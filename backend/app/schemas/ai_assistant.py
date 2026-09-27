from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.schemas.common import DEMO_DATA_DISCLAIMER


class AIQueryRequest(BaseModel):
    query: str
    role: Optional[str] = "USER"  # USER or ADMIN
    habitation_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class AIQueryResponse(BaseModel):
    query: str
    answer: str
    suggested_actions: List[str] = []
    related_entities: Dict[str, Any] = {}
    data_available: bool = True
    disclaimer: str = DEMO_DATA_DISCLAIMER
