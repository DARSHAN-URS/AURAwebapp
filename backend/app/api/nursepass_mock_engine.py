from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import uuid
import random

from ..database import get_db
from .nursepass_auth import get_current_user
from ..models_nursepass import (
    NursePassUserProfile,
    NursePassMockTestBlueprint,
    NursePassMockQuestion,
    NursePassMockTestSession,
    NursePassMockResultSummary,
    NursePassMockAnalytics
)

router = APIRouter(prefix="/api/v1/nursepass/mock", tags=["NursePass AI Mock Test Engine"])

# --- Request & Response Schemas ---

class CreateMockTestRequest(BaseModel):
    exam_slug: str = "nclex-rn"
    test_type: str = "mini" # full_length, mini, subject, weak_area, adaptive, custom
    question_count: Optional[int] = 20
    duration_mins: Optional[int] = 30
    subject_filter: Optional[str] = None
    difficulty: Optional[str] = "medium"

class AutoSaveSessionRequest(BaseModel):
    answers: Dict[str, Any] # { question_id: ["A"] or ["A", "C"] }
    flagged: List[int] # list of question IDs
    current_index: int = 0
    time_remaining_secs: int = 1800

# --- High-Yield Mock Questions Seeder ---

def ensure_mock_questions_seeded(db: Session, exam_slug: str = "nclex-rn"):
    """Seeds rich NCLEX / Prometric / CBT clinical questions if not already present."""
    count = db.query(NursePassMockQuestion).filter(NursePassMockQuestion.exam_slug == exam_slug).count()
    if count >= 10:
        return

    sample_questions = [
        {
            "subject": "Pharmacology",
            "topic": "Cardiac Glycosides & Digoxin Toxicity",
            "difficulty": "medium",
            "type": "single_choice",
            "stem": "A 68-year-old male with heart failure receiving Digoxin 0.25 mg daily reports visual changes describing yellow-green halos around light fixtures and nausea. Which action should the nurse take first?",
            "options": [
                {"id": "A", "text": "Check the patient's serum digoxin level and pulse rate."},
                {"id": "B", "text": "Administer an antacid for nausea."},
                {"id": "C", "text": "Encourage increased oral fluid intake."},
                {"id": "D", "text": "Reassure the client that visual halos are a normal side effect."}
            ],
            "correct": ["A"],
            "rationale": "Yellow-green halos around lights, nausea, and bradycardia are classic early signs of digoxin toxicity. The nurse must immediately check the apical pulse for a full minute and verify serum digoxin level (normal: 0.5 - 2.0 ng/mL). Digibind (Digoxin Immune Fab) is the antidote for severe toxicity.",
            "tip": "High-Yield NCLEX Tip: Always check apical pulse for 1 full minute prior to administering Digoxin. Hold if HR < 60 bpm."
        },
        {
            "subject": "Medical-Surgical",
            "topic": "Endocrine & Diabetes Mellitus DKA",
            "difficulty": "hard",
            "type": "sata",
            "stem": "A nurse in the Emergency Department is caring for a patient diagnosed with Diabetic Ketoacidosis (DKA). Which clinical manifestations and lab findings should the nurse expect? Select all that apply.",
            "options": [
                {"id": "A", "text": "Kussmaul respirations with fruity odor breath"},
                {"id": "B", "text": "Blood glucose level > 300 mg/dL"},
                {"id": "C", "text": "Serum arterial pH < 7.35 with low HCO3 (< 18 mEq/L)"},
                {"id": "D", "text": "Positive urine ketones"},
                {"id": "E", "text": "Severe fluid volume overload and peripheral edema"}
            ],
            "correct": ["A", "B", "C", "D"],
            "rationale": "DKA is characterized by hyperglycemia (>300 mg/dL), metabolic acidosis (pH < 7.35, HCO3 < 18), positive urine ketones, and compensatory deep rapid breathing (Kussmaul respirations). Patients experience severe dehydration, NOT fluid overload.",
            "tip": "NGN Clinical Judgment: Initial priority intervention in DKA is IV 0.9% Normal Saline fluid rehydration before IV regular insulin infusion."
        },
        {
            "subject": "Pharmacology",
            "topic": "Dosage & Flow Rate Calculations",
            "difficulty": "medium",
            "type": "single_choice",
            "stem": "A physician orders Heparin IV infusion at 1,200 units/hr. The pharmacy supplies Heparin 25,000 units in 500 mL of 5% Dextrose in Water (D5W). What flow rate in mL/hr should the nurse set on the IV infusion pump?",
            "options": [
                {"id": "A", "text": "24 mL/hr"},
                {"id": "B", "text": "12 mL/hr"},
                {"id": "C", "text": "30 mL/hr"},
                {"id": "D", "text": "48 mL/hr"}
            ],
            "correct": ["A"],
            "rationale": "Calculation: Concentration = 25,000 units / 500 mL = 50 units/mL. Rate = 1,200 units/hr ÷ 50 units/mL = 24 mL/hr.",
            "tip": "Dimensional Analysis: (500 mL / 25,000 units) × (1,200 units / 1 hr) = 24 mL/hr."
        },
        {
            "subject": "Maternal & Child",
            "topic": "Obstetrics & Antepartum Complications",
            "difficulty": "hard",
            "type": "single_choice",
            "stem": "A pregnant client at 34 weeks gestation presents with sudden, dark red vaginal bleeding, severe abdominal pain, and uterine tenderness with board-like firmness. Which condition should the nurse suspect?",
            "options": [
                {"id": "A", "text": "Abruptio Placentae (Placental Abruption)"},
                {"id": "B", "text": "Placenta Previa"},
                {"id": "C", "text": "Ectopic Pregnancy"},
                {"id": "D", "text": "Incompetent Cervix"}
            ],
            "correct": ["A"],
            "rationale": "Abruptio placentae is characterized by painful, dark red vaginal bleeding and board-like uterine rigidity. Placenta previa presents with painless, bright red bleeding. Placental abruption is an emergency requiring fetal monitoring and preparation for immediate C-section.",
            "tip": "Key Differential: Painful + Dark Red = Abruption. Painless + Bright Red = Previa."
        },
        {
            "subject": "Pediatric Nursing",
            "topic": "Cardiovascular & Tetralogy of Fallot",
            "difficulty": "medium",
            "type": "single_choice",
            "stem": "A 9-month-old infant with Tetralogy of Fallot becomes acutely cyanotic and hyperpneic during a blood draw ('TET spell'). Which position should the nurse place the infant in immediately?",
            "options": [
                {"id": "A", "text": "Knee-chest position (or squatting position)"},
                {"id": "B", "text": "High Fowlers with legs elevated"},
                {"id": "C", "text": "Trendelenburg position"},
                {"id": "D", "text": "Right side-lying flat position"}
            ],
            "correct": ["A"],
            "rationale": "Placing the infant in a knee-chest position increases systemic vascular resistance (SVR), which reduces the right-to-left shunt, forcing blood into the pulmonary artery to improve oxygenation.",
            "tip": "Tetralogy of Fallot 4 Defects: Pulmonary stenosis, Right ventricular hypertrophy, Overriding aorta, Ventricular septal defect (PROVe)."
        },
        {
            "subject": "Psychiatric Nursing",
            "topic": "Bipolar Disorder & Lithium Therapy",
            "difficulty": "medium",
            "type": "single_choice",
            "stem": "A client diagnosed with Bipolar Disorder is prescribed Lithium Carbonate. Which dietary instruction is essential for the nurse to provide?",
            "options": [
                {"id": "A", "text": "Maintain consistent daily sodium and fluid intake."},
                {"id": "B", "text": "Restrict sodium intake to prevent fluid retention."},
                {"id": "C", "text": "Avoid foods high in Vitamin K such as spinach."},
                {"id": "D", "text": "Increase intake of potassium-rich foods."}
            ],
            "correct": ["A"],
            "rationale": "Lithium is a salt. Hyponatremia or sodium depletion causes the kidneys to reabsorb lithium, leading to acute lithium toxicity. Clients must maintain consistent sodium and drink 2–3 liters of water daily.",
            "tip": "Lithium Therapeutic Range: 0.6 - 1.2 mEq/L. Toxicity occurs > 1.5 mEq/L."
        }
    ]

    for q in sample_questions:
        db.add(NursePassMockQuestion(
            exam_slug=exam_slug,
            subject=q["subject"],
            topic=q["topic"],
            difficulty=q["difficulty"],
            question_type=q["type"],
            stem_text=q["stem"],
            options_json=q["options"],
            correct_answer_json=q["correct"],
            rationale_text=q["rationale"],
            clinical_tip=q["tip"]
        ))
    db.commit()

# --- Endpoints ---

@router.post("/create")
def create_mock_test_session(
    req: CreateMockTestRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a custom or pre-configured Mock Test Session."""
    ensure_mock_questions_seeded(db, req.exam_slug)

    # Query matching questions
    q_query = db.query(NursePassMockQuestion).filter(NursePassMockQuestion.exam_slug == req.exam_slug)
    if req.subject_filter:
        q_query = q_query.filter(NursePassMockQuestion.subject == req.subject_filter)

    questions = q_query.all()
    if not questions:
        # Fallback to all questions
        questions = db.query(NursePassMockQuestion).all()

    question_ids = [q.id for q in questions]
    if len(question_ids) > (req.question_count or 20):
        question_ids = random.sample(question_ids, req.question_count or 20)

    session_id = f"mock_{uuid.uuid4().hex[:12]}"
    duration_mins = req.duration_mins or 30

    session = NursePassMockTestSession(
        id=session_id,
        user_id=current_user.id,
        exam_slug=req.exam_slug,
        test_type=req.test_type,
        status="in_progress",
        total_questions=len(question_ids),
        current_index=0,
        time_remaining_secs=duration_mins * 60,
        question_ids_json=question_ids,
        answers_json={},
        flagged_json=[]
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "status": "success",
        "session_id": session_id,
        "exam_slug": req.exam_slug,
        "test_type": req.test_type,
        "total_questions": len(question_ids),
        "duration_mins": duration_mins
    }

@router.get("/sessions/{session_id}")
def get_mock_test_session(
    session_id: str,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches active test session questions and current answers."""
    session = db.query(NursePassMockTestSession).filter(NursePassMockTestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Mock session not found")

    question_ids = session.question_ids_json or []
    questions = db.query(NursePassMockQuestion).filter(NursePassMockQuestion.id.in_(question_ids)).all()
    
    # Sort questions matching order in question_ids
    q_dict = {q.id: q for q in questions}
    ordered_questions = []
    for q_id in question_ids:
        if q_id in q_dict:
            q = q_dict[q_id]
            ordered_questions.append({
                "id": q.id,
                "subject": q.subject,
                "topic": q.topic,
                "difficulty": q.difficulty,
                "question_type": q.question_type,
                "stem_text": q.stem_text,
                "options": q.options_json
            })

    return {
        "status": "success",
        "session": {
            "id": session.id,
            "exam_slug": session.exam_slug,
            "test_type": session.test_type,
            "status": session.status,
            "total_questions": session.total_questions,
            "current_index": session.current_index,
            "time_remaining_secs": session.time_remaining_secs,
            "answers": session.answers_json or {},
            "flagged": session.flagged_json or []
        },
        "questions": ordered_questions
    }

@router.post("/sessions/{session_id}/autosave")
def autosave_mock_test_session(
    session_id: str,
    req: AutoSaveSessionRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Auto-saves user selected answers and time remaining every 10 seconds."""
    session = db.query(NursePassMockTestSession).filter(NursePassMockTestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Mock session not found")

    session.answers_json = req.answers
    session.flagged_json = req.flagged
    session.current_index = req.current_index
    session.time_remaining_secs = req.time_remaining_secs
    db.commit()

    return {"status": "success", "message": "Session auto-saved"}

@router.post("/sessions/{session_id}/submit")
def submit_mock_test_session(
    session_id: str,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submits test session, calculates score %, evaluates pass/fail status, and generates AI readiness score."""
    session = db.query(NursePassMockTestSession).filter(NursePassMockTestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Mock session not found")

    session.status = "completed"
    session.submitted_at = datetime.utcnow()

    # Calculate Score
    question_ids = session.question_ids_json or []
    questions = db.query(NursePassMockQuestion).filter(NursePassMockQuestion.id.in_(question_ids)).all()
    user_answers = session.answers_json or {}

    correct_count = 0
    incorrect_count = 0
    skipped_count = 0

    subject_totals = {}
    subject_corrects = {}

    for q in questions:
        subj = q.subject
        subject_totals[subj] = subject_totals.get(subj, 0) + 1
        
        q_id_str = str(q.id)
        if q_id_str in user_answers and user_answers[q_id_str]:
            given = sorted(user_answers[q_id_str])
            correct = sorted(q.correct_answer_json)
            if given == correct:
                correct_count += 1
                subject_corrects[subj] = subject_corrects.get(subj, 0) + 1
            else:
                incorrect_count += 1
        else:
            skipped_count += 1

    total_q = len(questions) or 1
    score_pct = round((correct_count / total_q) * 100, 1)

    pass_status = "High Pass" if score_pct >= 80 else "Passed" if score_pct >= 70 else "Borderline" if score_pct >= 60 else "Fail"
    ai_readiness_score = round(min(score_pct * 1.05, 99.0), 1)

    # Subject scores breakdown
    subject_scores = {}
    for s, tot in subject_totals.items():
        corr = subject_corrects.get(s, 0)
        subject_scores[s] = {"correct": corr, "total": tot, "pct": round((corr / tot) * 100, 1)}

    # Save Result Summary
    result = NursePassMockResultSummary(
        session_id=session_id,
        user_id=current_user.id,
        exam_slug=session.exam_slug,
        test_title=f"{session.exam_slug.upper()} {session.test_type.replace('_', ' ').title()} Mock",
        score_pct=score_pct,
        total_questions=total_q,
        correct_count=correct_count,
        incorrect_count=incorrect_count,
        skipped_count=skipped_count,
        pass_status=pass_status,
        ai_readiness_score=ai_readiness_score,
        percentile_rank=round(score_pct * 0.95 + 10, 1),
        time_taken_mins=max(1, int((1800 - session.time_remaining_secs) / 60)),
        subject_scores_json=subject_scores,
        ai_feedback_json={
            "summary": f"Great clinical performance! You demonstrated strong reasoning in {list(subject_corrects.keys())[0] if subject_corrects else 'General Nursing'}.",
            "advice": "Focus on high-alert pharmacology dosage calculations and EKG arrhythmia scenarios before your target exam date."
        }
    )

    db.add(result)
    db.commit()

    return {
        "status": "success",
        "session_id": session_id,
        "score_pct": score_pct,
        "pass_status": pass_status,
        "ai_readiness_score": ai_readiness_score
    }

@router.get("/results/{session_id}")
def get_mock_test_results(
    session_id: str,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches completed test result analytics and evaluation summary."""
    result = db.query(NursePassMockResultSummary).filter(NursePassMockResultSummary.session_id == session_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Test results not found")

    return {"status": "success", "result": result}

@router.get("/review/{session_id}")
def get_mock_test_review(
    session_id: str,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches detailed question-by-question review with clinical rationales."""
    session = db.query(NursePassMockTestSession).filter(NursePassMockTestSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Mock session not found")

    question_ids = session.question_ids_json or []
    questions = db.query(NursePassMockQuestion).filter(NursePassMockQuestion.id.in_(question_ids)).all()
    user_answers = session.answers_json or {}
    flagged = session.flagged_json or []

    review_list = []
    for q in questions:
        q_id_str = str(q.id)
        given = user_answers.get(q_id_str, [])
        correct = q.correct_answer_json
        is_correct = sorted(given) == sorted(correct)

        review_list.append({
            "id": q.id,
            "subject": q.subject,
            "topic": q.topic,
            "difficulty": q.difficulty,
            "question_type": q.question_type,
            "stem_text": q.stem_text,
            "options": q.options_json,
            "user_answer": given,
            "correct_answer": correct,
            "is_correct": is_correct,
            "is_flagged": q.id in flagged,
            "rationale_text": q.rationale_text,
            "clinical_tip": q.clinical_tip
        })

    return {"status": "success", "review": review_list}

@router.get("/history")
def get_user_mock_history(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches student's completed mock test history."""
    results = db.query(NursePassMockResultSummary).filter(
        NursePassMockResultSummary.user_id == current_user.id
    ).order_by(NursePassMockResultSummary.created_at.desc()).all()

    return {"status": "success", "history": results}
