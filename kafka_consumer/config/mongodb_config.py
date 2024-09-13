import os
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import  HTTPException
from dotenv import load_dotenv
import utils.constants.message_constants as MESSAGE_CONSTANTS
from pymongo.server_api import ServerApi

load_dotenv()

class MongoConfig:
    def __init__(self):
        try:
            self.host = os.getenv('MONGO_URI')
            self.port = int(os.getenv('MONGO_PORT'))
            self.db_name = os.getenv('MONGO_DB_NAME')
            self.client = AsyncIOMotorClient(self.host, server_api=ServerApi('1'))
            self.db = self.client[self.db_name]
        except Exception as e:
             print(f"Error connecting to MongoDB: {e}")
             raise HTTPException(status_code=500, detail=MESSAGE_CONSTANTS.MONGODB_CONN_ERROR)

    def get_db(self):
        return self.db

# Initialize MongoConfig
mongo_config = MongoConfig()