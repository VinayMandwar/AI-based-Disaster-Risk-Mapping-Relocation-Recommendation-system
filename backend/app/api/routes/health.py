from datetime import datetime
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
from app.schemas.common import DEMO_DATA_DISCLAIMER

router = APIRouter()


@router.get("/health", status_code=status.HTTP_200_OK)
def health_check(db: Session = Depends(get_db)):
    """
    Service health check and database connectivity verification.
    """
    db_status = "healthy"
    db_latency_ms = 0.0
    try:
        t0 = datetime.utcnow()
        db.execute(text("SELECT 1"))
        t1 = datetime.utcnow()
        db_latency_ms = round((t1 - t0).total_seconds() * 1000, 2)
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "online",
        "service": "Aashray Backend API",
        "version": "1.0.0",
        "environment": "development",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "database": {
            "status": db_status,
            "latency_ms": db_latency_ms,
        },
        "disclaimer": DEMO_DATA_DISCLAIMER,
    }
