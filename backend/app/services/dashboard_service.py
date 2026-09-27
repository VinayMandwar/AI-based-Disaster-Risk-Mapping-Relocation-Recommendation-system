from sqlalchemy.orm import Session, joinedload
from app.models.entities import (
    Habitation,
    RiskScore,
    PopulationProfile,
    RelocationRecommendation,
    Alert,
    Complaint,
)
from app.schemas.dashboard import (
    DashboardKpis,
    RiskDistributionItem,
    PopulationVulnerabilitySummary,
    HighRiskHabitationSummary,
    RecentAlertSummary,
    DashboardSummaryResponse,
)


class DashboardService:
    @staticmethod
    def get_summary(db: Session) -> DashboardSummaryResponse:
        habitations = (
            db.query(Habitation)
            .options(
                joinedload(Habitation.risk_scores),
                joinedload(Habitation.population_profile),
                joinedload(Habitation.hazard_assessments),
            )
            .all()
        )

        total_habitations = len(habitations)
        critical_zones = 0
        high_risk_areas = 0
        population_at_risk = 0

        risk_counts = {"SAFE_LOW": 0, "MODERATE": 0, "HIGH": 0, "CRITICAL": 0}
        risk_colors = {
            "SAFE_LOW": "#10b981",  # Emerald
            "MODERATE": "#f59e0b",  # Amber
            "HIGH": "#f97316",      # Orange
            "CRITICAL": "#ef4444",  # Red
        }

        total_pop = 0
        children_total = 0
        elderly_total = 0
        women_total = 0
        special_total = 0

        high_risk_list = []

        for h in habitations:
            # Latest Risk Score
            latest_score = 0.0
            latest_level = "SAFE_LOW"
            if h.risk_scores:
                latest_rs = sorted(h.risk_scores, key=lambda x: x.calculated_at)[-1]
                latest_score = latest_rs.composite_score
                latest_level = latest_rs.risk_level

            if latest_level in risk_counts:
                risk_counts[latest_level] += 1

            if latest_level == "CRITICAL":
                critical_zones += 1
                population_at_risk += h.population
            elif latest_level == "HIGH":
                high_risk_areas += 1
                population_at_risk += h.population

            # Primary Hazard
            primary_hazard = "Unknown"
            if h.hazard_assessments:
                latest_ha = sorted(h.hazard_assessments, key=lambda x: x.assessed_at)[-1]
                primary_hazard = latest_ha.primary_hazard

            # Demographics
            if h.population_profile:
                pp = h.population_profile
                total_pop += pp.total_population
                children_total += pp.children_count
                elderly_total += pp.elderly_count
                women_total += pp.women_count
                special_total += pp.special_vulnerabilities_count
            else:
                total_pop += h.population

            high_risk_list.append(
                HighRiskHabitationSummary(
                    id=h.id,
                    habitation=h.name,
                    code=h.code,
                    district=h.district,
                    state=h.state,
                    risk_level=latest_level,
                    risk_score=latest_score,
                    population=h.population,
                    status=h.status,
                    primary_hazard=primary_hazard,
                )
            )

        # Sort highest risk habitations by score desc
        high_risk_list.sort(key=lambda x: x.risk_score, reverse=True)

        # Immediate relocation count
        immediate_relocation_cases = (
            db.query(RelocationRecommendation)
            .filter(RelocationRecommendation.priority_level == "IMMEDIATE")
            .count()
        )

        # Risk Distribution items
        risk_distribution = []
        for level, count in risk_counts.items():
            pct = round((count / total_habitations * 100), 1) if total_habitations > 0 else 0.0
            risk_distribution.append(
                RiskDistributionItem(
                    risk_level=level,
                    count=count,
                    percentage=pct,
                    color=risk_colors[level],
                )
            )

        # Recent alerts
        raw_alerts = (
            db.query(Alert)
            .options(joinedload(Alert.habitation))
            .filter(Alert.is_active == True)
            .order_by(Alert.issued_at.desc())
            .limit(5)
            .all()
        )
        recent_alerts = [
            RecentAlertSummary(
                id=a.id,
                title=a.title,
                message=a.message,
                severity=a.severity,
                alert_type=a.alert_type,
                habitation_name=a.habitation.name if a.habitation else "General Regional",
                issued_at=a.issued_at,
            )
            for a in raw_alerts
        ]

        # Open complaints count
        open_complaints = (
            db.query(Complaint)
            .filter(Complaint.status.in_(["Submitted", "Under Review", "In Progress"]))
            .count()
        )

        return DashboardSummaryResponse(
            kpis=DashboardKpis(
                total_habitations=total_habitations,
                critical_zones=critical_zones,
                high_risk_areas=high_risk_areas,
                population_at_risk=population_at_risk,
                immediate_relocation_cases=immediate_relocation_cases,
                open_complaints=open_complaints,
            ),
            risk_distribution=risk_distribution,
            population_vulnerability=PopulationVulnerabilitySummary(
                total_population_assessed=total_pop,
                children_total=children_total,
                elderly_total=elderly_total,
                women_total=women_total,
                special_vulnerabilities_total=special_total,
            ),
            highest_risk_habitations=high_risk_list,
            recent_alerts=recent_alerts,
        )
