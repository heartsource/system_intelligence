from datetime import datetime
from typing import List, Optional
from fastapi import UploadFile
from pydantic import BaseModel

from utils.enums.shared_enum import InquiryStatus, SortOrder


class InquiryModel(BaseModel):
    inquiry_id: Optional[int] = None
    agent_id: str
    status: Optional[InquiryStatus] = InquiryStatus.INQUIRED
    query: str
    response: Optional[str] = None
    requested_on: Optional[datetime] = None
    responded_on: Optional[datetime] = None
    responded_by: Optional[str] = None
    injested_on: Optional[datetime] = None
    updated_dt: Optional[datetime] = None
    deleted_dt: Optional[datetime] = None

class InquiryListModel(BaseModel):
    status: Optional[List[InquiryStatus]] = None
    sort_by: Optional[str] = 'requested_on'
    sort_order: Optional[SortOrder] = SortOrder.DESC
    limit: Optional[int] = 10
    offset: Optional[int] = 0
