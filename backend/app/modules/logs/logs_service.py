from fastapi import HTTPException
from utils.common_utilities import custom_serializer, is_valid_uuid
from config.mongodb_config import mongo_client
from modules.logs.logs_model import AgentLogsListModel, AgentLogsModel
from bson import ObjectId
import utils.constants.error_constants as ERROR_CONSTANTS 
import json
from uuid import uuid4

async def fetchLogs(payload: AgentLogsListModel):
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
                    "interaction_id": 1,
                    "interaction_date": 1,
                    "duration": 1
                }}
            ]
        if sort_dict:
            pipeline.append({ "$sort": sort_dict })
        
        pipeline.append({ "$limit": payload.limit })

        if payload.agent_ids:
            formattedAgentIds = []
            for id in payload.agent_ids:
                if not ObjectId.is_valid(id):
                    raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_ID_ERROR)
                formattedAgentIds.append(ObjectId(id))
            pipeline.insert(0, { "$match": { "agent_id": { "$in": formattedAgentIds } } })
        print(pipeline)
        async with mongo_client("logs") as logs_collection:
            results = await logs_collection.aggregate(pipeline).to_list(None)
            return json.loads(json.dumps(results, default=custom_serializer))
    except Exception as e:
        raise Exception(e)
    
async def fetchLogDetails(id: str):
    try:
        if not is_valid_uuid(id):
            raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_INTERACTION_ID_ERROR)
        pipeline = [
            { "$match": {"interaction_id": id }},
            { "$lookup": {
                "from": "agents",
                "localField": "agent_id",
                "foreignField": "_id",
                "as": "agent_info"
            }},
            { "$unwind": "$agent_info" }
        ]
        async with mongo_client("logs") as agents_collection:
            result = await agents_collection.aggregate(pipeline).to_list(None)
            return json.loads(json.dumps(result, default=custom_serializer))
    except Exception as e:
        raise Exception(e)
    
async def createAgentLogs(payload: AgentLogsModel):
    try:
        payload['duration'] = int(payload['duration'].total_seconds())
        async with mongo_client("logs") as logs_collection:
            return await logs_collection.insert_one(payload)
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