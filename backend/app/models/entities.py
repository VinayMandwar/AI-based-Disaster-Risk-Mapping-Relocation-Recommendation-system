import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    String, Integer, Float, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum, Index
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    users: Mapped[List["User"]] = relationship("User", back_populates="role_rel")


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    mobile: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    habitation_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("habitations.id", ondelete="SET NULL"), nullable=True)
    role_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("roles.id"), nullable=True)
    role_name: Mapped[str] = mapped_column(String(50), default="VIEWER")  # ADMIN, CITIZEN, ANALYST, VIEWER
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    role_rel: Mapped[Optional["Role"]] = relationship("Role", back_populates="users")
    habitation_rel: Mapped[Optional["Habitation"]] = relationship("Habitation")
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="user_rel")
    complaints: Mapped[List["Complaint"]] = relationship("Complaint", back_populates="user_rel")


class Habitation(Base):
    __tablename__ = "habitations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    village: Mapped[str] = mapped_column(String(255), nullable=False)
    district: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    population: Mapped[int] = mapped_column(Integer, default=0)
    housing_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE")  # ACTIVE, MONITORED, RELOCATING
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    population_profile: Mapped[Optional["PopulationProfile"]] = relationship("PopulationProfile", back_populates="habitation", uselist=False, cascade="all, delete-orphan")
    infrastructure_profile: Mapped[Optional["InfrastructureProfile"]] = relationship("InfrastructureProfile", back_populates="habitation", uselist=False, cascade="all, delete-orphan")
    hazard_assessments: Mapped[List["HazardAssessment"]] = relationship("HazardAssessment", back_populates="habitation", cascade="all, delete-orphan")
    risk_scores: Mapped[List["RiskScore"]] = relationship("RiskScore", back_populates="habitation", cascade="all, delete-orphan")
    capacity_assessments: Mapped[List["CapacityAssessment"]] = relationship("CapacityAssessment", back_populates="habitation", cascade="all, delete-orphan")
    relocation_recommendations: Mapped[List["RelocationRecommendation"]] = relationship("RelocationRecommendation", back_populates="habitation")
    alerts: Mapped[List["Alert"]] = relationship("Alert", back_populates="habitation")


class PopulationProfile(Base):
    __tablename__ = "population_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    habitation_id: Mapped[str] = mapped_column(String(36), ForeignKey("habitations.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    total_population: Mapped[int] = mapped_column(Integer, default=0)
    children_count: Mapped[int] = mapped_column(Integer, default=0)
    elderly_count: Mapped[int] = mapped_column(Integer, default=0)
    women_count: Mapped[int] = mapped_column(Integer, default=0)
    special_vulnerabilities_count: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    habitation: Mapped["Habitation"] = relationship("Habitation", back_populates="population_profile")


class InfrastructureProfile(Base):
    __tablename__ = "infrastructure_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    habitation_id: Mapped[str] = mapped_column(String(36), ForeignKey("habitations.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    road_accessibility: Mapped[int] = mapped_column(Integer, default=3)  # 1 (Critical) to 5 (Excellent)
    water_availability: Mapped[int] = mapped_column(Integer, default=3)
    sanitation: Mapped[int] = mapped_column(Integer, default=3)
    electricity: Mapped[int] = mapped_column(Integer, default=3)
    healthcare_access: Mapped[int] = mapped_column(Integer, default=3)
    shelter_availability: Mapped[int] = mapped_column(Integer, default=3)
    housing_condition: Mapped[int] = mapped_column(Integer, default=3)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    habitation: Mapped["Habitation"] = relationship("Habitation", back_populates="infrastructure_profile")


class HazardAssessment(Base):
    __tablename__ = "hazard_assessments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    habitation_id: Mapped[str] = mapped_column(String(36), ForeignKey("habitations.id", ondelete="CASCADE"), nullable=False, index=True)
    flood_risk: Mapped[float] = mapped_column(Float, default=0.0)
    landslide_risk: Mapped[float] = mapped_column(Float, default=0.0)
    erosion_risk: Mapped[float] = mapped_column(Float, default=0.0)
    earthquake_risk: Mapped[float] = mapped_column(Float, default=0.0)
    fire_risk: Mapped[float] = mapped_column(Float, default=0.0)
    heatwave_risk: Mapped[float] = mapped_column(Float, default=0.0)
    cyclone_risk: Mapped[float] = mapped_column(Float, default=0.0)
    primary_hazard: Mapped[str] = mapped_column(String(100), default="None")
    assessed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    habitation: Mapped["Habitation"] = relationship("Habitation", back_populates="hazard_assessments")


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    habitation_id: Mapped[str] = mapped_column(String(36), ForeignKey("habitations.id", ondelete="CASCADE"), nullable=False, index=True)
    composite_score: Mapped[float] = mapped_column(Float, default=0.0)  # 0.0 to 100.0
    risk_level: Mapped[str] = mapped_column(String(32), default="SAFE_LOW", index=True)  # SAFE_LOW, MODERATE, HIGH, CRITICAL
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    habitation: Mapped["Habitation"] = relationship("Habitation", back_populates="risk_scores")


class CapacityAssessment(Base):
    __tablename__ = "capacity_assessments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    habitation_id: Mapped[str] = mapped_column(String(36), ForeignKey("habitations.id", ondelete="CASCADE"), nullable=False, index=True)
    carrying_capacity_people: Mapped[int] = mapped_column(Integer, default=0)
    current_load: Mapped[int] = mapped_column(Integer, default=0)
    capacity_stress_ratio: Mapped[float] = mapped_column(Float, default=1.0)  # load / capacity
    status: Mapped[str] = mapped_column(String(32), default="NORMAL")  # NORMAL, STRESSED, OVER_CAPACITY
    assessed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    habitation: Mapped["Habitation"] = relationship("Habitation", back_populates="capacity_assessments")


class SafeZone(Base):
    __tablename__ = "safe_zones"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    district: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    max_capacity: Mapped[int] = mapped_column(Integer, default=500)
    current_occupancy: Mapped[int] = mapped_column(Integer, default=0)
    elevation_meters: Mapped[float] = mapped_column(Float, default=0.0)
    safety_score: Mapped[int] = mapped_column(Integer, default=90)
    road_access_score: Mapped[int] = mapped_column(Integer, default=85)
    healthcare_score: Mapped[int] = mapped_column(Integer, default=80)
    distance_km: Mapped[float] = mapped_column(Float, default=5.0)
    status: Mapped[str] = mapped_column(String(32), default="ACTIVE")  # ACTIVE, STANDBY, FULL
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recommendations: Mapped[List["RelocationRecommendation"]] = relationship("RelocationRecommendation", back_populates="safe_zone")


class EmergencyFacility(Base):
    __tablename__ = "emergency_facilities"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    facility_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)  # HOSPITAL, SHELTER, RELIEF_CAMP, FIRE_STATION
    district: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=100)
    contact_info: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="ACTIVE")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class RelocationRecommendation(Base):
    __tablename__ = "relocation_recommendations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    habitation_id: Mapped[str] = mapped_column(String(36), ForeignKey("habitations.id"), nullable=False, index=True)
    safe_zone_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("safe_zones.id"), nullable=True, index=True)
    priority_level: Mapped[str] = mapped_column(String(32), default="MEDIUM", index=True)  # IMMEDIATE, HIGH, MEDIUM, LOW
    people_to_relocate: Mapped[int] = mapped_column(Integer, default=0)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="PROPOSED")  # PROPOSED, APPROVED, IN_PROGRESS, COMPLETED
    recommended_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    habitation: Mapped["Habitation"] = relationship("Habitation", back_populates="relocation_recommendations")
    safe_zone: Mapped[Optional["SafeZone"]] = relationship("SafeZone", back_populates="recommendations")


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(32), default="MEDIUM", index=True)  # LOW, MEDIUM, HIGH, CRITICAL
    alert_type: Mapped[str] = mapped_column(String(64), nullable=False)  # LANDSLIDE_WARNING, FLOOD_ALERT, etc.
    habitation_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("habitations.id"), nullable=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    issued_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    habitation: Mapped[Optional["Habitation"]] = relationship("Habitation", back_populates="alerts")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(128), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False)
    entity_id: Mapped[str] = mapped_column(String(64), nullable=False)
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    user_rel: Mapped[Optional["User"]] = relationship("User", back_populates="audit_logs")


class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    complaint_code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    habitation_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("habitations.id", ondelete="SET NULL"), nullable=True, index=True)
    issue_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)  # Flooding, Landslide, Erosion, Unsafe House, Blocked Road, Damaged Infrastructure, Other
    location_text: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    photo_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    contact_name: Mapped[str] = mapped_column(String(128), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Submitted", index=True)  # Submitted, Under Review, In Progress, Resolved, Rejected
    assigned_to: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user_rel: Mapped[Optional["User"]] = relationship("User", back_populates="complaints")
    habitation_rel: Mapped[Optional["Habitation"]] = relationship("Habitation")
