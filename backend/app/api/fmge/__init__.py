"""
FMGE AI API Package
====================
Stub router for FMGE AI (Foreign Medical Graduate Examination) product.
Mounted under prefix /api/fmge by the main application.
Ready for future expansion without restructuring the monorepo.
"""
from fastapi import APIRouter
import time

fmge_router = APIRouter(tags=["FMGE AI"])

@fmge_router.get("/api/fmge/status", tags=["FMGE AI"])
async def fmge_status():
    """FMGE AI product status endpoint — currently in development."""
    return {
        "product": "fmge-ai",
        "status": "coming_soon",
        "message": "FMGE AI — Foreign Medical Graduate Examination Prep is launching soon.",
        "features_planned": [
            "AI Mock Tests (FMGE Pattern)",
            "Subject-wise Question Bank",
            "AI Study Planner",
            "Clinical Case Discussions",
            "Performance Analytics",
            "AI Chat Tutor"
        ],
        "timestamp": time.time()
    }
