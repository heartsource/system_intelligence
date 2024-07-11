from typing import Optional
from fastapi import APIRouter, Response
from typing import Optional
from utils.enums.shared_enum import Flow, Model
from utils.common_utilities import internalServerError
from modules.hearty.hearty_service import talkToHeartie
from heartie_modals import HeartieQueryPayload

router = APIRouter()


@router.post("/talk_to_heartie/", tags=["talk_to_heartie"])
async def talk_to_heartie(
    response: Response,
    question: Optional[str] = None, 
    prompt: Optional[str] = None, 
    model: Optional[Model] = None, 
    flow: Optional[Flow] = None, 
    payload: Optional[HeartieQueryPayload] = None
    ):
    try:
        return await talkToHeartie(question, prompt, model, flow, payload)
    except Exception as e:
        return internalServerError(e, response)