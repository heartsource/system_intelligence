from datetime import date, datetime
from uuid import UUID
from pydantic import BaseModel
from typing import Optional
from enum import Enum

class Status(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class Model(str, Enum):
    ChatGPT4 = 'ChatGPT4'
    Llama3 = 'Llama 3'
    Mistral = 'Mistral'

class Flow(str,Enum):
    RAG = 'RAG'
    FineTuning = 'Fine Tuning'

class SortOrder(Enum):
    ASC = 'asc'
    DESC = 'desc'

class AgentModel(BaseModel):
    id: Optional[UUID] = None
    name: str
    description: Optional[str] = None
    template: str
    model: Model
    flow: Flow
    status: Optional[str] = Status.ACTIVE
    created_dt: Optional[datetime] = None
    updated_dt: Optional[datetime] = None
    deleted_dt: Optional[datetime] = None

    class Config:
        use_enum_values = True  # Ensure enums are serialized as their values
    # Enum Configuration (Config class): Pydantic's Config class allows us to specify serialization behavior. 
    # use_enum_values = True instructs Pydantic to serialize enums using their values (str representations), instead of their internal representations (typically Python objects).

class AgentListModel(BaseModel):
    id: Optional[UUID] = None
    name: Optional[str] = None
    description: Optional[str] = None,
    template: Optional[str] = None,
    model: Optional[Model] = None
    flow: Optional[Flow] = None
    status: Optional[Status] = None
    sort_order: Optional[SortOrder] = 'desc'
    sort_by: Optional[str] = 'updated_dt'
    limit: Optional[int] = 10



