from typing import List
from sqlalchemy.orm import Session
from app.models.entities import SafeZone
from app.schemas.safe_zone import SafeZoneListResponse, SafeZoneItem


class SafeZoneService:
    @staticmethod
    def get_safe_zones(db: Session) -> SafeZoneListResponse:
        zones = db.query(SafeZone).order_by(SafeZone.name).all()

        total_max = 0
        total_occ = 0
        items: List[SafeZoneItem] = []

        for sz in zones:
            total_max += sz.max_capacity
            total_occ += sz.current_occupancy
            avail = max(0, sz.max_capacity - sz.current_occupancy)
            rate = round((sz.current_occupancy / sz.max_capacity * 100), 1) if sz.max_capacity > 0 else 0.0

            items.append(
                SafeZoneItem(
                    id=sz.id,
                    name=sz.name,
                    code=sz.code,
                    district=sz.district,
                    state=sz.state,
                    latitude=sz.latitude,
                    longitude=sz.longitude,
                    max_capacity=sz.max_capacity,
                    current_occupancy=sz.current_occupancy,
                    available_capacity=avail,
                    occupancy_rate=rate,
                    elevation_meters=sz.elevation_meters,
                    safety_score=getattr(sz, "safety_score", 90),
                    road_access_score=getattr(sz, "road_access_score", 85),
                    healthcare_score=getattr(sz, "healthcare_score", 80),
                    distance_km=getattr(sz, "distance_km", 5.0),
                    status=sz.status,
                    created_at=sz.created_at,
                )
            )

        total_avail = max(0, total_max - total_occ)

        return SafeZoneListResponse(
            total_safe_zones=len(zones),
            total_max_capacity=total_max,
            total_current_occupancy=total_occ,
            total_available_capacity=total_avail,
            items=items,
        )
