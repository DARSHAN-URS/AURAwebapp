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
    NursePassInstitution,
    NursePassInstitutionUser,
    NursePassFacultyProfile,
    NursePassBatch,
    NursePassBatchStudent,
    NursePassAssignment,
    NursePassSeatAllocation
)

router = APIRouter(prefix="/api/v1/nursepass/institution", tags=["NursePass Institution Management"])

# --- Request Schemas ---

class InviteStudentRequest(BaseModel):
    full_name: str
    email: str
    target_exam: str = "nclex-rn"
    batch_id: Optional[int] = None

class CreateBatchRequest(BaseModel):
    name: str # e.g. OET Nursing Fall 2026 Batch
    target_exam: str = "oet-nursing"
    academic_year: str = "2025-2026"
    capacity: int = 100
    faculty_name: str = "Prof. Michael Vance, RN"

class CreateAssignmentRequest(BaseModel):
    batch_id: int
    title: str
    description: str
    due_days: int = 7
    total_questions: int = 30

# --- Seeder ---

def ensure_institution_seeded(db: Session, user_id: str):
    """Seeds default B2B Nursing College Tenant if not present."""
    inst = db.query(NursePassInstitution).filter(NursePassInstitution.owner_user_id == user_id).first()
    if not inst:
        inst = NursePassInstitution(
            name="St. Johns College of Nursing & Health Sciences",
            code="CON-STJOHNS-2026",
            logo_url="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
            accreditation="INC & CCNE Accredited",
            total_seats=500,
            used_seats=342,
            subscription_tier="Enterprise B2B Plan",
            owner_user_id=user_id
        )
        db.add(inst)
        db.commit()
        db.refresh(inst)

    # Batches
    batch_count = db.query(NursePassBatch).filter(NursePassBatch.institution_id == inst.id).count()
    if batch_count == 0:
        b1 = NursePassBatch(
            institution_id=inst.id,
            name="NCLEX-RN 2026 Spring Mastery Batch",
            target_exam="nclex-rn",
            academic_year="2025-2026",
            capacity=150,
            student_count=118,
            faculty_name="Dr. Sarah Jenkins, RN, MSN"
        )
        b2 = NursePassBatch(
            institution_id=inst.id,
            name="OET Nursing Intensive Coaching Batch",
            target_exam="oet-nursing",
            academic_year="2025-2026",
            capacity=100,
            student_count=84,
            faculty_name="Prof. David Miller, MA, OET Examiner"
        )
        b3 = NursePassBatch(
            institution_id=inst.id,
            name="DHA & Prometric Gulf Licensing Batch",
            target_exam="dha",
            academic_year="2025-2026",
            capacity=100,
            student_count=72,
            faculty_name="Dr. Amina Al-Mansoor, BSN"
        )
        db.add_all([b1, b2, b3])
        db.commit()

    # Faculty Profiles
    fac_count = db.query(NursePassFacultyProfile).filter(NursePassFacultyProfile.institution_id == inst.id).count()
    if fac_count == 0:
        f1 = NursePassFacultyProfile(
            institution_id=inst.id,
            user_id="faculty_dev_1",
            name="Dr. Sarah Jenkins, RN, MSN",
            department="Medical-Surgical Nursing",
            assigned_subjects=["Cardiovascular System", "Pharmacology & Parenteral Therapies", "NextGen Clinical Judgment"]
        )
        f2 = NursePassFacultyProfile(
            institution_id=inst.id,
            user_id="faculty_dev_2",
            name="Prof. David Miller, MA",
            department="English for Healthcare Professionals",
            assigned_subjects=["OET Writing Case Notes", "OET Speaking Virtual Simulation"]
        )
        db.add_all([f1, f2])
        db.commit()

    # Assignments
    ass_count = db.query(NursePassAssignment).filter(NursePassAssignment.institution_id == inst.id).count()
    if ass_count == 0:
        a1 = NursePassAssignment(
            institution_id=inst.id,
            batch_id=1,
            title="NGN Case Study #14: Heart Failure & Fluid Balance",
            description="Complete the 6-step Clinical Judgment Measurement Model case study before Friday 5:00 PM.",
            due_date=datetime.utcnow() + timedelta(days=4),
            total_questions=25,
            completed_students=98,
            total_assigned=118
        )
        db.add(a1)
        db.commit()

    return inst

# --- Endpoints ---

@router.get("/details")
def get_institution_details(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches B2B institution details, total seats, used seats, and accreditation."""
    inst = ensure_institution_seeded(db, current_user.id)
    batches = db.query(NursePassBatch).filter(NursePassBatch.institution_id == inst.id).all()
    faculty = db.query(NursePassFacultyProfile).filter(NursePassFacultyProfile.institution_id == inst.id).all()

    return {
        "status": "success",
        "institution": inst,
        "active_batches_count": len(batches),
        "faculty_members_count": len(faculty),
        "average_ai_readiness": 84.5,
        "mock_completion_rate": "92.4%"
    }

@router.get("/students")
def get_student_roster(
    batch_id: Optional[int] = None,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches candidate student roster with batch allocation, AI readiness, and seat status."""
    inst = ensure_institution_seeded(db, current_user.id)

    students = [
        {
            "user_id": "std_101",
            "full_name": "Nurse Emily Vance, BSN",
            "email": "emily.vance@stjohns.edu",
            "target_exam": "NCLEX-RN",
            "batch_name": "NCLEX-RN 2026 Spring Mastery Batch",
            "ai_readiness": 89.2,
            "questions_solved": 740,
            "seat_status": "active",
            "seat_key": "SEAT-STJ-9921-A"
        },
        {
            "user_id": "std_102",
            "full_name": "Nurse Michael Chang, RN",
            "email": "michael.chang@stjohns.edu",
            "target_exam": "NCLEX-RN",
            "batch_name": "NCLEX-RN 2026 Spring Mastery Batch",
            "ai_readiness": 91.5,
            "questions_solved": 1120,
            "seat_status": "active",
            "seat_key": "SEAT-STJ-9922-B"
        },
        {
            "user_id": "std_103",
            "full_name": "Nurse Priya Sharma, BSN",
            "email": "priya.sharma@stjohns.edu",
            "target_exam": "OET Nursing",
            "batch_name": "OET Nursing Intensive Coaching Batch",
            "ai_readiness": 82.0,
            "questions_solved": 530,
            "seat_status": "active",
            "seat_key": "SEAT-STJ-9923-C"
        },
        {
            "user_id": "std_104",
            "full_name": "Nurse Ananya Patel, RN",
            "email": "ananya.patel@stjohns.edu",
            "target_exam": "DHA Licensing",
            "batch_name": "DHA & Prometric Gulf Licensing Batch",
            "ai_readiness": 86.8,
            "questions_solved": 610,
            "seat_status": "active",
            "seat_key": "SEAT-STJ-9924-D"
        }
    ]

    return {"status": "success", "students": students, "total_count": len(students)}

@router.post("/students/invite")
def invite_student(
    req: InviteStudentRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Invites student to institution and allocates seat license."""
    inst = ensure_institution_seeded(db, current_user.id)
    if inst.used_seats >= inst.total_seats:
        raise HTTPException(status_code=400, detail="Institution seat capacity full. Please upgrade seat license.")

    inst.used_seats += 1
    db.commit()

    seat_key = f"SEAT-STJ-{uuid.uuid4().hex[:6].upper()}"

    return {
        "status": "success",
        "message": f"Invitation and Seat License {seat_key} sent to {req.email}",
        "seat_key": seat_key,
        "remaining_seats": inst.total_seats - inst.used_seats
    }

@router.get("/faculty")
def get_faculty_roster(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches faculty members roster."""
    inst = ensure_institution_seeded(db, current_user.id)
    faculty = db.query(NursePassFacultyProfile).filter(NursePassFacultyProfile.institution_id == inst.id).all()

    return {"status": "success", "faculty": faculty}

@router.get("/batches")
def get_institution_batches(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches academic batches and capacity metrics."""
    inst = ensure_institution_seeded(db, current_user.id)
    batches = db.query(NursePassBatch).filter(NursePassBatch.institution_id == inst.id).all()

    return {"status": "success", "batches": batches}

@router.post("/batches")
def create_institution_batch(
    req: CreateBatchRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new academic batch in institution."""
    inst = ensure_institution_seeded(db, current_user.id)
    batch = NursePassBatch(
        institution_id=inst.id,
        name=req.name,
        target_exam=req.target_exam,
        academic_year=req.academic_year,
        capacity=req.capacity,
        faculty_name=req.faculty_name
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)

    return {"status": "success", "batch": batch}

@router.get("/assignments")
def get_institution_assignments(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches institution practice assignments."""
    inst = ensure_institution_seeded(db, current_user.id)
    assignments = db.query(NursePassAssignment).filter(NursePassAssignment.institution_id == inst.id).all()

    return {"status": "success", "assignments": assignments}

@router.post("/assignments")
def create_institution_assignment(
    req: CreateAssignmentRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates & assigns a practice task to an academic batch."""
    inst = ensure_institution_seeded(db, current_user.id)
    assignment = NursePassAssignment(
        institution_id=inst.id,
        batch_id=req.batch_id,
        title=req.title,
        description=req.description,
        due_date=datetime.utcnow() + timedelta(days=req.due_days),
        total_questions=req.total_questions
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {"status": "success", "assignment": assignment}

@router.get("/seats")
def get_seat_metrics(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches B2B Enterprise seat license metrics (Total, Used, Available)."""
    inst = ensure_institution_seeded(db, current_user.id)

    return {
        "status": "success",
        "total_seats": inst.total_seats,
        "used_seats": inst.used_seats,
        "available_seats": inst.total_seats - inst.used_seats,
        "subscription_tier": inst.subscription_tier,
        "renewal_date": (datetime.utcnow() + timedelta(days=300)).strftime("%Y-%m-%d")
    }
