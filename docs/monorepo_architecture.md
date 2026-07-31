# Healthcare AI Suite - Enterprise Monorepo Architecture Guide

## Overview

The **Healthcare AI Suite** is a Modular Monolith Monorepo providing a unified backend, database, authentication system, AI engine, payment Gateway, multi-channel notifications, and storage vault for multiple SaaS products:

1. **Aura Routes**: Global study abroad, university finder, and visa eligibility matcher.
2. **NursePass AI**: Comprehensive licensing exam prep suite (NCLEX-RN, NMC CBT, OET Nursing, DHA, HAAD, MOH, Prometric).
3. **FMGE AI**: Foreign Medical Graduate Examination AI prep (Future expansion).

---

## Directory Structure

```
Healthcare AI Suite
├── apps/                        # Frontend Application Packages
│   ├── aura-routes/             # Aura Routes Next.js App
│   ├── nursepass/               # NursePass Next.js App
│   └── fmge-ai/                 # FMGE AI Next.js App
│
├── backend/                     # Unified Modular Monolith FastAPI Engine
│   └── app/
│       ├── api/                 # Endpoint namespaces (/api/aura, /api/nursepass, /api/fmge, /api/common)
│       ├── ai/                  # Shared AI Service (LLM Provider Factory & Cost Tracker)
│       ├── payments/            # Shared Razorpay & Subscription Engine
│       ├── notifications/       # Shared In-App, Email, WhatsApp Notifications
│       ├── storage/             # Shared PDF Vault & Document Generator
│       └── admin/               # Shared Super Admin Operations & Audit Logs
│
├── packages/                    # Reusable Shared Frontend TypeScript Packages
│   ├── ui/                      # Shared UI components & design system tokens
│   ├── auth/                    # Shared Supabase Auth & RBAC hooks
│   ├── payments/                # Shared Razorpay checkout handlers
│   ├── notifications/           # Shared Realtime notification hooks
│   ├── ai/                      # Shared AI streaming hooks
│   └── utils/                   # Shared TypeScript helpers & validators
│
├── infrastructure/              # Docker, Nginx, deployment scripts
└── docs/                        # Architecture documentation
```

---

## Shared Services Architecture

- **Single Database**: One PostgreSQL database tagged with `application_type` (`AURA`, `NURSEPASS`, `FMGE`).
- **Single Auth**: One Supabase Auth instance with JWT tokens and Role-Based Access Control (RBAC).
- **Single AI Engine**: LLM Provider Factory supporting OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, and Google Gemini 1.5 Pro.
- **Product Switcher**: Navigation header component allowing candidates to switch products seamlessly without re-login.
