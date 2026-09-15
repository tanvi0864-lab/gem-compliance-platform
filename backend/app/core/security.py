from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.JWT_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None


def validate_domain_for_role(email: str, role: str) -> tuple[bool, str]:
    """Returns (is_valid, error_message)."""
    from app.config import settings
    privileged_roles = ["ADMIN", "PROCUREMENT_OFFICER"]
    if role not in privileged_roles:
        return True, ""
    domain = email.split("@")[-1].lower() if "@" in email else ""
    allowed = settings.allowed_domains_list
    if domain not in allowed:
        return False, f"Admin and Procurement Officer accounts require an @{allowed[0]} email address."
    return True, ""
