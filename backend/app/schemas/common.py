from typing import Generic, TypeVar, Optional, List
from pydantic import BaseModel

T = TypeVar("T")

DEMO_DATA_DISCLAIMER = "DEMO DATA — NOT OFFICIAL GOVERNMENT DATA"


class DisclaimerResponse(BaseModel):
    disclaimer: str = DEMO_DATA_DISCLAIMER


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    disclaimer: str = DEMO_DATA_DISCLAIMER
