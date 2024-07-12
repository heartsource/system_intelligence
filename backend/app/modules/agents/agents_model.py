from datetime import datetime
from uuid import UUID
import uuid
from pydantic import BaseModel
from typing import Optional
from utils.enums.shared_enum import Model, Flow, AgentType, SortOrder, Status

class AgentModel(BaseModel):
    name: str
    description: Optional[str] = None
    template: str
    model: Model
    flow: Flow
    type: Optional[str] = AgentType.CUSTOM
    status: Optional[str] = Status.ACTIVE
    created_dt: Optional[datetime] = None
    updated_dt: Optional[datetime] = None
    deleted_dt: Optional[datetime] = None

    # class Config:
    #     json_encoders = {
    #         AgentType: lambda v: v.value,
    #         Status: lambda v: v.value,
    #         Model: lambda v: v.value,
    #         Flow: lambda v: v.value,
    #         datetime: lambda v: v.isoformat()
    #     }
    # Enum Configuration (Config class): Pydantic's Config class allows us to specify serialization behavior. 
    # use_enum_values = True instructs Pydantic to serialize enums using their values (str representations), instead of their internal representations (typically Python objects).

class AgentListModel(BaseModel):
    id: Optional[uuid.UUID] = None
    name: Optional[str] = None
    description: Optional[str] = None,
    template: Optional[str] = None,
    model: Optional[Model] = None
    flow: Optional[Flow] = None
    status: Optional[Status] = None
    type: Optional[str] = AgentType.CUSTOM
    sort_order: Optional[SortOrder] = SortOrder.DESC
    sort_by: Optional[str] = 'created_dt'
    limit: Optional[int] = 10


class AgentUpdateModel(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    template: Optional[str] = None
    model: Optional[Model] = None
    flow: Optional[Flow] = None
    status: Optional[Status]= None

