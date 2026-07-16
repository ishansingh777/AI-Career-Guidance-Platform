
# AI Career Guidance Platform

AI Career Guidance Platform is a full-stack app that helps users assess their skills, explore career paths, compare roles, and chat with an AI career mentor.


- React frontend: `client/`
- Express + Prisma backend: `server/`

UI reference (Figma): https://www.figma.com/design/SxDESdXPeEbzGn6K7Bq6YS/AI-Career-Guidance-Platform

---

## Features

- **Assessment**: collect answers and compute career fit signals.

- **Top career matches**: curated recommendations based on the latest assessment.
- **Career details**: role overview, skills, salary, roadmap, and resources.
- **Recommendations & comparisons**: compare career options and visualize differences.
- **AI Mentor chat**: ask follow-up questions about career and next steps.
- **Skill gap analysis**: highlight strengths and gaps.
- **Saved careers**: persist and revisit career selections.
- **PDF report export**: generate a career report for sharing.

---

## Tech Stack

### Frontend
- React + React Router
- Vite
- Tailwind CSS (with shadcn/ui-inspired styling/components)
- Axios (API client)
- Charting (Recharts / Chart.js via dependencies)

### Backend
- Express
- Prisma ORM + PostgreSQL
- JWT authentication (see backend auth service/controller)
- OpenAI integration for AI Mentor (provider abstraction)

---

## Folder Structure

```text
AI Career Guidance Platform/
├─ client/                     # React app
│  ├─ src/
│  │  ├─ pages/              # Route-level pages
│  │  ├─ components/        # Reusable UI components
│  │  ├─ context/           # Auth + theme contexts
│  │  ├─ features/          # Feature modules
│  │  ├─ services/          # API calls
│  │  └─ utils/             # helpers + formatting + PDF export
│  ├─ public/
│  └─ vite.config.ts        # dev proxy for /api
│
├─ server/                     # Express app
│  ├─ src/
│  │  ├─ app.ts              # middleware + route mount
│  │  ├─ server.ts           # server bootstrap + Prisma check
│  │  ├─ routes/            # /api/* routes
│  │  ├─ controllers/       # route handlers
│  │  ├─ services/          # business logic
│  │  ├─ lib/               # Prisma + AI provider abstraction
│  │  └─ middleware/        # auth middleware
│  ├─ prisma/
│  └─ .env.example
│
└─ docs/                        # additional documentation (placeholder)
```

---

## Architecture Overview

- **Client** renders pages and calls backend endpoints through an Axios instance.
- **Server** exposes API routes under `/api/*`.
- **Prisma** manages persistence (Users, Careers, Assessments, Chat/Messages, Saved careers, etc.).
- **AI layer**:
  - `server/src/lib/ai/` provides:
    - provider abstraction (`provider.ts`)
    - OpenAI implementation (`openai.ts`)
    - prompt building (`promptBuilder.ts`)

---

## Installation

### Prerequisites
- Node.js 18+ recommended
- PostgreSQL database (local or managed like Neon)
- OpenAI API key (for AI Mentor)

### Install dependencies
From the repository root:

```bash
npm install
```

Then install client dependencies if needed:

```bash
cd client && npm install
```

Then install server dependencies if needed:

```bash
cd ../server && npm install
```

---

## Running Locally

### Frontend (Vite)

From `client/`:

```bash
npm run dev
```

The Vite dev server proxies `/api` to the backend at `http://localhost:5000` (see `client/vite.config.ts`).

### Backend (Express)

From `server/`:

```bash
npm run dev
```

Backend starts on `PORT` (default: `5000`).

---

## Environment Variables

> Create the environment files based on the included examples.

### Client Environment (Vite)
File: `client/.env.example`

Required / documented:
- `VITE_API_URL` — intended base URL for API requests.
  - Note: current runtime uses relative `/api` paths and the Vite dev proxy.
  - For production deployments, you can either:
    - keep proxy-based relative `/api` calls (if your hosting routes `/api` to the backend), or
    - update the client to use `VITE_API_URL` (not required for this milestone).



### Server Environment (Express + Prisma)
File: `server/.env.example`

Required / documented:
- `DATABASE_URL` — PostgreSQL connection string.
- `JWT_SECRET` — secret for signing/verifying JWT tokens.
- `OPENAI_API_KEY` — OpenAI API key for AI Mentor.
- `OPENAI_MODEL` — OpenAI model name.
- `PORT` — backend listening port.
- `CORS_ORIGIN` — intended allowed origin for CORS.
  - Note: server currently uses `cors()` with default settings. Documented for deployment readiness.

---

## API Overview

Base path:
- `/api`

Routes mounted by the backend:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout` (stateless logout)
- `GET /api/user/me` (requires auth)
- `GET /api/assessments/*` (assessment flows)
- `GET /api/recommendations` (top matches)
- `GET /api/careers/*` (career details)
- `POST /api/chat` (AI mentor chat)

> Response bodies are controlled by the corresponding controllers in `server/src/controllers/*`.

---

## Screenshots

Placeholders:
- Landing page screenshot: `docs/screenshots/landing.png`
- Dashboard screenshot: `docs/screenshots/dashboard.png`
- AI Mentor chat screenshot: `docs/screenshots/chat.png`
- Career details screenshot: `docs/screenshots/career-details.png`

---

## Deployment Guide

### Frontend (Vercel)
Build command:
- `client/build` uses `vite build`

Start command (if needed):
- Vercel handles the static build.

Environment variables:
- Provide `VITE_API_URL` if your deployment needs a non-proxy backend URL.

### Backend (Render / Railway)
Build command:
- `npm run build`

Start command:
- `npm run start`

Environment variables (server):
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `PORT`
- `CORS_ORIGIN`

### Database (Neon PostgreSQL)
- Use the Neon connection string as `DATABASE_URL`.
- Ensure SSL mode is enabled (example uses `sslmode=require`).

---

## Future Improvements

- Add additional AI providers (Gemini/OpenRouter) via the provider abstraction.
- Strengthen CORS configuration using `CORS_ORIGIN` in server runtime.
- Improve production observability (structured logs, request IDs, tracing).
- Add automated CI checks for lint/typecheck.

---

## License

No top-level `LICENSE` file was detected/read in the repository root.

Third-party notices/attributions are documented in:
- `client/ATTRIBUTIONS.md`

Additional notes:
- `KNOWN_LIMITATIONS.md` (current known gaps/assumptions)

---



