from typing import Optional
from fastapi import APIRouter, Response
from modules.ai_models.prompt_model import PromptModel
from modules.ai_models.llama.llama_service import LlamaService
from utils.common_utilities import internalServerError

router = APIRouter()
llama_service = LlamaService()

@router.post('/')
async def llama_chat_completions(response: Response, payload: Optional[PromptModel] = None):
    try:   
        return await llama_service.LlamaChatCompletions(payload.prompt)
    except Exception as e:
        return internalServerError(e, response)