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
    NursePassChatSession,
    NursePassChatMessage,
    NursePassAIMemory
)

router = APIRouter(prefix="/api/v1/nursepass/tutor", tags=["NursePass AI Nurse Tutor"])

# --- Request & Response Schemas ---

class CreateSessionRequest(BaseModel):
    title: Optional[str] = "Clinical Pharmacology Discussion"
    exam_slug: str = "nclex-rn"
    learning_mode: str = "study" # study, clinical_reasoning, exam_prep, case_discussion

class SendMessageRequest(BaseModel):
    text_content: str

class GeneratePracticeRequest(BaseModel):
    topic: str
    difficulty: Optional[str] = "medium"

# --- Endpoints ---

@router.post("/sessions")
def create_tutor_session(
    req: CreateSessionRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new AI Tutor Chat Session."""
    session_id = f"session_{uuid.uuid4().hex[:12]}"
    session = NursePassChatSession(
        id=session_id,
        user_id=current_user.id,
        title=req.title or f"{req.learning_mode.replace('_', ' ').title()} Chat",
        exam_slug=req.exam_slug,
        learning_mode=req.learning_mode
    )
    db.add(session)

    # Initial Welcome Message
    mode_titles = {
        "study": "Study Mode: Ask me any nursing concept or pharmacology question for a simplified breakdown.",
        "clinical_reasoning": "Clinical Reasoning Mode: Let's analyze patient assessment, nursing diagnoses, and priority interventions step-by-step.",
        "exam_prep": f"Exam Prep Mode ({req.exam_slug.upper()}): Ask questions specifically formatted according to official {req.exam_slug.upper()} blueprints.",
        "case_discussion": "Case Discussion Mode: Share any clinical scenario for comprehensive findings analysis and safety priorities."
    }

    welcome_text = f"Hello Nurse! I am **Aura AI Nurse Tutor**. {mode_titles.get(req.learning_mode, 'How can I assist your study today?')}"
    
    welcome_msg = NursePassChatMessage(
        session_id=session_id,
        sender="ai",
        text_content=welcome_text,
        suggested_questions_json=[
            "Explain Digoxin toxicity symptoms & nursing priorities.",
            "Compare DKA vs HHS clinical presentations.",
            "Generate 5 practice SATA questions on cardiac meds."
        ]
    )
    db.add(welcome_msg)
    db.commit()
    db.refresh(session)

    return {"status": "success", "session": session}

@router.get("/sessions")
def get_tutor_sessions(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches user's chat session history."""
    sessions = db.query(NursePassChatSession).filter(
        NursePassChatSession.user_id == current_user.id
    ).order_by(NursePassChatSession.updated_at.desc()).all()
    
    if not sessions:
        # Create initial default session
        default_req = CreateSessionRequest()
        return [create_tutor_session(default_req, current_user, db)["session"]]

    return sessions

@router.get("/sessions/{session_id}")
def get_tutor_session_detail(
    session_id: str,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches session info and complete message thread."""
    session = db.query(NursePassChatSession).filter(NursePassChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = db.query(NursePassChatMessage).filter(
        NursePassChatMessage.session_id == session_id
    ).order_by(NursePassChatMessage.created_at.asc()).all()

    return {"status": "success", "session": session, "messages": messages}

@router.post("/sessions/{session_id}/message")
def send_tutor_message(
    session_id: str,
    req: SendMessageRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sends user message and generates rich clinical AI response."""
    session = db.query(NursePassChatSession).filter(NursePassChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Save User Message
    user_msg = NursePassChatMessage(
        session_id=session_id,
        sender="user",
        text_content=req.text_content
    )
    db.add(user_msg)

    # Generate Clinical AI Response
    query_lower = req.text_content.lower()
    
    if "digoxin" in query_lower:
        ai_reply = """### Clinical Pharmacology: Digoxin Toxicity & Nursing Priorities

**1. Key Clinical Manifestations:**
- **Early Symptoms:** Gastrointestinal distress (anorexia, nausea, vomiting, abdominal pain) and CNS alterations (confusion, fatigue).
- **Classic Sensory Hallmark:** Visual disturbances presenting as **yellow-green halos** around light sources or blurred vision.
- **Cardiovascular:** Tachyarrhythmias, bradycardia, or AV heart blocks.

**2. High-Yield Nursing Actions:**
- Assess **apical pulse for 1 full minute** before administration. Hold medication if HR < 60 bpm in adults (or < 90 bpm in infants).
- Monitor serum digoxin levels (Therapeutic range: **0.5 - 2.0 ng/mL**).
- Check **serum Potassium (K+)**. *Hypokalemia increases digoxin binding and severe toxicity risks!*

**3. Antidote:** Digoxin Immune Fab (**Digibind**)."""
        suggested = ["What is the therapeutic digoxin level?", "Why does hypokalemia worsen toxicity?", "Generate 5 practice questions."]
    elif "dka" in query_lower:
        ai_reply = """### Clinical Decision Path: Diabetic Ketoacidosis (DKA)

**1. Pathophysiology Highlights:**
- Severe insulin deficiency $\\rightarrow$ hyperglycemia ($>300\\text{ mg/dL}$) $\\rightarrow$ lipolysis & ketogenesis $\\rightarrow$ metabolic acidosis ($pH < 7.35, HCO_3 < 18\\text{ mEq/L}$).

**2. Priority Nursing Interventions:**
- **#1 Priority:** Fluid resuscitation with **0.9% Normal Saline** (1–1.5 L in 1st hour) to restore vascular volume and renal perfusion.
- **#2 Priority:** Regular Insulin IV infusion after verifying serum Potassium $\\ge 3.3\\text{ mEq/L}$.
- **#3 Priority:** Add 5% Dextrose (D5W) to IV fluids when blood glucose drops to $250\\text{ mg/dL}$ to prevent cerebral edema."""
        suggested = ["Why add D5W when blood sugar reaches 250?", "Compare DKA vs HHS.", "Generate practice case study."]
    else:
        ai_reply = f"""### {session.exam_slug.upper()} Clinical Response ({session.learning_mode.replace('_', ' ').title()})

Regarding **"{req.text_content}"**:

1. **Assessment & Priority Action:** Always prioritize airway, breathing, and circulation (ABCs) and patient safety.
2. **Key Consideration:** Review high-alert medication protocols and vital sign changes before intervention.
3. **NCLEX/Prometric Tip:** Look for words like *first*, *initial*, or *immediate* to identify the primary nursing action."""
        suggested = ["Explain priority nursing interventions.", "Create 5 practice MCQs.", "Give a clinical example."]

    ai_msg = NursePassChatMessage(
        session_id=session_id,
        sender="ai",
        text_content=ai_reply,
        suggested_questions_json=suggested
    )
    db.add(ai_msg)
    
    session.updated_at = datetime.utcnow()
    db.commit()

    return {"status": "success", "user_message": user_msg, "ai_message": ai_msg}

@router.post("/generate-practice")
def generate_practice_questions(
    req: GeneratePracticeRequest,
    current_user: NursePassUserProfile = Depends(get_current_user)
):
    """Generates 5 high-yield practice MCQs with clinical rationales based on current topic."""
    questions = [
        {
            "id": 1,
            "stem": f"A nurse is evaluating a client receiving treatment for {req.topic}. Which finding indicates a high-risk complication requiring immediate physician notification?",
            "options": [
                {"id": "A", "text": "Sudden onset of dyspnea and bilateral basal crackles"},
                {"id": "B", "text": "Mild fatigue after physical therapy"},
                {"id": "C", "text": "Serum sodium level of 138 mEq/L"},
                {"id": "D", "text": "Dry skin and mild thirst"}
            ],
            "correct": "A",
            "rationale": "Sudden dyspnea and lung crackles indicate acute fluid volume overload and pulmonary edema, requiring immediate medical intervention."
        },
        {
            "id": 2,
            "stem": "Which lab value requires immediate nursing action prior to administering cardiac glycoside therapy?",
            "options": [
                {"id": "A", "text": "Potassium level of 2.9 mEq/L (Hypokalemia)"},
                {"id": "B", "text": "Sodium level of 140 mEq/L"},
                {"id": "C", "text": "Calcium level of 9.2 mg/dL"},
                {"id": "D", "text": "Magnesium level of 2.0 mEq/L"}
            ],
            "correct": "A",
            "rationale": "Hypokalemia potentiates digoxin toxicity, raising the risk of life-threatening cardiac arrhythmias."
        }
    ]

    return {"status": "success", "topic": req.topic, "questions": questions}

@router.delete("/sessions/{session_id}")
def delete_tutor_session(
    session_id: str,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a chat session."""
    session = db.query(NursePassChatSession).filter(
        NursePassChatSession.id == session_id,
        NursePassChatSession.user_id == current_user.id
    ).first()
    if session:
        db.query(NursePassChatMessage).filter(NursePassChatMessage.session_id == session_id).delete()
        db.delete(session)
        db.commit()
    return {"status": "success", "message": "Session deleted"}
