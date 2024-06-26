from datetime import date, datetime
from enum import Enum
from typing import Optional, List, Dict, Any
import json
import traceback

from fastapi import HTTPException
from modules.agents.agents_model import AgentListModel, AgentModel
import uuid
import aiofiles

# async def load_agents_data():
#     with open(r"utils\agentsData.json") as agents_data_file:
#         return json.load(agents_data_file) # returns JSON object as a dictionary
    
async def load_agents_data():
    async with aiofiles.open(r"utils\agentsData.json", "r") as agents_data_file:
        data = await agents_data_file.read()
        return json.loads(data)

def sortBy(agent, sort_key):
    value = agent.get(sort_key)
    if value is None:
        # Ensure None values are placed at the end during sorting
        return (1, None)
    return (0, value)

async def fetch_agents_list(agent_model: AgentListModel) -> List[Dict[str, Any]]:
    try:
        filtered_agents_data = await load_agents_data()

        filtered_agents_data = [agent for agent in filtered_agents_data if 'deleted_dt' not in agent or agent['deleted_dt'] is None ]

        if agent_model.name:
            filtered_agents_data = [agent for agent in filtered_agents_data if agent['name'] == agent_model.name ]

        if agent_model.model:
            filtered_agents_data = [agent for agent in filtered_agents_data if agent['model'] == agent_model.model.value ]

        if agent_model.flow:
            filtered_agents_data = [agent for agent in filtered_agents_data if agent['flow'] == agent_model.flow.value ]

        if agent_model.status:
            filtered_agents_data = [agent for agent in filtered_agents_data if agent['status'] == agent_model.status.value ]

        if agent_model.sort_by:
            sort_order_value = agent_model.sort_order.value if isinstance(agent_model.sort_order, Enum) else agent_model.sort_order
            reverse = sort_order_value.lower() == 'desc'
            # filtered_agents_data.sort(key = sortBy(agent_model.sort_by), reverse = reverse)
            filtered_agents_data = sorted(filtered_agents_data, key=lambda agent: sortBy(agent, agent_model.sort_by), reverse=reverse)

        if agent_model.limit:
            filtered_agents_data = filtered_agents_data[:agent_model.limit]

        return filtered_agents_data
    except Exception as e:
        traceback.print_exception(e)
        raise Exception(e)

async def fetchAgentDetails(id: str) -> Dict[str, Any]:
    try:
        agents_data = await load_agents_data()
        agents_data = [agent for agent in agents_data if 'deleted_dt' not in agent or agent['deleted_dt'] is None ]
        agentAvailable = False
        for agent in agents_data:
            if agent['id'] == id :
                agentAvailable = True
                return agent
        if agentAvailable == False:
                return None
    except Exception as e:
        traceback.print_exception(e)
        raise Exception(e)


async def createAgent(agent: AgentModel):
    try:
        existingAgentData = await load_agents_data() # Read the JSON into the buffer
        for existingAgent in existingAgentData:
            if existingAgent['name'] == agent.name :
                raise Exception(agent.name + " agent is already available")
        agent.created_dt = datetime.now()
        agent.id = uuid.uuid4()

        # Serialize AgentModel instance to JSON using model_dump_json()
        return await add_data_to_json_file(agent.model_dump_json(), existingAgentData)
    except Exception as e:
        traceback.print_exception(e)
        raise Exception(e)

async def updateAgentDetails(id:str, agent: AgentListModel):
    try:
        existingAgentData = await load_agents_data() # Read the JSON into the buffer
        agentAvailable = False
        for existingAgent in existingAgentData:
            if existingAgent['id'] == id :
                agentAvailable = True
                existingAgent['name'] = agent.name
                existingAgent['description'] = agent.description
                existingAgent['model'] = agent.model
                existingAgent['status'] = agent.status
                existingAgent['flow'] = agent.flow
                existingAgent['template'] = agent.template
                existingAgent['updated_dt'] = datetime.now()
                break        
        if agentAvailable == False:
            raise Exception("No record found with id " + id)
        # Serialize AgentModel instance to JSON using model_dump_json()
        return await update_json_file(existingAgentData)
    except Exception as e:
        traceback.print_exception(e)
        raise Exception(e)
    
async def deleteAgent(id:str):
        try:
            existingAgentData = await load_agents_data() # Read the JSON into the buffer
            agentAvailable = False
            for existingAgent in existingAgentData:
                if existingAgent['id'] == id :
                    if existingAgent['deleted_dt'] is not None:
                        raise Exception("Agent details cannot be updated as agent is already deleted")
                    agentAvailable = True
                    existingAgent['deleted_dt'] = datetime.now()
                    break        
            if agentAvailable == False:
                raise Exception("No record found with id " + id)
            # Serialize AgentModel instance to JSON using model_dump_json()
            return await update_json_file(existingAgentData)
        except Exception as e:
            traceback.print_exception(e)
            raise Exception(e)

async def add_data_to_json_file(newAgentData, existingAgentData):
    existingAgentData.append(json.loads(newAgentData)) # Append the new agent data
    # Write the updated data back to the JSON file
    async with aiofiles.open("utils/agentsData.json", "w") as json_file:
        await json_file.write(json.dumps(existingAgentData, default=str))  # Use default=str to handle UUID and date serialization

async def update_json_file(existingAgentData):
    # Write the updated data back to the JSON file
    async with aiofiles.open("utils/agentsData.json", "w") as json_file:
        await json_file.write(json.dumps(existingAgentData, default=str))  # Use default=str to handle UUID and date serialization