from fastapi import APIRouter
from app.api.routes import (
    health,
    habitations,
    dashboard,
    risk,
    capacity,
    relocation,
    safe_zones,
    alerts,
    auth,
    complaints,
    ai_assistant,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, tags=["Authentication & Roles"])
api_router.include_router(dashboard.router, tags=["Dashboard"])
api_router.include_router(habitations.router, tags=["Habitations"])
api_router.include_router(risk.router, tags=["Risk Assessment"])
api_router.include_router(capacity.router, tags=["Carrying Capacity"])
api_router.include_router(relocation.router, tags=["Relocation"])
api_router.include_router(safe_zones.router, tags=["Safe Zones"])
api_router.include_router(alerts.router, tags=["Alerts"])
api_router.include_router(complaints.router, tags=["Complaints & Grievances"])
api_router.include_router(ai_assistant.router, tags=["Aashray AI Assistant"])
