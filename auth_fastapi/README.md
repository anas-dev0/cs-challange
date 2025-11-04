# FastAPI Auth Service

High-performance authentication service built with FastAPI, PostgreSQL, and OAuth 2.0 integration (Google & GitHub). Features JWT-based authentication with access/refresh tokens, async database operations, and comprehensive security.

## 🚀 Features

- **JWT Authentication**: Secure access tokens (2h) and refresh tokens (7d)
- **OAuth 2.0 Integration**: Sign in with Google and GitHub
- **Password Security**: Bcrypt hashing with strength validation
- **Async Database**: SQLAlchemy 2.0 with asyncpg for PostgreSQL
- **Email Validation**: Pydantic v2 email validation
- **CORS Support**: Configurable origins for frontend
- **Session Management**: Stateless sessions with OAuth state verification
- **Health Checks**: Database connectivity monitoring
- **API Documentation**: Auto-generated Swagger UI and ReDoc

## 📋 Prerequisites

- **Python 3.11+**
- **PostgreSQL 15+** (or use Docker)
- **Docker Desktop** (for containerized setup)
- **Google OAuth credentials** (optional, for Google sign-in)
- **GitHub OAuth App** (optional, for GitHub sign-in)

## 🛠️ Installation & Setup

### Option 1: Docker (Recommended)

#### 1. Configure Environment

Create `auth_fastapi/.env` file:

```bash
# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your_super_secure_random_string_here_min_32_chars
REFRESH_SECRET=another_different_secure_random_string_here

# Token Expiration
ACCESS_EXPIRES_HOURS=2
REFRESH_EXPIRES_DAYS=7

# Database (for Docker setup, don't change)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/utopiahire

# CORS Origins (frontend URLs)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# OAuth (Optional - see OAuth Setup section below)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Session Secret (for OAuth state verification)
SESSION_SECRET=another_random_string_for_session_middleware
```

**Security Note**: Generate strong secrets using:
```bash
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or online: https://randomkeygen.com/
```

#### 2. Start Services

```bash
# From project root
docker compose up -d --build

# Check if services are running
docker compose ps

# View logs
docker compose logs -f auth
```

#### 3. Verify Backend

- Health check: http://localhost:8000/health
- API docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**Expected health response**:
```json
{
  "status": "ok",
  "db": "up"
}
```

### Option 2: Local Development (Without Docker)

#### 1. Set Up Database

Install PostgreSQL locally, then create database:

```sql
CREATE DATABASE utopiahire;
```

#### 2. Create Virtual Environment

```bash
cd auth_fastapi

# Create venv
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate (Mac/Linux)
source venv/bin/activate
```

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 4. Configure Environment

Create `auth_fastapi/.env` with your local database URL:

```bash
DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/utopiahire
# ... (other variables same as above)
```

#### 5. Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🔐 OAuth Setup (Optional)

OAuth integration is optional but recommended for better UX. Follow these guides to enable Google and GitHub sign-in.

### Google OAuth Configuration

#### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "UtopiaHire"
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Configure consent screen:
   - **User Type**: External
   - **App name**: UtopiaHire
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Add test users if needed

#### 2. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select **Application type**: Web application
4. Configure:
   - **Name**: UtopiaHire Web Client
   - **Authorized JavaScript origins**: `http://localhost:8000`
   - **Authorized redirect URIs**: `http://localhost:8000/api/auth/oauth/google/callback`
5. Copy **Client ID** and **Client Secret**

#### 3. Add to Environment

Update `auth_fastapi/.env`:

```bash
GOOGLE_CLIENT_ID=1234567890-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-YourClientSecretHere
```

#### 4. Restart Backend

```bash
docker compose restart auth
```

### GitHub OAuth Configuration

#### 1. Create GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers) → **OAuth Apps**
2. Click **New OAuth App**
3. Fill in details:
   - **Application name**: UtopiaHire
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:8000/api/auth/oauth/github/callback`
4. Click **Register application**

#### 2. Generate Client Secret

1. On the OAuth app page, click **Generate a new client secret**
2. Copy both **Client ID** and **Client Secret** immediately

#### 3. Add to Environment

Update `auth_fastapi/.env`:

```bash
GITHUB_CLIENT_ID=Iv1.your_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

#### 4. Restart Backend

```bash
docker compose restart auth
```

### Testing OAuth

1. Ensure backend is running: http://localhost:8000/health
2. Test Google OAuth: http://localhost:8000/api/auth/oauth/google
   - Should redirect to Google account chooser
3. Test GitHub OAuth: http://localhost:8000/api/auth/oauth/github
   - Should redirect to GitHub authorization page

**Note**: Full OAuth flow requires frontend running to handle callback tokens.

## 📝 API Endpoints

### Health & Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with database status |
| GET | `/docs` | Swagger UI documentation |
| GET | `/redoc` | ReDoc documentation |

### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Register new user with email/password |
| POST | `/api/auth/login` | No | Login with email/password |
| GET | `/api/auth/me` | Yes | Get current user info |
| POST | `/api/auth/refresh` | Refresh Token | Refresh access token |

### OAuth

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/oauth/google` | Initiate Google OAuth flow |
| GET | `/api/auth/oauth/google/callback` | Google OAuth callback handler |
| GET | `/api/auth/oauth/github` | Initiate GitHub OAuth flow |
| GET | `/api/auth/oauth/github/callback` | GitHub OAuth callback handler |

### Request/Response Examples

#### Register

**Request**:
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Strong@Pass123"
}
```

**Response** (201 Created):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login

**Request**:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Strong@Pass123"
}
```

**Response** (200 OK): Same as register

#### Get Current User

**Request**:
```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Refresh Token

**Request**:
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

#### OAuth Flow

**Initiate OAuth**:
```bash
# Browser redirects to this URL
GET /api/auth/oauth/google
# or
GET /api/auth/oauth/github

# Optional query params:
# - login_hint=user@example.com (Google only)
# - login=username (GitHub only)
```

**Response**: Redirects to provider (Google/GitHub) authorization page

**After Authorization**: Provider redirects to callback URL, backend processes:
1. Exchanges authorization code for access token
2. Fetches user info from provider API
3. Creates or updates user in database
4. Issues JWT tokens
5. Redirects to frontend with tokens: `http://localhost:5173/?token=...&refreshToken=...`

## 🏗️ Project Structure

```
auth_fastapi/
├── app/
│   ├── main.py              # FastAPI app entry, CORS, routes
│   ├── routers.py           # Auth endpoints (register, login, /me, refresh)
│   ├── oauth.py             # OAuth endpoints (Google, GitHub)
│   ├── security.py          # JWT creation/validation, password hashing
│   ├── models.py            # SQLAlchemy User model
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── db.py                # Database connection, async engine
│   ├── config.py            # Environment settings (Pydantic BaseSettings)
│   └── middleware.py        # Request logging, session middleware
├── Dockerfile               # Docker image for auth service
├── requirements.txt         # Python dependencies
├── .env.example             # Example environment variables
└── README.md                # This file
```

## 🔧 Development

### Database Migrations

Currently using auto-create on startup (`models.Base.metadata.create_all`). For production, consider:

- **Alembic** for migrations
- **SQLAlchemy migrations** with version control

### Adding New Endpoints

1. Define Pydantic schemas in `schemas.py`
2. Add route handler in `routers.py` or create new router file
3. Import and include router in `main.py`
4. Update this README with new endpoint documentation

### Testing Locally

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test register (PowerShell)
$body = '{"name":"Test User","email":"test@example.com","password":"Test@Pass123"}'
Invoke-WebRequest -Uri "http://localhost:8000/api/auth/register" -Method POST -Body $body -ContentType "application/json"

# Test login
$body = '{"email":"test@example.com","password":"Test@Pass123"}'
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = ($response.Content | ConvertFrom-Json).access_token

# Test /me endpoint
Invoke-WebRequest -Uri "http://localhost:8000/api/auth/me" -Headers @{"Authorization"="Bearer $token"}
```

## 🐛 Troubleshooting

### Database Connection Errors

**Problem**: `asyncpg.exceptions.InvalidPasswordError` or connection timeout

**Solutions**:
```bash
# Check if PostgreSQL container is running
docker compose ps

# Check database logs
docker compose logs db

# Verify DATABASE_URL in .env
cat auth_fastapi/.env | Select-String DATABASE_URL

# Restart database
docker compose restart db
```

### OAuth Not Working

**Problem**: "Invalid client" or redirect URI mismatch

**Solutions**:
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set in `.env`
- Check redirect URIs in Google Cloud Console match exactly: `http://localhost:8000/api/auth/oauth/google/callback`
- For GitHub, verify callback URL: `http://localhost:8000/api/auth/oauth/github/callback`
- Restart auth service after changing `.env`: `docker compose restart auth`

### Session Errors

**Problem**: "Session data not found" or OAuth state mismatch

**Solutions**:
- Ensure `SESSION_SECRET` is set in `.env`
- Verify `itsdangerous` package is installed: `pip show itsdangerous`
- Check that `SessionMiddleware` is configured in `main.py`
- Clear browser cookies and try again

### Port Already in Use

**Problem**: Port 8000 is already in use

**Solutions**:
```bash
# Find process using port 8000 (PowerShell)
Get-NetTCPConnection -LocalPort 8000 | Select-Object -ExpandProperty OwningProcess

# Kill process
Stop-Process -Id <process_id> -Force

# Or change port in docker-compose.yml
# ports:
#   - "8001:8000"
```

### Import Errors

**Problem**: `ModuleNotFoundError` or import issues

**Solutions**:
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Or rebuild Docker image
docker compose build --no-cache auth
docker compose up -d auth
```

## 🔒 Security Best Practices

### Development

- Use `.env` file for secrets (never commit)
- Default JWT secrets are fine for local testing

### Production

**CRITICAL CHANGES** before deploying:

1. **Generate Strong Secrets**:
   ```bash
   JWT_SECRET=<min-32-char-random-string>
   REFRESH_SECRET=<different-min-32-char-random-string>
   SESSION_SECRET=<another-random-string>
   ```

2. **Use Environment Variables**: Don't commit `.env` to version control
   - Use platform env vars (AWS Parameter Store, Heroku Config Vars, etc.)

3. **Database Security**:
   - Change PostgreSQL password from `postgres`
   - Use managed database (AWS RDS, DigitalOcean, etc.)
   - Enable SSL connections (`?ssl=require` in DATABASE_URL)

4. **Enable HTTPS**:
   - Use SSL/TLS certificates
   - Update `CORS_ORIGINS` to `https://` URLs
   - Set `secure=True` on cookies if using cookie-based auth

5. **Additional Security**:
   - Enable rate limiting (e.g., with `slowapi`)
   - Add email verification for new users
   - Implement 2FA (optional)
   - Use `httponly` cookies instead of localStorage for tokens (more secure)
   - Regular dependency updates (`pip list --outdated`)

6. **OAuth Production Setup**:
   - Update redirect URIs in Google/GitHub consoles to production URLs
   - Use production domain: `https://api.yourdomain.com/api/auth/oauth/google/callback`
   - Keep OAuth secrets secure

## 🚀 Deployment

### Docker (Recommended)

Deploy as Docker container to:
- **Railway.app** (Docker native)
- **Render.com** (Docker support)
- **Fly.io** (Docker support)
- **AWS ECS/Fargate**
- **DigitalOcean App Platform**

### Steps for Railway

1. Push code to GitHub
2. Connect Railway to repository
3. Railway auto-detects Dockerfile
4. Set environment variables in Railway dashboard:
   - `JWT_SECRET`, `REFRESH_SECRET`, `SESSION_SECRET`
   - `DATABASE_URL` (use Railway PostgreSQL addon)
   - `CORS_ORIGINS` (your frontend domain)
   - OAuth credentials if enabled
5. Deploy!

### Using Managed PostgreSQL

Update `DATABASE_URL` to point to managed database:

```bash
# Example for Railway PostgreSQL
DATABASE_URL=postgresql+asyncpg://user:pass@host.railway.app:5432/railway

# Example for AWS RDS
DATABASE_URL=postgresql+asyncpg://user:pass@mydb.abc123.us-east-1.rds.amazonaws.com:5432/utopiahire
```

## 📦 Dependencies

Key packages (see `requirements.txt` for full list):

- **fastapi** - Web framework
- **uvicorn[standard]** - ASGI server
- **sqlalchemy[asyncio]** - Async ORM
- **asyncpg** - Async PostgreSQL driver
- **python-jose[cryptography]** - JWT handling
- **passlib[bcrypt]** - Password hashing
- **pydantic[email]** - Data validation
- **authlib** - OAuth 2.0 client
- **httpx** - Async HTTP client (for OAuth API calls)
- **itsdangerous** - Session security
- **python-dotenv** - Environment variable loading

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/auth-improvement`
2. Make changes and test thoroughly
3. Update documentation if needed
4. Commit: `git commit -m 'Add auth improvement'`
5. Push: `git push origin feature/auth-improvement`
6. Open Pull Request

## 📚 Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [Authlib Documentation](https://docs.authlib.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [OAuth 2.0 Simplified](https://aaronparecki.com/oauth-2-simplified/)

## 📝 Notes

- Access tokens expire after 2 hours (configurable via `ACCESS_EXPIRES_HOURS`)
- Refresh tokens expire after 7 days (configurable via `REFRESH_EXPIRES_DAYS`)
- Google OAuth always shows account picker (`prompt=select_account`)
- GitHub OAuth doesn't support account picker by design
- Database schema auto-creates on startup (consider migrations for production)
- Frontend handles token storage and automatic refresh
