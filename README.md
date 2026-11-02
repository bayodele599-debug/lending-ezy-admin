# Lending Ezy — Administration

Premium administrative preview plus a **password-protected enquiry inbox**, with server-side API forwarding.

## Local setup
```bash
npm install
cp .env.example .env.local
npm run dev -- -p 3001
```
Generate `ADMIN_SESSION_SECRET` (32+ random characters), `ADMIN_API_TOKEN` (32+ random characters), and a strong unique `ADMIN_PASSWORD` (16+ characters). The backend's `ADMIN_API_TOKEN` must match. Never commit secrets or expose private values via `NEXT_PUBLIC_`.

Routes: `/` demo command centre, `/login` secure admin login, `/inbox` protected enquiries and replies.

**Safe defaults:** No configured admin credentials means login is disabled. Backend access requires server credentials. Email sending requires configured SMTP. Deploy behind additional access protection, rate limiting and security monitoring before collecting real user data. This is not a loan-origination platform.
