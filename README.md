# HazardShield AI

> **Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs for Vulnerable Habitations**

---

## 1. Project Overview
HazardShield AI is an intelligent disaster-management decision-support platform engineered to identify high-risk settlement areas ("Red Zones"), evaluate their demographic and infrastructural carrying capacity, prioritize urgent relocation needs, and guide sustainable safe zone allocations.

> [!IMPORTANT]
> **DEMO DATA NOTICE**: All habitation, population, hazard assessment, and relocation records included in this milestone are fictional demonstrative records (`DEMO DATA — NOT OFFICIAL GOVERNMENT DATA`) prepared for architectural validation and evaluation.

---

## 2. SIH Problem Interpretation & Proposed Solution

### The Challenge
Disaster management authorities often face difficulties synthesizing disparate datasets (terrain topology, meteorological warnings, structural vulnerability, demographic density, and evacuation shelter capacity) during impending extreme weather or seismic events. This results in delayed identification of unviable habitations, overloaded relief camps, and ad-hoc evacuations that risk human lives.

### The HazardShield AI Solution
1. **Dynamic Risk Stratification**: Synthesizes multi-hazard susceptibilities (flood, landslide, earthquake, fire, cyclone) into an actionable composite risk score.
2. **Carrying Capacity Stress Monitoring**: Calculates stress ratios between current settlement loads and local infrastructure thresholds (water, sanitation, road accessibility).
3. **Prioritized Relocation Queue**: Flags habitations requiring immediate vs. staged evacuation and maps them to verified safe zones with remaining capacity.
4. **Actionable Command Center**: Empowers district magistrates, emergency response teams, and relief commissioners with an intuitive, unified dashboard.

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14/15 (App Router), TypeScript, Tailwind CSS, Lucide React |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2 |
| **Database** | PostgreSQL 16 (PostGIS compatible schema), SQLAlchemy 2.0 ORM |
| **Database Migrations** | Alembic |
| **DevOps & Containers** | Docker, Docker Compose |
| **Spatial Formats** | GeoJSON, WGS84 CRS:84 |

---

## 4. Project Structure

```
hazardshield-ai/
│
├── frontend/                     # Next.js App Router application
│   ├── app/                      # Page routes (dashboard, habitations, risk, capacity, relocation, safe-zones, alerts, reports, settings, login)
│   ├── components/               # Reusable UI, dashboard widgets, and MapContainer
│   ├── lib/                      # API client and utility helpers
│   ├── types/                    # Shared TypeScript interfaces
│   ├── public/                   # Static assets
│   ├── tailwind.config.ts        # Tailwind styling configuration
│   └── package.json
│
├── backend/                      # FastAPI backend service
│   ├── app/
│   │   ├── api/routes/           # API endpoints (health, dashboard, habitations, risk, capacity, relocation, safe_zones, alerts)
│   │   ├── core/                 # App settings, environment configs, CORS
│   │   ├── db/                   # Database engine, session, and seed scripts
│   │   ├── models/               # SQLAlchemy models (13 relational entities)
│   │   ├── schemas/              # Pydantic v2 request/response schemas
│   │   ├── services/             # Core business logic and aggregation
│   │   └── main.py               # FastAPI entry point
│   ├── alembic/                  # Alembic migration scripts and versions
│   ├── alembic.ini               # Alembic configuration
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile
│
├── data/
│   ├── sample/                   # Centralized demo dataset (fictional Indian habitations)
│   └── geojson/                  # Sample GeoJSON red zones & safe zones
│
├── docs/
│   └── ARCHITECTURE.md           # System architecture and future engine expansion
│
├── docker-compose.yml            # Multi-container orchestration (postgres, backend, frontend)
├── .env.example                  # Environment configuration template
├── .gitignore
└── README.md
```

---

## 5. Database Design (13 Entities)

The PostgreSQL database contains 13 relational entities:
- **`roles`**: System roles (`ADMIN`, `AUTHORITY`, `ANALYST`, `VIEWER`).
- **`users`**: System users with role references and authentication attributes.
- **`habitations`**: Core settlement records (district, coordinates, population, housing).
- **`population_profiles`**: Demographic vulnerability metrics (children, elderly, women, special vulnerabilities).
- **`infrastructure_profiles`**: Lifeline scores (roads, sanitation, water, power, healthcare, shelter).
- **`hazard_assessments`**: Granular hazard probabilities (flood, landslide, earthquake, cyclone, fire, heatwave).
- **`risk_scores`**: Calculated composite score and level (`SAFE_LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
- **`capacity_assessments`**: Carrying capacity thresholds, current population loads, and stress ratios.
- **`safe_zones`**: Evacuation shelters with capacity, occupancy, and elevation metrics.
- **`emergency_facilities`**: Hospitals, relief camps, and fire stations.
- **`relocation_recommendations`**: Prioritized relocation recommendations linked to safe zones.
- **`alerts`**: Real-time hazard alerts and notifications.
- **`audit_logs`**: System activity audit trails.

---

## 6. Environment Variables

Create your `.env` file from `.env.example`:

```bash
cp .env.example .env
```

| Variable | Description | Default (Local) |
|---|---|---|
| `ENVIRONMENT` | Runtime environment | `development` |
| `SECRET_KEY` | Application secret key | `demo_secret_key_change_in_production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+psycopg://hazardshield_user:hazardshield_password@localhost:5432/hazardshield_db` |
| `NEXT_PUBLIC_API_URL` | Base API URL for frontend | `http://localhost:8000` |
| `BACKEND_HOST` | Backend bind host | `0.0.0.0` |
| `BACKEND_PORT` | Backend bind port | `8000` |

---

## 7. Running Locally

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- PostgreSQL 14+ (or run via Docker)

### 1. Start PostgreSQL (Option A: via Docker)
```bash
docker compose up -d postgres
```

### 2. Set Up and Run Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Seed demo data
python -m app.db.seed_data

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API will be accessible at: `http://localhost:8000`  
Swagger Documentation: `http://localhost:8000/docs`

### 3. Set Up and Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Dashboard will be accessible at: `http://localhost:3000`

---

## 8. Running with Docker Compose

Run all services (`postgres`, `backend`, `frontend`) in isolated containers:

```bash
docker compose up --build -d
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Interactive Docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

To shut down:
```bash
docker compose down
```

---

## 9. API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and database connectivity |
| `GET` | `/api/dashboard/summary` | Top KPI statistics, risk distribution, vulnerability totals |
| `GET` | `/api/habitations` | Paginated list of habitations with district/risk filtering |
| `GET` | `/api/habitations/{id}` | Detailed habitation profile and assessments |
| `GET` | `/api/risk/summary` | Risk matrix breakdown and highest hazard zones |
| `GET` | `/api/capacity/summary` | Carrying capacity stress ratios and overloaded zones |
| `GET` | `/api/relocation/summary` | Priority relocation queue and target safe zones |
| `GET` | `/api/safe-zones` | Registered safe havens and relief camps |
| `GET` | `/api/alerts` | Active hazard advisories and emergency bulletins |

---

## 10. Milestone Roadmap

### Milestone 1 (Current)
- [x] Full-stack architecture (Next.js + FastAPI + PostgreSQL + Docker)
- [x] 13-entity relational database schema
- [x] Alembic migration pipeline
- [x] Centralized sample dataset (fictional Indian habitations)
- [x] Enterprise disaster-management frontend shell and 10 views
- [x] Reusable `MapContainer` placeholder with GIS layer controls
- [x] Verified health check, backend endpoints, and frontend data binding

### Milestone 2 (Upcoming)
- Advanced GIS integration (MapLibre / Leaflet vector tiles and polygon boundaries)
- Real-time hydrological and meteorological sensor ingestion
- Rule-based dynamic Red Zone classification

### Milestone 3 (Future)
- Machine Learning hazard susceptibility modeling (XGBoost / GNN)
- Multi-objective linear optimization for emergency relocation allocation
- Evacuation route analysis via pgRouting
- Natural language Disaster Management AI Assistant
