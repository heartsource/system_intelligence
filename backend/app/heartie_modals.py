from pydantic import BaseModel
from typing import Optional
from utils.enums.shared_enum import Flow, Model

class HeartieQueryPayload(BaseModel):
    agent_id: str
    question: str
    prompt: Optional[str] = None
    model: Optional[Model] = None
    flow: Optional[Flow] = None