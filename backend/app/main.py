from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.api.api_router import api_router
from app.db.base import Base
from app.db.session import engine
from app.db.seed_data import seed_database
from app.schemas.common import DEMO_DATA_DISCLAIMER


from sqlalchemy import text


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed demo data if empty
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(32);"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS habitation_id VARCHAR(36);"))
            conn.commit()
        Base.metadata.create_all(bind=engine)
        seed_database()
    except Exception as e:
        print(f"Startup initialization notice (will retry on demand): {e}")
    yield
    # Shutdown logic if any


app = FastAPI(
    title="Aashray — AI-Based Disaster Risk Mapping & Relocation Recommendation System",
    description=(
        "Intelligent Identification of Hazard-Based Red Zones, "
        "Carrying Capacity Assessment And Immediate Relocation Needs for Vulnerable Habitations.\n\n"
        "**Philosophy**: From Disaster Response to Disaster Prevention\n\n"
        "**Focus Hazards**: Flood, Landslide, Erosion.\n\n"
        f"**NOTICE**: {DEMO_DATA_DISCLAIMER}"
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local Next.js frontend requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", include_in_schema=False)
def root():
    return {
        "project": "Aashray",
        "title": "AI-Based Disaster Risk Mapping & Relocation Recommendation System",
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_check": "/api/health",
        "disclaimer": DEMO_DATA_DISCLAIMER,
    }
