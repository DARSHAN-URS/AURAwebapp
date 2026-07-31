# Migration Archive — Healthcare AI Suite Monorepo

This directory contains files that have been superseded by the monorepo refactoring.
**Do NOT delete this directory** until all applications are verified to work correctly in production.

---

## Contents

### `archive/website-legacy/`
**What**: Full copy of the original `website/` Next.js application.
**Why archived**: `apps/aura-routes/` is now the canonical Aura Routes frontend.
**Status**: Kept for rollback safety.
**Safe to delete**: When `apps/aura-routes/` is confirmed working in production.

### `archive/aura-routes-nursepass-services/`
**What**: NursePass service files (API clients) that were in `apps/aura-routes/services/`.
**Why archived**: These belong in `apps/nursepass/services/` — they were copied there.
**Safe to delete**: After `apps/nursepass/` confirms they import correctly.

### `archive/aura-routes-nursepass-pages/`
**What**: NursePass pages that lived in `apps/aura-routes/app/` (exams/, ai-features/, etc.)
**Why archived**: NursePass pages belong in `apps/nursepass/app/`.
**Safe to delete**: After `apps/nursepass/` confirms pages render correctly.

---

## Rollback Instructions

If anything breaks:
1. `apps/aura-routes/` → restore from `archive/website-legacy/`
2. All NursePass services → restore from `archive/aura-routes-nursepass-services/`
3. All NursePass pages → restore from `archive/aura-routes-nursepass-pages/`

---

## Migration Date
2026-07-30
