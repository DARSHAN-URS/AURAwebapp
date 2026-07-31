from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import uuid

from ..database import get_db
from .nursepass_auth import get_current_user
from ..models_nursepass import (
    NursePassUserProfile,
    NursePassNotificationItem,
    NursePassNotificationPreference,
    NursePassAnnouncement,
    NursePassWhatsAppLog
)

router = APIRouter(prefix="/api/v1/nursepass/notifications", tags=["NursePass Notifications & Communication"])

# --- Request Schemas ---

class UpdatePreferencesPayload(BaseModel):
    study_reminders: bool = True
    mock_results: bool = True
    ai_evaluations: bool = True
    subscription_alerts: bool = True
    email_enabled: bool = True
    whatsapp_enabled: bool = True
    marketing_enabled: bool = False

class BroadcastAnnouncementPayload(BaseModel):
    title: str
    content: str
    category: str = "General Announcement"
    priority: str = "Normal"
    target_audience: str = "all"

# --- Seeder ---

def ensure_notifications_seeded(db: Session, user_id: str):
    """Seeds default notifications stream, channel preferences, and announcements if not present."""
    count = db.query(NursePassNotificationItem).filter(NursePassNotificationItem.user_id == user_id).count()
    if count == 0:
        sample_notifs = [
            {
                "category": "ai",
                "priority": "high",
                "title": "OET Speaking Virtual Examiner Evaluation Ready",
                "message": "Your OET Nursing Medication Counseling role-play performance has been evaluated. Overall Estimated Grade: Grade B (370/500).",
                "url": "/ai-features/speaking-coach",
                "action": "View Examiner Feedback",
                "read": False
            },
            {
                "category": "mock",
                "priority": "critical",
                "title": "NCLEX-RN Adaptive Full-Length Mock Test Recommendation",
                "message": "You are 14 days away from your peak readiness window. Complete 1 full-length simulation test to lock in your 89%+ pass probability.",
                "url": "/exams/nclex-rn/mock-setup",
                "action": "Start Mock Test",
                "read": False
            },
            {
                "category": "subscription",
                "priority": "normal",
                "title": "Premium Pro Subscription Active",
                "message": "Your Premium Pro annual subscription is active. Tax Invoice INV-NP-2026-001 is ready for PDF download.",
                "url": "/dashboard/subscription",
                "action": "View Invoice",
                "read": True
            },
            {
                "category": "achievement",
                "priority": "normal",
                "title": "Level 5 Specialist Badge Unlocked!",
                "message": "Congratulations! You earned 3,450 XP and unlocked the 500 Clinical Questions Solved Mastery Milestone.",
                "url": "/certificates",
                "action": "View Badges",
                "read": True
            }
        ]

        for n in sample_notifs:
            db.add(NursePassNotificationItem(
                user_id=user_id,
                category=n["category"],
                priority=n["priority"],
                title=n["title"],
                message=n["message"],
                action_url=n["url"],
                action_text=n["action"],
                is_read=n["read"]
            ))

    # Preferences
    pref = db.query(NursePassNotificationPreference).filter(NursePassNotificationPreference.user_id == user_id).first()
    if not pref:
        db.add(NursePassNotificationPreference(
            user_id=user_id,
            study_reminders=True,
            mock_results=True,
            ai_evaluations=True,
            subscription_alerts=True,
            email_enabled=True,
            whatsapp_enabled=True,
            marketing_enabled=False
        ))

    # Announcements
    ann_count = db.query(NursePassAnnouncement).count()
    if ann_count == 0:
        db.add(NursePassAnnouncement(
            title="NursePass Next Generation NCLEX-RN Adaptive Algorithm v4.2 Release",
            content="We have updated our NCLEX-RN CAT engine with 250+ new NGN Case Studies and Clinical Judgment Measurement Model (NCJMM) item types.",
            category="Platform Upgrade",
            priority="Important",
            target_audience="all"
        ))

    # WhatsApp logs
    wa_count = db.query(NursePassWhatsAppLog).filter(NursePassWhatsAppLog.user_id == user_id).count()
    if wa_count == 0:
        db.add(NursePassWhatsAppLog(
            user_id=user_id,
            phone_number="+1 (555) 234-8900",
            template_name="nursepass_daily_study_reminder",
            message="Hi Nurse Candidate, your daily NCLEX-RN study goal is 20 practice questions. Practice now to maintain your 14-day streak!",
            status="Sent"
        ))

    db.commit()

# --- Endpoints ---

@router.get("")
def get_notifications_stream(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches candidate notifications stream with priority ordering."""
    ensure_notifications_seeded(db, current_user.id)

    notifs = db.query(NursePassNotificationItem).filter(
        NursePassNotificationItem.user_id == current_user.id
    ).order_by(NursePassNotificationItem.created_at.desc()).all()

    unread_count = db.query(NursePassNotificationItem).filter(
        NursePassNotificationItem.user_id == current_user.id,
        NursePassNotificationItem.is_read == False
    ).count()

    return {
        "status": "success",
        "notifications": notifs,
        "unread_count": unread_count
    }

@router.post("/mark-read/{notification_id}")
def mark_notification_read(
    notification_id: int,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marks single notification as read."""
    notif = db.query(NursePassNotificationItem).filter(
        NursePassNotificationItem.id == notification_id,
        NursePassNotificationItem.user_id == current_user.id
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "success"}

@router.post("/mark-all-read")
def mark_all_notifications_read(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marks all candidate notifications as read."""
    db.query(NursePassNotificationItem).filter(
        NursePassNotificationItem.user_id == current_user.id
    ).update({"is_read": True})
    db.commit()
    return {"status": "success"}

@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Archives / deletes single notification item."""
    db.query(NursePassNotificationItem).filter(
        NursePassNotificationItem.id == notification_id,
        NursePassNotificationItem.user_id == current_user.id
    ).delete()
    db.commit()
    return {"status": "success"}

@router.get("/preferences")
def get_notification_preferences(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches candidate channel preferences (In-App, Email, WhatsApp)."""
    ensure_notifications_seeded(db, current_user.id)

    pref = db.query(NursePassNotificationPreference).filter(
        NursePassNotificationPreference.user_id == current_user.id
    ).first()

    return {"status": "success", "preferences": pref}

@router.post("/preferences")
def update_notification_preferences(
    req: UpdatePreferencesPayload,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates candidate channel delivery preferences."""
    pref = db.query(NursePassNotificationPreference).filter(
        NursePassNotificationPreference.user_id == current_user.id
    ).first()

    if not pref:
        pref = NursePassNotificationPreference(user_id=current_user.id)
        db.add(pref)

    pref.study_reminders = req.study_reminders
    pref.mock_results = req.mock_results
    pref.ai_evaluations = req.ai_evaluations
    pref.subscription_alerts = req.subscription_alerts
    pref.email_enabled = req.email_enabled
    pref.whatsapp_enabled = req.whatsapp_enabled
    pref.marketing_enabled = req.marketing_enabled

    db.commit()
    return {"status": "success", "preferences": pref}

@router.post("/broadcast")
def broadcast_announcement(
    req: BroadcastAnnouncementPayload,
    db: Session = Depends(get_db)
):
    """Admin endpoint to broadcast announcements across platform target audiences."""
    ann = NursePassAnnouncement(
        title=req.title,
        content=req.content,
        category=req.category,
        priority=req.priority,
        target_audience=req.target_audience
    )
    db.add(ann)
    db.commit()

    return {"status": "success", "announcement": ann}
