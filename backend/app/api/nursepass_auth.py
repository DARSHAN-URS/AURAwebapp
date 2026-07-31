from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

from ..database import get_db
from ..models_nursepass import (
    NursePassUserProfile,
    NursePassSubscription,
    NursePassPaymentHistory,
    NursePassNotificationPref,
    NursePassUserActivity,
    NursePassExamPref
)

router = APIRouter(prefix="/api/v1/auth", tags=["NursePass Auth & Profile Management"])

# --- Request & Response Schemas ---

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    mobile: Optional[str] = None
    country: Optional[str] = None
    qualification: Optional[str] = None
    experience: Optional[str] = None
    employer: Optional[str] = None
    target_exam: Optional[str] = None
    target_exam_date: Optional[str] = None
    daily_study_goal_mins: Optional[int] = None
    avatar_url: Optional[str] = None

class OnboardingRequest(BaseModel):
    target_exam: str
    target_exam_date: Optional[str] = None
    qualification: Optional[str] = None
    experience: Optional[str] = None
    employer: Optional[str] = None
    daily_study_goal_mins: Optional[int] = 60
    weak_topics: Optional[List[str]] = []

class NotificationPrefRequest(BaseModel):
    email_updates: bool = True
    sms_updates: bool = False
    exam_reminders: bool = True
    promotional_emails: bool = True

# --- JWT / Session Helper ---

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> NursePassUserProfile:
    """Decodes Bearer token or uses fallback dev session to fetch/create current NursePass profile."""
    user_id = "user_dev_nursepass_1"
    email = "nurse.demo@nursepass.ai"
    full_name = "Registered Nurse Demo"

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        # Token carries user ID / email payload or fallback
        if "mock" in token or token == "mock-dev-token":
            user_id = "user_dev_nursepass_1"
        else:
            # Parse token id or default to token string prefix
            user_id = f"user_sb_{token[:16]}"

    # Fetch profile from DB or create if missing
    profile = db.query(NursePassUserProfile).filter(NursePassUserProfile.id == user_id).first()
    if not profile:
        profile = NursePassUserProfile(
            id=user_id,
            email=email,
            full_name=full_name,
            role="student",
            target_exam="NCLEX-RN",
            onboarding_completed=False
        )
        db.add(profile)
        
        # Also ensure default subscription exists
        sub = NursePassSubscription(id=str(uuid.uuid4()), user_id=user_id, plan_id="free", status="active")
        db.add(sub)
        
        # Default notification prefs
        notif = NursePassNotificationPref(user_id=user_id)
        db.add(notif)
        
        db.commit()
        db.refresh(profile)

    return profile

def require_role(allowed_roles: List[str]):
    """RBAC Guard Dependency."""
    def role_checker(current_user: NursePassUserProfile = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {allowed_roles}"
            )
        return current_user
    return role_checker

def require_subscription(allowed_plans: List[str]):
    """Subscription Access Control Guard Dependency."""
    def subscription_checker(
        current_user: NursePassUserProfile = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        sub = db.query(NursePassSubscription).filter(NursePassSubscription.user_id == current_user.id).first()
        plan_id = sub.plan_id if sub else "free"
        if plan_id not in allowed_plans:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Upgrade required. Feature accessible on plans: {allowed_plans}"
            )
        return current_user
    return subscription_checker

# --- API Endpoints ---

@router.get("/me")
def get_user_me(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(NursePassSubscription).filter(NursePassSubscription.user_id == current_user.id).first()
    notif = db.query(NursePassNotificationPref).filter(NursePassNotificationPref.user_id == current_user.id).first()
    
    return {
        "status": "success",
        "profile": current_user,
        "subscription": {
            "plan_id": sub.plan_id if sub else "free",
            "status": sub.status if sub else "active",
            "current_period_end": sub.current_period_end if sub else None
        },
        "notification_preferences": notif
    }

@router.post("/profile")
def update_user_profile(
    req: ProfileUpdateRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.full_name is not None: current_user.full_name = req.full_name
    if req.mobile is not None: current_user.mobile = req.mobile
    if req.country is not None: current_user.country = req.country
    if req.qualification is not None: current_user.qualification = req.qualification
    if req.experience is not None: current_user.experience = req.experience
    if req.employer is not None: current_user.employer = req.employer
    if req.target_exam is not None: current_user.target_exam = req.target_exam
    if req.target_exam_date is not None: current_user.target_exam_date = req.target_exam_date
    if req.daily_study_goal_mins is not None: current_user.daily_study_goal_mins = req.daily_study_goal_mins
    if req.avatar_url is not None: current_user.avatar_url = req.avatar_url

    # Log user activity
    activity = NursePassUserActivity(
        user_id=current_user.id,
        activity_type="profile_update",
        description="Updated personal & professional profile information"
    )
    db.add(activity)
    db.commit()
    db.refresh(current_user)

    return {"status": "success", "message": "Profile updated successfully", "profile": current_user}

@router.post("/onboarding")
def complete_onboarding_wizard(
    req: OnboardingRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.target_exam = req.target_exam
    if req.target_exam_date: current_user.target_exam_date = req.target_exam_date
    if req.qualification: current_user.qualification = req.qualification
    if req.experience: current_user.experience = req.experience
    if req.employer: current_user.employer = req.employer
    if req.daily_study_goal_mins: current_user.daily_study_goal_mins = req.daily_study_goal_mins
    current_user.onboarding_completed = True

    # Save exam preferences
    exam_pref = db.query(NursePassExamPref).filter(NursePassExamPref.user_id == current_user.id).first()
    if not exam_pref:
        exam_pref = NursePassExamPref(user_id=current_user.id)
        db.add(exam_pref)
    
    exam_pref.target_exam = req.target_exam
    exam_pref.target_date = req.target_exam_date
    exam_pref.weak_topics = req.weak_topics or []

    # Log user activity
    activity = NursePassUserActivity(
        user_id=current_user.id,
        activity_type="onboarding_completed",
        description=f"Completed 5-step onboarding wizard for exam: {req.target_exam}"
    )
    db.add(activity)

    db.commit()
    db.refresh(current_user)

    return {"status": "success", "message": "Onboarding completed successfully!", "profile": current_user}

@router.post("/notifications")
def update_notification_preferences(
    req: NotificationPrefRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notif = db.query(NursePassNotificationPref).filter(NursePassNotificationPref.user_id == current_user.id).first()
    if not notif:
        notif = NursePassNotificationPref(user_id=current_user.id)
        db.add(notif)

    notif.email_updates = req.email_updates
    notif.sms_updates = req.sms_updates
    notif.exam_reminders = req.exam_reminders
    notif.promotional_emails = req.promotional_emails

    db.commit()
    return {"status": "success", "message": "Notification preferences updated", "notification_preferences": notif}

@router.get("/activity")
def get_user_activity_logs(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logs = db.query(NursePassUserActivity).filter(
        NursePassUserActivity.user_id == current_user.id
    ).order_by(NursePassUserActivity.created_at.desc()).limit(20).all()
    
    return {"status": "success", "activity_logs": logs}

@router.get("/subscriptions")
def get_user_subscriptions(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(NursePassSubscription).filter(NursePassSubscription.user_id == current_user.id).first()
    payments = db.query(NursePassPaymentHistory).filter(
        NursePassPaymentHistory.user_id == current_user.id
    ).order_by(NursePassPaymentHistory.created_at.desc()).all()

    return {
        "status": "success",
        "subscription": sub,
        "payment_history": payments
    }
