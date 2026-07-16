# Deployment Checklist (Portfolio/Production Readiness)

This checklist covers the typical deployment path for the **AI Career Guidance Platform**:
- Frontend: **Vercel**
- Backend: **Render / Railway**
- Database: **Neon PostgreSQL**

> Follow steps in order. Do not change APIs or database schema as part of deployment.

---

## 1) Frontend Deployment (Vercel)

### Build Settings
- Framework/Build: Vite (React)
- Build Command (repo root / client):
  - `cd client && npm run build`
- Output Directory:
  - `client/dist`

### Runtime Environment
- Add environment variables (if your client uses them):
  - `VITE_API_URL` *(optional; only if you configure the client to call a non-proxy backend directly)*

### Networking
- Ensure Vercel route handling aligns with backend:
  - This project uses `/api/...` paths.
  - Confirm that in production, `/api` requests reach the backend.
  - If you rely on a dev-proxy behavior, you may need rewrite rules or an API route proxy configuration at deploy-time.

---

## 2) Backend Deployment (Render / Railway)

### Build Settings
- Build Command (in `server/`):
  - `npm run build`
- Start Command (in `server/`):
  - `npm run start`

### Health Check
- Validate backend responds to:
  - `GET /api/health` (or any documented health endpoint)

---

## 3) Neon PostgreSQL Setup

### Create DB
- Provision a Neon Postgres database.

### Connection String
- Set backend `DATABASE_URL` to the Neon connection string.
- Ensure SSL requirements match the project expectations.
  - If the sample uses `sslmode=require`, keep that in `DATABASE_URL`.

---

## 4) Environment Variables

### Client (.env)
- File reference: `client/.env.example`
- Required / Used:
  - `VITE_API_URL` *(verify usage; some setups use relative `/api`)*

### Server (.env)
- File reference: `server/.env.example`
- Required / Used:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`
  - `PORT`
  - `CORS_ORIGIN`

> Do not commit secrets to git.

---

## 5) Production Build Commands

From repository root:

```bash
npm install
```

Frontend:
```bash
cd client && npm install && npm run build
```

Backend:
```bash
cd server && npm install && npm run build
```

---

## 6) Production Verification Checklist

### Backend
1. Start backend with production env vars.
2. Confirm DB connection succeeds.
3. Confirm Prisma migrations are applied (if required by your deployment flow).
4. Confirm auth endpoints work:
   - `POST /api/auth/signup`
   - `POST /api/auth/login`
5. Confirm chat endpoint works:
   - `POST /api/chat`

### Frontend
1. Open deployed frontend.
2. Sign up (or login with existing user).
3. Complete assessment.
4. Load recommendations and career details.
5. Use AI mentor chat.
6. Save/unsave a career.
7. Export PDF.

### Cross-Origin / Networking
- Confirm CORS allows your deployed frontend origin.
- Confirm `/api` calls resolve to backend.

---

## 7) Common Deployment Issues

### CORS errors
- Symptom: browser blocks requests due to CORS.
- Fix:
  - Ensure `CORS_ORIGIN` matches the frontend deployment URL.

### `/api` requests failing in production
- Symptom: 404/connection errors from frontend.
- Fix:
  - Configure Vercel rewrites/proxying to backend **or** update client base URLs (only if your project setup requires it).

### Missing OPENAI API key
- Symptom: AI mentor chat fails.
- Fix:
  - Ensure `OPENAI_API_KEY` and `OPENAI_MODEL` are set in backend environment.

### PDF export issues
- Symptom: download fails or blank file.
- Fix:
  - Confirm generated content is returned with correct headers.

### Database SSL mismatch
- Symptom: Prisma cannot connect to Neon.
- Fix:
  - Ensure `DATABASE_URL` includes required SSL settings.

---

## 8) Release Notes (Portfolio)

Record for your portfolio:
- Deployment URLs (frontend + backend if separate)
- Neon DB used (provider only; no credentials)
- Any limitations documented in `KNOWN_LIMITATIONS.md`

