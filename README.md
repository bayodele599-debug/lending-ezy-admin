# Lending Ezy — Administration

Internal operations **preview** for the worldwide lending technology platform.

- Read-only sandbox overview from the backend API
- Product, country and partner-launch information
- Live originations, disbursements, and repayments locked at zero
- No privileged financial operations or real customer data

## Start
```bash
npm install
cp .env.example .env.local
npm run dev -- -p 3001
```
Start `lending-ezy-backend` on localhost:8000, with `APP_ENV=development` for sandbox API access. Admin dashboard is at http://localhost:3001.

**Not production ready:** Authentication, RBAC, tenant isolation, migrations, real provider integrations and compliance approvals are not yet implemented. Do not deploy this unauthenticated admin preview against real customer data.
