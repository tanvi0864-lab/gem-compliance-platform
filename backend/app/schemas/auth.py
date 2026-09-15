from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole
    full_name: Optional[str] = None
    organisation: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: Optional[str] = None
    email: str


class UserProfile(BaseModel):
    id: str
    email: str
    role: str
    full_name: Optional[str] = None
    organisation: Optional[str] = None
    phone: Optional[str] = None
    pan: Optional[str] = None
    gstin: Optional[str] = None
    udyam_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    company_type: Optional[str] = None
    turnover_cr: Optional[str] = None
    is_active: bool
    is_banned: bool

    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    organisation: Optional[str] = None
    phone: Optional[str] = None
    pan: Optional[str] = None
    gstin: Optional[str] = None
    udyam_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    company_type: Optional[str] = None
    turnover_cr: Optional[str] = None
