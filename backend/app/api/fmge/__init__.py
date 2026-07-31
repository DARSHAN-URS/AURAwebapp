"""
FMGE AI API Package
====================
Master router for FMGE AI (Foreign Medical Graduate Examination) product.
Mounted under prefix /api/fmge by the main application.
"""
from fastapi import APIRouter
import time
from .fmge_landing import fmge_landing_router
from .fmge_auth import fmge_auth_router
from .fmge_dashboard import fmge_dashboard_router
from .fmge_qbank import fmge_qbank_router
from .fmge_mocks import fmge_mocks_router
from .fmge_planner import fmge_planner_router
from .fmge_cases import fmge_cases_router
from .fmge_tutor import fmge_tutor_router
from .fmge_images import fmge_images_router
from .fmge_analytics import fmge_analytics_router
from .fmge_achievements import fmge_achievements_router
from .fmge_payments import fmge_payments_router
from .fmge_notifications import fmge_notifications_router
from .fmge_institutions import fmge_institutions_router
from .fmge_admin import fmge_admin_router

fmge_router = APIRouter(tags=["FMGE AI"])

# Include sub-routers
fmge_router.include_router(fmge_landing_router)
fmge_router.include_router(fmge_auth_router)
fmge_router.include_router(fmge_dashboard_router)
fmge_router.include_router(fmge_qbank_router)
fmge_router.include_router(fmge_mocks_router)
fmge_router.include_router(fmge_planner_router)
fmge_router.include_router(fmge_cases_router)
fmge_router.include_router(fmge_tutor_router)
fmge_router.include_router(fmge_images_router)
fmge_router.include_router(fmge_analytics_router)
fmge_router.include_router(fmge_achievements_router)
fmge_router.include_router(fmge_payments_router)
fmge_router.include_router(fmge_notifications_router)
fmge_router.include_router(fmge_institutions_router)
fmge_router.include_router(fmge_admin_router)

@fmge_router.get("/status", tags=["FMGE AI"])
async def fmge_status():
    """FMGE AI product status endpoint."""
    return {
        "product": "fmge-ai",
        "status": "operational",
        "message": "FMGE AI — Foreign Medical Graduate Examination & NEXT Prep Engine is live.",
        "modules": [
            "Landing & Marketing API",
            "19 Subjects QBank Engine",
            "300-Q NBE CBT Test Simulator",
            "FMGE AI Clinical Tutor",
            "AI Study Planner",
            "Weak Area Performance Analytics"
        ],
        "timestamp": time.time()
    }

