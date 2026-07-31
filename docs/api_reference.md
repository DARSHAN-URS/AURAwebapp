# Healthcare AI Suite — API Reference

## Base URL
```
Production: https://api.healthcare-suite.com
Local Dev:  http://localhost:8000
```

---

## Products & Namespaces

| Product | API Prefix | Frontend |
|---|---|---|
| Aura Routes | `/api/aura/` | auraroutes.com |
| NursePass | `/api/nursepass/` | nursepass.com |
| FMGE AI | `/api/fmge/` | fmge.healthcare-suite.com |
| Common (shared) | `/api/common/` | All products |

---

## Health Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Root suite health check |
| GET | `/api/common/health` | Common services health |
| GET | `/api/aura/health` | Aura Routes health |
| GET | `/api/nursepass/health` | NursePass health |
| GET | `/api/fmge/health` | FMGE AI health |
| GET | `/api/fmge/status` | FMGE AI status & roadmap |

---

## Aura Routes APIs (`/api/aura/`)

### Eligibility
- `POST /api/eligibility/check` — AI eligibility check for nursing/medical programs

### Visa
- `POST /api/visa/check` — AI visa eligibility checker
- `GET /api/visa-success/stories` — Success stories

### Universities
- `GET /api/explorer/universities` — University listings
- `GET /api/explorer/countries` — Country listings
- `POST /api/university-matcher/match` — AI university matcher

### MBBS
- `GET /api/mbbs-matcher/countries` — MBBS destination countries

### Dashboard
- `GET /api/dashboard/stats` — Student dashboard statistics

### Chat (AI)
- `POST /api/chat/message` — AI study abroad advisor chat

### Payments
- `POST /api/payments/create-order` — Razorpay order creation
- `POST /api/payments/verify` — Payment verification

### SOP
- `POST /api/sop/generate` — AI SOP generation
- `GET /api/sop/list` — SOP history

---

## NursePass APIs (`/api/v1/nursepass/`)

### Auth
- `POST /api/v1/nursepass/auth/register` — NursePass registration
- `POST /api/v1/nursepass/auth/login` — NursePass login

### Dashboard
- `GET /api/v1/nursepass/dashboard/overview` — Student overview

### Mock Tests (NP-M05)
- `POST /api/v1/nursepass/mock/start` — Start adaptive mock test
- `GET /api/v1/nursepass/mock/sessions` — Test session history
- `POST /api/v1/nursepass/mock/submit` — Submit test answers

### Study Planner (NP-M06)
- `GET /api/v1/nursepass/planner/plan` — AI study plan
- `POST /api/v1/nursepass/planner/generate` — Generate new plan

### OET Writing (NP-M07)
- `POST /api/v1/nursepass/writing/evaluate` — AI writing evaluation
- `GET /api/v1/nursepass/writing/history` — Writing history

### AI Tutor (NP-M08)
- `POST /api/v1/nursepass/tutor/chat` — AI clinical tutor chat

### Speaking Coach (NP-M09)
- `POST /api/v1/nursepass/speaking/session` — Speaking session
- `GET /api/v1/nursepass/speaking/history` — Session history

### Analytics (NP-M10)
- `GET /api/v1/nursepass/analytics/overview` — Performance analytics
- `GET /api/v1/nursepass/analytics/readiness` — AI readiness score

### Certificates (NP-M11)
- `GET /api/v1/nursepass/certificates/list` — Earned certificates
- `POST /api/v1/nursepass/certificates/generate` — Generate certificate

### Payments (NP-M12)
- `GET /api/v1/nursepass/payments/plans` — Subscription plans
- `POST /api/v1/nursepass/payments/create-order` — Create order
- `POST /api/v1/nursepass/payments/verify` — Verify payment

### Notifications (NP-M13)
- `GET /api/v1/nursepass/notifications/list` — Notification stream
- `PUT /api/v1/nursepass/notifications/preferences` — Update preferences

### Institution (NP-M14)
- `GET /api/v1/nursepass/institution/overview` — Institution dashboard
- `GET /api/v1/nursepass/institution/students` — Student roster

### Admin (NP-M15)
- `GET /api/v1/nursepass/admin/metrics` — Platform metrics
- `GET /api/v1/nursepass/admin/users` — User management
- `GET /api/v1/nursepass/admin/ai-configs` — AI provider configs
- `GET /api/v1/nursepass/admin/feature-flags` — Feature flags

---

## FMGE AI APIs (`/api/fmge/`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/fmge/health` | Health check |
| GET | `/api/fmge/status` | Product status & roadmap |

> Full FMGE API coming soon.

---

## Interactive Docs
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`
