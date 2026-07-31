# Healthcare AI Suite — Enterprise Monorepo

> **One backend. One database. One auth system. Three products. Unlimited scale.**

A production-grade **Railway-optimized Modular Monolith Monorepo** powering multiple independent healthcare SaaS products from a unified FastAPI backend, Supabase database, shared AI engine, payment engine, and notification engine.

---

## Products

| Product | Description | Domain | Status |
|---|---|---|---|
| **Aura Routes** | Study abroad, university finder, visa eligibility | auraroutes.com | ✅ Live |
| **NursePass AI** | Nursing licensing exam prep (NCLEX, CBT, OET, DHA, HAAD, MOH) | nursepass.com | ✅ Live |
| **FMGE AI** | Foreign Medical Graduate Exam prep | fmge.healthcare-suite.com | 🔄 Coming Soon |

---

## Monorepo Structure

```
Healthcare-AI-Suite/
├── apps/
│   ├── aura-routes/       # Aura Routes Next.js frontend (port 3000)
│   ├── nursepass/         # NursePass Next.js frontend (port 3001)
│   └── fmge-ai/           # FMGE AI Next.js frontend (port 3002)
│
├── backend/               # Shared FastAPI backend (port 8000)
│   └── app/
│       ├── api/
│       │   ├── aura/      # /api/aura/* endpoints
│       │   ├── nursepass/ # /api/nursepass/* endpoints
│       │   ├── fmge/      # /api/fmge/* endpoints
│       │   └── common/    # /api/common/* shared endpoints
│       ├── ai/            # Shared AI Engine (OpenAI/Gemini/Claude)
│       ├── payments/      # Shared Razorpay engine
│       ├── notifications/ # Shared multi-channel notifications
│       └── storage/       # Shared Supabase storage
│
├── packages/
│   ├── ui/                # Shared React component library
│   ├── auth/              # Supabase hooks, session, RBAC
│   ├── payments/          # Razorpay checkout hooks
│   ├── ai/                # AI streaming hooks
│   └── utils/             # API fetcher, formatters, validators
│
├── infrastructure/
│   ├── Dockerfile         # Backend production image
│   ├── Dockerfile.aura    # Aura Routes production image
│   ├── Dockerfile.nursepass # NursePass production image
│   ├── docker-compose.yml # Full-stack local dev orchestration
│   └── nginx.conf         # Reverse proxy config
│
├── .github/
│   └── workflows/ci.yml   # GitHub Actions CI pipeline
│
├── railway.json           # Railway monorepo deployment config
├── package.json           # npm workspaces root
└── .env.example           # Unified environment template
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js ≥ 20
- Python ≥ 3.11
- PostgreSQL (or Supabase project)

### 1. Clone & Install
```bash
git clone https://github.com/your-org/healthcare-ai-suite.git
cd healthcare-ai-suite
```

### 2. Set Up Backend
```bash
cd backend
cp ../.env.example .env
# Edit .env with your values
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Start Aura Routes
```bash
# From monorepo root
npm run dev:aura
# → http://localhost:3000
```

### 4. Start NursePass
```bash
npm run dev:nursepass
# → http://localhost:3001
```

### 5. Full Stack with Docker
```bash
docker-compose -f infrastructure/docker-compose.yml up --build
# Backend  → http://localhost:8000
# Aura     → http://localhost:3000
# NursePass→ http://localhost:3001
```

---

## API Endpoints

| Namespace | Description | Example |
|---|---|---|
| `/api/aura/*` | Aura Routes product APIs | `/api/aura/health` |
| `/api/nursepass/*` | NursePass product APIs | `/api/nursepass/health` |
| `/api/fmge/*` | FMGE AI product APIs | `/api/fmge/health` |
| `/api/common/*` | Shared cross-product APIs | `/api/common/health` |
| `/api/docs` | Interactive Swagger UI | |
| `/health` | Root health check | |

---

## Railway Deployment

This repo is Railway-monorepo ready. Connect your GitHub repository to Railway and 4 services are auto-configured from `railway.json`:

| Service | Root Directory | URL |
|---|---|---|
| `backend` | `/backend` | api.yourdomain.com |
| `aura-routes` | `/apps/aura-routes` | auraroutes.com |
| `nursepass` | `/apps/nursepass` | nursepass.com |
| `fmge-ai` | `/apps/fmge-ai` | fmge.yourdomain.com |

Add Railway PostgreSQL and Redis plugins to the same project.

### Required Environment Variables
See [.env.example](.env.example) for the complete list.

---

## Architecture

- **Modular Monolith** — One FastAPI process, modular domain packages
- **Single Database** — PostgreSQL with `application_type` column for data isolation
- **Single Auth** — Supabase Auth with SSO across all products
- **RBAC** — Role-based access: Super Admin → Product Admins → Institution Admin → Faculty → Student
- **Shared AI** — Unified LLM factory (OpenAI GPT-4o, Gemini 1.5 Pro, Claude 3.5 Sonnet)

---

## Adding a New Product

1. `mkdir apps/new-product && cd apps/new-product && npm create next-app@latest .`
2. Add endpoint namespace: `backend/app/api/new_product/__init__.py`
3. Register router in `backend/app/main.py`
4. Add service entry to `railway.json`

No other changes required. 🚀
