from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.relocation_service import RelocationService
from app.schemas.relocation import RelocationSummaryResponse

router = APIRouter()


@router.get("/relocation/summary", response_model=RelocationSummaryResponse)
def get_relocation_summary(db: Session = Depends(get_db)):
    """
    Retrieve prioritized habitations requiring relocation and mapped safe zones.
    """
    return RelocationService.get_summary(db)
