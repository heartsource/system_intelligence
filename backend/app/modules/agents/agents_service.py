from datetime import date, datetime
from enum import Enum
from typing import Optional, List, Dict, Any
import json
import traceback
from bson import ObjectId
from fastapi import HTTPException
from utils.enums.shared_enum import AgentType
from utils.common_utilities import custom_serializer
from config.mongodb_config import mongo_client
from modules.agents.agents_model import AgentListModel, AgentModel, AgentUpdateModel
import uuid
import aiofiles
import utils.constants.error_constants as ERROR_CONSTANTS

   
async def load_agents_data():
    async with aiofiles.open("../config/agentsData.json", "r") as agents_data_file:
        data = await agents_data_file.read()
        return json.loads(data)

def sortBy(agent, sort_key):
    value = agent.get(sort_key)
    if value is None:
        # Ensure None values are placed at the end during sorting
        return (1, None)
    return (0, value)

async def fetchAgentsList(agent_model: AgentListModel) -> List[Dict[str, Any]]:
    try:
        async with mongo_client("agents") as agents_collection:
            query = {}

            if agent_model.name:
                query['name'] = agent_model.name

            if agent_model.model:
                query['model'] = agent_model.model.value

            if agent_model.flow:
                query['flow'] = agent_model.flow.value

            if agent_model.status:
                query['status'] = agent_model.status.value

            # Filter out agents with 'deleted_dt' field or where 'deleted_dt' is not None
            query['$or'] = [{'deleted_dt': {'$exists': False}}, {'deleted_dt': None}]

            if agent_model.sort_by:
                sort_field = agent_model.sort_by
                sort_order = -1 if agent_model.sort_order.value.lower() == 'desc' else 1
                sort_dict = {sort_field: sort_order}
            else:
                sort_dict = None

            limit = agent_model.limit if agent_model.limit else None

            # Perform the MongoDB find operation with the constructed query
            filtered_agents_data = await agents_collection.find(query).sort(sort_dict).limit(limit).to_list(None)

            return json.loads(json.dumps(filtered_agents_data, default=str))
    except Exception as e:
        traceback.print_exc()
        raise Exception(e)

async def fetchAgentsNames(agent_type: Optional[AgentType] = None):
    try:
        async with mongo_client("agents") as agents_collection:
            query = {}
            if agent_type and (agent_type.value == "custom" or agent_type.value == "default"):
                query = {
                    "type": agent_type.value
                }
            # Filter out agents with 'deleted_dt' field or where 'deleted_dt' is not None
            query["$or"] = [{'deleted_dt': {'$exists': False}}, {'deleted_dt': None}]

            # Perform the MongoDB find operation with the constructed query
            filtered_agents_data = await agents_collection.find(query, {"name": 1}).sort({"name": 1}).to_list(None)

            return json.loads(json.dumps(filtered_agents_data, default=str))
    except Exception as e:
        traceback.print_exc()
        raise Exception(e)

async def fetchAgentDetails(id: str) -> Dict[str, Any]:
    try:
        # Validate the ObjectId
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_ID_ERROR)
        async with mongo_client("agents") as agents_collection:
            # Construct the query
            query = {
                "_id": ObjectId(id),
                "$or": [
                    {"deleted_dt": {"$exists": False}},
                    {"deleted_dt": None}
                ]
            }

            # Execute the query
            agent = await agents_collection.find_one(query) 

            if agent is not None:
                # Convert ObjectId to string for JSON serialization
                agent["_id"] = str(agent["_id"])
                return agent
            return None
    except Exception as e:
        traceback.print_exc()
        raise Exception(e)


async def createAgent(agent: AgentModel):
    try:
        agent.name = agent.name.strip()

        # Check if agent with the same name already exists
        async with mongo_client("agents") as agents_collections:
            existing_agent = await agents_collections.find_one({"name": agent.name})

        if existing_agent:
            raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.AGENT_EXISTS_ERROR)
        
        agent.created_dt = datetime.now()
        agent_dict = agent.model_dump()  # Convert AgentModel to dictionary
        # Convert agent_dict to a plain Python dictionary
        document = json.loads(json.dumps(agent_dict, default=custom_serializer))

        async with mongo_client("agents") as agents_collections:
            return await agents_collections.insert_one(document)
        
    except Exception as e:
        traceback.print_exc()
        raise Exception(e)

async def updateAgentDetails(agent_id:str, updatedAgentData: AgentUpdateModel):
    try:
        if not ObjectId.is_valid(agent_id):
             raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_ID_ERROR)
        async with mongo_client("agents") as agents_collection:
            agent = await agents_collection.find_one({"_id": ObjectId(agent_id)})
        if not agent:
            raise HTTPException(status_code=404, detail=ERROR_CONSTANTS.NOT_FOUND_ERROR)

        # Update agent attributes
        if updatedAgentData.name is not None:
            agent['name'] = updatedAgentData.name.strip()
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
        agent['updated_dt'] = datetime.now()
        del agent['_id']
        # Convert updated agent to a dictionary
        agent_dict = json.loads(json.dumps(agent, default=str))
        
        async with mongo_client("agents") as agents_collection:
            return await agents_collection.update_one({"_id": ObjectId(agent_id)}, { "$set": agent_dict})
    except Exception as e:
        traceback.print_exc()
        raise Exception(e)
    
async def deleteAgent(agent_id:str):
        try:
            if not ObjectId.is_valid(agent_id):
                raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_ID_ERROR)
            async with mongo_client("agents") as agents_collection:
                agent = await agents_collection.find_one({"_id": ObjectId(agent_id)})
            if not agent:
                raise HTTPException(status_code=404, detail=ERROR_CONSTANTS.NOT_FOUND_ERROR)   

            if agent['deleted_dt'] is not None or agent['deleted_dt'] :
                raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.AGENT_UPDATE_ERROR)

            async with mongo_client("agents") as agents_collection:
                return await agents_collection.update_one({"_id": ObjectId(agent_id)}, {"$set": {'deleted_dt': datetime.now() }})
        except Exception as e:
            raise Exception(e)

async def add_data_to_json_file(newAgentData: dict, existingAgentData: List[dict]):
    existingAgentData.append(newAgentData)
    # Write the updated data back to the JSON file
    async with aiofiles.open("../config/agentsData.json", "w") as json_file:
        await json_file.write(json.dumps(existingAgentData, default=str))  # Use default=str to handle UUID and date serialization

async def update_json_file(existingAgentData):
    # Write the updated data back to the JSON file
    async with aiofiles.open("../config/agentsData.json", "w") as json_file:
        await json_file.write(json.dumps(existingAgentData, default=str))  # Use default=str to handle UUID and date serialization