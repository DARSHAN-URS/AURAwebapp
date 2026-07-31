from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

from ..database import get_db
from .nursepass_auth import get_current_user
from ..models_nursepass import (
    NursePassUserProfile,
    NursePassCertificate,
    NursePassBadge,
    NursePassAchievement
)

router = APIRouter(prefix="/api/v1/nursepass/certificates", tags=["NursePass Digital Certificates & Verification"])

# --- Request Schemas ---

class GenerateCertRequest(BaseModel):
    cert_type: str # course_completion, mock_excellence, study_milestone, oet_writing, oet_speaking
    title: str
    description: str

# --- Seeder ---

def ensure_certificates_seeded(db: Session, user_id: str, recipient_name: str):
    """Seeds default earned certificates, badges, and achievements for a candidate."""
    cert_count = db.query(NursePassCertificate).filter(NursePassCertificate.user_id == user_id).count()
    if cert_count == 0:
        sample_certs = [
            {
                "uuid": "CERT-NP-2026-8942",
                "type": "mock_excellence",
                "title": "NCLEX-RN Full-Length Mock Test Excellence Certificate",
                "desc": "Awarded for scoring in the 92nd percentile on the NCLEX-RN Adaptive Full Simulation Examination.",
                "authority": "NursePass International Nursing Examination Board"
            },
            {
                "uuid": "CERT-NP-2026-3105",
                "type": "oet_writing",
                "title": "OET Nursing Clinical Writing Master Certificate",
                "desc": "Awarded for completing 15 official OET Referral & Discharge writing tasks with an estimated Grade A.",
                "authority": "NursePass OET Language Assessment Authority"
            },
            {
                "uuid": "CERT-NP-2026-5521",
                "type": "study_milestone",
                "title": "500 Clinical Questions Solved Mastery Milestone",
                "desc": "Recognizing dedicated practice and mastery of over 500 NGN NCLEX-RN high-yield clinical reasoning items.",
                "authority": "NursePass Academic Learning Council"
            }
        ]

        for c in sample_certs:
            db.add(NursePassCertificate(
                cert_uuid=c["uuid"],
                user_id=user_id,
                cert_type=c["type"],
                title=c["title"],
                description=c["desc"],
                recipient_name=recipient_name or "Registered Nurse Candidate",
                issuing_authority=c["authority"],
                qr_verification_url=f"/certificates/verify/{c['uuid']}",
                is_valid=True
            ))

    # Badges
    badge_count = db.query(NursePassBadge).filter(NursePassBadge.user_id == user_id).count()
    if badge_count == 0:
        sample_badges = [
            {"key": "accuracy_master", "title": "Accuracy Master (85%+)", "cat": "Performance", "icon": "Target"},
            {"key": "mock_champion", "title": "Mock Test Champion", "cat": "Performance", "icon": "Trophy"},
            {"key": "streak_champ", "title": "14-Day Study Streak", "cat": "Learning", "icon": "Flame"},
            {"key": "ai_tutor_power", "title": "AI Tutor Power User", "cat": "AI", "icon": "Sparkles"},
            {"key": "oet_speaking_pro", "title": "OET Virtual Examiner Pro", "cat": "Performance", "icon": "Mic"}
        ]

        for b in sample_badges:
            db.add(NursePassBadge(
                user_id=user_id,
                badge_key=b["key"],
                title=b["title"],
                category=b["cat"],
                icon_name=b["icon"]
            ))

    # Achievements
    achieve = db.query(NursePassAchievement).filter(NursePassAchievement.user_id == user_id).first()
    if not achieve:
        db.add(NursePassAchievement(
            user_id=user_id,
            total_xp=3450,
            user_level=5,
            user_title="Level 5 Nurse Specialist",
            questions_milestone=500,
            hours_milestone=50,
            mock_milestone=10,
            streak_days=14
        ))

    db.commit()

# --- Endpoints ---

@router.get("")
def get_user_certificates(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches list of all digital certificates earned by the student."""
    ensure_certificates_seeded(db, current_user.id, current_user.full_name or "Registered Nurse Candidate")

    certs = db.query(NursePassCertificate).filter(
        NursePassCertificate.user_id == current_user.id
    ).order_by(NursePassCertificate.issue_date.desc()).all()

    return {"status": "success", "certificates": certs}

@router.post("/generate")
def generate_certificate(
    req: GenerateCertRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generates a new verifiable digital certificate."""
    cert_uuid = f"CERT-NP-2026-{uuid.uuid4().hex[:6].upper()}"
    new_cert = NursePassCertificate(
        cert_uuid=cert_uuid,
        user_id=current_user.id,
        cert_type=req.cert_type,
        title=req.title,
        description=req.description,
        recipient_name=current_user.full_name or "Registered Nurse Candidate",
        issuing_authority="NursePass International Nursing Examination Board",
        qr_verification_url=f"/certificates/verify/{cert_uuid}",
        is_valid=True
    )
    db.add(new_cert)
    db.commit()

    return {"status": "success", "certificate": new_cert}

@router.get("/verify/{cert_uuid}")
def verify_certificate_public(cert_uuid: str, db: Session = Depends(get_db)):
    """PUBLIC verification endpoint checking certificate authenticity, recipient, and validity status."""
    cert = db.query(NursePassCertificate).filter(NursePassCertificate.cert_uuid == cert_uuid).first()
    if not cert:
        return {
            "status": "invalid",
            "message": "Certificate identifier not found or revoked.",
            "is_valid": False
        }

    return {
        "status": "success",
        "is_valid": cert.is_valid,
        "certificate": {
            "cert_uuid": cert.cert_uuid,
            "title": cert.title,
            "description": cert.description,
            "recipient_name": cert.recipient_name,
            "issuing_authority": cert.issuing_authority,
            "issue_date": cert.issue_date.strftime("%B %d, %Y"),
            "qr_verification_url": cert.qr_verification_url
        }
    }

@router.get("/achievements")
def get_user_achievements(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches user XP points, level, unlocked badges, and milestone progression."""
    ensure_certificates_seeded(db, current_user.id, current_user.full_name or "Registered Nurse Candidate")

    achieve = db.query(NursePassAchievement).filter(NursePassAchievement.user_id == current_user.id).first()
    badges = db.query(NursePassBadge).filter(NursePassBadge.user_id == current_user.id).all()

    return {
        "status": "success",
        "achievement": achieve,
        "badges": badges
    }
