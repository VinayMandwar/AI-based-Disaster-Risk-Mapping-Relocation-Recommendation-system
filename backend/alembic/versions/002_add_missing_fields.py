"""add_missing_fields

Revision ID: 002_add_missing_fields
Revises: 001_initial_schema
Create Date: 2026-09-27 18:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '002_add_missing_fields'
down_revision: Union[str, None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    # 1. Update users table with mobile, habitation_id, and foreign key
    if 'users' in existing_tables:
        existing_user_cols = {c['name'] for c in inspector.get_columns('users')}
        if 'mobile' not in existing_user_cols:
            op.add_column('users', sa.Column('mobile', sa.String(length=32), nullable=True))
        if 'habitation_id' not in existing_user_cols:
            op.add_column('users', sa.Column('habitation_id', sa.String(length=36), nullable=True))
        
        # Add foreign key if not present
        existing_fks = {fk.get('name') for fk in inspector.get_foreign_keys('users')}
        if 'fk_users_habitation_id' not in existing_fks:
            try:
                op.create_foreign_key(
                    'fk_users_habitation_id',
                    'users',
                    'habitations',
                    ['habitation_id'],
                    ['id'],
                    ondelete='SET NULL'
                )
            except Exception:
                pass

    # 2. Update hazard_assessments with erosion_risk
    if 'hazard_assessments' in existing_tables:
        existing_ha_cols = {c['name'] for c in inspector.get_columns('hazard_assessments')}
        if 'erosion_risk' not in existing_ha_cols:
            op.add_column(
                'hazard_assessments',
                sa.Column('erosion_risk', sa.Float(), nullable=False, server_default='0.0')
            )

    # 3. Update safe_zones with scoring and distance columns
    if 'safe_zones' in existing_tables:
        existing_sz_cols = {c['name'] for c in inspector.get_columns('safe_zones')}
        if 'safety_score' not in existing_sz_cols:
            op.add_column(
                'safe_zones',
                sa.Column('safety_score', sa.Integer(), nullable=False, server_default='90')
            )
        if 'road_access_score' not in existing_sz_cols:
            op.add_column(
                'safe_zones',
                sa.Column('road_access_score', sa.Integer(), nullable=False, server_default='85')
            )
        if 'healthcare_score' not in existing_sz_cols:
            op.add_column(
                'safe_zones',
                sa.Column('healthcare_score', sa.Integer(), nullable=False, server_default='80')
            )
        if 'distance_km' not in existing_sz_cols:
            op.add_column(
                'safe_zones',
                sa.Column('distance_km', sa.Float(), nullable=False, server_default='5.0')
            )

    # 4. Create complaints table if missing
    if 'complaints' not in existing_tables:
        op.create_table(
            'complaints',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('complaint_code', sa.String(length=64), nullable=False),
            sa.Column('user_id', sa.String(length=36), nullable=True),
            sa.Column('habitation_id', sa.String(length=36), nullable=True),
            sa.Column('issue_type', sa.String(length=64), nullable=False),
            sa.Column('location_text', sa.String(length=255), nullable=False),
            sa.Column('description', sa.Text(), nullable=False),
            sa.Column('photo_url', sa.String(length=512), nullable=True),
            sa.Column('contact_name', sa.String(length=128), nullable=False),
            sa.Column('contact_phone', sa.String(length=32), nullable=False),
            sa.Column('status', sa.String(length=32), nullable=False, server_default='Submitted'),
            sa.Column('assigned_to', sa.String(length=128), nullable=True),
            sa.Column('admin_notes', sa.Text(), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('updated_at', sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(['habitation_id'], ['habitations.id'], ondelete='SET NULL'),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index('ix_complaints_complaint_code', 'complaints', ['complaint_code'], unique=True)
        op.create_index('ix_complaints_user_id', 'complaints', ['user_id'], unique=False)
        op.create_index('ix_complaints_habitation_id', 'complaints', ['habitation_id'], unique=False)
        op.create_index('ix_complaints_issue_type', 'complaints', ['issue_type'], unique=False)
        op.create_index('ix_complaints_status', 'complaints', ['status'], unique=False)
        op.create_index('ix_complaints_created_at', 'complaints', ['created_at'], unique=False)

    # 5. Missing indexes on existing tables
    if 'alerts' in existing_tables:
        existing_alerts_idx = {idx['name'] for idx in inspector.get_indexes('alerts')}
        if 'ix_alerts_habitation_id' not in existing_alerts_idx:
            op.create_index('ix_alerts_habitation_id', 'alerts', ['habitation_id'], unique=False)

    if 'emergency_facilities' in existing_tables:
        existing_ef_idx = {idx['name'] for idx in inspector.get_indexes('emergency_facilities')}
        if 'ix_emergency_facilities_name' not in existing_ef_idx:
            op.create_index('ix_emergency_facilities_name', 'emergency_facilities', ['name'], unique=False)

    if 'relocation_recommendations' in existing_tables:
        existing_rr_idx = {idx['name'] for idx in inspector.get_indexes('relocation_recommendations')}
        if 'ix_relocation_recommendations_safe_zone_id' not in existing_rr_idx:
            op.create_index('ix_relocation_recommendations_safe_zone_id', 'relocation_recommendations', ['safe_zone_id'], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if 'complaints' in existing_tables:
        op.drop_table('complaints')

    if 'safe_zones' in existing_tables:
        cols = {c['name'] for c in inspector.get_columns('safe_zones')}
        for col_name in ['distance_km', 'healthcare_score', 'road_access_score', 'safety_score']:
            if col_name in cols:
                op.drop_column('safe_zones', col_name)

    if 'hazard_assessments' in existing_tables:
        cols = {c['name'] for c in inspector.get_columns('hazard_assessments')}
        if 'erosion_risk' in cols:
            op.drop_column('hazard_assessments', 'erosion_risk')

    if 'users' in existing_tables:
        existing_fks = {fk.get('name') for fk in inspector.get_foreign_keys('users')}
        if 'fk_users_habitation_id' in existing_fks:
            op.drop_constraint('fk_users_habitation_id', 'users', type_='foreignkey')
        cols = {c['name'] for c in inspector.get_columns('users')}
        if 'habitation_id' in cols:
            op.drop_column('users', 'habitation_id')
        if 'mobile' in cols:
            op.drop_column('users', 'mobile')
