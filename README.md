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


## Financing review desk

The admin home route now redirects to the **protected** \`/requests\` review desk. Operators use the same secure sign-in session as the enquiry inbox. Financing requests are listed with filters, pagination, borrower contact details, backend-calculated repayment estimates, manual status changes with required reasons, and a time-stamped history.

The Next.js server-side API routes \`/api/requests\` and \`/api/requests/[id]\` use the private \`INTERNAL_API_URL\` and \`ADMIN_API_TOKEN\` environment variables. No backend secret is exposed to the browser. \`PATCH\` checks the admin session, origin, UUID, status and note; the backend independently validates status transitions and concurrent updates.

Internal review stages are not binding credit approvals. Review changes do not send customer emails or initiate disbursements. Configure and deploy the separate Lending Ezy backend and its migrations before enabling real customer intake.
