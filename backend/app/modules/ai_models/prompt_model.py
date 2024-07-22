from pydantic import BaseModel
from typing import Optional
from utils.enums.shared_enum import Flow, Model

class PromptModel(BaseModel):
    prompt: Optional[str] = None