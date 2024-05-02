import os
from flask import Flask, request, jsonify, abort
from create_model import (
    create_ranking_model,
    create_retrieval_model,
    get_mongo_db,
    preprocess_data,
    load_data,
)
import tensorflow as tf
import tensorflow_recommenders as tfrs
import numpy as np
app = Flask(__name__)

db = get_mongo_db()

@app.route("/recommend", methods=["GET"])
def send_recommendations():
    try:
        if (
            request.args.get("userId") is not None
            and request.args.get("number") is not None
        ):
            user_id = request.args.get("userId")
            n = request.args.get("number")
            print(f"Logs --- User ID: {user_id}, Number of recommendations: {n}")
            recommendations = make_recommendations(user_id, int(n))
            recommendations = [video_id for video_id in recommendations]
            return jsonify({"data": recommendations})
        else:
            raise ValueError("Missing required parameters")
    except ValueError as e:
        abort(400, str(e))

def make_recommendations(user_id, n: int = 10):
    data = load_data(db)
    datasets = preprocess_data(data)
    retrieval_model = create_retrieval_model(data=data, datasets=datasets)
    retrieval_model.load_weights("models/retrieval/weights")
    ranking_model = create_ranking_model(retrieval_model)
    ranking_model.load_weights("models/ranking/weights")

    index = tfrs.layers.factorized_top_k.BruteForce(retrieval_model.query_model, k = n)
    index.index_from_dataset(
      tf.data.Dataset.zip((
        datasets["rooms"].map(lambda x: x["room_id"]).batch(100),
        datasets["rooms"].batch(100).map(retrieval_model.candidate_model)
      ))
    )

    user_query = {
        "user_id": tf.convert_to_tensor([user_id])
    }
    _, room_ids = index(user_query)
    room_ids = room_ids[0].numpy()
    room_ids = [room_id.decode() for room_id in room_ids]
    print(f"Logs --- Room IDs: {room_ids}")
    room_datas = {}
    for room_id in room_ids:
        room_data = data["rooms"].loc[data["rooms"]["_id"] == room_id]
        room_datas[room_id] = {
          "hotel": room_data["hotel"].values[0],
          "room_type": room_data["room_type"].values[0],
          "room_name": room_data["room_name"].values[0],
        }
    specific_room_data = [room_datas[room_id] for room_id in room_ids]
    duration = ranking_model({
        "user_id": tf.constant([user_id] * n),
        "room_id": tf.constant(room_ids),
        "hotel": tf.constant([specific_room_data[i]["hotel"] for i in range(n)]),
        "room_type": tf.constant([specific_room_data[i]["room_type"] for i in range(n)]),
        "room_name": tf.constant([specific_room_data[i]["room_name"] for i in range(n)]),
    })
    scores = [score.numpy()[0] for score in duration]
    # sort video ids by scores
    print(f"Logs --- Scores: {scores}")
    sorted_ids = tf.argsort(scores, direction="DESCENDING")
    print(f"Logs --- Sorted room IDs: {sorted_ids}")
    
    sorted_room = np.array(room_ids)[sorted_ids]
    return sorted_room


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("PORT", 5000), debug=True)