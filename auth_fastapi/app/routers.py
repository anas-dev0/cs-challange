from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .db import get_db
from .models import User
from .schemas import RegisterRequest, LoginRequest, TokenResponse, UserOut, MeResponse, Message, RefreshRequest
from .security import is_strong_password, hash_password, verify_password, create_access_token, create_refresh_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse, responses={400: {"model": Message}})
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Validate password
    if not is_strong_password(payload.password):
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters and include lowercase (a-z), uppercase (A-Z), a number (0-9), and a symbol.")
    # Check email
    res = await db.execute(select(User).where(User.email == payload.email))
    if res.scalar_one_or_none() is not None:
        raise HTTPException(status_code=400, detail="Email already registered")
    # Create user
    user = User(name=payload.name, email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    access = create_access_token({"id": user.id, "email": user.email})
    refresh = create_refresh_token({"id": user.id, "email": user.email, "tv": user.token_version})
    return TokenResponse(token=access, refreshToken=refresh, user=UserOut(id=user.id, name=user.name, email=user.email))

@router.post("/login", response_model=TokenResponse, responses={400: {"model": Message}})
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == payload.email))
    user = res.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access = create_access_token({"id": user.id, "email": user.email})
    refresh = create_refresh_token({"id": user.id, "email": user.email, "tv": user.token_version})
    return TokenResponse(token=access, refreshToken=refresh, user=UserOut(id=user.id, name=user.name, email=user.email))

@router.get("/me", response_model=MeResponse, responses={401: {"model": Message}})
async def me(user: User = Depends(get_current_user)):
    return MeResponse(user=UserOut(id=user.id, name=user.name, email=user.email))

@router.post("/refresh", response_model=TokenResponse, responses={401: {"model": Message}})
async def refresh(payload: RefreshRequest, db: AsyncSession = Depends(get_db)):
    from jose import jwt, JWTError
    from .config import settings
    try:
        data = jwt.decode(payload.refreshToken, settings.refresh_secret, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    uid = data.get("id"); tv = data.get("tv")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    res = await db.execute(select(User).where(User.id == uid))
    user = res.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    if tv is None or tv != user.token_version:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    access = create_access_token({"id": user.id, "email": user.email})
    # rotate refresh token by reissuing
    refresh = create_refresh_token({"id": user.id, "email": user.email, "tv": user.token_version})
    return TokenResponse(token=access, refreshToken=refresh, user=UserOut(id=user.id, name=user.name, email=user.email))
