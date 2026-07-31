"""
Common API Package
==================
Shared endpoints used across all products (Aura Routes, NursePass, FMGE AI).
Includes health checks, user profile, cross-product notifications, and auth.
Mounted under prefix /api/common by the main application.
"""
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import time

# Import shared sub-routers
from ..profile import router as profile_router
from ..notifications import router as notifications_router
from ..communication import router as communication_router

# Common/shared product router
common_router = APIRouter(tags=["Common — Shared Services"])

# ─── Health Check ─────────────────────────────────────────────────────────────
@common_router.get("/api/common/health", tags=["Health"])
async def common_health():
    """Unified health check endpoint for Railway and load balancer probes."""
    return {
        "status": "healthy",
        "service": "Healthcare AI Suite — Shared Backend",
        "products": ["aura-routes", "nursepass", "fmge-ai"],
        "timestamp": time.time()
    }

@common_router.get("/api/aura/health", tags=["Health"])
async def aura_health():
    return {"status": "healthy", "product": "aura-routes", "timestamp": time.time()}

@common_router.get("/api/nursepass/health", tags=["Health"])
async def nursepass_health():
    return {"status": "healthy", "product": "nursepass", "timestamp": time.time()}

@common_router.get("/api/fmge/health", tags=["Health"])
async def fmge_health():
    return {"status": "healthy", "product": "fmge-ai", "timestamp": time.time()}

# Include shared sub-routers
common_router.include_router(profile_router)
common_router.include_router(notifications_router)
common_router.include_router(communication_router)
