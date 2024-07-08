from pydantic import BaseModel
from typing import Optional

class HeartieQueryPayload(BaseModel):
    agent_id: str
    question: str
    prompt: Optional[str] = None
    model: Optional[str] = None
    flow: Optional[str] = None

