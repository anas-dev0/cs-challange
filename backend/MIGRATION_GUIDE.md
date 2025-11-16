# Migration Guide: Old Structure → New Modular Structure

This guide helps you understand the changes from the old backend structure to the new modular architecture.

## Overview of Changes

The backend has been restructured to follow a **modular architecture** with clear separation of concerns. All files have been reorganized into dedicated modules based on their responsibility.

## Import Path Changes

### Configuration
```python
# OLD
from .config import settings

# NEW
from .config.settings import settings
# OR
from .config import settings  # Also works with __init__.py
```

### Database
```python
# OLD
from .db import Base, engine, get_db

# NEW
from .database.connection import Base, engine, get_db
# OR
from .database import Base, engine, get_db
```

### Models
```python
# OLD
from .models import User, Interview

# NEW
from .models.user import User, Interview
# OR
from .models import User, Interview
```

### Schemas
```python
# OLD
from .schemas import RegisterRequest, LoginRequest, ...

# NEW
from .schemas.auth_schemas import RegisterRequest, LoginRequest, ...
# OR
from .schemas import RegisterRequest, LoginRequest, ...
```

### Routes
```python
# OLD
from .auth_routes import router as auth_router
from .oauth_routes import router as oauth_router
from .service_routes import router as service_router
from .job_routes import router as job_router
from .CvTools import router as cv_router

# NEW
from .routes.auth import router as auth_router
from .routes.oauth import router as oauth_router
from .routes.service import router as service_router
from .routes.job import router as job_router
from .routes.cv_tools import router as cv_router
# OR
from .routes import (
    auth_router,
    oauth_router,
    service_router,
    job_router,
    cv_router
)
```

### Middleware
```python
# OLD
from .middleware import logging_middleware
from .security_middleware import (
    limiter,
    SecurityHeadersMiddleware,
    ...
)

# NEW
from .middleware.logging import logging_middleware
from .middleware.security import (
    limiter,
    SecurityHeadersMiddleware,
    ...
)
# OR
from .middleware import (
    logging_middleware,
    limiter,
    SecurityHeadersMiddleware,
    ...
)
```

### Utilities
```python
# OLD
from .security import (
    is_strong_password,
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

# NEW
from .utils.security_utils import (
    is_strong_password,
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
# OR
from .utils import (
    is_strong_password,
    hash_password,
    ...
)
```

### Parsers
```python
# OLD
from .parser import parse_document_with_metadata
from .cv_structure_parser import parse_and_analyze_cv
from .latex_generator import generate_latex_cv

# NEW
from .parsers.cv_parser import parse_document_with_metadata
from .parsers.cv_structure_parser import parse_and_analyze_cv
from .parsers.latex_generator import generate_latex_cv
# OR
from .parsers import (
    parse_document_with_metadata,
    parse_and_analyze_cv,
    generate_latex_cv
)
```

### Services
```python
# OLD
from .gemini_api_structured import analyze_structured_cv_with_gemini

# NEW
from .services.gemini_service import analyze_structured_cv_with_gemini
# OR
from .services import analyze_structured_cv_with_gemini
```

## File Location Changes

### Complete Mapping

| Old Location | New Location | Description |
|-------------|-------------|-------------|
| `app/config.py` | `app/config/settings.py` | Configuration |
| `app/db.py` | `app/database/connection.py` | Database connection |
| `app/models.py` | `app/models/user.py` | ORM models |
| `app/schemas.py` | `app/schemas/auth_schemas.py` | Pydantic schemas |
| `app/auth_routes.py` | `app/routes/auth.py` | Auth endpoints |
| `app/oauth_routes.py` | `app/routes/oauth.py` | OAuth endpoints |
| `app/service_routes.py` | `app/routes/service.py` | Service endpoints |
| `app/job_routes.py` | `app/routes/job.py` | Job endpoints |
| `app/CvTools.py` | `app/routes/cv_tools.py` | CV tool endpoints |
| `app/middleware.py` | `app/middleware/logging.py` | Logging middleware |
| `app/security_middleware.py` | `app/middleware/security.py` | Security middleware |
| `app/security.py` | `app/utils/security_utils.py` | Security utilities |
| `app/parser.py` | `app/parsers/cv_parser.py` | CV parser |
| `app/cv_structure_parser.py` | `app/parsers/cv_structure_parser.py` | Structured parser |
| `app/latex_generator.py` | `app/parsers/latex_generator.py` | LaTeX generator |
| `app/gemini_api_structured.py` | `app/services/gemini_service.py` | Gemini service |

## Module Organization

### Before (Flat Structure)
```
app/
├── main.py
├── config.py
├── db.py
├── models.py
├── schemas.py
├── auth_routes.py
├── oauth_routes.py
├── service_routes.py
├── job_routes.py
├── CvTools.py
├── middleware.py
├── security_middleware.py
├── security.py
├── parser.py
├── cv_structure_parser.py
├── latex_generator.py
└── gemini_api_structured.py
```

### After (Modular Structure)
```
app/
├── main.py
├── config/
│   ├── __init__.py
│   └── settings.py
├── database/
│   ├── __init__.py
│   └── connection.py
├── models/
│   ├── __init__.py
│   └── user.py
├── schemas/
│   ├── __init__.py
│   └── auth_schemas.py
├── routes/
│   ├── __init__.py
│   ├── auth.py
│   ├── oauth.py
│   ├── service.py
│   ├── job.py
│   └── cv_tools.py
├── middleware/
│   ├── __init__.py
│   ├── logging.py
│   └── security.py
├── utils/
│   ├── __init__.py
│   └── security_utils.py
├── services/
│   ├── __init__.py
│   └── gemini_service.py
└── parsers/
    ├── __init__.py
    ├── cv_parser.py
    ├── cv_structure_parser.py
    └── latex_generator.py
```

## Benefits of New Structure

### 1. **Clear Separation of Concerns**
Each module has a single responsibility:
- `routes/`: API endpoints only
- `services/`: Business logic
- `models/`: Database entities
- `schemas/`: API validation
- `utils/`: Helper functions
- `middleware/`: Request/response processing

### 2. **Better Organization**
Related code is grouped together:
- All routes in `routes/`
- All parsers in `parsers/`
- All security in `utils/` and `middleware/`

### 3. **Easier Maintenance**
- Find files faster
- Understand code structure quickly
- Add new features easily
- Test modules independently

### 4. **Scalability**
Easy to add new modules:
```
app/
├── emails/          # Email templates and sending
├── notifications/   # Push notifications
├── analytics/       # Usage analytics
└── reports/         # Report generation
```

### 5. **Professional Standards**
Follows industry best practices:
- Clean Architecture principles
- Domain-Driven Design concepts
- Modular monolith pattern
- Python packaging standards

## Migration Checklist

If you have custom code that imports from the old structure:

- [ ] Update all import statements
- [ ] Test that application starts successfully
- [ ] Verify all routes are accessible
- [ ] Run tests (if available)
- [ ] Update any deployment scripts
- [ ] Update documentation

## Example: Updating a Custom Route

### Before
```python
# custom_routes.py
from .db import get_db
from .models import User
from .security import get_current_user
from .schemas import UserOut

@router.get("/custom")
async def custom_endpoint(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Implementation
    pass
```

### After
```python
# custom_routes.py
from ..database.connection import get_db
from ..models.user import User
from ..utils.security_utils import get_current_user
from ..schemas.auth_schemas import UserOut

@router.get("/custom")
async def custom_endpoint(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Implementation
    pass
```

## Common Issues & Solutions

### Issue: ModuleNotFoundError
```
ModuleNotFoundError: No module named 'app.config'
```

**Solution**: Update the import path
```python
# Instead of: from .config import settings
from .config.settings import settings
```

### Issue: Import from wrong level
```
ImportError: attempted relative import beyond top-level package
```

**Solution**: Make sure you're using the correct number of dots
```python
# In app/routes/auth.py
from ..database.connection import get_db  # Correct (go up one level)
from .database.connection import get_db   # Wrong (current level)
```

### Issue: Circular imports
```
ImportError: cannot import name 'X' from partially initialized module
```

**Solution**: 
1. Check if modules are importing each other
2. Move shared code to a separate module
3. Use type hints with `from __future__ import annotations`

## Testing the Migration

### 1. Test Import
```bash
python -c "from app.main import app; print('✅ Import successful')"
```

### 2. Test Application Start
```bash
python -m app.main
# Should start without errors
```

### 3. Test API Endpoints
```bash
curl http://localhost:8000/health
# Should return {"status": "ok", ...}
```

### 4. Check API Documentation
```bash
# Open browser
http://localhost:8000/docs
# All endpoints should be visible
```

## Getting Help

If you encounter issues during migration:

1. **Check this guide** for import path changes
2. **Review ARCHITECTURE.md** for detailed structure
3. **Check logs** for specific error messages
4. **Test incrementally** - fix one import at a time
5. **Create an issue** if problem persists

## Rollback (Emergency Only)

If you need to rollback temporarily:

```bash
git checkout HEAD~1  # Go back one commit
```

But please report the issue so we can fix it!

## Future Enhancements

The modular structure enables:
- [ ] Email service module
- [ ] Notification system
- [ ] Analytics module
- [ ] Report generation
- [ ] Background jobs
- [ ] API versioning
- [ ] Plugin system

---

**Questions?** Create an issue on GitHub or contact the development team.

**Last Updated**: November 2024
