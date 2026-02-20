# 🎯 UtopiaHire Backend - Modular Architecture

> **Professional, Secure, and Scalable Interview Preparation Platform**

A well-structured backend application following industry best practices with **modular architecture**, **security by design**, and **privacy by design** principles.

## 🌟 Key Features

### 🏗️ **Modular Architecture**
- **Clear Separation of Concerns**: Routes, services, models, and utilities are organized into dedicated modules
- **High Maintainability**: Each module has a single, well-defined responsibility
- **Easy to Extend**: Add new features without affecting existing code
- **Professional Structure**: Follows industry best practices for Python web applications

### 🔒 **Security by Design**
- **Multi-Layer Security**: Defense in depth with security at every layer
- **Input Validation**: Comprehensive validation and sanitization
- **Authentication**: JWT-based authentication with refresh tokens
- **Rate Limiting**: Protect against brute force and DDoS attacks
- **Security Headers**: CSP, HSTS, X-Frame-Options, and more
- **SQL Injection Prevention**: Parameterized queries throughout
- **XSS Protection**: HTML sanitization and output encoding

### 🔐 **Privacy by Design**
- **Data Minimization**: Only collect necessary information
- **Secure Storage**: bcrypt password hashing, secure file handling
- **Access Control**: Role-based access with JWT tokens
- **Audit Logging**: Security events tracked for accountability
- **GDPR Compliance**: User data protection and privacy controls

### 👥 **User-Centric Design**
- **Fast Performance**: Async/await for non-blocking operations
- **Clear Error Messages**: User-friendly error responses
- **Comprehensive API**: RESTful design with OpenAPI documentation
- **Reliable**: Graceful error handling and recovery

## ⚙️ How the Backend Works & Query Handling

> **Note:** This project uses **FastAPI** (Python), not Spring Boot (Java). FastAPI is a modern, async-first Python web framework that shares similar concepts (routing, dependency injection, middleware) with Spring Boot but runs on Python's `asyncio` event loop.

### FastAPI Request Lifecycle

Every HTTP request flows through the following pipeline before reaching a route handler:

```
HTTP Request
    │
    ▼
┌────────────────────────────┐
│  CORS Middleware           │  ← Validates Origin header
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│  Security Middleware       │  ← Rate limiting, security headers,
│  (middleware/security.py)  │    input sanitization, size limits
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│  Logging Middleware        │  ← Logs method, path, status, duration
│  (middleware/logging.py)   │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│  Pydantic Schema           │  ← Validates & coerces request body
│  (schemas/)                │    against declared types
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│  Route Handler             │  ← Business logic (routes/)
│  (routes/*.py)             │
└──────────┬─────────────────┘
           │
           ▼
        Response
```

### Routing

Routes are defined as Python functions decorated with HTTP-method decorators and grouped into `APIRouter` objects. Each router is then mounted on the main `app` in `main.py`:

```python
# app/routes/auth.py
router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    ...
```

```python
# app/main.py
app.include_router(auth_router, tags=["Authentication"])
```

### Dependency Injection

FastAPI uses `Depends()` to inject shared resources into route handlers. The two most commonly used dependencies in this project are:

| Dependency | Source | What it provides |
|---|---|---|
| `db: AsyncSession = Depends(get_db)` | `database/connection.py` | An async SQLAlchemy database session scoped to the request |
| `user: User = Depends(get_current_user)` | `utils/security_utils.py` | The authenticated `User` ORM object, decoded from the JWT Bearer token |

`get_db` is a generator function that yields a session and automatically closes it when the request finishes:

```python
# app/database/connection.py
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session          # session is open during the request
                               # automatically closed when generator exits
```

---

### How Database Queries Are Handled

This project uses **SQLAlchemy 2.0 (async mode)** with an **asyncpg** driver for PostgreSQL.

#### ORM Models

Tables are defined as Python classes that extend `Base` (SQLAlchemy `DeclarativeBase`). Column types and relationships are declared with Python type hints via `Mapped`:

```python
# app/models/user.py
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    interviews: Mapped[List["Interview"]] = relationship(
        "Interview", back_populates="user", cascade="all, delete-orphan"
    )
```

#### Async Query Pattern

All database operations are non-blocking. The standard pattern used throughout the routes is:

```python
# SELECT – find a single row
result = await db.execute(select(User).where(User.email == email))
user = result.scalar_one_or_none()   # None if not found, raises MultipleResultsFound if >1 row

# INSERT – create a new record
new_user = User(name=payload.name, email=payload.email, password_hash=hash_password(payload.password))
db.add(new_user)
await db.commit()
await db.refresh(new_user)   # reload the auto-generated fields (e.g. id, created_at)

# UPDATE – modify an existing record
user.email_verified = True
await db.commit()

# DELETE – remove a record (cascade handled by ORM relationship)
await db.delete(user)
await db.commit()
```

#### SQL Injection Prevention

SQLAlchemy never interpolates values directly into SQL strings. The `select(User).where(User.email == email)` expression compiles to a **parameterized query** (`SELECT … WHERE email = $1`), so user-supplied values are always treated as data, not SQL.

Raw SQL is only used for schema migrations at startup (inside `lifespan` in `main.py`) and always with DDL-safe statements (`ALTER TABLE … ADD COLUMN IF NOT EXISTS`).

#### Connection Pooling & Session Lifecycle

The async engine is created once at startup and reused for the entire application lifetime:

```python
# app/database/connection.py
engine = create_async_engine(settings.database_url, echo=False, future=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
```

- **One session per request** – `get_db` opens a fresh `AsyncSession` for every incoming request via the `async with AsyncSessionLocal()` context manager.
- **`expire_on_commit=False`** – ORM objects remain usable after `commit()` without an extra round-trip to the database (important in async code to avoid lazy-load issues).
- **Connection pool** – asyncpg maintains a pool of reusable TCP connections to PostgreSQL under the hood, managed automatically by SQLAlchemy.

---

## 📁 Project Structure

```
backend/
├── agent/                    # Interview Agent (separate process)
│   ├── agent.py             # LiveKit voice interview agent
│   ├── cv_parser.py         # CV parsing utilities
│   ├── mailer.py            # Email service for reports
│   └── prompts.py           # AI prompt templates
│
├── app/                     # Main Application
│   ├── main.py             # Application entry point
│   │
│   ├── config/             # Configuration
│   │   └── settings.py     # Environment-based settings
│   │
│   ├── database/           # Database Layer
│   │   └── connection.py   # SQLAlchemy engine & sessions
│   │
│   ├── models/             # ORM Models
│   │   └── user.py         # User and Interview models
│   │
│   ├── schemas/            # API Schemas
│   │   └── auth_schemas.py # Pydantic request/response models
│   │
│   ├── routes/             # API Endpoints
│   │   ├── auth.py         # Authentication
│   │   ├── oauth.py        # OAuth (Google, GitHub)
│   │   ├── service.py      # Interview services
│   │   ├── job.py          # Job search
│   │   └── cv_tools.py     # CV analysis & generation
│   │
│   ├── services/           # Business Logic
│   │   └── gemini_service.py # AI analysis
│   │
│   ├── middleware/         # Middleware
│   │   ├── logging.py      # Request logging
│   │   └── security.py     # Security middleware
│   │
│   ├── utils/              # Utilities
│   │   └── security_utils.py # JWT, passwords, validation
│   │
│   └── parsers/            # Document Processing
│       ├── cv_parser.py    # Multi-format CV extraction
│       ├── cv_structure_parser.py # AI-powered parsing
│       └── latex_generator.py # LaTeX CV generation
│
├── api/                    # Skills Gap Analysis
├── core/                   # AI/ML Components
├── data/                   # Static Data
├── cv_uploads/             # Temporary File Storage
│
├── .env.example           # Environment template
├── requirements.txt       # Python dependencies
├── ARCHITECTURE.md        # Detailed architecture docs
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.13+
- PostgreSQL 15+
- LiveKit account (for voice interviews)
- Google Gemini API key (for AI)

### 1. Clone Repository
```bash
git clone https://github.com/anas-dev0/cs-challange.git
cd cs-challange/backend
```

### 2. Install Dependencies
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit with your values
nano .env
```

**Required Environment Variables:**
```bash
# Security (generate with: python -c "import secrets; print(secrets.token_urlsafe(32))")
JWT_SECRET=your-secret-here
REFRESH_SECRET=your-secret-here
SESSION_SECRET=your-secret-here

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/utopiahire

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# LiveKit
LIVEKIT_API_KEY=your-key
LIVEKIT_API_SECRET=your-secret
LIVEKIT_URL=wss://your-project.livekit.cloud

# Google AI
GOOGLE_API_KEY=your-gemini-key

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 4. Start Database
```bash
# From project root
docker-compose up -d
```

### 5. Run Application
```bash
# Main application
python -m app.main

# Access at:
# - API: http://localhost:8000
# - Docs: http://localhost:8000/docs
# - Health: http://localhost:8000/health
```

### 6. Run Interview Agent (separate terminal)
```bash
cd agent
python agent.py dev
```

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register          - Create account
POST   /api/auth/login             - Login
POST   /api/auth/refresh           - Refresh token
POST   /api/auth/verify-email      - Verify email
POST   /api/auth/resend-verification - Resend verification
GET    /api/auth/me                - Get current user
```

### OAuth Endpoints
```
GET    /api/auth/oauth/google      - Google OAuth
GET    /api/auth/oauth/google/callback
GET    /api/auth/oauth/github      - GitHub OAuth
GET    /api/auth/oauth/github/callback
```

### Service Endpoints
```
POST   /api/upload-cv              - Upload CV
POST   /api/start-session          - Start interview
POST   /api/save-interview         - Save results
```

### CV Tools Endpoints
```
POST   /api/analyze-structured     - Analyze CV
POST   /api/apply-suggestion       - Apply suggestion
POST   /api/generate-latex         - Generate LaTeX CV
```

### Job Endpoints
```
POST   /api/search-jobs            - Search jobs
GET    /api/jobs/{id}              - Get job details
```

**Interactive Documentation**: Visit `http://localhost:8000/docs` for complete API reference with try-it-out functionality.

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Access (2h) and refresh (7d) tokens
- **Password Security**: bcrypt hashing with salt
- **Account Protection**: 5 failed attempts → 15min lockout
- **Email Verification**: Required for new accounts
- **OAuth Support**: Google and GitHub integration

### Input Validation
- **Client-side**: Frontend validation
- **API Layer**: Pydantic schema validation
- **Middleware**: HTML sanitization, SQL injection detection
- **Database**: Parameterized queries, type safety

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: ...
```

### Rate Limiting
| Endpoint | Limit |
|----------|-------|
| Registration | 5/min |
| Login | 10/min |
| Email Resend | 3/min |
| File Upload | 10/min |
| General API | 100/min |

### File Upload Security
- **Type Validation**: Extension and MIME type checking
- **Size Limit**: 10MB maximum
- **Filename Sanitization**: Remove dangerous characters
- **Path Traversal Prevention**: Block directory navigation
- **Restricted Permissions**: Owner read/write only

## 🧪 Testing

```bash
# Run all tests
python -m pytest

# With coverage
python -m pytest --cov=app

# Specific module
python -m pytest tests/test_routes/test_auth.py
```

## 📖 Development

### Adding a New Feature

1. **Update models** (if database changes needed)
   ```python
   # app/models/user.py
   ```

2. **Create/update schemas**
   ```python
   # app/schemas/
   ```

3. **Add route handler**
   ```python
   # app/routes/
   ```

4. **Implement business logic**
   ```python
   # app/services/
   ```

5. **Add tests**

6. **Update documentation**

### Code Style
- Follow PEP 8
- Use type hints
- Document with docstrings
- Write descriptive variable names
- Keep functions focused and small

### Security Checklist
Before deploying:
- [ ] Input validation implemented
- [ ] Authentication required (if protected)
- [ ] Authorization checked (if user-specific)
- [ ] Rate limiting configured
- [ ] Error messages don't leak info
- [ ] Logging excludes sensitive data
- [ ] Tests include security scenarios

## 🚢 Deployment

### Production Checklist
- [ ] Strong secrets generated (32+ chars)
- [ ] Database SSL enabled
- [ ] CORS origins configured
- [ ] HTTPS enforced
- [ ] Rate limits reviewed
- [ ] Logging configured
- [ ] Error tracking enabled
- [ ] Backups configured
- [ ] Monitoring setup

### Environment Setup
```bash
# Generate strong secrets
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Update production .env
JWT_SECRET=<generated-secret>
REFRESH_SECRET=<generated-secret>
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db?ssl=require
CORS_ORIGINS=https://yourdomain.com
```

## 📊 Monitoring

### What to Monitor
- **Performance**: Response times, query times, resource usage
- **Security**: Failed logins, rate limit hits, suspicious patterns
- **Errors**: 4xx/5xx responses, exceptions, database errors

### Log Format
```
INFO:     GET /api/auth/me -> 200 (42.3 ms)
WARNING:  Failed login attempt for user@example.com
ERROR:    Database connection timeout
```

## 🔧 Troubleshooting

### Import Errors
```bash
# Check Python path
python -c "import sys; print(sys.path)"

# Verify module structure
python -c "from app.main import app; print('OK')"
```

### Database Connection
```bash
# Test connection
python -c "import asyncio; from app.database.connection import engine; asyncio.run(engine.dispose())"

# Check PostgreSQL
docker-compose ps
docker-compose logs db
```

### Authentication Issues
- Verify JWT_SECRET matches in .env
- Check token hasn't expired
- Confirm user exists in database
- Review middleware logs

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)**: Detailed architecture documentation
- **[SECURITY.md](../SECURITY.md)**: Comprehensive security guide
- **[Main README](../README.md)**: Project overview and setup
- **[API Docs](http://localhost:8000/docs)**: Interactive API documentation



**Built with ❤️ for professional interview preparation**

