# Standard library imports
import os
import pathlib
import threading
import time
import numpy as np
import pandas as pd
from pymongo import MongoClient

# Third party imports
import tensorflow as tf
from typing import Dict, Text
import tensorflow_recommenders as tfrs
from dotenv import load_dotenv

from create_model import create_model, get_mongo_db, load_data, preprocess_data, create_training_datasets, create_retrieval_model, training_retrieval_model, create_ranking_model, training_ranking_model

if __name__ == '__main__':
  print("Starting model builder")
  db = get_mongo_db()
  init = False
  user_len = 0
  room_len = 0
  history_len = 0
  
  while True:
    print("Checking for new data")
    new_user_len = db["accounts"].count_documents({})
    new_room_len = db["rooms"].count_documents({})
    new_history_len = db["history"].count_documents({})
    if user_len != new_user_len or room_len != new_room_len or history_len != new_history_len:
      user_len, room_len, history_len = new_user_len, new_room_len, new_history_len
      init = True
      
    if init and user_len > 0 and room_len > 0 and history_len > 0:
      print("Retraining model")
      t1 = threading.Thread(target=create_model)
      t1.start()
      init = False
    time.sleep(10)
      
      