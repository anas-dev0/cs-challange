# Job Search Integration - Complete Guide

## Overview

Successfully integrated LinkedIn job scraping functionality into your unified FastAPI backend.

## Changes Made

### 1. Backend Integration

#### Created New File: `backend/app/job_routes.py`

- LinkedIn job scraping functionality
- Two main endpoints:
  - `POST /api/jobs/search` - Search and scrape jobs
  - `GET /api/jobs` - Retrieve saved jobs

#### Updated: `backend/app/main.py`

- Added import for `job_router`
- Included job router in the FastAPI app

#### Updated: `backend/requirements.txt`

- Added `beautifulsoup4` - HTML parsing for job scraping
- Added `urllib3` - HTTP request utilities

### 2. Frontend Updates

#### Updated: `frontend/src/pages/JobMatcher.tsx`

- Changed API endpoint from `http://127.0.0.1:5000/search_jobs`
- To: `http://localhost:8000/api/jobs/search`
- Now integrated with unified backend on port 8000

#### Updated: `frontend/src/pages/GetJobs.tsx`

- Changed API endpoint from `http://127.0.0.1:5000/get_jobs`
- To: `http://localhost:8000/api/jobs`
- Fetches jobs from unified backend

## API Endpoints

### Job Search

```
POST http://localhost:8000/api/jobs/search
Content-Type: application/json

{
  "keywords": "React Developer",
  "location": "Remote",
  "max_jobs": 10,
  "timeRange": "86400"  // optional, in seconds
}
```

**Response:**

```json
{
  "message": "10 jobs found and saved.",
  "jobs": [
    {
      "title": "Senior React Developer",
      "company": "Tech Company",
      "location": "Remote",
      "job_link": "https://linkedin.com/...",
      "posted_date": "2 hours ago",
      "description": "Job description...",
      "logo": "logo_url",
      "logo_tag": "logo_url",
      "in_time_range": true,
      "time_note": ""
    }
  ]
}
```

### Get Jobs

```
GET http://localhost:8000/api/jobs
```

**Response:**

```json
{
  "jobs": [...]
}
```

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
pip install beautifulsoup4 urllib3
# Or install all requirements
pip install -r requirements.txt
```

### 2. Restart Backend Server

```bash
cd backend
python -m app.main
```

The server should start on `http://localhost:8000`

### 3. Frontend is Ready

No additional setup needed - just ensure frontend is running on `http://localhost:5173`

## Features

### Job Scraping

- Scrapes LinkedIn job listings
- Supports keyword and location search
- Configurable max results (default: 10)
- Optional time range filter (hours/days)
- Extracts:
  - Job title
  - Company name
  - Location
  - Job link
  - Posted date
  - Full job description
  - Company logo

### Integration with Interview Setup

- "Take an Interview" button on each job card
- Automatically pre-fills:
  - Job Description
  - Job Title
- Navigates to Interview Setup page
- Uses localStorage for data transfer

## File Storage

Jobs are saved to `linkedin_jobs.json` in the backend root directory.

## Error Handling

- Graceful fallbacks for missing data
- Retry logic for network requests
- Rate limiting protection
- Validation for all inputs

## Time Range Options

- `3600` = Last hour
- `86400` = Last 24 hours
- `604800` = Last week
- Empty string = All time

## Notes

- The old standalone Flask server on port 5000 is no longer needed
- All job functionality now runs through the unified FastAPI backend on port 8000
- Jobs are shared across all users (consider adding user-specific job lists if needed)
- Scraping may take time depending on max_jobs parameter

## Testing

1. **Search Jobs:**

   - Go to Job Matcher page
   - Enter search criteria
   - Submit form
   - Wait for scraping to complete

2. **View Jobs:**

   - Navigate to Get Jobs page
   - See list of scraped jobs
   - Click "View Job" to open LinkedIn
   - Click "Take an Interview" to start interview prep

3. **Interview Integration:**
   - Click "Take an Interview" on any job
   - Verify job description and title are pre-filled
   - Continue with interview setup

## Troubleshooting

### Jobs not appearing

- Check backend console for scraping errors
- Verify `linkedin_jobs.json` exists in backend directory
- LinkedIn may block excessive requests - wait a few minutes

### API connection errors

- Ensure backend is running on port 8000
- Check CORS settings in `main.py`
- Verify frontend is using correct endpoints

### Scraping fails

- LinkedIn may have changed their HTML structure
- Check internet connection
- Verify requests aren't being rate-limited

## Future Enhancements

- User-specific job saves
- Job bookmarking
- Advanced filtering
- Job alerts
- Company research integration
- Salary information scraping
