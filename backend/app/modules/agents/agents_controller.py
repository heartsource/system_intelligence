from typing import Optional
from fastapi import APIRouter, Response, status, HTTPException
from utils.enums.shared_enum import AgentType
from utils.common_utilities import internalServerError
from modules.agents.agents_model import AgentListModel, AgentModel, AgentUpdateModel
from modules.agents.agents_service import AgentService
import utils.constants.error_constants as ERROR_CONSTANTS
import utils.constants.app_constants as APP_CONSTANTS
import json

router = APIRouter()
agent_service = AgentService()

@router.post('/')
async def fetch_agents(body: AgentListModel, response: Response):
    try:
        agentsListData = await agent_service.fetchAgentsList(body)
        if agentsListData == [] or agentsListData == None:
            response.status_code = status.HTTP_404_NOT_FOUND
            return { "status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
        response.status_code = status.HTTP_200_OK
        return { "status": "success", "data": agentsListData }
    except Exception as e:
        return internalServerError(e, response)

@router.get('/names')
async def fetch_agent_names(response: Response, agent_type:  Optional[AgentType] = None):
    try: 
        agentsNames = await agent_service.fetchAgentsNames(agent_type)
        if agentsNames == [] or agentsNames == None:
            response.status_code = status.HTTP_404_NOT_FOUND
            return { "status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
        if agentsNames is not None:
            response.status_code = status.HTTP_200_OK
            return { "status": "success", "data": agentsNames }
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
    except Exception as e:
        return internalServerError(e, response)

@router.get('/{id}')
async def fetch_agent_details(id: str, response: Response):
    try: 
        res = await agent_service.fetchAgentDetails(id)
        if res is not None:
            response.status_code = status.HTTP_200_OK
            return { "status": "success", "data": res }
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
    except Exception as e:
        return internalServerError(e, response)


@router.post('/create-agent')
async def create_agent(body: AgentModel, response: Response):
    try:
        await agent_service.createAgent(body)       
        response.status_code = status.HTTP_201_CREATED
        return { "status": "success", "data": APP_CONSTANTS.AGENT_CREATED_SUCCESS }   
    except Exception as e:
        return internalServerError(e, response)

@router.put('/{id}')
async def update_agent(id: str, body: AgentUpdateModel, response: Response):
    try:
        await agent_service.updateAgentDetails(id, body)
        response.status_code = status.HTTP_200_OK
        return { "status": "success", "data": APP_CONSTANTS.AGENT_UPDATED_SUCCESS }
    except Exception as e:
        return internalServerError(e, response)
    
@router.delete('/{id}')
async def delete_agent(id: str, response: Response):
    try:
        await agent_service.deleteAgent(id)
        response.status_code = status.HTTP_200_OK
        return { "status": "success", "data": APP_CONSTANTS.AGENT_DELETED_SUCCESS }
    except Exception as e:
        return internalServerError(e, response)
