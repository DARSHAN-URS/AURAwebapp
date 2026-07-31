from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta

from ..database import get_db
from .nursepass_auth import get_current_user
from ..models_nursepass import (
    NursePassUserProfile,
    NursePassAnalyticsSummary,
    NursePassSubjectAnalytics,
    NursePassTopicAnalytics,
    NursePassPerformanceForecast
)

router = APIRouter(prefix="/api/v1/nursepass/analytics", tags=["NursePass Performance Analytics"])

# --- Request Schemas ---

class ExportReportRequest(BaseModel):
    format: str = "pdf" # pdf, csv
    include_subjects: bool = True
    include_topics: bool = True

# --- Seeder ---

def ensure_analytics_seeded(db: Session, user_id: str):
    """Seeds default student analytics summary, subject metrics, and AI forecast if not present."""
    summary = db.query(NursePassAnalyticsSummary).filter(NursePassAnalyticsSummary.user_id == user_id).first()
    if not summary:
        summary = NursePassAnalyticsSummary(
            user_id=user_id,
            overall_accuracy_pct=84.5,
            questions_solved=640,
            mock_tests_completed=8,
            study_hours_total=42.5,
            study_streak_days=14,
            pass_probability_pct=89.2,
            ai_readiness_score=88.5
        )
        db.add(summary)

    # Subject Analytics
    sub_count = db.query(NursePassSubjectAnalytics).filter(NursePassSubjectAnalytics.user_id == user_id).count()
    if sub_count == 0:
        sample_subs = [
            {"name": "Pharmacology & Parenteral Therapy", "acc": 88.5, "qs": 180, "time": 42, "comp": 85.0, "conf": 90.0},
            {"name": "Medical-Surgical Nursing", "acc": 84.0, "qs": 210, "time": 48, "comp": 80.0, "conf": 86.0},
            {"name": "Maternal & Child Health", "acc": 79.5, "qs": 110, "time": 50, "comp": 70.0, "conf": 78.0},
            {"name": "Pediatric Nursing", "acc": 86.0, "qs": 95, "time": 40, "comp": 78.0, "conf": 88.0},
            {"name": "Psychiatric & Mental Health", "acc": 76.0, "qs": 85, "time": 55, "comp": 65.0, "conf": 72.0}
        ]
        for s in sample_subs:
            db.add(NursePassSubjectAnalytics(
                user_id=user_id,
                subject_name=s["name"],
                accuracy_pct=s["acc"],
                questions_attempted=s["qs"],
                avg_time_secs=s["time"],
                completion_pct=s["comp"],
                confidence_score=s["conf"]
            ))

    # Topic Analytics
    top_count = db.query(NursePassTopicAnalytics).filter(NursePassTopicAnalytics.user_id == user_id).count()
    if top_count == 0:
        sample_topics = [
            {"subject": "Pharmacology", "topic": "Cardiac Glycosides & Digoxin Toxicity", "strong": True, "incorrect": False, "mastery": 92.0},
            {"subject": "Pharmacology", "topic": "Anticoagulants & Heparin Protocols", "strong": True, "incorrect": False, "mastery": 88.0},
            {"subject": "Medical-Surgical", "topic": "Endocrine DKA vs HHS Emergencies", "strong": False, "incorrect": True, "mastery": 68.0},
            {"subject": "Maternal & Child", "topic": "Antepartum Complications & Placental Abruption", "strong": False, "incorrect": True, "mastery": 62.0},
            {"subject": "Pediatrics", "topic": "Tetralogy of Fallot & TET Spells", "strong": True, "incorrect": False, "mastery": 90.0}
        ]
        for t in sample_topics:
            db.add(NursePassTopicAnalytics(
                user_id=user_id,
                subject_name=t["subject"],
                topic_name=t["topic"],
                is_strong=t["strong"],
                frequently_incorrect=t["incorrect"],
                mastery_pct=t["mastery"]
            ))

    # Forecast
    forecast = db.query(NursePassPerformanceForecast).filter(NursePassPerformanceForecast.user_id == user_id).first()
    if not forecast:
        db.add(NursePassPerformanceForecast(
            user_id=user_id,
            target_exam="nclex-rn",
            predicted_score="Passing Standard (Top 12%)",
            pass_probability_pct=89.2,
            readiness_date=(datetime.utcnow() + timedelta(days=45)).strftime("%Y-%m-%d")
        ))

    db.commit()

# --- Endpoints ---

@router.get("/overview")
def get_analytics_overview(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches executive student analytics summary, pass probability, and AI readiness metrics."""
    ensure_analytics_seeded(db, current_user.id)

    summary = db.query(NursePassAnalyticsSummary).filter(NursePassAnalyticsSummary.user_id == current_user.id).first()
    forecast = db.query(NursePassPerformanceForecast).filter(NursePassPerformanceForecast.user_id == current_user.id).first()

    return {
        "status": "success",
        "summary": summary,
        "forecast": forecast
    }

@router.get("/subjects")
def get_subject_analytics(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches accuracy and performance breakdown across all nursing subjects."""
    ensure_analytics_seeded(db, current_user.id)

    subjects = db.query(NursePassSubjectAnalytics).filter(
        NursePassSubjectAnalytics.user_id == current_user.id
    ).all()

    return {"status": "success", "subjects": subjects}

@router.get("/topics")
def get_topic_analytics(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches strong vs weak topics and frequently missed clinical concepts."""
    ensure_analytics_seeded(db, current_user.id)

    topics = db.query(NursePassTopicAnalytics).filter(
        NursePassTopicAnalytics.user_id == current_user.id
    ).all()

    strong_topics = [t for t in topics if t.is_strong]
    weak_topics = [t for t in topics if t.frequently_incorrect or not t.is_strong]

    return {
        "status": "success",
        "all_topics": topics,
        "strong_topics": strong_topics,
        "weak_topics": weak_topics
    }

@router.get("/forecast")
def get_performance_forecast(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches AI predictive exam score forecast and target readiness completion date."""
    ensure_analytics_seeded(db, current_user.id)

    forecast = db.query(NursePassPerformanceForecast).filter(
        NursePassPerformanceForecast.user_id == current_user.id
    ).first()

    return {"status": "success", "forecast": forecast}

@router.post("/export")
def export_performance_report(
    req: ExportReportRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generates downloadable PDF / CSV performance summary report payload."""
    ensure_analytics_seeded(db, current_user.id)

    summary = db.query(NursePassAnalyticsSummary).filter(NursePassAnalyticsSummary.user_id == current_user.id).first()
    subjects = db.query(NursePassSubjectAnalytics).filter(NursePassSubjectAnalytics.user_id == current_user.id).all()

    report_content = f"""NURSEPASS AI PERFORMANCE REPORT
Candidate: {current_user.full_name or 'Nurse Candidate'}
Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}
AI Readiness Score: {summary.ai_readiness_score}%
Pass Probability: {summary.pass_probability_pct}%
Questions Solved: {summary.questions_solved}
Mock Tests Completed: {summary.mock_tests_completed}
Study Streak: {summary.study_streak_days} Days

SUBJECT DIAGNOSTICS:
"""
    for s in subjects:
        report_content += f"- {s.subject_name}: {s.accuracy_pct}% Accuracy ({s.questions_attempted} Qs)\n"

    return {
        "status": "success",
        "format": req.format,
        "report_title": f"NursePass_Performance_Report_{current_user.id}.{req.format}",
        "report_content": report_content
    }
