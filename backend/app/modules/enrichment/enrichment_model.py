from datetime import datetime
from typing import List, Optional
from fastapi import UploadFile
from pydantic import BaseModel

from utils.enums.shared_enum import EnrichmentStatus, SortOrder


class EnrichmentModel(BaseModel):
    enrichment_id: Optional[int] = None
    agent_id: str
    status: Optional[EnrichmentStatus] = EnrichmentStatus.INQUIRED
    query: str
    response: Optional[str] = None
    requested_on: Optional[datetime] = None
    responded_on: Optional[datetime] = None
    responded_by: Optional[str] = None
    injested_on: Optional[datetime] = None
    updated_dt: Optional[datetime] = None
    deleted_dt: Optional[datetime] = None

class EnrichmentListModel(BaseModel):
    status: Optional[List[EnrichmentStatus]] = None
    sort_by: Optional[str] = 'requested_on'
    sort_order: Optional[SortOrder] = SortOrder.DESC
    limit: Optional[int] = 10
    offset: Optional[int] = 0
