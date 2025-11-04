from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    jwt_secret: str = Field(..., alias="JWT_SECRET")
    refresh_secret: str = Field(..., alias="REFRESH_SECRET")
    # Optional session secret for server-side sessions (used by OAuth)
    session_secret: str = Field("", alias="SESSION_SECRET")
    access_expires_hours: int = Field(2, alias="ACCESS_EXPIRES_HOURS")
    refresh_expires_days: int = Field(7, alias="REFRESH_EXPIRES_DAYS")
    database_url: str = Field(..., alias="DATABASE_URL")
    cors_origins: str = Field("http://localhost:5173,http://localhost:5174", alias="CORS_ORIGINS")
    
    # OAuth credentials
    google_client_id: str = Field("", alias="GOOGLE_CLIENT_ID")
    google_client_secret: str = Field("", alias="GOOGLE_CLIENT_SECRET")
    google_redirect_uri: str = Field("http://localhost:8000/api/auth/oauth/google/callback", alias="GOOGLE_REDIRECT_URI")
    
    github_client_id: str = Field("", alias="GITHUB_CLIENT_ID")
    github_client_secret: str = Field("", alias="GITHUB_CLIENT_SECRET")
    github_redirect_uri: str = Field("http://localhost:8000/api/auth/oauth/github/callback", alias="GITHUB_REDIRECT_URI")
    
    frontend_url: str = Field("http://localhost:5173", alias="FRONTEND_URL")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()