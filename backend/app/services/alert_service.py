from typing import List
from sqlalchemy.orm import Session, joinedload
from app.models.entities import Alert
from app.schemas.alert import AlertListResponse, AlertItem


class AlertService:
    @staticmethod
    def get_alerts(db: Session, active_only: bool = True) -> AlertListResponse:
        query = db.query(Alert).options(joinedload(Alert.habitation))
        if active_only:
            query = query.filter(Alert.is_active == True)

        alerts = query.order_by(Alert.issued_at.desc()).all()

        crit_count = 0
        high_count = 0
        med_count = 0
        items: List[AlertItem] = []

        for a in alerts:
            if a.severity == "CRITICAL":
                crit_count += 1
            elif a.severity == "HIGH":
                high_count += 1
            elif a.severity == "MEDIUM":
                med_count += 1

            items.append(
                AlertItem(
                    id=a.id,
                    title=a.title,
                    message=a.message,
                    severity=a.severity,
                    alert_type=a.alert_type,
                    habitation_id=a.habitation_id,
                    habitation_name=a.habitation.name if a.habitation else None,
                    is_active=a.is_active,
                    issued_at=a.issued_at,
                    resolved_at=a.resolved_at,
                )
            )

        return AlertListResponse(
            total_alerts=len(items),
            active_critical_count=crit_count,
            active_high_count=high_count,
            active_medium_count=med_count,
            items=items,
        )
