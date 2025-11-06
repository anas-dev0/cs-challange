# Quick Start Guide - Unified Backend

This guide will help you get the unified backend service up and running quickly.

## What Changed?

The application previously had two separate backend services:

1. **auth_fastapi** (port 8000) - Running in Docker for authentication
2. **backend/server.py** (port 3001) - Running locally for services

Now there's **ONE unified backend service** that:

- Runs on **port 8000**
- Handles authentication AND services
- **Does NOT run in Docker** (only PostgreSQL runs in Docker)
- Has JWT protection on all service endpoints

## Quick Setup (5 minutes)

### Step 1: Start the Database

From the project root directory:

```bash
docker-compose up -d
```

This starts PostgreSQL and pgAdmin. The unified backend service is no longer in Docker.

### Step 2: Setup Backend

```bash
cd backend_unified
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Configure Environment

The `.env` file is already set up with default values. For LiveKit features, update:

```env
LIVEKIT_API_KEY=your-key
LIVEKIT_API_SECRET=your-secret
LIVEKIT_URL=your-url
```

### Step 4: Run the Backend

```bash
uvicorn app.main:app --reload --port 8000
```

✅ Backend is now running at `http://localhost:8000`

### Step 5: Run the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend is now running at `http://localhost:5173`

### Step 6: Run the Agent (Optional - For AI Interviews)

In another terminal:

```bash
cd backend
python agent.py dev
```

## Verification

1. **Check backend health**: Visit `http://localhost:8000/health`
2. **Check API docs**: Visit `http://localhost:8000/docs`
3. **Test frontend**: Visit `http://localhost:5173`

## What's Working?

✅ User registration and login (JWT authentication)
✅ Google/GitHub OAuth login
✅ Protected API endpoints (CV upload, sessions)
✅ Interview management
✅ Database operations
✅ Frontend communicates with unified backend

## Ports Summary

- **8000**: Unified Backend (FastAPI)
- **5173**: Frontend (Vite React)
- **5432**: PostgreSQL Database
- **5050**: pgAdmin (Database management UI)

## Need Help?

- Backend errors: Check `backend_unified/README.md`
- Database issues: Run `docker-compose down -v` then `docker-compose up -d`
- Frontend issues: Check frontend console for errors

## Common Commands

**Start everything:**

```bash
# Terminal 1 - Database
docker-compose up -d

# Terminal 2 - Backend
cd backend_unified
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 3 - Frontend
cd frontend
npm run dev

# Terminal 4 - Agent (optional)
cd backend
python agent.py dev
```

**Stop everything:**

```bash
# Stop backend: Ctrl+C in terminal
# Stop frontend: Ctrl+C in terminal
# Stop agent: Ctrl+C in terminal
# Stop database: docker-compose down
```

## Migration Notes

If you had data in the old setup:

- ✅ Database data is preserved (same schema)
- ✅ User accounts work as before
- ✅ Interview records are accessible
- ⚠️ Frontend now sends JWT tokens with all requests
- ⚠️ Service endpoints now require authentication

The old `auth_fastapi` Docker container is no longer used and has been removed from `docker-compose.yml`.
