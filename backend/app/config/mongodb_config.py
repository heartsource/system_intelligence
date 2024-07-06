from contextlib import asynccontextmanager
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB")

@asynccontextmanager
async def mongo_client(collection_name: str):
    client = AsyncIOMotorClient(MONGO_URI, server_api=ServerApi('1'))
    try:
        # Set the Stable API version when creating a new client

        yield client[MONGO_DB][collection_name] # Yield: This point marks the end of setup and the start of the application's runtime
    except Exception as e:
        print(f"An error occurred with MongoDB connection: {e}")
        raise HTTPException(status_code=500, detail="Could not connect to MongoDB")
    
    finally:
        client.close()