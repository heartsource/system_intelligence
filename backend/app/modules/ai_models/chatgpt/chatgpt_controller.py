from typing import Optional
from fastapi import APIRouter, Response
from modules.ai_models.prompt_model import PromptModel
from modules.ai_models.chatgpt.chatgpt_service import ChatGPTService
from utils.common_utilities import internalServerError

router = APIRouter()
chatgpt_service = ChatGPTService()

@router.post('/')
async def chatgpt_chat_completions(response: Response, payload: Optional[PromptModel] = None):
    try:   
        return await chatgpt_service.chatGPTChatCompletions(payload.prompt)
    except Exception as e:
        return internalServerError(e, response)