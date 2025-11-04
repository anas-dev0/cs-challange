from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RefreshRequest(BaseModel):
    refreshToken: str = Field(..., alias="refreshToken")

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

class TokenResponse(BaseModel):
    token: str
    refreshToken: str
    user: UserOut

class MeResponse(BaseModel):
    user: UserOut

class Message(BaseModel):
    message: str
