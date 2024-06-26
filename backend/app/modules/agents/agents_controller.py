from fastapi import APIRouter, Response, status, HTTPException
from modules.agents.agents_model import AgentListModel, AgentModel
from modules.agents.agents_service import deleteAgent, fetch_agents_list, createAgent, fetchAgentDetails, updateAgentDetails

router = APIRouter()

def internalServerError(e, response):
    response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    return { "status": "error", "data": str(e)}

@router.post('/')
async def fetch_agents(body: AgentListModel, response: Response):
    try:
        res = await fetch_agents_list(body)
        if res == [] or res == None:
            response.status_code = status.HTTP_404_NOT_FOUND
            return { "status": "error", "data": "No records found" }
        response.status_code = status.HTTP_200_OK
        return { "status": "success", "data": res }
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
        return {"status": "error", "data": f"No record found with id {id}"}
    except Exception as e:
        return internalServerError(e, response)


@router.post('/create-agent')
async def create_agent(body: AgentModel, response: Response):
    try:
        await createAgent(body)       
        response.status_code = status.HTTP_201_CREATED
        return { "status": "success", "data": "Agent Created" }   
    except Exception as e:
        return internalServerError(e, response)

@router.put('/{id}')
async def update_agent(id: str, body: AgentListModel, response: Response):
    try:
        await updateAgentDetails(id, body)
        response.status_code = status.HTTP_200_OK
        return { "status": "success", "data": "Agent details updated successfully" }
    except Exception as e:
        return internalServerError(e, response)
    
@router.delete('/{id}')
async def delete_agent(id: str, response: Response):
    try:
        await deleteAgent(id)
        response.status_code = status.HTTP_200_OK
        return { "status": "success", "data": "Agent deleted successfully" }
    except Exception as e:
        return internalServerError(e, response)
    



