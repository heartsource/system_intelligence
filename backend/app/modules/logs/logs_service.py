from datetime import datetime, timezone
from typing import Any, Dict
from fastapi import HTTPException
from utils.common_utilities import custom_serializer, is_valid_uuid
from modules.logs.logs_model import AgentLogsListModel, AgentLogsModel
from bson import ObjectId
import utils.constants.error_messages as ERROR_MESSAGES 
import json
from config.mongodb_config import mongo_config
import utils.constants.db_constants as DB_CONSTANTS

# logs_collection = MONGO_CONFIG.mongo_db.get_collection(DB_CONSTANTS.LOGS_COLLECTION)
class LogService:
    def __init__(self) -> None:
        self.db = mongo_config.get_db()
        self.collection = self.db[DB_CONSTANTS.LOGS_COLLECTION]
        
    async def fetchLogs(self, payload: AgentLogsListModel):
        try:
            sort_dict = { payload.sort_by : -1 if payload.sort_order.value.lower() == "desc" else 1 } if payload.sort_by else None
            
            pipeline = [
                        {
                            "$match": {
                                "$or": [
                                    {"deleted_dt": {"$exists": False}},
                                    {"deleted_dt": None}
                                ]
                            }
                        },
                        { 
                            "$lookup": {
                            "from": "agents",
                            "localField": "agent_id",
                            "foreignField": "_id",
                            "as": "agent_info"
                            }
                        },
                        { 
                            "$unwind": "$agent_info" 
                        },
                        { 
                            "$project": {
                            "agent_id": 1,
                            "agent_name": "$agent_info.name",
                            "model": 1,
                            "flow": 1,
                            "interaction_id": 1,
                            "interaction_date": 1,
                            "duration": 1
                            }
                        }
                    ]
            if sort_dict:
                pipeline.append({ "$sort": sort_dict })

            # Setting skip and limit values
            pipeline.append({ "$skip": payload.offset })
            pipeline.append({ "$limit": payload.limit })

            if payload.agent_ids:
                formattedAgentIds = []
                for id in payload.agent_ids:
                    if not ObjectId.is_valid(id):
                        raise HTTPException(status_code=400, detail=ERROR_MESSAGES.INVALID_ID_ERROR)
                    formattedAgentIds.append(ObjectId(id))
                query = { "$match": 
                            { 
                                "agent_id": { "$in": formattedAgentIds }
                            }
                        }
                pipeline.insert(0, query)
            
            results = await self.collection.aggregate(pipeline).to_list(length=None)

            # separate count pipeline (excluding skip and limit)
            count_pipeline = pipeline[:-2]  # Remove the last two stages (skip and limit)
            count_pipeline.append({"$count": "total"})
            count_result = await self.collection.aggregate(count_pipeline).to_list(length=1)

            # Extract the total count from the result
            data_length = count_result[0]["total"] if count_result else 0

            return { "data": json.loads(json.dumps(list(results), default=custom_serializer)), "length": data_length }
        except Exception as e:
            raise Exception(e)
        
    async def fetchLogDetails(self, id: str)-> Dict[str, Any]:
        try:
            if not is_valid_uuid(id):
                raise HTTPException(status_code=400, detail=ERROR_MESSAGES.INVALID_INTERACTION_ID_ERROR)
            
            pipeline = [
                {
                    '$match': {
                        'interaction_id': id,
                        "$or": [
                            {"deleted_dt": {"$exists": False}},
                            {"deleted_dt": None}
                        ]
                    }
                },
                {
                    '$lookup': {
                        'from': 'agents',  # The collection to join with
                        'localField': 'agent_id',  # Field from the logs collection
                        'foreignField': '_id',  # Field from the agents collection
                        'as': 'agent_details'  # Name of the new field to add with agent details
                    }
                },
                {
                    '$unwind': '$agent_details'  # Optional: Unwind the agent_details array if only one agent is expected
                },
                {
                    "$project": {
                            "_id": 1,
                            "agent_id": 1,                            
                            "agent_name": "$agent_details.name",
                            "interaction_id": 1,
                            "interaction_date": 1,
                            "duration": 1,
                            "template": 1,
                            "question": 1,
                            "answer": 1,
                            "model": 1,
                            "flow": 1
                    }
                }
            ]
    
            result = await self.collection.aggregate(pipeline).to_list(length=None)
            # agent_log =  await self.collection.find_one(query)

            if result is not None:
                # Convert ObjectId to string for JSON serialization
                return json.loads(json.dumps(result[0], default=custom_serializer))
            return None
        except Exception as e:
            raise Exception(e)
        
    async def createAgentLogs(self, payload: AgentLogsModel):
        try:
            payload['duration'] = int(payload['duration'].total_seconds())
            return await self.collection.insert_one(payload)
        except Exception as e:
            raise Exception(e)
        
    async def deleteAgentLogs(self, agent_id: str):
        try:
            if not ObjectId.is_valid(agent_id):
                raise HTTPException(status_code=400, detail=ERROR_MESSAGES.INVALID_ID_ERROR)
            return await self.collection.update_many({"agent_id": ObjectId(agent_id)}, {"$set": {"deleted_dt": datetime.now(timezone.utc)}})
        except Exception as e:
            raise Exception(e)
