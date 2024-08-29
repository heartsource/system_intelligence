from datetime import datetime, timezone
from typing import Any, Dict
from fastapi import HTTPException
from utils.common_utilities import custom_serializer, is_valid_uuid
from modules.logs.logs_model import AgentLogsListModel, AgentLogsModel
from bson import ObjectId
import utils.constants.error_constants as ERROR_CONSTANTS 
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
                        raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_ID_ERROR)
                    formattedAgentIds.append(ObjectId(id))
                query = { "$match": 
                            { 
                                "agent_id": { "$in": formattedAgentIds }
                            }
                        }
                pipeline.insert(0, query)
            results = await self.collection.aggregate(pipeline).to_list(length=None)
            return json.loads(json.dumps(list(results), default=custom_serializer))
        except Exception as e:
            raise Exception(e)
        
    async def fetchLogDetails(self, id: str)-> Dict[str, Any]:
        try:
            if not is_valid_uuid(id):
                raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_INTERACTION_ID_ERROR)
            query = {
                "interaction_id": id,
                "$or": [
                    {"deleted_dt": {"$exists": False}},
                    {"deleted_dt": None}
                ]
            }
            agent_log =  await self.collection.find_one(query) 

            if agent_log is not None:
                # Convert ObjectId to string for JSON serialization
                return json.loads(json.dumps(agent_log, default=custom_serializer))
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
                raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_ID_ERROR)
            return await self.collection.update_many({"agent_id": ObjectId(agent_id)}, {"$set": {"deleted_dt": datetime.now(timezone.utc)}})
        except Exception as e:
            raise Exception(e)
