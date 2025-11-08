# Email Delivery Improvement Guide

## Problem

Emails sent via Gmail SMTP are not reaching university email addresses (e.g., `anas.aouini@supcom.tn`) but work fine with personal email accounts.

## Root Cause

University email servers have strict spam filtering, SPF/DKIM policies, and often block external SMTP servers like Gmail's.

## Recommended Solutions

### Solution 1: Use SendGrid (Free & Reliable)

SendGrid offers 100 free emails/day and has excellent deliverability to institutional emails.

#### Setup Steps:

1. Sign up at https://sendgrid.com/free/
2. Verify your sender identity
3. Create an API key
4. Update your `.env` file:

```env
# Replace Gmail SMTP with SendGrid
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SENDER_EMAIL=your-verified-email@domain.com
SENDER_PASSWORD=your_sendgrid_api_key
```

#### Backend Code Changes:

No code changes needed! Your current `mailer.py` will work with SendGrid SMTP.

### Solution 2: Use Mailgun

Mailgun offers 5,000 free emails/month for the first 3 months.

1. Sign up at https://www.mailgun.com/
2. Verify your domain (or use their sandbox domain for testing)
3. Get SMTP credentials
4. Update `.env`:

```env
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=587
SENDER_EMAIL=postmaster@your-sandbox-domain.mailgun.org
SENDER_PASSWORD=your_mailgun_password
```

### Solution 3: University SMTP Server

If your university provides SMTP access for students:

1. Contact IT to get SMTP credentials
2. Update `.env` with university SMTP server:

```env
SMTP_SERVER=smtp.supcom.tn  # (example, check with IT)
SMTP_PORT=587
SENDER_EMAIL=anas.aouini@supcom.tn
SENDER_PASSWORD=your_university_password
```

### Solution 4: Add Email Headers for Better Deliverability

Enhance your current Gmail setup with proper headers:

```python
# In mailer.py, add these headers to the message object:
message["Reply-To"] = SENDER_EMAIL
message["Return-Path"] = SENDER_EMAIL
message["X-Mailer"] = "UtopiaHire"
message["X-Priority"] = "3"  # Normal priority

# Add List-Unsubscribe header (helps with spam filters)
message["List-Unsubscribe"] = f"<mailto:{SENDER_EMAIL}?subject=unsubscribe>"
```

### Solution 5: Test with Email Deliverability Tools

1. **Mail Tester**: Send a test email to a generated address at https://www.mail-tester.com/
   - Shows your spam score and issues
2. **Check SPF/DKIM**: Run your domain through https://mxtoolbox.com/SuperTool.aspx
   - Verifies email authentication

## Temporary Workaround

For testing purposes, you can:

1. Ask your professor/admin to whitelist your sender email
2. Check the university's quarantine/junk folder (may require admin access)
3. Set up email forwarding from your university email to Gmail

## Best Long-Term Solution

**Use SendGrid or AWS SES** - These services are designed for transactional emails and have:

- Better IP reputation
- Proper SPF/DKIM/DMARC setup
- Higher deliverability rates
- Email analytics and bounce handling
- Free tiers for development

## Testing After Changes

1. Send test emails to multiple addresses:

   - Your personal Gmail
   - Your university email
   - ProtonMail or Outlook (test different providers)

2. Check spam scores at mail-tester.com

3. Monitor backend logs for SMTP errors

## Additional Notes

- Gmail SMTP is fine for personal projects but not ideal for production
- University email systems are notoriously strict
- Even with perfect setup, some institutions block all external SMTP
- Consider implementing a fallback notification system (SMS, in-app notifications)
