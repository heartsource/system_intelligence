from datetime import datetime
import uuid
from pydantic import BaseModel
from typing import Optional
from utils.enums.shared_enum import Model, Flow, AgentType, SortOrder, AgentStatus

class AgentModel(BaseModel):
    name: str
    description: Optional[str] = None
    template: str
    model: Model
    flow: Flow
    type: Optional[AgentType] = AgentType.CUSTOM
    status: Optional[AgentStatus] = AgentStatus.ACTIVE
    created_dt: Optional[datetime] = None
    updated_dt: Optional[datetime] = None
    deleted_dt: Optional[datetime] = None

class AgentListModel(BaseModel):
    id: Optional[uuid.UUID] = None
    name: Optional[str] = None
    description: Optional[str] = None,
    template: Optional[str] = None,
    model: Optional[Model] = None
    flow: Optional[Flow] = None
    status: Optional[AgentStatus] = None
    type: Optional[AgentType] = AgentType.CUSTOM
    sort_order: Optional[SortOrder] = SortOrder.DESC
    sort_by: Optional[str] = 'created_dt'
    limit: Optional[int] = 10
    offset: Optional[int] = 0


class AgentUpdateModel(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    template: Optional[str] = None
    model: Optional[Model] = None
    flow: Optional[Flow] = None
    status: Optional[AgentStatus]= None

