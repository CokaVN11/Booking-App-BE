# Standard library imports
import os
import pathlib
import numpy as np
import pandas as pd
from pymongo import MongoClient

# Third party imports
import tensorflow as tf
from typing import Dict, Text
import tensorflow_recommenders as tfrs
from dotenv import load_dotenv

load_dotenv(pathlib.Path(__file__).parent / ".env")
CONNECTION_STRING = os.getenv("MONGO_URI")

class QueryModel(tf.keras.Model):
    def __init__(self, layer_sizes, unique_user_ids):
        super().__init__()
        self.embedding_model = tf.keras.Sequential(
            [
                tf.keras.layers.StringLookup(
                    vocabulary=unique_user_ids, mask_token=None
                ),
                tf.keras.layers.Embedding(len(unique_user_ids) + 1, 32),
            ]
        )
        self.dense_layers = tf.keras.Sequential()
        for layer_size in layer_sizes[:-1]:
            self.dense_layers.add(tf.keras.layers.Dense(layer_size, activation="relu"))
        self.dense_layers.add(tf.keras.layers.Dense(layer_sizes[-1]))

    def call(self, inputs):
        feature_embedding = self.embedding_model(inputs["user_id"])
        return self.dense_layers(feature_embedding)


class RoomModel(tf.keras.Model):
    def __init__(
        self, unique_room_ids, unique_hotels, unique_room_types, unique_room_names
    ):
        super().__init__()
        self.room_embedding = tf.keras.Sequential(
            [
                tf.keras.layers.StringLookup(
                    vocabulary=unique_room_ids, mask_token=None
                ),
                tf.keras.layers.Embedding(len(unique_room_ids) + 1, 32),
            ]
        )
        self.hotel_embedding = tf.keras.Sequential(
            [
                tf.keras.layers.StringLookup(vocabulary=unique_hotels, mask_token=None),
                tf.keras.layers.Embedding(len(unique_hotels) + 1, 32),
            ]
        )
        self.room_type_embedding = tf.keras.Sequential(
            [
                tf.keras.layers.StringLookup(
                    vocabulary=unique_room_types, mask_token=None
                ),
                tf.keras.layers.Embedding(len(unique_room_types) + 1, 32),
            ]
        )
        self.room_name_embedding = tf.keras.Sequential(
            [
                tf.keras.layers.StringLookup(
                    vocabulary=unique_room_names, mask_token=None
                ),
                tf.keras.layers.Embedding(len(unique_room_names) + 1, 32),
            ]
        )

    def call(self, inputs):
        return tf.concat(
            [
                self.room_embedding(inputs["room_id"]),
                self.hotel_embedding(inputs["hotel"]),
                self.room_type_embedding(inputs["room_type"]),
                self.room_name_embedding(inputs["room_name"]),
            ],
            axis=1,
        )


class CandidateModel(tf.keras.Model):
    def __init__(
        self,
        layer_sizes,
        unique_room_ids,
        unique_hotels,
        unique_room_types,
        unique_room_names,
    ):
        super().__init__()
        self.embedding_model = RoomModel(
            unique_room_ids, unique_hotels, unique_room_types, unique_room_names
        )
        self.dense_layers = tf.keras.Sequential()
        for layer_size in layer_sizes[:-1]:
            self.dense_layers.add(tf.keras.layers.Dense(layer_size, activation="relu"))
        self.dense_layers.add(tf.keras.layers.Dense(layer_sizes[-1]))

    def call(self, inputs):
        feature_embedding = self.embedding_model(inputs)
        return self.dense_layers(feature_embedding)


class RetrievalModel(tfrs.models.Model):
    def __init__(
        self,
        layer_sizes,
        datasets,
        unique_user_ids,
        unique_room_ids,
        unique_hotels,
        unique_room_types,
        unique_room_names,
    ):
        super().__init__()
        self.query_model = QueryModel(layer_sizes, unique_user_ids)
        self.candidate_model = CandidateModel(
            layer_sizes,
            unique_room_ids,
            unique_hotels,
            unique_room_types,
            unique_room_names,
        )
        self.task = tfrs.tasks.Retrieval(
            metrics=tfrs.metrics.FactorizedTopK(
                candidates=datasets["rooms"].batch(128).map(self.candidate_model)
            )
        )

    def compute_loss(self, features, training=False):
        query_embeddings = self.query_model(features)
        candidate_embeddings = self.candidate_model(features)

        return self.task(
            query_embeddings, candidate_embeddings, compute_metrics=not training
        )


class RankingModel(tfrs.Model):
    def __init__(self, retrieval_model: tfrs.Model):
        super().__init__()
        self.retrieval_model = retrieval_model
        self.embedding_model = tf.keras.Sequential(
            [
                tf.keras.layers.Dense(128, activation="relu"),
                tf.keras.layers.Dense(64, activation="relu"),
                tf.keras.layers.Dense(1),
            ]
        )

    def call(self, inputs):
        user_embeddings = self.retrieval_model.query_model(inputs)
        positive_room_embeddings = self.retrieval_model.candidate_model(inputs)
        return self.embedding_model(
            tf.concat([user_embeddings, positive_room_embeddings], axis=1)
        )


class RoomRankingModel(tfrs.Model):
    def __init__(self, retrieval_model: tfrs.Model):
        super().__init__()
        self.ranking_model = RankingModel(retrieval_model)
        self.task = tfrs.tasks.Ranking(
            loss=tf.keras.losses.MeanSquaredError(),
            metrics=[tf.keras.metrics.RootMeanSquaredError()],
        )

    def compute_loss(self, features, training=False):
        labels = features.pop("duration")
        duration_prediction = self(features)
        return self.task(labels=labels, predictions=duration_prediction)

    def call(self, features, training=False):
        return self.ranking_model(features)


def get_mongo_db():
    client = MongoClient(CONNECTION_STRING)
    return client["JoyHub"]


def load_data(db) -> Dict[Text, pd.DataFrame]:
    accounts = db["accounts"]
    rooms = db["rooms"]
    history = db["history"]

    accounts_df = pd.DataFrame(list(accounts.find({"role": "customer"}, {"_id": 1})))
    accounts_df["_id"] = accounts_df["_id"].astype(str)

    # get room types and hotel for each room
    # from roomType and hotel collections
    lookup_room_type = {
        "$lookup": {
            "from": "roomtypes",
            "localField": "room_type",
            "foreignField": "_id",
            "as": "roomtype",
            "pipeline": [{"$project": {"_id": 0, "name": 1}}],
        }
    }

    lookup_hotel = {
        "$lookup": {
            "from": "accounts",
            "localField": "hotel",
            "foreignField": "_id",
            "as": "hotel",
            "pipeline": [{"$project": {"_id": 0, "hotel_name": 1}}],
        }
    }

    project = {"$project": {"_id": 1, "hotel": 1, "roomtype": 1, "name": 1}}

    pipeline = [lookup_room_type, lookup_hotel, project]

    room_items = list(rooms.aggregate(pipeline))
    rooms_df = pd.DataFrame(room_items)
    rooms_df["_id"] = rooms_df["_id"].astype(str)
    rooms_df["hotel"] = rooms_df["hotel"].apply(lambda x: x[0]["hotel_name"])
    rooms_df["room_type"] = rooms_df["roomtype"].apply(lambda x: x[0]["name"])
    rooms_df.drop(["roomtype"], axis=1, inplace=True)
    rooms_df.rename(columns={"name": "room_name"}, inplace=True)
    rooms_df["hotel"] = rooms_df["hotel"].astype(str)
    rooms_df["room_type"] = rooms_df["room_type"].astype(str)

    history_df = pd.DataFrame(list(history.find({}, {"_id": 0})))
    if "user_id" in history_df.columns:
        history_df["user_id"] = history_df["user_id"].astype(str)
    history_df["history"] = history_df["history"].apply(
        lambda x: [
            {
                **item,
                "room": str(item["room"]),
                "hotel": str(item["hotel"]),
                "watchedOn": item["watchedOn"].isoformat(),
            }
            for item in x
        ]
    )

    return {"accounts": accounts_df, "rooms": rooms_df, "history": history_df}


def preprocess_data(data: Dict[Text, pd.DataFrame]) -> Dict[Text, tf.data.Dataset]:
    accounts = tf.data.Dataset.from_tensor_slices(data["accounts"]._id.values)
    rooms = tf.data.Dataset.from_tensor_slices(
        {
            "room_id": data["rooms"]._id.values,
            "hotel": data["rooms"].hotel.values,
            "room_type": data["rooms"].room_type.values,
            "room_name": data["rooms"].room_name.values,
        }
    )

    rooms_df = data["rooms"].set_index("_id")

    def history_generator():
        for _, row in data["history"].iterrows():
            user_id = row["user_id"]
            for entry in row["history"]:
                room_id = entry["room"]
                room_info = rooms_df.loc[room_id]
                if room_info is None:  # skip if room not found
                    continue
                yield {
                    "user_id": user_id,
                    "room_id": room_id,
                    "room_type": room_info["room_type"],
                    "room_name": room_info["room_name"],
                    "hotel": entry["hotel"],
                    "duration": entry["duration"],
                    "watchedOn": entry["watchedOn"],
                }

    history = tf.data.Dataset.from_generator(
        history_generator,
        output_signature={
            "user_id": tf.TensorSpec(shape=(), dtype=tf.string),
            "room_id": tf.TensorSpec(shape=(), dtype=tf.string),
            "room_type": tf.TensorSpec(shape=(), dtype=tf.string),
            "room_name": tf.TensorSpec(shape=(), dtype=tf.string),
            "hotel": tf.TensorSpec(shape=(), dtype=tf.string),
            "duration": tf.TensorSpec(shape=(), dtype=tf.float64),
            "watchedOn": tf.TensorSpec(shape=(), dtype=tf.string),
        },
    )

    return {"accounts": accounts, "rooms": rooms, "history": history}

def create_training_datasets(datasets: Dict[Text, tf.data.Dataset]):
    shuffled = datasets["history"].shuffle(100_000, seed=42, reshuffle_each_iteration=False)
    shuffled_size = len(list(shuffled))
    train_ds = shuffled.take(shuffled_size * 4 // 5)
    test_ds = shuffled.skip(shuffled_size * 4 // 5).take(shuffled_size // 5)
    cached_train = train_ds.shuffle(100_000).batch(8192).cache()
    cached_test = test_ds.batch(4096).cache()
    
    return cached_train, cached_test

def create_retrieval_model(datasets: Dict[Text, tf.data.Dataset], data: Dict[Text, pd.DataFrame]):
    unique_user_ids = np.unique(data["history"]["user_id"].values)
    unique_room_ids = np.unique(data["rooms"]["_id"].values)

    unique_hotels = np.unique(data["rooms"]["hotel"].values)
    unique_room_types = np.unique(data["rooms"]["room_type"].values)
    unique_room_names = np.unique(data["rooms"]["room_name"].values)

    retrieval_model = RetrievalModel(
        layer_sizes=[32, 16],
        datasets=datasets,
        unique_user_ids=unique_user_ids,
        unique_room_ids=unique_room_ids,
        unique_hotels=unique_hotels,
        unique_room_types=unique_room_types,
        unique_room_names=unique_room_names,
    )

    retrieval_model.compile(optimizer=tf.keras.optimizers.Adagrad(0.1))

    return retrieval_model
  
def training_retrieval_model(retrieval_model: tfrs.Model, datasets: Dict[Text, tf.data.Dataset]):
    cached_train, cached_test = create_training_datasets(datasets)
    history = retrieval_model.fit(cached_train, validation_data=cached_test, validation_freq=2, epochs=10)
    
    accuracy = history.history["val_factorized_top_k/top_100_categorical_accuracy"][-1]
    print(f"Top-100 accuracy: {accuracy:.2f}.")
    retrieval_model.save_weights("models/retrieval/weights")
  
def create_ranking_model(retrieval_model: tfrs.Model):
    ranking_model = RoomRankingModel(retrieval_model)
    ranking_model.compile(optimizer=tf.keras.optimizers.Adagrad(0.1))
    return ranking_model


def training_ranking_model(ranking_model: tfrs.Model, datasets: Dict[Text, tf.data.Dataset]):
    cached_train, cached_test = create_training_datasets(datasets)
    history = ranking_model.fit(cached_train, validation_data=cached_test, validation_freq=2, epochs=10)
    
    rmse = history.history["val_root_mean_squared_error"][-1]
    print(f"RMSE: {rmse:.2f}.")
    ranking_model.save_weights("models/ranking/weights")
    
    
def create_model():
    db = get_mongo_db()
    data = load_data(db)
    datasets = preprocess_data(data)
    retrieval_model = create_retrieval_model(datasets, data)
    training_retrieval_model(retrieval_model, datasets)
    ranking_model = create_ranking_model(retrieval_model)
    training_ranking_model(ranking_model, datasets)
    print("Model training complete")