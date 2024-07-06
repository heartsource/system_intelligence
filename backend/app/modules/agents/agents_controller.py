from fastapi import APIRouter, Response, status, HTTPException
from modules.agents.agents_model import AgentListModel, AgentModel, AgentUpdateModel
from modules.agents.agents_service import deleteAgent, createAgent, fetchAgentDetails, fetchAgentsList, updateAgentDetails
import utils.constants.error_constants as ERROR_CONSTANTS
import utils.constants.app_constants as APP_CONSTANTS
import json

router = APIRouter()

def internalServerError(e, response):
    if e.args[0] and isinstance(e.args[0], HTTPException):
        response.status_code = e.args[0].status_code
        return { "status": "error", "data": e.args[0].detail}
    response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    return { "status": "error", "data": str(e)}

@router.post('/')
async def fetch_agents(body: AgentListModel, response: Response):
    try:
        agentsListData = await fetchAgentsList(body)
        if agentsListData == [] or agentsListData == None:
            response.status_code = status.HTTP_404_NOT_FOUND
            return { "status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
        response.status_code = status.HTTP_200_OK
        # Manually serialize res to JSON to handle any serialization issues
        return { "status": "success", "data": agentsListData }
    except Exception as e:
        return internalServerError(e, response)

@router.get('/{id}')
async def fetch_agent_details(id: str, response: Response):
    try: 
        res = await fetchAgentDetails(id)
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
        await createAgent(body)       
        response.status_code = status.HTTP_201_CREATED
        return { "status": "success", "data": APP_CONSTANTS.AGENT_CREATED_SUCCESS }   
    except Exception as e:
        return internalServerError(e, response)

@router.put('/{id}')
async def update_agent(id: str, body: AgentUpdateModel, response: Response):
    try:
        await updateAgentDetails(id, body)
        response.status_code = status.HTTP_200_OK
        return { "status": "success", "data": APP_CONSTANTS.AGENT_UPDATED_SUCCESS }
    except Exception as e:
        return internalServerError(e, response)
    
@router.delete('/{id}')
async def delete_agent(id: str, response: Response):
    try:
        await deleteAgent(id)
        response.status_code = status.HTTP_200_OK
        return { "status": "success", "data": APP_CONSTANTS.AGENT_DELETED_SUCCESS }
    except Exception as e:
        return internalServerError(e, response)
    



