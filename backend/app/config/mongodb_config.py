import os
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import  HTTPException
from dotenv import load_dotenv
import utils.constants.error_constants as ERROR_CONSTANTS

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://si-admin:SI-admin1234@si-cluster.abw4huo.mongodb.net/?retryWrites=true&w=majority&appName=si-cluster")
MONGO_DB_NAME = os.getenv("MONGO_DB", "system_intelligence_db")
mongo_client = AsyncIOMotorClient(MONGO_URI)
mongo_db = mongo_client.get_database(MONGO_DB_NAME)

class MongoConfig:
    def __init__(self):
        try:
            self.host = os.getenv('MONGO_HOST', 'mongodb+srv://si-admin:SI-admin1234@si-cluster.abw4huo.mongodb.net/?retryWrites=true&w=majority&appName=si-cluster')
            self.port = int(os.getenv('MONGO_PORT', 27017))
            self.db_name = os.getenv('MONGO_DB_NAME', 'system_intelligence_db')
            self.client = AsyncIOMotorClient(self.host, self.port)
            self.db = self.client[self.db_name]
        except Exception as e:
             print(f"Error connecting to MongoDB: {e}")
             raise HTTPException(status_code=500, detail=ERROR_CONSTANTS.MONGODB_CONN_ERROR)

    def get_db(self):
        return self.db

# Initialize MongoConfig
mongo_config = MongoConfig()