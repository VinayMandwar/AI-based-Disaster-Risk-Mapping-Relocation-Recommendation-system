"""initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-15 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. roles
    op.create_table(
        'roles',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_roles_name', 'roles', ['name'], unique=True)

    # 2. users
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('role_id', sa.Integer(), nullable=True),
        sa.Column('role_name', sa.String(length=50), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # 3. habitations
    op.create_table(
        'habitations',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('code', sa.String(length=64), nullable=False),
        sa.Column('village', sa.String(length=255), nullable=False),
        sa.Column('district', sa.String(length=255), nullable=False),
        sa.Column('state', sa.String(length=255), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('population', sa.Integer(), nullable=False),
        sa.Column('housing_count', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_habitations_code', 'habitations', ['code'], unique=True)
    op.create_index('ix_habitations_name', 'habitations', ['name'], unique=False)
    op.create_index('ix_habitations_district', 'habitations', ['district'], unique=False)
    op.create_index('ix_habitations_state', 'habitations', ['state'], unique=False)

    # 4. population_profiles
    op.create_table(
        'population_profiles',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('habitation_id', sa.String(length=36), nullable=False),
        sa.Column('total_population', sa.Integer(), nullable=False),
        sa.Column('children_count', sa.Integer(), nullable=False),
        sa.Column('elderly_count', sa.Integer(), nullable=False),
        sa.Column('women_count', sa.Integer(), nullable=False),
        sa.Column('special_vulnerabilities_count', sa.Integer(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['habitation_id'], ['habitations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_population_profiles_habitation_id', 'population_profiles', ['habitation_id'], unique=True)

    # 5. infrastructure_profiles
    op.create_table(
        'infrastructure_profiles',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('habitation_id', sa.String(length=36), nullable=False),
        sa.Column('road_accessibility', sa.Integer(), nullable=False),
        sa.Column('water_availability', sa.Integer(), nullable=False),
        sa.Column('sanitation', sa.Integer(), nullable=False),
        sa.Column('electricity', sa.Integer(), nullable=False),
        sa.Column('healthcare_access', sa.Integer(), nullable=False),
        sa.Column('shelter_availability', sa.Integer(), nullable=False),
        sa.Column('housing_condition', sa.Integer(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['habitation_id'], ['habitations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_infrastructure_profiles_habitation_id', 'infrastructure_profiles', ['habitation_id'], unique=True)

    # 6. hazard_assessments
    op.create_table(
        'hazard_assessments',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('habitation_id', sa.String(length=36), nullable=False),
        sa.Column('flood_risk', sa.Float(), nullable=False),
        sa.Column('landslide_risk', sa.Float(), nullable=False),
        sa.Column('earthquake_risk', sa.Float(), nullable=False),
        sa.Column('fire_risk', sa.Float(), nullable=False),
        sa.Column('heatwave_risk', sa.Float(), nullable=False),
        sa.Column('cyclone_risk', sa.Float(), nullable=False),
        sa.Column('primary_hazard', sa.String(length=100), nullable=False),
        sa.Column('assessed_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['habitation_id'], ['habitations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_hazard_assessments_habitation_id', 'hazard_assessments', ['habitation_id'], unique=False)

    # 7. risk_scores
    op.create_table(
        'risk_scores',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('habitation_id', sa.String(length=36), nullable=False),
        sa.Column('composite_score', sa.Float(), nullable=False),
        sa.Column('risk_level', sa.String(length=32), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('calculated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['habitation_id'], ['habitations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_risk_scores_habitation_id', 'risk_scores', ['habitation_id'], unique=False)
    op.create_index('ix_risk_scores_risk_level', 'risk_scores', ['risk_level'], unique=False)

    # 8. capacity_assessments
    op.create_table(
        'capacity_assessments',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('habitation_id', sa.String(length=36), nullable=False),
        sa.Column('carrying_capacity_people', sa.Integer(), nullable=False),
        sa.Column('current_load', sa.Integer(), nullable=False),
        sa.Column('capacity_stress_ratio', sa.Float(), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=False),
        sa.Column('assessed_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['habitation_id'], ['habitations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_capacity_assessments_habitation_id', 'capacity_assessments', ['habitation_id'], unique=False)

    # 9. safe_zones
    op.create_table(
        'safe_zones',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('code', sa.String(length=64), nullable=False),
        sa.Column('district', sa.String(length=255), nullable=False),
        sa.Column('state', sa.String(length=255), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('max_capacity', sa.Integer(), nullable=False),
        sa.Column('current_occupancy', sa.Integer(), nullable=False),
        sa.Column('elevation_meters', sa.Float(), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_safe_zones_code', 'safe_zones', ['code'], unique=True)
    op.create_index('ix_safe_zones_name', 'safe_zones', ['name'], unique=False)
    op.create_index('ix_safe_zones_district', 'safe_zones', ['district'], unique=False)

    # 10. emergency_facilities
    op.create_table(
        'emergency_facilities',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('facility_type', sa.String(length=64), nullable=False),
        sa.Column('district', sa.String(length=255), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('capacity', sa.Integer(), nullable=False),
        sa.Column('contact_info', sa.String(length=255), nullable=True),
        sa.Column('status', sa.String(length=32), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_emergency_facilities_facility_type', 'emergency_facilities', ['facility_type'], unique=False)
    op.create_index('ix_emergency_facilities_district', 'emergency_facilities', ['district'], unique=False)

    # 11. relocation_recommendations
    op.create_table(
        'relocation_recommendations',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('habitation_id', sa.String(length=36), nullable=False),
        sa.Column('safe_zone_id', sa.String(length=36), nullable=True),
        sa.Column('priority_level', sa.String(length=32), nullable=False),
        sa.Column('people_to_relocate', sa.Integer(), nullable=False),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=False),
        sa.Column('recommended_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['habitation_id'], ['habitations.id']),
        sa.ForeignKeyConstraint(['safe_zone_id'], ['safe_zones.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_relocation_recommendations_habitation_id', 'relocation_recommendations', ['habitation_id'], unique=False)
    op.create_index('ix_relocation_recommendations_priority_level', 'relocation_recommendations', ['priority_level'], unique=False)

    # 12. alerts
    op.create_table(
        'alerts',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('severity', sa.String(length=32), nullable=False),
        sa.Column('alert_type', sa.String(length=64), nullable=False),
        sa.Column('habitation_id', sa.String(length=36), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('issued_at', sa.DateTime(), nullable=False),
        sa.Column('resolved_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['habitation_id'], ['habitations.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_alerts_severity', 'alerts', ['severity'], unique=False)
    op.create_index('ix_alerts_is_active', 'alerts', ['is_active'], unique=False)

    # 13. audit_logs
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=True),
        sa.Column('action', sa.String(length=128), nullable=False),
        sa.Column('entity_type', sa.String(length=64), nullable=False),
        sa.Column('entity_id', sa.String(length=64), nullable=False),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_audit_logs_timestamp', 'audit_logs', ['timestamp'], unique=False)


def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('alerts')
    op.drop_table('relocation_recommendations')
    op.drop_table('emergency_facilities')
    op.drop_table('safe_zones')
    op.drop_table('capacity_assessments')
    op.drop_table('risk_scores')
    op.drop_table('hazard_assessments')
    op.drop_table('infrastructure_profiles')
    op.drop_table('population_profiles')
    op.drop_table('habitations')
    op.drop_table('users')
    op.drop_table('roles')
