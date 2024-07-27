from datetime import datetime
from typing import List, Optional
import uuid
from pydantic import BaseModel
from utils.enums.shared_enum import Flow, Model, SortOrder

class AgentLogsModel(BaseModel):
    agent_id: str
    interaction_id: uuid.UUID
    model: Model
    flow: Flow
    template: str
    question: str
    answer: str
    interaction_date: datetime
    duration: int
    deleted_dt: Optional[datetime] = None

class AgentLogsListModel(BaseModel):
    agent_ids: Optional[List[str]] = None # Array of agent ids
    interaction_id: Optional[uuid.UUID] = None
    interaction_date: Optional[datetime] = None
    duration: Optional[int] = None
    model: Optional[Model] = None
    flow: Optional[Flow] = None
    sort_order: Optional[SortOrder] = SortOrder.DESC
    sort_by: Optional[str] = 'interaction_date'
    limit: Optional[int] = 10
    offset: Optional[int] = 0
    deleted_dt: Optional[datetime] = None