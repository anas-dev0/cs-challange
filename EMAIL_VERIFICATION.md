# Email Verification Feature

## Overview

The application now requires users to verify their email address after registration before they can log in. This enhances security and ensures valid email addresses.

## Changes Made

### Backend Changes

#### 1. Database Model Updates (`backend/app/models.py`)

Added two new fields to the `User` model:

- `email_verified`: Boolean field (stored as integer) to track verification status
- `verification_token`: String field to store unique verification tokens

#### 2. Email Service (`backend/agent/mailer.py`)

Added new function `send_verification_email()` that:

- Generates a beautiful HTML email with a verification link
- Includes the verification token in the URL
- Has a fallback plain text version
- Uses the existing SMTP configuration

#### 3. Authentication Routes (`backend/app/auth_routes.py`)

Modified and added endpoints:

**POST `/api/auth/register`**

- Now returns a message instead of tokens
- Generates a unique verification token
- Sends verification email to the user
- Sets `email_verified=False` by default

**POST `/api/auth/verify-email`** (NEW)

- Accepts verification token
- Marks email as verified
- Returns access/refresh tokens for automatic login
- Clears the verification token

**POST `/api/auth/resend-verification`** (NEW)

- Allows users to request a new verification email
- Requires email and password
- Generates new verification token

**POST `/api/auth/login`**

- Now checks if email is verified before allowing login
- Returns 403 error if email not verified

#### 4. OAuth Integration (`backend/app/oauth_routes.py`)

- OAuth users (Google/GitHub) are automatically marked as verified
- Sets `email_verified=True` for OAuth signups

#### 5. Database Migration (`backend/app/main.py`)

- Added automatic column creation on startup
- Handles existing databases gracefully with IF NOT EXISTS

#### 6. Schemas (`backend/app/schemas.py`)

- Added `VerifyEmailRequest` schema for verification endpoint

### Frontend Changes

#### 1. New Verification Page (`frontend/src/pages/VerifyEmail.tsx`)

- Handles email verification when users click the link
- Shows loading, success, or error states
- Automatically logs users in after successful verification
- Redirects to dashboard after verification

#### 2. Router Updates (`frontend/src/App.tsx`)

- Added `/verify-email` route for the verification page

#### 3. Auth Context (`frontend/src/AuthContext.tsx`)

- Updated `register()` to handle the new response (message instead of tokens)
- Updated `login()` to handle 403 errors for unverified emails
- Shows appropriate toast messages

## User Flow

### Registration Flow

1. User fills out registration form
2. System validates password strength
3. Account is created with `email_verified=False`
4. Verification email is sent to user's inbox
5. User sees success message: "Please check your email to verify your account"
6. Modal closes

### Verification Flow

1. User receives email with verification link
2. User clicks link (opens `/verify-email?token=...`)
3. Frontend sends token to backend
4. Backend validates token and marks email as verified
5. User is automatically logged in
6. User is redirected to dashboard

### Login Flow

1. User enters credentials
2. System validates credentials
3. **NEW:** System checks if email is verified
4. If not verified, shows error: "Please verify your email before logging in"
5. If verified, user logs in successfully

### OAuth Flow (Google/GitHub)

1. User signs in with OAuth provider
2. Account is created/accessed
3. Email is automatically marked as verified
4. User logs in successfully (no verification needed)

## Email Configuration

Make sure these environment variables are set in `backend/.env`:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
SENDER_NAME=AI Interview Coach
FRONTEND_URL=http://localhost:5173
```

## Testing

### Test Registration

1. Register a new account
2. Check console/logs for email sending confirmation
3. Check your email inbox for verification email
4. Click the verification link
5. Should be logged in and redirected to dashboard

### Test Login Before Verification

1. Register a new account
2. Try to log in before clicking verification link
3. Should see error: "Please verify your email before logging in"

### Test Resend Verification (Future Enhancement)

Currently not exposed in UI, but endpoint is available at `/api/auth/resend-verification`

## Security Notes

- Verification tokens are generated using `secrets.token_urlsafe(32)` for cryptographic security
- Tokens are single-use and cleared after verification
- Verification links expire after 24 hours (can be implemented with timestamp checking)
- OAuth users bypass email verification as providers already verify emails
- Email sending errors don't fail registration (user can resend later)

## Future Enhancements

1. **Token Expiration**: Add timestamp checking for 24-hour expiration
2. **Resend UI**: Add "Resend verification email" button in login modal
3. **Rate Limiting**: Limit verification email requests to prevent spam
4. **Email Templates**: More customizable email templates
5. **Multi-language Support**: Verification emails in user's language
6. **SMS Verification**: Optional SMS verification as alternative
