from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.common import DEMO_DATA_DISCLAIMER


class ComplaintCreate(BaseModel):
    issue_type: str  # Flooding, Landslide, Erosion, Unsafe House, Blocked Road, Damaged Infrastructure, Other
    habitation_id: Optional[str] = None
    location_text: str
    description: str
    photo_url: Optional[str] = None
    contact_name: str
    contact_phone: str


class ComplaintUpdate(BaseModel):
    status: Optional[str] = None  # Submitted, Under Review, In Progress, Resolved, Rejected
    assigned_to: Optional[str] = None
    admin_notes: Optional[str] = None


class ComplaintItem(BaseModel):
    id: str
    complaint_code: str
    user_id: Optional[str] = None
    habitation_id: Optional[str] = None
    habitation_name: Optional[str] = None
    issue_type: str
    location_text: str
    description: str
    photo_url: Optional[str] = None
    contact_name: str
    contact_phone: str
    status: str
    assigned_to: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ComplaintListResponse(BaseModel):
    items: List[ComplaintItem]
    total: int
    open_count: int
    in_progress_count: int
    resolved_count: int
    disclaimer: str = DEMO_DATA_DISCLAIMER
