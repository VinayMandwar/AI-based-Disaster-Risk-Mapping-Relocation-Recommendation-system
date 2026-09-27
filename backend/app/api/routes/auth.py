import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import User, Habitation, Role
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    UserProfileResponse,
    AuthTokenResponse,
)

router = APIRouter(prefix="/auth")


@router.post("/login", response_model=AuthTokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user or administrator.
    Accepts credentials or demo accounts.
    """
    email_or_user = payload.email_or_username.strip().lower()
    role_req = (payload.role_requested or "ADMIN").upper()

    # Look up user in DB
    user = db.query(User).filter(User.email.ilike(email_or_user)).first()

    # If demo access or test user not yet in DB, create/return standard session
    if not user:
        # Check if demo login requested
        if "admin" in email_or_user or role_req == "ADMIN":
            full_name = "Disaster Management Administrator"
            role_name = "ADMIN"
            habitation_id = None
        else:
            # Default citizen user
            first_hab = db.query(Habitation).first()
            full_name = "Ramesh Kumar (Citizen)"
            role_name = "CITIZEN"
            habitation_id = first_hab.id if first_hab else None

        user = User(
            id=str(uuid.uuid4()),
            email=email_or_user if "@" in email_or_user else f"{email_or_user}@aashray.local",
            hashed_password="demo_hashed_token",
            full_name=full_name,
            role_name=role_name,
            habitation_id=habitation_id,
            is_active=True,
        )
        try:
            db.add(user)
            db.commit()
            db.refresh(user)
        except Exception:
            db.rollback()

    # Resolve linked habitation details if citizen
    hab_name, village, district, state = None, None, None, None
    if user.habitation_id:
        hab = db.query(Habitation).filter(Habitation.id == user.habitation_id).first()
        if hab:
            hab_name = hab.name
            village = hab.village
            district = hab.district
            state = hab.state

    user_profile = UserProfileResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        mobile=user.mobile,
        role_name="ADMIN" if "ADMIN" in user.role_name.upper() else "USER",
        habitation_id=user.habitation_id,
        habitation_name=hab_name,
        village=village,
        district=district,
        state=state,
        is_active=user.is_active,
    )

    return AuthTokenResponse(
        access_token=f"aashray_token_{user.id}",
        token_type="bearer",
        user=user_profile,
    )


@router.post("/demo-login", response_model=AuthTokenResponse)
def demo_login(
    role: str = Query("ADMIN", description="ADMIN or USER"),
    habitation_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Fast demo login for evaluation purposes.
    """
    role_upper = role.upper()
    if role_upper == "ADMIN":
        user = db.query(User).filter(User.role_name.ilike("%ADMIN%")).first()
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                email="admin@aashray.gov.in",
                hashed_password="demo_secure_pass",
                full_name="Dr. S. K. Raman (Disaster Operations Chief)",
                role_name="ADMIN",
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        user_profile = UserProfileResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            mobile=user.mobile,
            role_name="ADMIN",
            habitation_id=None,
            habitation_name=None,
            village=None,
            district=None,
            state=None,
            is_active=True,
        )
    else:
        # Default citizen habitation (e.g. Nandi Gram Tola or first critical habitation)
        target_hab = None
        if habitation_id:
            target_hab = db.query(Habitation).filter(Habitation.id == habitation_id).first()
        if not target_hab:
            target_hab = db.query(Habitation).first()

        user_profile = UserProfileResponse(
            id="demo-user-citizen-01",
            email="citizen.rampur@aashray.local",
            full_name="Ramesh Kumar (Resident)",
            mobile="+91 98765 43210",
            role_name="USER",
            habitation_id=target_hab.id if target_hab else "HAB-UK-CHM-01",
            habitation_name=target_hab.name if target_hab else "Nandi Gram Tola",
            village=target_hab.village if target_hab else "Nandikot",
            district=target_hab.district if target_hab else "Chamoli",
            state=target_hab.state if target_hab else "Uttarakhand",
            is_active=True,
        )

    return AuthTokenResponse(
        access_token=f"aashray_demo_token_{user_profile.role_name.lower()}",
        token_type="bearer",
        user=user_profile,
    )


@router.post("/register", response_model=AuthTokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a citizen user with their location/habitation.
    """
    existing = db.query(User).filter(User.email.ilike(payload.email.strip())).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account with this email already exists.")

    new_user = User(
        id=str(uuid.uuid4()),
        email=payload.email.strip().lower(),
        hashed_password="demo_hashed_password",
        full_name=payload.name.strip(),
        mobile=payload.mobile.strip() if payload.mobile else None,
        habitation_id=payload.habitation_id,
        role_name="CITIZEN",
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    hab_name, village, district, state = None, None, None, None
    if new_user.habitation_id:
        hab = db.query(Habitation).filter(Habitation.id == new_user.habitation_id).first()
        if hab:
            hab_name = hab.name
            village = hab.village
            district = hab.district
            state = hab.state

    user_profile = UserProfileResponse(
        id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        mobile=new_user.mobile,
        role_name="USER",
        habitation_id=new_user.habitation_id,
        habitation_name=hab_name,
        village=village,
        district=district,
        state=state,
        is_active=True,
    )

    return AuthTokenResponse(
        access_token=f"aashray_token_{new_user.id}",
        token_type="bearer",
        user=user_profile,
    )
