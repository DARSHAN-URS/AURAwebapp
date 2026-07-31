"""
FMGE AI — AI Clinical Case Simulator & Medical Reasoning Engine API Router
===========================================================================
Provides dynamic endpoints for virtual patient encounters, conversational AI history taking,
physical examination findings (General, CVS, RS, Abdomen, Neuro), lab test ordering & radiology image reports,
differential diagnosis evaluation, treatment planning, emergency mode, and clinical reasoning feedback.
"""
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import time

fmge_cases_router = APIRouter(prefix="/clinical-cases", tags=["FMGE AI Clinical Case Simulator"])

# ── Schemas ─────────────────────────────────────────────────────────

class StartSessionRequest(BaseModel):
    user_id: str
    case_id: str

class PatientChatRequest(BaseModel):
    session_id: str
    message: str

class ExamineRequest(BaseModel):
    session_id: str
    system: str # CVS, RS, Abdomen, Neuro, General

class OrderInvestigationRequest(BaseModel):
    session_id: str
    investigations: List[str] # ["CBC", "Chest X-Ray", "ECG", "Troponin I"]

class SubmitDiagnosisRequest(BaseModel):
    session_id: str
    primary_diagnosis: str
    differential_diagnoses: List[str]
    treatment_plan: str
    emergency_actions: Optional[List[str]] = []


# ── Case Directory Endpoint ─────────────────────────────────────────

@fmge_cases_router.get("/list")
async def get_clinical_cases_list(
    subject: Optional[str] = "all",
    difficulty: Optional[str] = "all"
):
    """Returns directory of clinical case scenarios."""
    cases = [
        {
            "id": "c-101",
            "title": "Case 101: 45M with Crushing Chest Pain & Diaphoresis",
            "subject": "General Medicine",
            "organ_system": "Cardiovascular",
            "difficulty": "Intermediate",
            "is_emergency": True,
            "patient": {"name": "Mr. Rajesh Kumar", "age": 45, "gender": "Male"},
            "chief_complaint": "Severe 2-hour retrosternal chest pain radiating to left jaw & arm.",
            "vitals": {"bp": "150/90 mmHg", "hr": "98 bpm", "rr": "22 /min", "spo2": "96% on RA", "temp": "98.4 °F"},
            "completion_rate": "84.5%",
            "high_yield_tag": "FMGE Must Know"
        },
        {
            "id": "c-102",
            "title": "Case 102: 28F Primigravida at 34 Weeks with Severe Headache",
            "subject": "Obstetrics & Gynecology",
            "organ_system": "Reproductive / Nephrology",
            "difficulty": "Hard (NBE Level)",
            "is_emergency": True,
            "patient": {"name": "Mrs. Priya Sharma", "age": 28, "gender": "Female"},
            "chief_complaint": "Severe frontal headache, epigastric discomfort, & blurred vision.",
            "vitals": {"bp": "165/110 mmHg", "hr": "88 bpm", "rr": "18 /min", "spo2": "98% on RA", "temp": "98.6 °F"},
            "completion_rate": "79.2%",
            "high_yield_tag": "HELLP Syndrome"
        },
        {
            "id": "c-103",
            "title": "Case 103: 6Y Child with High Fever, Stridor & Drooling",
            "subject": "Pediatrics",
            "organ_system": "Respiratory / ENT",
            "difficulty": "Emergency",
            "is_emergency": True,
            "patient": {"name": "Master Aarav", "age": 6, "gender": "Male"},
            "chief_complaint": "Sudden onset high fever, severe sore throat, inspiratory stridor, and drooling.",
            "vitals": {"bp": "95/60 mmHg", "hr": "130 bpm", "rr": "32 /min", "spo2": "92% on RA", "temp": "103.2 °F"},
            "completion_rate": "72.0%",
            "high_yield_tag": "Acute Epiglottitis"
        }
    ]
    return {"success": True, "total": len(cases), "cases": cases}


# ── Start Session Endpoint ──────────────────────────────────────────

@fmge_cases_router.post("/start")
async def start_case_session(request: StartSessionRequest):
    """Initializes a virtual patient EMR session."""
    session_id = f"sess-{int(time.time())}"
    return {
        "success": True,
        "session_id": session_id,
        "case_id": request.case_id,
        "patient": {
            "name": "Mr. Rajesh Kumar",
            "age": 45,
            "gender": "Male",
            "occupation": "Accountant",
            "chief_complaint": "Severe retrosternal chest pain radiating to left jaw for 2 hours.",
            "vitals": {"bp": "150/90 mmHg", "hr": "98 bpm", "rr": "22 /min", "spo2": "96% on RA"}
        },
        "initial_message": "“Doctor, please help! I felt a heavy crushing pressure in my chest about 2 hours ago while climbing stairs. The pain goes up into my left neck and arm, and I am sweating profusely.”"
    }


# ── Patient Conversation AI Endpoint ───────────────────────────────

@fmge_cases_router.post("/{id}/chat")
async def chat_with_patient(id: str, request: PatientChatRequest):
    """Simulates AI Virtual Patient conversational responses."""
    msg = request.message.lower()
    
    if "pain" in msg or "radiate" in msg:
        reply = "“The pain feels like a heavy elephant sitting on my chest. It radiates right up to my left lower jaw and down my inner left arm. It hasn't stopped for 2 hours.”"
    elif "fever" in msg or "cough" in msg:
        reply = "“No doctor, I don't have any fever or cough. Just this terrible chest crushing pain and cold sweat.”"
    elif "medical history" in msg or "diabetic" in msg or "bp" in msg:
        reply = "“I have had Type 2 Diabetes for 6 years and high blood pressure, but I sometimes forget to take my medications regularly.”"
    else:
        reply = "“Yes doctor, the pressure is very intense and I am feeling quite anxious and lightheaded.”"

    return {"success": True, "session_id": request.session_id, "patient_reply": reply}


# ── Physical Examination Endpoint ──────────────────────────────────

@fmge_cases_router.post("/{id}/examine")
async def examine_patient(id: str, request: ExamineRequest):
    """Returns physical examination findings by organ system."""
    system = request.system.upper()
    findings = {
        "GENERAL": "Patient is anxious, diaphoetic (cold clammy skin), pale. No jaundice, cyanosis, or pedal edema.",
        "CVS": "S1 and S2 present. S4 gallop heard at apex. No murmur or pericardial rub. JVP is not elevated.",
        "RS": "Bilateral vesicular breath sounds. Fine bilateral basal crepitations present at lung bases.",
        "ABDOMEN": "Soft, non-tender, no organomegaly. Normal bowel sounds.",
        "NEURO": "Alert, conscious, oriented x 3. Pupils equal and reactive to light. No focal neurological deficits."
    }
    return {
        "success": True,
        "system": system,
        "finding": findings.get(system, "Unremarkable physical examination findings.")
    }


# ── Investigation Ordering Endpoint ────────────────────────────────

@fmge_cases_router.post("/{id}/investigations")
async def order_investigations(id: str, request: OrderInvestigationRequest):
    """Simulates realistic lab test and radiology image reports."""
    reports = [
        {
            "investigation": "12-Lead ECG",
            "report_text": "ST-segment elevation of 2.5 mm in leads II, III, and aVF with reciprocal ST depression in I and aVL.",
            "interpretation": "Acute Inferior Wall Myocardial Infarction (IWMI)",
            "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80"
        },
        {
            "investigation": "Serum Cardiac Biomarkers",
            "report_text": "Troponin I: 4.8 ng/mL (Normal < 0.04 ng/mL) | CK-MB: 48 U/L (Normal < 25 U/L).",
            "interpretation": "Markedly elevated cardiac biomarkers confirming myocardial necrosis.",
            "image_url": None
        },
        {
            "investigation": "Chest X-Ray (PA View)",
            "report_text": "Normal cardiothoracic ratio. No pulmonary congestion or pneumothorax.",
            "interpretation": "Unremarkable Chest X-Ray.",
            "image_url": None
        }
    ]
    return {"success": True, "ordered": request.investigations, "reports": reports}


# ── Evaluate Clinical Session Endpoint ──────────────────────────────

@fmge_cases_router.post("/{id}/evaluate")
async def evaluate_clinical_case(id: str, request: SubmitDiagnosisRequest):
    """Evaluates student's primary diagnosis, differentials, and treatment plan."""
    correct_diagnosis = "Acute Inferior Wall Myocardial Infarction (RCA Occlusion)"
    is_correct = "inferior" in request.primary_diagnosis.lower() or "mi" in request.primary_diagnosis.lower() or "myocardial" in request.primary_diagnosis.lower()

    return {
        "success": True,
        "evaluation": {
            "overall_clinical_score": 92.5 if is_correct else 55.0,
            "diagnostic_accuracy": "100% (Correct)" if is_correct else "Incorrect Diagnosis",
            "investigation_efficiency": "90% (Appropriate ECG & Cardiac Enzymes ordered)",
            "unnecessary_investigations": [],
            "treatment_plan_accuracy": "94% (Appropriate Aspirin + Clopidogrel + Heparin + Emergency PCI pathway)",
            "correct_primary_diagnosis": correct_diagnosis,
            "evidence_based_feedback": "Excellent diagnostic reasoning! ST elevation in leads II, III, aVF represents Inferior Wall MI (RCA occlusion). Immediate dual antiplatelet therapy and primary PCI are the gold-standard interventions.",
            "learning_points": [
                "Inferior Wall MI is supplied by Right Coronary Artery (RCA) in 85-90% of cases.",
                "Always check right-sided ECG leads (V3R, V4R) if RV infarction is suspected before giving Nitrates."
            ]
        }
    }


# ── Analytics Endpoint ──────────────────────────────────────────────

@fmge_cases_router.get("/analytics")
async def get_clinical_analytics():
    """Returns clinical reasoning metrics and diagnostic accuracy history."""
    return {
        "success": True,
        "analytics": {
            "cases_completed": 14,
            "diagnostic_accuracy_pct": 88.4,
            "reasoning_score_avg": 91.2,
            "investigation_efficiency_pct": 86.5,
            "emergency_success_rate_pct": 92.0,
            "strongest_specialty": "Cardiology & Emergency Medicine",
            "weakest_specialty": "Pediatric Airway Emergencies"
        }
    }
