from typing import Optional
from fastapi import APIRouter, Response, status

from utils.common_utilities import internalServerError
from modules.logs.logs_model import AgentLogsListModel
from modules.logs.logs_service import fetchLogDetails, fetchLogs
import utils.constants.error_constants as ERROR_CONSTANTS
import utils.constants.app_constants as APP_CONSTANTS

router = APIRouter()

@router.post('/')
async def fetch_logs(payload: AgentLogsListModel, response: Response):
    try:
        agentsLogsData = await fetchLogs(payload)
        if agentsLogsData == [] or agentsLogsData == None:
                return { "status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
        response.status_code = status.HTTP_200_OK
        # Manually serialize res to JSON to handle any serialization issues
        return { "status": "success", "data": agentsLogsData }
    except Exception as e:
        return internalServerError(e, response)
    

# @router.get('/{agent_id}')
# async def fetch_agent_logs(agent_id: str, response: Response):
#     try:
#             agentLogs = await fetchAgentLogs(agent_id)
#             if agentLogs == None:
#                 return { "status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
#             response.status_code = status.HTTP_200_OK
#             # Manually serialize res to JSON to handle any serialization issues
#             return { "status": "success", "data": agentLogs }
#     except Exception as e:
#          return internalServerError(e, response)

@router.get('/{interaction_id}')
async def fetch_log_details(interaction_id: str, response: Response):
    try:
            logDetails = await fetchLogDetails(interaction_id)
            if logDetails == None:
                return { "status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
            response.status_code = status.HTTP_200_OK
            # Manually serialize res to JSON to handle any serialization issues
            return { "status": "success", "data": logDetails }
    except Exception as e:
         return internalServerError(e, response)