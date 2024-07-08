from datetime import datetime
from typing import List, Optional
import uuid
from pydantic import BaseModel

from utils.enums.shared_enum import SortOrder


class AgentLogsModel(BaseModel):
    agent_id: str
    interaction_id: uuid.UUID
    question: str
    answer: str
    interaction_date: datetime
    duration: int

class AgentLogsListModel(BaseModel):
    agent_ids: Optional[List[str]] = None # Array of agent ids
    interaction_id: Optional[str] = None
    interaction_date: Optional[datetime] = None
    duration: Optional[int] = None
    sort_order: Optional[SortOrder] = SortOrder.ASC
    sort_by: Optional[str] = 'interaction_date'
    limit: Optional[int] = 10