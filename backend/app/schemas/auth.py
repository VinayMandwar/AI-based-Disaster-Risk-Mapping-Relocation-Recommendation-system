from typing import Optional
from pydantic import BaseModel, EmailStr
from app.schemas.common import DEMO_DATA_DISCLAIMER


class LoginRequest(BaseModel):
    email_or_username: str
    password: str
    role_requested: Optional[str] = "ADMIN"  # ADMIN or USER


class RegisterRequest(BaseModel):
    name: str
    email: str
    mobile: Optional[str] = None
    password: str
    habitation_id: Optional[str] = None
    location_text: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    mobile: Optional[str] = None
    role_name: str
    habitation_id: Optional[str] = None
    habitation_name: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    is_active: bool
    disclaimer: str = DEMO_DATA_DISCLAIMER


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse
    disclaimer: str = DEMO_DATA_DISCLAIMER
