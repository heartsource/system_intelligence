from typing import Any, Dict
from fastapi import HTTPException
from utils.common_utilities import custom_serializer, is_valid_uuid
from config.mongodb_config import mongo_client
from modules.logs.logs_model import AgentLogsListModel, AgentLogsModel
from bson import ObjectId
import utils.constants.error_constants as ERROR_CONSTANTS 
import json
from uuid import uuid4
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
                    { "$lookup": {
                        "from": "agents",
                        "localField": "agent_id",
                        "foreignField": "_id",
                        "as": "agent_info"
                    }},
                    { "$unwind": "$agent_info" },
                    { "$project": {
                        "agent_id": 1,
                        "agent_name": "$agent_info.name",
                        "model": 1,
                        "flow": 1,
                        "interaction_id": 1,
                        "interaction_date": 1,
                        "duration": 1
                    }}
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
                pipeline.insert(0, { "$match": { "agent_id": { "$in": formattedAgentIds } } })
            # async with mongo_client("logs") as logs_collection:
            results =  self.collection.aggregate(pipeline)
            return json.loads(json.dumps(list(results), default=custom_serializer))
        except Exception as e:
            raise Exception(e)
        
    async def fetchLogDetails(self, id: str)-> Dict[str, Any]:
        try:
            if not is_valid_uuid(id):
                raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_INTERACTION_ID_ERROR)
            # pipeline = [
            #     { "$match": {"interaction_id": id }},
            #     { "$lookup": {
            #         "from": "agents",
            #         "localField": "agent_id",
            #         "foreignField": "_id",
            #         "as": "agent_info"
            #     }},
            #     { "$unwind": "$agent_info" }
            # ]
            query = {
                "interaction_id": id,
                "$or": [
                    {"deleted_dt": {"$exists": False}},
                    {"deleted_dt": None}
                ]
            }
            agent_log =  self.collection.find_one(query) 

            if agent_log is not None:
                # Convert ObjectId to string for JSON serialization
                # agent_log["_id"] = str(agent_log["_id"])
                return json.loads(json.dumps(agent_log, default=custom_serializer))
            return None
        except Exception as e:
            raise Exception(e)
        
    async def createAgentLogs(self, payload: AgentLogsModel):
        try:
            payload['duration'] = int(payload['duration'].total_seconds())
            # async with mongo_client("logs") as logs_collection:
            return  self.collection.insert_one(payload)
        except Exception as e:
            raise Exception(e)
        
    # async def fetchAgentLogs(agent_id: AgentLogsModel):
    #     try:
    #         if not ObjectId.is_valid(agent_id):
    #             raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_ID_ERROR)
    #         pipeline = [
    #             { "$match": {"_id": ObjectId(agent_id) }},
    #             { "$lookup": {
    #                 "from": "logs",
    #                 "localField": "_id",
    #                 "foreignField": "agent_id",
    #                 "as": "agentLogs"
    #             }}
    #         ]
    #         async with mongo_client("agents") as agents_collection:
    #             result = await agents_collection.aggregate(pipeline).to_list(None)
    #             return json.loads(json.dumps(result, default=custom_serializer))
    #     except Exception as e:
    #         raise Exception(e)
        
    # async def createAgentLogs(payload: AgentLogsModel):
    #     try:
    #         payload['duration'] = int(payload['duration'].total_seconds())
    #         async with mongo_client("logs") as logs_collection:
    #             return await logs_collection.insert_one(payload)
    #     except Exception as e:
    #         raise Exception(e)