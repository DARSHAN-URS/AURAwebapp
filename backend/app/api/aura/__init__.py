"""
Aura Routes API Package
=======================
Combined router aggregating all Aura Routes endpoint modules.
Mounted under prefix /api/aura by the main application.
"""
from fastapi import APIRouter

# Import all Aura Routes sub-routers
from ..endpoints import router as eligibility_router
from ..payments import router as payments_router
from ..sop import router as sop_router
from ..visa_checker import router as visa_checker_router
from ..dashboard import router as dashboard_router
from ..chat import router as chat_router
from ..university_matcher import router as university_matcher_router
from ..mbbs_matcher import router as mbbs_matcher_router
from ..applications import router as applications_router
from ..visa_success import router as visa_success_router
from ..scholarships import router as scholarships_router
from ..journey import router as journey_router
from ..explorer import router as explorer_router
from ..knowledge import router as knowledge_router

# Aggregated Aura Routes router
aura_router = APIRouter(tags=["Aura Routes"])

aura_router.include_router(eligibility_router)
aura_router.include_router(payments_router)
aura_router.include_router(sop_router)
aura_router.include_router(visa_checker_router)
aura_router.include_router(dashboard_router)
aura_router.include_router(chat_router)
aura_router.include_router(university_matcher_router)
aura_router.include_router(mbbs_matcher_router)
aura_router.include_router(applications_router)
aura_router.include_router(visa_success_router)
aura_router.include_router(scholarships_router)
aura_router.include_router(journey_router)
aura_router.include_router(explorer_router)
aura_router.include_router(knowledge_router)
