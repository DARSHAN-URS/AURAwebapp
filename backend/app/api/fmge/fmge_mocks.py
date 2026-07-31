"""
FMGE AI — AI Mock Test Engine & Exam Simulation API Router
===========================================================
Provides dynamic endpoints for NBE 300-Q CBT exam simulation, custom test building,
adaptive AI test generation, background auto-saving, test submission evaluation,
AI mistake categorization (Knowledge Gap, Concept Confusion, Time Pressure),
pass prediction, test history, and leaderboards.
"""
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import time

fmge_mocks_router = APIRouter(prefix="/mock-tests", tags=["FMGE AI Mock Test Engine"])

# ── Schemas ─────────────────────────────────────────────────────────

class CustomTestCreateRequest(BaseModel):
    user_id: str
    title: str = "Custom Practice Test"
    subjects: List[str] = ["General Medicine", "Pharmacology"]
    question_count: int = 30
    time_limit_mins: int = 30
    difficulty: str = "AI Adaptive"
    include_ibq: bool = True
    adaptive_mode: bool = True

class AutoSaveAnswerRequest(BaseModel):
    user_id: str
    test_id: str
    answers: Dict[str, int] # question_id -> selected_option
    time_remaining_seconds: int

class TestSubmitRequest(BaseModel):
    user_id: str
    test_id: str
    answers: Dict[str, int]
    time_taken_seconds: int


# ── Templates List Endpoint ─────────────────────────────────────────

@fmge_mocks_router.get("/list")
async def get_mock_test_templates():
    """Returns available Grand Tests, Subject Tests, and Daily Challenges."""
    templates = [
        {
            "id": "gt-01",
            "title": "NBE FMGE Official Grand Test #1",
            "type": "Full Simulation",
            "total_questions": 300,
            "duration_mins": 300,
            "parts": [
                {"name": "Part A (Morning Session)", "questions": 150, "duration": 150},
                {"name": "Part B (Afternoon Session)", "questions": 150, "duration": 150}
            ],
            "difficulty": "NBE Standard",
            "attempts_count": 8940,
            "average_score": "178 / 300",
            "pass_cutoff": 150
        },
        {
            "id": "gt-02",
            "title": "NBE FMGE Official Grand Test #2",
            "type": "Full Simulation",
            "total_questions": 300,
            "duration_mins": 300,
            "parts": [
                {"name": "Part A (Morning Session)", "questions": 150, "duration": 150},
                {"name": "Part B (Afternoon Session)", "questions": 150, "duration": 150}
            ],
            "difficulty": "High Yield",
            "attempts_count": 6420,
            "average_score": "184 / 300",
            "pass_cutoff": 150
        },
        {
            "id": "daily-challenge",
            "title": "Today's Daily 20-Q Challenge",
            "type": "Daily Challenge",
            "total_questions": 20,
            "duration_mins": 20,
            "parts": [{"name": "Single Session", "questions": 20, "duration": 20}],
            "difficulty": "Adaptive",
            "attempts_count": 1420,
            "average_score": "15 / 20",
            "pass_cutoff": 10
        }
    ]
    return {"success": True, "templates": templates}


# ── Create Test Session ─────────────────────────────────────────────

@fmge_mocks_router.post("/create")
async def create_custom_test(request: CustomTestCreateRequest):
    """Creates a custom or adaptive AI test session."""
    test_id = f"test-{int(time.time())}"
    return {
        "success": True,
        "message": "Custom test session created successfully.",
        "test_id": test_id,
        "title": request.title,
        "total_questions": request.question_count,
        "duration_mins": request.time_limit_mins,
        "redirect_url": f"/mocks/simulation?test_id={test_id}"
    }


# ── Load Test Questions Stream ──────────────────────────────────────

@fmge_mocks_router.get("/{id}/questions")
async def get_test_questions(id: str):
    """Returns questions stream for an active test session."""
    questions = [
        {
            "id": 101,
            "part": "Part A",
            "subject": "General Medicine",
            "topic": "Cardiology",
            "question_stem": "A 45-year-old male presents with sudden onset retrosternal crushing pain radiating to left jaw. ECG shows ST elevation in II, III, aVF. What coronary artery is acutely occluded?",
            "options": [
                {"id": 0, "text": "Left Anterior Descending Artery (LAD)"},
                {"id": 1, "text": "Right Coronary Artery (RCA)"},
                {"id": 2, "text": "Left Circumflex Artery (LCx)"},
                {"id": 3, "text": "Left Main Coronary Artery (LMCA)"}
            ],
            "is_ibq": False,
            "image_url": None
        },
        {
            "id": 102,
            "part": "Part A",
            "subject": "Pharmacology",
            "topic": "Antimicrobial Chemotherapy",
            "question_stem": "Which of the following anti-hypertensive drugs is contraindicated in pregnant women due to fetal renal dysgenesis?",
            "options": [
                {"id": 0, "text": "Labetalol"},
                {"id": 1, "text": "Methyldopa"},
                {"id": 2, "text": "Enalapril (ACE Inhibitor)"},
                {"id": 3, "text": "Nifedipine"}
            ],
            "is_ibq": False,
            "image_url": None
        },
        {
            "id": 103,
            "part": "Part B",
            "subject": "Obstetrics & Gynecology",
            "topic": "Pre-eclampsia & Eclampsia",
            "question_stem": "A 28-year-old primigravida at 34 weeks presents with BP 165/110 mmHg, 3+ proteinuria, and severe headache. What is the drug of choice for seizure prophylaxis?",
            "options": [
                {"id": 0, "text": "Phenytoin"},
                {"id": 1, "text": "Magnesium Sulfate (MgSO4)"},
                {"id": 2, "text": "Diazepam"},
                {"id": 3, "text": "Sodium Nitroprusside"}
            ],
            "is_ibq": False,
            "image_url": None
        }
    ]
    return {"success": True, "test_id": id, "total_questions": len(questions), "questions": questions}


# ── Auto Save & Submission Endpoints ─────────────────────────────────

@fmge_mocks_router.post("/{id}/auto-save")
async def auto_save_test(id: str, request: AutoSaveAnswerRequest):
    """Background auto-save endpoint triggered every 30 seconds."""
    return {"success": True, "saved_at": int(time.time()), "answers_count": len(request.answers)}


@fmge_mocks_router.post("/{id}/submit")
async def submit_mock_test(id: str, request: TestSubmitRequest):
    """Submits test, evaluates marks, classifies mistakes, and calculates pass prediction."""
    answers = request.answers
    # Sample evaluation calculation
    correct_count = 0
    for q_id, opt in answers.items():
        if opt in [1, 2]: # Sample correct matching
            correct_count += 1

    total_qs = max(len(answers), 3)
    calculated_score = int((correct_count / total_qs) * 300)
    passed = calculated_score >= 150

    return {
        "success": True,
        "test_id": id,
        "results_summary": {
            "total_questions": 300,
            "attempted_questions": len(answers),
            "correct_questions": correct_count,
            "calculated_score": f"{calculated_score} / 300",
            "pass_cutoff_met": passed,
            "pass_status": "PASSED" if passed else "FAILED",
            "percentile": "88.4th Percentile",
            "estimated_pass_probability": "89.4%" if passed else "42.0%",
            "time_taken_mins": round(request.time_taken_seconds / 60, 1),
            "ai_mistake_categorization": {
                "knowledge_gap": "45%",
                "concept_confusion": "30%",
                "carelessness": "15%",
                "time_pressure": "10%"
            }
        }
    }


# ── Detailed Result Report & Review Endpoint ─────────────────────────

@fmge_mocks_router.get("/{id}/result")
async def get_test_result_report(id: str):
    """Returns detailed performance report, score breakdown, and review mode."""
    return {
        "success": True,
        "test_id": id,
        "test_title": "NBE FMGE Official Grand Test #1",
        "score_card": {
            "score": "188 / 300",
            "cutoff": 150,
            "passed": True,
            "percentile": "88.4th",
            "accuracy": "76.5%",
            "speed_per_q_seconds": "48s",
            "ai_pass_prediction": "89.4%"
        },
        "subject_breakdown": [
            {"subject": "General Medicine", "total": 33, "correct": 27, "accuracy": "81.8%"},
            {"subject": "General Surgery", "total": 32, "correct": 25, "accuracy": "78.1%"},
            {"subject": "OBG", "total": 30, "correct": 26, "accuracy": "86.6%"},
            {"subject": "Pharmacology", "total": 13, "correct": 8, "accuracy": "61.5%"}
        ],
        "ai_recommendation": "Priority Revision Required: Focus on Autonomic Pharmacology & Antimicrobial drug mechanisms before attempting Grand Test #2."
    }


# ── Test History Endpoint ───────────────────────────────────────────

@fmge_mocks_router.get("/history")
async def get_test_history(user_id: str = "demo-user-123"):
    """Returns past test attempt history catalog."""
    history = [
        {
            "test_id": "test-901",
            "title": "NBE FMGE Official Grand Test #1",
            "date": "2026-07-28",
            "score": "188 / 300",
            "pass_status": "PASSED",
            "percentile": "88.4th",
            "duration_mins": 264
        },
        {
            "test_id": "test-902",
            "title": "Pharmacology & Pathology Mini Mock",
            "date": "2026-07-20",
            "score": "42 / 60",
            "pass_status": "PASSED",
            "percentile": "84.0th",
            "duration_mins": 48
        }
    ]
    return {"success": True, "history": history}


# ── Leaderboard Endpoint ────────────────────────────────────────────

@fmge_mocks_router.get("/leaderboard")
async def get_leaderboard():
    """Returns daily, weekly, and institution rank cards."""
    leaderboard = [
        {"rank": 1, "name": "Dr. Ananya Patel", "college": "Tbilisi State Med Univ, Georgia", "score": "242 / 300", "percentile": "99.9th"},
        {"rank": 2, "name": "Dr. Mohammed Nizam", "college": "Davao Med School, Philippines", "score": "238 / 300", "percentile": "99.7th"},
        {"rank": 3, "name": "Dr. Rahul Sharma", "college": "Kursk State Med Univ, Russia", "score": "234 / 300", "percentile": "99.4th"},
        {"rank": 4, "name": "Dr. Sneha Verma", "college": "Samarkand State Med Univ, Uzbekistan", "score": "228 / 300", "percentile": "98.9th"},
    ]
    return {"success": True, "period": "July 2026", "leaderboard": leaderboard}
