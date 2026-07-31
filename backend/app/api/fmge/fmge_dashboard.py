"""
FMGE AI — Student Dashboard & Learning Workspace API Router
============================================================
Provides dynamic endpoints for student welcome banner, exam countdown,
AI readiness score breakdown, daily study targets, clinical patient cases,
bookmarks, markdown notes, achievements, and subscription management.
"""
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import time

fmge_dashboard_router = APIRouter(prefix="/dashboard", tags=["FMGE AI Student Dashboard"])

# ── Schemas ─────────────────────────────────────────────────────────

class NoteCreateRequest(BaseModel):
    title: str
    content: str
    tags: List[str] = []
    subject: Optional[str] = "General Medicine"
    is_pinned: Optional[bool] = False

class BookmarkCreateRequest(BaseModel):
    item_id: str
    item_type: str = "question" # question, clinical_case, ai_note
    title: str
    subject: str

class ToggleTaskRequest(BaseModel):
    task_id: str
    completed: bool


# ── Overview Endpoint ───────────────────────────────────────────────

@fmge_dashboard_router.get("/overview")
async def get_dashboard_overview():
    """Returns complete overview data for the student dashboard."""
    return {
        "success": True,
        "student": {
            "name": "Dr. Rahul Sharma",
            "medical_college": "Kursk State Medical University",
            "country": "Russia",
            "target_exam": "FMGE Dec 2026",
            "days_until_exam": 142,
            "study_streak_days": 7,
            "daily_motivation": "“Wherever the art of Medicine is loved, there is also a love of Humanity.” — Hippocrates",
            "subscription_plan": "Pro Clinical Pass"
        },
        "readiness_score": {
            "overall_pct": 84.5,
            "subject_mastery_pct": 82.0,
            "clinical_reasoning_pct": 88.4,
            "time_management_pct": 81.2,
            "estimated_marks": "194 / 300",
            "cutoff_met": True,
            "trend": "+4.2% this week"
        },
        "daily_targets": [
            {"id": "t1", "title": "Pharmacology • Antimicrobial Drug Mechanisms", "subtitle": "50 MCQs + 20 High-Yield Flashcards", "estimated_mins": 45, "completed": True},
            {"id": "t2", "title": "PSM • Vaccine Schedule & Biostatistics", "subtitle": "30 MCQs + Formula Review", "estimated_mins": 30, "completed": False},
            {"id": "t3", "title": "Radiology IBQ • X-Ray Sign Interpretations", "subtitle": "15 High-Resolution Case Slides", "estimated_mins": 25, "completed": False}
        ],
        "overall_progress": {
            "questions_solved": 3420,
            "total_qbank": 15000,
            "mock_tests_completed": 6,
            "total_mocks": 20,
            "subjects_completed": 12,
            "total_subjects": 19,
            "course_completion_pct": 68.4
        },
        "recent_activities": [
            {"id": "a1", "title": "Completed NBE Grand Test #5", "meta": "Scored 188/300 (Pass)", "time": "2 hours ago", "type": "mock"},
            {"id": "a2", "title": "Solved 50 Pharmacology MCQs", "meta": "Accuracy 84%", "time": "Yesterday", "type": "qbank"},
            {"id": "a3", "title": "AI Clinical Tutor Session", "meta": "Asked about NPH Triad & ECG Signs", "time": "2 days ago", "type": "ai"}
        ],
        "ai_recommendations": [
            {"id": "r1", "title": "Revise Autonomic Pharmacology", "reason": "Accuracy dropped below 70% in recent Grand Test #5", "action_url": "/qbank?subject=pharmacology"},
            {"id": "r2", "title": "Take 60-Q Mini Mock Test", "reason": "Improve time management speed by 5 seconds per MCQ", "action_url": "/mocks"}
        ]
    }


# ── Clinical Cases Endpoint ─────────────────────────────────────────

@fmge_dashboard_router.get("/clinical-cases")
async def get_clinical_cases():
    """Returns interactive patient case scenarios for clinical reasoning."""
    cases = [
        {
            "id": "c101",
            "title": "Case 101: 45M with Acute Retrosternal Chest Pain",
            "subject": "General Medicine",
            "vitals": "BP: 150/90 mmHg, HR: 98 bpm, SpO2: 96% on room air",
            "patient_vignette": "A 45-year-old male presents to the ER with 2-hour duration retrosternal crushing pain radiating to the left jaw and arm. ECG shows ST elevations in leads II, III, and aVF.",
            "diagnostic_options": [
                "Left Anterior Descending (LAD) Occlusion",
                "Right Coronary Artery (RCA) Inferior MI",
                "Left Circumflex (LCx) Lateral MI",
                "Acute Pericarditis"
            ],
            "correct_option": 1,
            "ai_explanation": "ST elevations in II, III, aVF represent an Inferior Wall Myocardial Infarction (IWMI), which is supplied by the Right Coronary Artery (RCA) in >85% of patients."
        },
        {
            "id": "c102",
            "title": "Case 102: 28F Primigravida at 34 Weeks with Severe Headache",
            "subject": "Obstetrics & Gynecology",
            "vitals": "BP: 165/110 mmHg, Urine Protein: 3+",
            "patient_vignette": "A 28-year-old primigravida presents at 34 weeks gestation with severe frontal headache and epigastric discomfort. Lab shows elevated ALT/AST and low platelets (65,000/mcL).",
            "diagnostic_options": [
                "Gestational Hypertension",
                "HELLP Syndrome in Severe Pre-eclampsia",
                "Acute Fatty Liver of Pregnancy",
                "Thrombotic Thrombocytopenic Purpura"
            ],
            "correct_option": 1,
            "ai_explanation": "HELLP syndrome is characterized by Hemolysis, Elevated Liver enzymes, and Low Platelets in severe pre-eclampsia. MgSO4 prophylaxis is indicated."
        }
    ]
    return {"success": True, "total_cases": len(cases), "cases": cases}


# ── Bookmarks Endpoint ──────────────────────────────────────────────

@fmge_dashboard_router.get("/bookmarks")
async def get_bookmarks():
    """Returns saved MCQs, cases, and notes."""
    bookmarks = [
        {"id": "b1", "item_id": "q104", "type": "question", "title": "Pharmacology • Digoxin Toxicity ECG Sign", "subject": "Pharmacology", "created_at": "2 days ago"},
        {"id": "b2", "item_id": "c101", "type": "clinical_case", "title": "Inferior Wall MI & RCA Occlusion Vignette", "subject": "General Medicine", "created_at": "3 days ago"},
        {"id": "b3", "item_id": "n12", "type": "note", "title": "High Yield Triads in Neurology & Psychiatry", "subject": "Neurology", "created_at": "5 days ago"}
    ]
    return {"success": True, "bookmarks": bookmarks}


@fmge_dashboard_router.post("/bookmarks")
async def create_bookmark(request: BookmarkCreateRequest):
    """Creates a new bookmark."""
    return {"success": True, "message": "Item bookmarked successfully."}


# ── Personal Notes Endpoint ─────────────────────────────────────────

@fmge_dashboard_router.get("/notes")
async def get_notes():
    """Returns student personal medical notes."""
    notes = [
        {
            "id": "n1",
            "title": "High Yield Triads in Internal Medicine",
            "content": "• Normal Pressure Hydrocephalus: Wet, Wacky, Wobbly\n• Charcot Triad (Ascending Cholangitis): Fever, RUQ Pain, Jaundice\n• Cushing Triad (Increased ICP): Hypertension, Bradycardia, Irregular Breathing",
            "tags": ["Triads", "Medicine", "PYQ"],
            "subject": "General Medicine",
            "is_pinned": True,
            "updated_at": "2026-07-28"
        },
        {
            "id": "n2",
            "title": "Pharmacology Antidotes Cheat Sheet",
            "content": "• Paracetamol → N-Acetylcysteine (NAC)\n• Opioids → Naloxone\n• Heparin → Protamine Sulfate\n• Warfarin → Vitamin K1 + FFP\n• Organophosphates → Atropine + Pralidoxime (2-PAM)",
            "tags": ["Pharmacology", "Antidotes", "Must Know"],
            "subject": "Pharmacology",
            "is_pinned": False,
            "updated_at": "2026-07-25"
        }
    ]
    return {"success": True, "notes": notes}


@fmge_dashboard_router.post("/notes")
async def create_note(request: NoteCreateRequest):
    """Creates a new markdown note."""
    return {"success": True, "message": "Medical note saved successfully.", "note_id": f"n-{int(time.time())}"}


# ── Achievements Endpoint ───────────────────────────────────────────

@fmge_dashboard_router.get("/achievements")
async def get_achievements():
    """Returns gamified learning badges & certificates."""
    achievements = [
        {"id": "a1", "name": "First NBE Mock", "description": "Completed your first 300-Q NBE Grand Test", "icon": "Award", "unlocked": True, "unlocked_at": "2026-07-10"},
        {"id": "a2", "name": "1,000 Questions Solved", "description": "Crossed 1,000 practice MCQs in QBank", "icon": "CheckCircle", "unlocked": True, "unlocked_at": "2026-07-18"},
        {"id": "a3", "name": "7-Day Study Streak", "description": "Studied continuously for 7 days without missing a target", "icon": "Zap", "unlocked": True, "unlocked_at": "2026-07-28"},
        {"id": "a4", "name": "NBE Top Performer (90%+)", "description": "Scored over 90% accuracy in a full Grand Test", "icon": "Trophy", "unlocked": False, "unlocked_at": None}
    ]
    return {"success": True, "achievements": achievements}


# ── Subscription Endpoint ───────────────────────────────────────────

@fmge_dashboard_router.get("/subscription")
async def get_subscription():
    """Returns active subscription plan, usage limits, and payment history."""
    return {
        "success": True,
        "subscription": {
            "plan_name": "Pro Clinical Pass",
            "status": "Active",
            "valid_until": "2027-07-31",
            "billing_cycle": "Annual (₹4,999)",
            "usage": {
                "qbank_access": "Unlimited",
                "mock_tests": "Unlimited",
                "ai_tutor_queries": "Unlimited",
                "flashcards": "5,000+ Unlocked"
            },
            "invoices": [
                {"id": "INV-FMGE-902", "date": "2026-07-01", "amount": "₹4,999", "status": "Paid", "pdf_url": "#"}
            ]
        }
    }
