from contextlib import asynccontextmanager
import os
import config
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://si-admin:SI-admin1234@si-cluster.abw4huo.mongodb.net/?retryWrites=true&w=majority&appName=si-cluster")
MONGO_DB_NAME = os.getenv("MONGO_DB", "system_intelligence_db")
mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client.get_database(MONGO_DB_NAME)

class MongoConfig:
    def __init__(self):
        self.host = os.getenv('MONGO_HOST', 'mongodb+srv://si-admin:SI-admin1234@si-cluster.abw4huo.mongodb.net/?retryWrites=true&w=majority&appName=si-cluster')
        self.port = int(os.getenv('MONGO_PORT', 27017))
        self.db_name = os.getenv('MONGO_DB_NAME', 'system_intelligence_db')
        self.client = MongoClient(self.host, self.port)
        self.db = self.client[self.db_name]

    def get_db(self):
        return self.db

# Initialize MongoConfig
mongo_config = MongoConfig()


# class MongoDB:
#     def __init__(self):
#         self.client = None
#         self.db = None

#     async def connect(self):
#         try:
#             self.client = AsyncIOMotorClient(config.get("MONGO_URI"))
#             self.db = self.client[config.get("MONGO_DB_NAME")]
#         except Exception as e:
#             print(f"Error connecting to MongoDB: {e}")

#     async def close(self):
#         try:
#             self.client.close()
#         except Exception as e:
#             print(f"Error closing MongoDB connection: {e}")

# # Create a single instance of MongoDB to be used across the application
# mongodb = MongoDB()

# @asynccontextmanager
# async def mongo_client(collection_name: str):
#     client = AsyncIOMotorClient(MONGO_URI, server_api=ServerApi('1'))
#     try:
#         # Set the Stable API version when creating a new client

#         yield client[MONGO_DB][collection_name] # Yield: This point marks the end of setup and the start of the application's runtime
#     except Exception as e:
#         print(f"An error occurred with MongoDB connection: {e}")
#         raise HTTPException(status_code=500, detail="Could not connect to MongoDB")
    
#     finally:
#         client.close()