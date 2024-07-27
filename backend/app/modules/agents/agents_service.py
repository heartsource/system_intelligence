from datetime import datetime
from typing import Optional, List, Dict, Any
import json
import traceback
from bson import ObjectId
from fastapi import HTTPException
import pymongo
from modules.logs.logs_service import LogService
from utils.enums.shared_enum import AgentType, Status
from utils.common_utilities import custom_serializer
from modules.agents.agents_model import AgentListModel, AgentModel, AgentUpdateModel
import utils.constants.error_constants as ERROR_CONSTANTS
import utils.constants.db_constants as DB_CONSTANTS
from pydantic.json import pydantic_encoder
from config.mongodb_config import mongo_config

logs_service = LogService()
class AgentService:
    def __init__(self):
        self.db = mongo_config.get_db()
        self.collection = self.db[DB_CONSTANTS.AGENTS_COLLECTION]

    async def fetchAgentsList(self, agent_model: AgentListModel) -> List[Dict[str, Any]]:
        try:
            query = {}

            if agent_model.name:
                query['name'] = agent_model.name.strip()

            if agent_model.model:
                query['model'] = agent_model.model.value

            if agent_model.flow:
                query['flow'] = agent_model.flow.value

            if agent_model.status:
                query['status'] = agent_model.status.value

             # Exclude agents with 'deleted_dt' field set or not None
            query['$or'] = [{'deleted_dt': {'$exists': False}}, {'deleted_dt': None}]

            sort_dict = None
            if agent_model.sort_by:
                sort_order = -1 if agent_model.sort_order.value.lower() == 'desc' else 1
                sort_dict = {agent_model.sort_by: sort_order}

            # Ensure sort_dict is converted to a list of tuples
            if isinstance(sort_dict, dict):
                sort_criteria = list(sort_dict.items())
            else:
                sort_criteria = sort_dict

            # Setting skip and limit values
            skip = agent_model.offset if agent_model.offset else 0
            limit = agent_model.limit if agent_model.limit else None

            # Perform the MongoDB find operation with the constructed query     
            filtered_agents_data = await self.collection.find(query).sort(sort_criteria).skip(skip).limit(limit).to_list(length=None)
            return json.loads(json.dumps(filtered_agents_data, default=custom_serializer))
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)

    async def fetchAgentsNames(self, agent_type: Optional[AgentType] = None):
        try:
            query = {}
            if agent_type and (agent_type.value == "custom" or agent_type.value == "default"):
                query = {
                    "type": agent_type.value
                }
            # Filter out agents with 'deleted_dt' field or where 'deleted_dt' is not None
            query["$or"] = [{'deleted_dt': {'$exists': False}}, {'deleted_dt': None}]

            # Perform the MongoDB find operation with the constructed query
            filtered_agents_data = await self.collection.find(query, {"name": 1}).sort([("name", pymongo.ASCENDING)]).to_list(length=None)

            return json.loads(json.dumps(list(filtered_agents_data), default=str))
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)

    async def fetchAgentDetails(self, id: str) -> Dict[str, Any]:
        try:
            if not ObjectId.is_valid(id):
                raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_ID_ERROR)

            query = {
                "_id": ObjectId(id),
                "$or": [
                    {"deleted_dt": {"$exists": False}},
                    {"deleted_dt": None}
                ]
            }

            agent =  await self.collection.find_one(query) 

            if agent is not None:
                # Convert ObjectId to string for JSON serialization
                agent["_id"] = str(agent["_id"])
                return agent
            return None
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)


    async def createAgent(self, agent: AgentModel):
        try:
            agent.name = agent.name.strip()
            
            # Check if agent with the same name already exists
            existing_agent = await self.collection.find_one({"name": agent.name})

            if existing_agent:
                raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.AGENT_EXISTS_ERROR)
            
            # Convert agent_dict to a plain Python dictionary
            document = json.loads(json.dumps(agent, default=pydantic_encoder))
            document['created_dt'] = datetime.now()

            return  await self.collection.insert_one(document)
            
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)

    async def updateAgentDetails(self, agent_id:str, updatedAgentData: AgentUpdateModel):
        try:
            if not ObjectId.is_valid(agent_id):
                raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_ID_ERROR)

            query = {
                "_id": ObjectId(agent_id),
                "$or": [
                    {"deleted_dt": {"$exists": False}},
                    {"deleted_dt": None}
                ]
            }

            agent =  await self.collection.find_one(query)
            if not agent:
                raise HTTPException(status_code=404, detail=ERROR_CONSTANTS.NOT_FOUND_ERROR)

            # Update agent attributes
            if updatedAgentData.name is not None:
                updatedName = updatedAgentData.name.strip()
                duplicateAgent =  await self.collection.find_one({"_id": {"$ne": ObjectId(agent_id)}, "name": updatedName})
                if duplicateAgent:
                    raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.AGENT_EXISTS_ERROR)
                agent['name'] = updatedName
            if updatedAgentData.description is not None:
                agent['description'] = updatedAgentData.description
            if updatedAgentData.model is not None:
                agent['model'] = updatedAgentData.model
            if updatedAgentData.status is not None:
                agent['status'] = updatedAgentData.status
            if updatedAgentData.flow is not None:
                agent['flow'] = updatedAgentData.flow
            if updatedAgentData.template is not None:
                agent['template'] = updatedAgentData.template
            del agent['_id'], agent['created_dt']
            
            # Convert updated agent to a dictionary
            agent_dict = json.loads(json.dumps(agent, default=custom_serializer))
            agent_dict['updated_dt'] = datetime.now()

            return  await self.collection.update_one({"_id": ObjectId(agent_id)}, { "$set": agent_dict})
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)
        
    async def deleteAgent(self, agent_id:str):
            try:
                if not ObjectId.is_valid(agent_id):
                    raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_ID_ERROR)

                query = {
                    "_id": ObjectId(agent_id),
                    "$or": [
                        {"deleted_dt": {"$exists": False}},
                        {"deleted_dt": None}
                    ]
                }

                agent =  await self.collection.find_one(query)
                if not agent:
                    raise HTTPException(status_code=404, detail=ERROR_CONSTANTS.NOT_FOUND_ERROR)   

                if agent.get('type') == AgentType.DEFAULT.value:
                    raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.AGENT_DELETE_ERROR)
                
                # Check if the agent is already marked as deleted
                if agent.get('deleted_dt') is not None:
                    raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.AGENT_UPDATE_ERROR)

                await logs_service.deleteAgentLogs(agent_id)
                return await self.collection.update_one(
                    {"_id": ObjectId(agent_id)},
                    {"$set": {'deleted_dt': datetime.now(), 'status': Status.INACTIVE }}
                    )
            except Exception as e:
                raise Exception(e)
