from sqlalchemy.orm import Session
from datetime import datetime
from ..models_nursepass import (
    NursePassExam,
    NursePassAIFeature,
    NursePassPricingPlan,
    NursePassCoupon,
    NursePassTestimonial,
    NursePassBlogPost,
    NursePassFAQ,
    NursePassContactLead,
    NursePassSubscriber,
    NursePassAnalyticsEvent
)

def seed_nursepass_data(db: Session):
    """Seed comprehensive NursePass production marketing data if tables are empty."""
    # 1. Seed Exams
    if db.query(NursePassExam).count() == 0:
        exams = [
            NursePassExam(
                slug="nclex-rn",
                name="NCLEX-RN",
                title="National Council Licensure Examination for Registered Nurses (USA & Canada)",
                icon="Stethoscope",
                category="Licensing",
                country="USA & Canada",
                short_description="The essential licensure exam for registered nurses aiming to practice in the United States and Canada.",
                full_overview="The NCLEX-RN tests the knowledge, skills, and abilities essential for safe and effective nursing practice at the entry level. NursePass AI simulates the NGN (Next Generation NCLEX) adaptive testing environment with clinical judgment measurement model case studies.",
                eligibility=[
                    "Degree or Diploma in Nursing (BSc Nursing, GNM, or equivalent)",
                    "Active Registration/License with State Nursing Council in home country",
                    "CGFNS Credentials Evaluation Service (CES) report or NYSED Verification",
                    "English language proficiency (IELTS/TOEFL) where applicable"
                ],
                exam_pattern={
                    "total_questions": "85 to 150 Adaptive Computerized Adaptive Test (CAT) questions",
                    "duration": "5 Hours max",
                    "format": "Next Gen NCLEX (NGN) format with Matrix Grid, Extended Multiple Response, Drag-and-Drop, Case Studies",
                    "passing_score": "Logit value calculated dynamically by CAT algorithm above the passing standard threshold"
                },
                syllabus=[
                    {"topic": "Safe and Effective Care Environment", "weightage": "26 - 38%", "description": "Management of Care, Safety, and Infection Control"},
                    {"topic": "Health Promotion and Maintenance", "weightage": "6 - 12%", "description": "Growth, Development, Ante/Intra/Postpartum Care, Wellness"},
                    {"topic": "Psychosocial Integrity", "weightage": "6 - 12%", "description": "Mental Health Concepts, Coping Mechanisms, Crisis Intervention"},
                    {"topic": "Physiological Integrity", "weightage": "38 - 50%", "description": "Basic Care & Comfort, Pharmacological & Parenteral Therapies, Reduction of Risk Potential, Physiological Adaptation"}
                ],
                passing_criteria="Computerized Adaptive Test evaluates performance continuously. Passing threshold is established when 95% certainty is reached that the candidate's capability exceeds standard minimum safe practice.",
                ai_prep_features=["adaptive-qbank", "chat-tutor", "analytics", "mock-test-engine"],
                faqs=[
                    {"q": "What is Next Gen NCLEX (NGN)?", "a": "NGN introduces clinical judgment measurement case studies and new item types (matrix, drag-drop, trend items) to evaluate real-world decision making under pressure."},
                    {"q": "How does NursePass AI help for NCLEX-RN?", "a": "NursePass AI uses CAT algorithms identical to NCSBN test engines, providing instant rationales, NGN case analysis, and weak-area diagnosis."}
                ],
                hero_stat="99.2% NCLEX NGN Pass Rate"
            ),
            NursePassExam(
                slug="cbt",
                name="NMC CBT Nursing",
                title="UK NMC Computer-Based Test (CBT) for Adult Nurses",
                icon="ShieldCheck",
                category="Licensing",
                country="United Kingdom",
                short_description="Mandatory knowledge test for trained nurses seeking registration with the UK Nursing and Midwifery Council (NMC).",
                full_overview="The NMC CBT assesses essential nursing knowledge for safe practice in the UK healthcare system. Divided into Part A (Numeracy) and Part B (Clinical Nursing), NursePass offers instant calculations and clinical scenario feedback.",
                eligibility=[
                    "Recognized professional Nursing Qualification",
                    "Active Registration with home country nursing council",
                    "Passed OET (Grade B in all sub-tests) or IELTS Academic (Overall 7.0)",
                    "Initiated NMC UK Online Portal registration"
                ],
                exam_pattern={
                    "total_questions": "120 Multiple Choice Questions (Part A: 15 Numeracy questions + Part B: 105 Clinical questions)",
                    "duration": "3 Hours (30 mins Part A, 2.5 hours Part B)",
                    "format": "Pearson VUE Computer-Based Test",
                    "passing_score": "Part A: 87%+ (13/15), Part B: 68%+ depending on domain weighting"
                },
                syllabus=[
                    {"topic": "Part A: Numeracy & Drug Calculations", "weightage": "15 Questions", "description": "Dose calculations, flow rates, unit conversions, IV infusions"},
                    {"topic": "Professional Values & Practice", "weightage": "25%", "description": "NMC Code, Accountability, Ethics, Safeguarding, Consent"},
                    {"topic": "Communication & Interpersonal Skills", "weightage": "20%", "description": "Patient communication, multidisciplinary team handover, documentation"},
                    {"topic": "Nursing Practice & Decision Making", "weightage": "40%", "description": "Acute care, chronic disease management, infection control, pharmacology"}
                ],
                passing_criteria="Candidates must pass both Part A (Numeracy) and Part B (Clinical) in a single sitting or re-attempt failing module within allowed NMC re-test windows.",
                ai_prep_features=["adaptive-qbank", "study-planner", "mock-test-engine"],
                faqs=[
                    {"q": "Where can I take the NMC CBT?", "a": "You can take the CBT at Pearson VUE test centers worldwide."},
                    {"q": "How does NursePass AI train for Part A Drug Calculations?", "a": "Our AI step-by-step math solver generates infinite dosage calculation problems with instant error diagnostics."}
                ],
                hero_stat="98.7% UK NMC CBT First-Attempt Pass Rate"
            ),
            NursePassExam(
                slug="oet-nursing",
                name="OET Nursing",
                title="Occupational English Test for Healthcare Professionals - Nursing",
                icon="Languages",
                category="Language",
                country="UK, Australia, New Zealand, USA, UAE, Ireland",
                short_description="The internationally recognized healthcare English language test tailored specifically for nurses.",
                full_overview="OET Nursing measures English language skills in real healthcare contexts: Listening to patient consults, Reading medical literature, Writing discharge letters, and Speaking nurse-patient roleplays.",
                eligibility=[
                    "Nursing students, graduates, or qualified registered nurses seeking international licensure or visa endorsement."
                ],
                exam_pattern={
                    "total_questions": "4 Modules: Listening (45m), Reading (60m), Writing (45m), Speaking (20m)",
                    "duration": "3 Hours 10 Minutes total",
                    "format": "Paper-based or Computer-delivered OET at authorized test centers or OET@Home",
                    "passing_score": "Grade B (350/500) minimum in each sub-test for UK NMC and US CGFNS"
                },
                syllabus=[
                    {"topic": "Listening Sub-test", "weightage": "3 Parts (42 items)", "description": "Part A (Consultation extracts), Part B (Workplace extracts), Part C (Presentation extracts)"},
                    {"topic": "Reading Sub-test", "weightage": "3 Parts (42 items)", "description": "Part A (Expeditious reading), Part B (Short workplace texts), Part C (Deep reading articles)"},
                    {"topic": "Writing Sub-test", "weightage": "1 Scenario (45 min)", "description": "Writing a referral, transfer, or discharge letter based on clinical case notes"},
                    {"topic": "Speaking Sub-test", "weightage": "2 Roleplays (20 min)", "description": "Nurse-patient clinical roleplay conversations assessing linguistic & clinical communication criteria"}
                ],
                passing_criteria="Scoring Grade B (350 points out of 500) across Listening, Reading, Writing, and Speaking sub-tests.",
                ai_prep_features=["writing-evaluator", "speaking-coach", "chat-tutor"],
                faqs=[
                    {"q": "Is OET easier for nurses than IELTS?", "a": "OET uses medical & nursing scenarios rather than general topics, making vocabulary familiar to nurses."},
                    {"q": "How does NursePass AI evaluate OET Writing?", "a": "Our AI Writing Evaluator checks letter structure, conciseness, grammar, and official OET criteria (Purpose, Content, Conciseness, Clarity, Genre, Language)."}
                ],
                hero_stat="97.9% OET Grade B Achievers"
            ),
            NursePassExam(
                slug="dha",
                name="DHA Exam (Dubai)",
                title="Dubai Health Authority Nursing Licensing Exam",
                icon="Building2",
                category="Regional Licensing",
                country="Dubai, UAE",
                short_description="Licensing examination for nurses seeking practice in Dubai public and private healthcare facilities.",
                full_overview="The DHA Nursing exam assesses core clinical competencies required by Dubai Health Authority standards. Prometric-delivered with high focus on emergency care, pharmacology, and patient safety.",
                eligibility=[
                    "BSc Nursing degree + minimum 2 years post-qualification experience, OR Diploma GNM + 2 years experience.",
                    "Active License from home country authority.",
                    "Primary Source Verification (PSV) via DataFlow."
                ],
                exam_pattern={
                    "total_questions": "150 Multiple Choice Questions",
                    "duration": "3 Hours",
                    "format": "Prometric Computer-Based Test",
                    "passing_score": "60% or higher"
                },
                syllabus=[
                    {"topic": "Fundamentals of Nursing", "weightage": "20%", "description": "Basic nursing care, hygiene, safety, patient assessment"},
                    {"topic": "Medical-Surgical Nursing", "weightage": "35%", "description": "Cardiovascular, Respiratory, Endocrine, Gastrointestinal care"},
                    {"topic": "Pediatrics & Maternal Nursing", "weightage": "25%", "description": "Antepartum, labor, neonatal, pediatric emergency care"},
                    {"topic": "Pharmacology & Infection Control", "weightage": "20%", "description": "Medication dosage, safety protocols, UAE health guidelines"}
                ],
                passing_criteria="Achieve minimum 60% overall score in the 150 MCQ Prometric exam.",
                ai_prep_features=["adaptive-qbank", "mock-test-engine"],
                faqs=[
                    {"q": "What is DataFlow PSV for DHA?", "a": "DataFlow verifies your educational certificates, work experience, and nursing license directly with issuing institutions."},
                    {"q": "Can I transfer DHA license to HAAD or MOH?", "a": "Yes! UAE unified license agreement allows license conversion between DHA, DOH/HAAD, and MOH after initial licensing."}
                ],
                hero_stat="98.5% DHA Pass Rate"
            ),
            NursePassExam(
                slug="haad",
                name="HAAD / DOH Exam (Abu Dhabi)",
                title="Department of Health Abu Dhabi (DOH/HAAD) Nurse Licensing Exam",
                icon="Building",
                category="Regional Licensing",
                country="Abu Dhabi, UAE",
                short_description="Licensure exam for nurses targeting career opportunities in Abu Dhabi and Al Ain.",
                full_overview="The DOH (formerly HAAD) examination evaluates clinical judgment and emergency response according to Department of Health Abu Dhabi standards.",
                eligibility=[
                    "BSc Nursing or GNM with 2+ years unbroken clinical experience",
                    "Home country license & DataFlow verification"
                ],
                exam_pattern={
                    "total_questions": "150 MCQs",
                    "duration": "3 Hours",
                    "format": "Pearson VUE Computer Test",
                    "passing_score": "60% minimum"
                },
                syllabus=[
                    {"topic": "Adult Nursing & Critical Care", "weightage": "40%", "description": "ICU, Emergency, Surgical care"},
                    {"topic": "Maternal & Child Health", "weightage": "25%", "description": "Obstetrics, Gynecology, Pediatrics"},
                    {"topic": "Mental Health & Ethics", "weightage": "15%", "description": "Psychiatric nursing, DOH ethical standards"},
                    {"topic": "Pharmacology & Dosage", "weightage": "20%", "description": "Medication calculation, side effect monitoring"}
                ],
                passing_criteria="Achieve 60%+ overall pass threshold.",
                ai_prep_features=["adaptive-qbank", "analytics"],
                faqs=[
                    {"q": "Is DOH/HAAD exam different from DHA?", "a": "Both test similar clinical topics, but DOH places heavier emphasis on critical care and UAE healthcare law."}
                ],
                hero_stat="98.1% DOH Abu Dhabi Pass Rate"
            ),
            NursePassExam(
                slug="moh",
                name="MOH Exam (Sharjah & Northern Emirates)",
                title="Ministry of Health UAE Licensing Examination for Nurses",
                icon="Landmark",
                category="Regional Licensing",
                country="UAE (Sharjah, Ajman, RAK, Fujairah, UAQ)",
                short_description="Official licensing exam for practicing nursing in Ministry of Health hospitals across the 5 Northern Emirates.",
                full_overview="MOH UAE licensure is required for healthcare professionals working in Ministry facilities and private sector clinics in Sharjah and Northern Emirates.",
                eligibility=[
                    "Recognized Nursing Degree/Diploma",
                    "Minimum 2 years clinical work experience",
                    "DataFlow Verification"
                ],
                exam_pattern={
                    "total_questions": "100 Multiple Choice Questions",
                    "duration": "2 Hours",
                    "format": "Prometric Computer Test",
                    "passing_score": "60% pass score"
                },
                syllabus=[
                    {"topic": "General Nursing Concepts", "weightage": "30%", "description": "Patient care, ethics, infection control"},
                    {"topic": "Clinical Specialities", "weightage": "50%", "description": "Med-Surg, OB-GYN, Pediatrics"},
                    {"topic": "Pharmacology & Safety", "weightage": "20%", "description": "Calculations and administration principles"}
                ],
                passing_criteria="60% minimum passing mark.",
                ai_prep_features=["adaptive-qbank", "study-planner"],
                faqs=[
                    {"q": "How many attempts are allowed for MOH UAE?", "a": "Candidates get 3 attempts per credential evaluation application."}
                ],
                hero_stat="99.0% MOH Pass Rate"
            ),
            NursePassExam(
                slug="prometric",
                name="Prometric Gulf Exams (Saudi Arabia & Oman)",
                title="Saudi Commission (SCFHS) & Oman (OMSB) Prometric Nurse Licensing",
                icon="Globe2",
                category="Regional Licensing",
                country="Saudi Arabia (KSA) & Oman",
                short_description="Licensure exam for nurses migrating to Saudi Arabia (SCFHS SNLE) and Oman (OMSB).",
                full_overview="Prometric SNLE (Saudi Nurse Licensure Exam) and OMSB tests cover comprehensive nursing care, emergency management, and Middle East clinical standards.",
                eligibility=[
                    "BSc Nursing or Diploma in Nursing + 1-2 years experience",
                    "Valid registration and MRE/DataFlow report"
                ],
                exam_pattern={
                    "total_questions": "150 MCQs",
                    "duration": "3 Hours",
                    "format": "Prometric Test Center CBT",
                    "passing_score": "50% - 60% depending on exact country board rules"
                },
                syllabus=[
                    {"topic": "Fundamentals & Clinical Procedures", "weightage": "30%", "description": "Standard operating procedures and patient safety"},
                    {"topic": "Specialty Nursing", "weightage": "50%", "description": "ICU, Emergency, OR, Pediatrics, OB-GYN"},
                    {"topic": "Pharmacology", "weightage": "20%", "description": "Dosages, drug interactions, parenteral nutrition"}
                ],
                passing_criteria="50% - 60% passing mark based on country regulation.",
                ai_prep_features=["mock-test-engine", "adaptive-qbank"],
                faqs=[
                    {"q": "What is Saudi SNLE?", "a": "SNLE is the Saudi Nursing Licensing Examination conducted via Prometric test centers globally."}
                ],
                hero_stat="98.8% Prometric Pass Rate"
            )
        ]
        db.add_all(exams)

    # 2. Seed AI Features
    if db.query(NursePassAIFeature).count() == 0:
        features = [
            NursePassAIFeature(
                slug="adaptive-qbank",
                title="AI Adaptive Question Bank",
                subtitle="Computerized Adaptive Testing engine modeled after official NCLEX NGN and Prometric algorithms.",
                icon="BrainCircuit",
                badge="Core Engine",
                short_description="Dynamic question difficulty adaptation with 10,000+ NGN case studies and detailed rationales.",
                full_description="Our AI Adaptive QBank dynamically calculates your ability score (Logit value) after every answer. It presents clinical judgment case studies, matrix items, and dosage calculation challenges tailored precisely to your knowledge gaps.",
                key_benefits=[
                    "10,000+ Verified NCLEX NGN, CBT, and Prometric clinical questions",
                    "Instant step-by-step rationales for correct and incorrect answers",
                    "Dynamic difficulty scaling based on Item Response Theory (IRT)",
                    "Clinical Judgment Measurement Model (CJMM) scenario questions"
                ],
                how_it_works=[
                    {"step": 1, "title": "Diagnostic Initializer", "description": "Assess baseline knowledge across all nursing client-needs categories."},
                    {"step": 2, "title": "Adaptive Selection", "description": "Engine selects next question at your exact boundary of capability."},
                    {"step": 3, "title": "Instant AI Feedback", "description": "Reveals pathophysiology rationales, pharmacological memory hacks, and nursing mnemonics."}
                ],
                tech_specs={"engine": "IRT-CAT Model 4.0", "accuracy": "99.4%", "questions": "10,000+"},
                demo_type="qbank"
            ),
            NursePassAIFeature(
                slug="study-planner",
                title="AI Dynamic Study Planner",
                subtitle="Personalized daily study schedules generated based on your exam date and diagnostic scores.",
                icon="Calendar",
                badge="Smart Schedule",
                short_description="Automatically adjusts daily milestones so you complete every syllabus topic before exam day.",
                full_description="Never worry about what to study today. NursePass AI Planner analyzes your weak subjects, remaining days, and daily available study hours to build an optimized calendar with automatic catching-up capabilities.",
                key_benefits=[
                    "Custom study routine aligned with your target exam date",
                    "Automatic recalibration when you miss a study session",
                    "Spaced repetition revision prompts for high-yield topics",
                    "Mobile sync and calendar notifications"
                ],
                how_it_works=[
                    {"step": 1, "title": "Input Schedule", "description": "Enter your exam date and daily available hours."},
                    {"step": 2, "title": "Algorithmic Generation", "description": "AI maps syllabus weightage into daily bite-sized tasks."},
                    {"step": 3, "title": "Live Tracking", "description": "Planner adapts automatically as you complete tests and modules."}
                ],
                tech_specs={"engine": "ScheduleOptimizer AI", "recalibration": "Realtime"},
                demo_type="planner"
            ),
            NursePassAIFeature(
                slug="chat-tutor",
                title="24/7 AI Clinical Chat Tutor",
                subtitle="Instant clinical explanations, drug interactions, and nursing care plan guidance.",
                icon="MessageSquareCode",
                badge="24/7 Support",
                short_description="Ask any nursing or medical question and get instant evidence-based clinical answers.",
                full_description="Stuck on a tricky pharmacology question or cardiac rhythm interpretation? NursePass AI Chat Tutor provides instant, friendly explanations backed by Mosby's and Saunders nursing guidelines.",
                key_benefits=[
                    "Instant explanations for complex pathophysiology and pharmacology",
                    "ECG strip and lab value interpretation assistant",
                    "Drug dose calculation step-by-step solver",
                    "Multilingual assistance for ESL nursing students"
                ],
                how_it_works=[
                    {"step": 1, "title": "Ask Anything", "description": "Type or voice-ask any clinical topic or question prompt."},
                    {"step": 2, "title": "Medical Knowledge Fetch", "description": "Tutor searches medical database and clinical guidelines."},
                    {"step": 3, "title": "Structured Answer", "description": "Provides easy-to-understand breakdown with memory tricks."}
                ],
                tech_specs={"model": "NurseGPT 4o Clinical", "latency": "<300ms"},
                demo_type="tutor"
            ),
            NursePassAIFeature(
                slug="writing-evaluator",
                title="AI OET Writing Evaluator",
                subtitle="Instant grading of OET Nursing referral and discharge letters against official criteria.",
                icon="FileText",
                badge="OET Specialty",
                short_description="Sub-second OET letter scoring with feedback on Purpose, Content, Conciseness, and Grammar.",
                full_description="Submit your written referral or discharge letters for instant scoring. Our AI Evaluator checks your work against the official 6 OET assessment criteria and highlights exact sentence corrections.",
                key_benefits=[
                    "Instant OET Grade (A, B, C+, C, D) prediction",
                    "Evaluation across all 6 OET criteria: Purpose, Content, Conciseness, Clarity, Genre, Language",
                    "Line-by-line grammar and medical terminology suggestions",
                    "Case notes summarization helper"
                ],
                how_it_works=[
                    {"step": 1, "title": "Select Scenario", "description": "Pick an OET clinical case note task."},
                    {"step": 2, "title": "Write or Paste", "description": "Type your response letter in the editor."},
                    {"step": 3, "title": "Instant Score Card", "description": "Get detailed score breakdown and improved draft within seconds."}
                ],
                tech_specs={"accuracy": "98.9% match to official OET assessors", "criteria_checked": 6},
                demo_type="writing"
            ),
            NursePassAIFeature(
                slug="speaking-coach",
                title="AI OET Speaking Coach",
                subtitle="Interactive voice roleplay scenarios simulating nurse-patient interactions.",
                icon="Mic",
                badge="Voice AI",
                short_description="Practice OET speaking roleplays with real-time feedback on fluency, tone, and empathy.",
                full_description="Engage in realistic voice conversations with AI patients expressing pain, anxiety, or reluctance. Receive instant feedback on your clinical communication, reassurance skills, fluency, and pronunciation.",
                key_benefits=[
                    "Interactive voice roleplay with simulated patients",
                    "Real-time feedback on clinical communication criteria",
                    "Assessment of empathy, sentence structure, and tone",
                    "Audio recording playback and pronunciation corrections"
                ],
                how_it_works=[
                    {"step": 1, "title": "Choose Roleplay", "description": "Select clinical situation (e.g. reassuring post-op patient)."},
                    {"step": 2, "title": "Voice Interaction", "description": "Speak into your mic; AI patient responds in real time."},
                    {"step": 3, "title": "Communication Analysis", "description": "Receive score card for linguistic and clinical skills."}
                ],
                tech_specs={"latency": "Speech-to-Speech < 500ms", "voice_models": "Natural Medical Accents"},
                demo_type="voice"
            ),
            NursePassAIFeature(
                slug="analytics",
                title="AI Performance Analytics",
                subtitle="Deep insight dashboards tracking pass readiness, accuracy trends, and weak domain areas.",
                icon="BarChart3",
                badge="Predictive AI",
                short_description="Accurate pass-probability meter telling you exactly when you are ready to take the exam.",
                full_description="Stop guessing if you are ready. Our predictive analytics engine combines performance data across all client needs categories to calculate your overall readiness index with 99.1% statistical accuracy.",
                key_benefits=[
                    "Realtime Pass Probability Index (0% to 100%)",
                    "Client Needs Category radar chart (Med-Surg, Pharm, OB, Psych)",
                    "Time-per-question efficiency metrics",
                    "Peer percentile benchmarking"
                ],
                how_it_works=[
                    {"step": 1, "title": "Data Aggregation", "description": "Collects question timing, accuracy, and confidence metrics."},
                    {"step": 2, "title": "Readiness Model", "description": "Compares performance against 50,000+ past successful test candidates."},
                    {"step": 3, "title": "Exam Readiness Green Light", "description": "Notifies you when your pass probability hits 95%+."}
                ],
                tech_specs={"prediction_accuracy": "99.1%", "benchmarks": "50,000+ Candidates"},
                demo_type="analytics"
            ),
            NursePassAIFeature(
                slug="mock-test-engine",
                title="AI Full Mock Test Engine",
                subtitle="Full-length timed simulation replicating Pearson VUE and Prometric test screens.",
                icon="Award",
                badge="Full Simulation",
                short_description="Exact replica of official exam interfaces with timed conditions and post-test diagnostic reports.",
                full_description="Experience the exact look, feel, and stress of the official test center. Timed countdowns, scratchpad tools, lab value references, and identical question layouts.",
                key_benefits=[
                    "Exact UI replica of Pearson VUE / Prometric test engines",
                    "Integrated medical calculator and standard lab reference values",
                    "Full performance review with detailed category scores",
                    "Unlimited full-length mock attempts"
                ],
                how_it_works=[
                    {"step": 1, "title": "Start Mock", "description": "Launch full-length timed exam simulation."},
                    {"step": 2, "title": "Exam Execution", "description": "Answer questions under real test conditions."},
                    {"step": 3, "title": "Comprehensive Report", "description": "Get overall pass/fail breakdown and detailed rationales."}
                ],
                tech_specs={"ui_replication": "100% Pearson VUE / Prometric", "mock_count": "Unlimited"},
                demo_type="mock"
            )
        ]
        db.add_all(features)

    # 3. Seed Pricing Plans
    if db.query(NursePassPricingPlan).count() == 0:
        plans = [
            NursePassPricingPlan(
                plan_id="free",
                name="Free Starter",
                tagline="Explore NursePass AI features and practice sample questions.",
                monthly_price=0.0,
                annual_price=0.0,
                currency="USD",
                badge=None,
                is_popular=False,
                features=[
                    {"name": "50 Adaptive QBank Practice Questions", "included": True, "limit": "50 total"},
                    {"name": "1 AI OET Writing Sample Evaluation", "included": True, "limit": "1 sample"},
                    {"name": "Basic Performance Analytics Dashboard", "included": True, "limit": "Basic"},
                    {"name": "24/7 AI Chat Tutor (5 queries/day)", "included": True, "limit": "5/day"},
                    {"name": "Full Length Timed Mock Exams", "included": False, "limit": None},
                    {"name": "AI Speaking Coach Scenarios", "included": False, "limit": None},
                    {"name": "Pass Guarantee & Tutor Consultation", "included": False, "limit": None}
                ],
                cta_text="Start Free Account"
            ),
            NursePassPricingPlan(
                plan_id="basic",
                name="Basic Pass",
                tagline="Essential preparation tools for targeted exam revision.",
                monthly_price=29.0,
                annual_price=23.0,
                currency="USD",
                badge=None,
                is_popular=False,
                features=[
                    {"name": "2,500+ Adaptive QBank Practice Questions", "included": True, "limit": "2,500+"},
                    {"name": "5 AI OET Writing Evaluations / month", "included": True, "limit": "5/mo"},
                    {"name": "Full Performance Analytics & Radar Chart", "included": True, "limit": "Full"},
                    {"name": "24/7 AI Chat Tutor (50 queries/day)", "included": True, "limit": "50/day"},
                    {"name": "2 Full Length Timed Mock Exams / month", "included": True, "limit": "2/mo"},
                    {"name": "AI Speaking Coach Scenarios", "included": False, "limit": None},
                    {"name": "Pass Guarantee & Tutor Consultation", "included": False, "limit": None}
                ],
                cta_text="Subscribe Basic"
            ),
            NursePassPricingPlan(
                plan_id="premium",
                name="Premium Pro",
                tagline="Complete AI suite designed to guarantee first-attempt success.",
                monthly_price=49.0,
                annual_price=39.0,
                currency="USD",
                badge="Most Popular",
                is_popular=True,
                features=[
                    {"name": "10,000+ Full Adaptive QBank Access", "included": True, "limit": "Unlimited"},
                    {"name": "Unlimited AI OET Writing Evaluations", "included": True, "limit": "Unlimited"},
                    {"name": "Predictive Pass Probability Engine (99.1%)", "included": True, "limit": "Unlimited"},
                    {"name": "Unlimited 24/7 AI Chat Tutor", "included": True, "limit": "Unlimited"},
                    {"name": "Unlimited Full Length Timed Mock Exams", "included": True, "limit": "Unlimited"},
                    {"name": "AI Voice Speaking Coach (OET Scenarios)", "included": True, "limit": "Unlimited"},
                    {"name": "1-on-1 Nurse Expert Strategy Session (30m)", "included": True, "limit": "1 session"}
                ],
                cta_text="Get Premium Pro"
            ),
            NursePassPricingPlan(
                plan_id="ultimate",
                name="Ultimate Pass Guarantee",
                tagline="VIP preparation with dedicated nurse mentor + 100% Pass Guarantee.",
                monthly_price=79.0,
                annual_price=63.0,
                currency="USD",
                badge="Pass Guarantee",
                is_popular=False,
                features=[
                    {"name": "Everything in Premium Pro Plan", "included": True, "limit": "Unlimited"},
                    {"name": "100% Money-Back Pass Guarantee", "included": True, "limit": "Guaranteed"},
                    {"name": "Dedicated Human Nurse Mentor via WhatsApp", "included": True, "limit": "Unlimited"},
                    {"name": "Document Verification & DataFlow Support", "included": True, "limit": "Full Support"},
                    {"name": "Priority AI Server Queue & Zero Latency", "included": True, "limit": "Priority"},
                    {"name": "Lifetime Access to Study Notes & Mnemonics", "included": True, "limit": "Lifetime"}
                ],
                cta_text="Claim Ultimate Guarantee"
            )
        ]
        db.add_all(plans)

    # 4. Seed Coupons
    if db.query(NursePassCoupon).count() == 0:
        coupons = [
            NursePassCoupon(code="NURSE20", discount_percent=20.0, description="Special 20% discount for nurses"),
            NursePassCoupon(code="EARLYBIRD", discount_percent=15.0, description="15% early bird registration discount"),
            NursePassCoupon(code="NURSEPASS10", discount_flat=10.0, description="$10 flat discount on premium plans")
        ]
        db.add_all(coupons)

    # 5. Seed Testimonials
    if db.query(NursePassTestimonial).count() == 0:
        testimonials = [
            NursePassTestimonial(
                student_name="Anjali Sharma, RN",
                role_title="Registered Nurse (USA)",
                country="India -> United States",
                exam_passed="NCLEX-RN (Next Gen)",
                score="Passed in 85 Questions",
                review="NursePass AI's adaptive questions were identical to the real Next Gen NCLEX! The clinical judgment case studies prepared me so well that I passed on my first attempt in just 85 questions.",
                photo_url="https://images.unsplash.com/photo-1594824813571-24a69c100dd1?w=400&auto=format&fit=crop&q=80",
                video_url="https://www.w3schools.com/html/mov_bbb.mp4",
                rating=5.0,
                is_featured=True
            ),
            NursePassTestimonial(
                student_name="David Okonjo, BSN",
                role_title="Staff Nurse (NHS UK)",
                country="Nigeria -> United Kingdom",
                exam_passed="NMC CBT Nursing",
                score="Part A: 100%, Part B: 92%",
                review="The AI dosage calculation trainer in NursePass made Part A numeracy so effortless. I finished the CBT in under 1.5 hours with confidence!",
                photo_url="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
                video_url=None,
                rating=5.0,
                is_featured=True
            ),
            NursePassTestimonial(
                student_name="Maria Santos, RN",
                role_title="Surgical Nurse (Australia)",
                country="Philippines -> Australia",
                exam_passed="OET Nursing",
                score="Straight A's & B's (Listening: 410, Speaking: 390)",
                review="I struggled with OET writing for months until I found NursePass AI Writing Evaluator. Instant feedback on my referral letters pushed my score to Grade B in just 2 weeks!",
                photo_url="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
                video_url="https://www.w3schools.com/html/mov_bbb.mp4",
                rating=5.0,
                is_featured=True
            ),
            NursePassTestimonial(
                student_name="Priya Nair, BSN",
                role_title="ICU Specialist (Dubai)",
                country="India -> UAE",
                exam_passed="DHA Nursing Exam",
                score="Score: 84%",
                review="NursePass AI mock tests gave me the exact Prometric feel for DHA. The rationale explanations after each question made studying super fast.",
                photo_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
                video_url=None,
                rating=5.0,
                is_featured=True
            )
        ]
        db.add_all(testimonials)

    # 6. Seed Blogs
    if db.query(NursePassBlogPost).count() == 0:
        blogs = [
            NursePassBlogPost(
                slug="how-to-pass-next-gen-nclex-first-attempt",
                title="How to Crack Next Generation NCLEX (NGN) on Your First Attempt",
                excerpt="Master the NGN Clinical Judgment Measurement Model, matrix items, and adaptive strategy with proven AI preparation workflows.",
                content="""
The Next Generation NCLEX (NGN) introduced a fundamental shift in how nursing competence is evaluated. Rather than testing passive recall, NGN focuses on **Clinical Judgment**: your ability to recognize cues, analyze hypotheses, prioritize actions, and evaluate patient outcomes.

### 1. Master the Clinical Judgment Measurement Model (CJMM)
The CJMM model evaluates 6 cognitive steps:
1. **Recognize Cues:** What information is relevant vs irrelevant?
2. **Analyze Cues:** What do the patient's vitals, lab values, and history suggest?
3. **Prioritize Hypotheses:** Which condition is the highest priority risk?
4. **Generate Solutions:** What nursing interventions are indicated or contraindicated?
5. **Take Action:** Which orders to execute immediately?
6. **Evaluate Outcomes:** How will you determine if the treatment was effective?

### 2. Practice Computerized Adaptive Testing (CAT)
The NCLEX uses CAT technology. The exam adapts to your ability level. When you answer correctly, the next question is harder; when you answer incorrectly, the test presents an easier question until it establishes 95% certainty of your capability.

### 3. Use NursePass AI Adaptive QBank
By training with NursePass AI, you practice NGN matrix grids, drop-down cloze items, and unfolded case studies daily with instant pathophysiology rationales.
                """,
                category="NCLEX Tips",
                author_name="Dr. Sarah Jenkins, DNP, RN",
                author_role="Lead Nurse Educator",
                author_avatar="https://images.unsplash.com/photo-1594824813571-24a69c100dd1?w=200&auto=format&fit=crop&q=80",
                cover_image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
                read_time="6 min read",
                tags=["NCLEX-RN", "NGN", "Study Tips", "Nursing USA"]
            ),
            NursePassBlogPost(
                slug="oet-nursing-writing-masterclass",
                title="OET Nursing Writing Sub-test: The Ultimate 45-Minute Strategy",
                excerpt="Learn how to structure referral letters, eliminate irrelevant case notes, and achieve Grade B or higher effortlessly.",
                content="""
The OET Nursing Writing test requires you to draft a professional referral, transfer, or discharge letter (180–200 words) in 45 minutes based on clinical case notes.

### Key Official Criteria Checked:
- **Purpose (Criteria 1):** Is the reason for writing clear in the introductory paragraph?
- **Content (Criteria 2):** Are all clinically relevant patient details included without leaving out key medical history?
- **Conciseness & Clarity (Criteria 3):** Have you excluded irrelevant background notes (e.g. past dental visits from 5 years ago)?
- **Genre & Style (Criteria 4):** Is the tone formal, professional, and respectful?
- **Organization & Cohesion (Criteria 5):** Is information grouped logically using paragraphs and transitional phrases?
- **Language (Criteria 6):** Are grammar, punctuation, and medical abbreviations correct?

### Step-by-Step Writing Workflow:
1. **First 5 Minutes (Reading Time):** Identify the recipient, patient name, and main reason for writing.
2. **Next 5 Minutes:** Select relevant vs irrelevant case notes.
3. **25 Minutes Writing:** Draft Intro, History, Current Situation, and Request.
4. **Last 10 Minutes:** Proofread using NursePass AI checklist.
                """,
                category="OET Preparation",
                author_name="Claire Thompson, M.Ed",
                author_role="OET Senior Specialist",
                author_avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
                cover_image="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
                read_time="8 min read",
                tags=["OET", "Writing", "UK Nursing", "Australia Nursing"]
            ),
            NursePassBlogPost(
                slug="uk-nmc-cbt-drug-calculation-guide",
                title="UK NMC CBT Nursing: A Foolproof Guide to Part A Drug Calculations",
                excerpt="Never lose a point on dosage, flow rate, or unit conversion questions with these 5 clinical math formulas.",
                content="""
Part A of the UK NMC CBT consists of 15 Numeracy questions. The passing score is 87%+ (minimum 13/15 correct answers).

### Top 5 Formulas to Remember:
1. **Oral Dosage:** `(Desired Dose / Stock Dose) × Stock Volume`
2. **IV Flow Rate (drops/min):** `(Total Volume in mL × Drop Factor) / Time in Minutes`
3. **Infusion Rate (mL/hr):** `Total Volume in mL / Time in Hours`
4. **Body Weight Dose:** `Dose per kg × Weight in kg`
5. **Unit Conversions:**
   - 1 Gram (g) = 1,000 Milligrams (mg)
   - 1 Milligram (mg) = 1,000 Micrograms (mcg)
   - 1 Litre (L) = 1,000 Millilitres (mL)

NursePass AI Drug Calculation Solver allows unlimited formula practice with instant error detection.
                """,
                category="CBT Guide",
                author_name="Mark Roberts, RN, MSc",
                author_role="Clinical Educator UK",
                author_avatar="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
                cover_image="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
                read_time="5 min read",
                tags=["CBT", "NMC", "UK", "Numeracy"]
            ),
            NursePassBlogPost(
                slug="nursing-career-abroad-usa-uk-uae-comparison",
                title="Nursing Career Abroad: USA vs. UK vs. UAE Salary, Processing Time & Licensing",
                excerpt="Comprehensive comparison guide comparing salaries, visa pathways, processing times, and licensing costs for internationally trained nurses.",
                content="""
Choosing the right country for your international nursing career depends on your personal goals, timeline, and family plans.

| Country | Avg Annual Salary | Exam Required | Processing Time | Visa Type |
| :--- | :--- | :--- | :--- | :--- |
| **USA** | $75,000 - $110,000 | NCLEX-RN + OET/IELTS | 12 - 18 Months | EB-3 Green Card (Permanent Residency) |
| **UK** | £28,407 - £38,000 | NMC CBT + OET/IELTS + OSCE | 4 - 6 Months | Health & Care Worker Visa |
| **UAE** | AED 96,000 - 180,000 | DHA / HAAD / MOH | 2 - 4 Months | Employment Residency Visa |

### Which Country is Right for You?
- **USA:** Highest long-term earning potential and immediate Permanent Residency (Green Card).
- **UK:** Fastest timeline to start working as an NHS staff nurse.
- **UAE:** Tax-free salary, proximity to Asia/Africa, and fast DataFlow verification.
                """,
                category="Nursing Career Abroad",
                author_name="Dr. Sarah Jenkins, DNP, RN",
                author_role="Lead Nurse Educator",
                author_avatar="https://images.unsplash.com/photo-1594824813571-24a69c100dd1?w=200&auto=format&fit=crop&q=80",
                cover_image="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80",
                read_time="7 min read",
                tags=["Career", "USA", "UK", "UAE", "Salaries"]
            ),
            NursePassBlogPost(
                slug="5-spaced-repetition-study-hacks-for-nurses",
                title="5 Science-Backed Spaced Repetition Hacks for Nursing Exams",
                excerpt="How to use active recall and spaced repetition memory techniques to remember hundreds of drug names and lab values.",
                content="""
Nursing exams require remembering vast amounts of pharmacology, lab values, and clinical procedures.

### The Forgetting Curve
Research shows that without review, humans forget 70% of new information within 24 hours. Spaced repetition disrupts the forgetting curve by prompting recall at optimal intervals (Day 1, Day 3, Day 7, Day 14, Day 30).

### 5 Effective Hacks:
1. **Active Recall over Passive Rereading:** Test yourself before reading rationales.
2. **High-Yield Pharmacology Mnemonics:** Group drugs by suffix (e.g. *-lol* for Beta Blockers, *-pril* for ACE Inhibitors).
3. **Lab Value Benchmark Cards:** Memorize core values (K+: 3.5–5.0 mEq/L, Na+: 135–145 mEq/L, NaHCO3: 22–26 mEq/L).
4. **Use NursePass AI Daily Flashcard Prompts.**
5. **Teach What You Learn:** Explain clinical concepts out loud as if teaching a junior nurse.
                """,
                category="Study Strategies",
                author_name="Mark Roberts, RN, MSc",
                author_role="Clinical Educator UK",
                author_avatar="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
                cover_image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
                read_time="5 min read",
                tags=["Study Hacks", "Memory", "Pharmacology"]
            ),
            NursePassBlogPost(
                slug="latest-dha-prometric-exam-updates-2026",
                title="Latest Updates for DHA, DOH & Saudi Prometric Nursing Exams in 2026",
                excerpt="Key policy changes regarding DataFlow Primary Source Verification, unified Gulf licenses, and updated passing score thresholds.",
                content="""
The UAE Health Authorities and Saudi Commission for Health Specialties (SCFHS) have announced important updates for foreign nurses taking licensing exams in 2026.

### Key Policy Changes:
1. **Unified UAE License Transferability:** Nurses who pass the DHA exam and work for 1 year in Dubai can now seamlessly transfer their license to Abu Dhabi (DOH) or Sharjah (MOH) without retaking exams.
2. **DataFlow Express Verification:** Primary Source Verification (PSV) turn-around time has been reduced from 30 days to 10 working days.
3. **Updated Question Bank Topics:** Increased focus on telehealth nursing, digital health records, and emergency infection prevention.
                """,
                category="Latest Exam Updates",
                author_name="Priya Nair, BSN",
                author_role="ICU Specialist & Educator",
                author_avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
                cover_image="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
                read_time="4 min read",
                tags=["DHA", "Prometric", "Gulf Nursing", "Updates 2026"]
            )
        ]
        db.add_all(blogs)

    # 7. Seed FAQs
    if db.query(NursePassFAQ).count() == 0:
        faqs = [
            NursePassFAQ(category="Platform", question="What is NursePass?", answer="NursePass is an AI-powered nursing licensing and language exam preparation platform designed specifically for international nurses preparing for NCLEX-RN, NMC CBT, OET Nursing, DHA, HAAD, MOH, and Prometric exams.", order=1),
            NursePassFAQ(category="Platform", question="Can I access NursePass on mobile devices?", answer="Yes! NursePass is fully responsive and available as a PWA app on iOS, Android, tablets, and desktop browsers with offline study capabilities.", order=2),
            NursePassFAQ(category="AI Features", question="How accurate is the AI Adaptive Question Bank?", answer="Our adaptive engine uses Item Response Theory (IRT) algorithms modeled directly on official Pearson VUE NGN and Prometric test software with a 99.4% difficulty accuracy rate.", order=3),
            NursePassFAQ(category="AI Features", question="How does the AI OET Writing Evaluator work?", answer="You can paste or type your written referral or discharge letter. The AI checks it against the 6 official OET criteria (Purpose, Content, Conciseness, Clarity, Genre, Language) and provides instant scoring and line-by-line corrections.", order=4),
            NursePassFAQ(category="Courses", question="Which exams are supported on NursePass?", answer="We support NCLEX-RN (USA & Canada), UK NMC CBT (Adult Nursing), OET Nursing, DHA Dubai, DOH Abu Dhabi (HAAD), MOH UAE, and Gulf Prometric (Saudi SNLE & OMSB Oman).", order=5),
            NursePassFAQ(category="Pricing", question="What payment methods are accepted?", answer="We accept Credit/Debit Cards (Visa, Mastercard, Amex), UPI, NetBanking, Razorpay, PayPal, and Apple Pay/Google Pay.", order=6),
            NursePassFAQ(category="Pricing", question="Is there a free plan available?", answer="Yes! The Free Starter plan gives you access to 50 practice questions, 1 AI OET letter evaluation, and 5 daily AI tutor queries with zero credit card required.", order=7),
            NursePassFAQ(category="Refund", question="What is the 100% Pass Guarantee policy?", answer="Our Ultimate Pass Guarantee plan includes a 100% money-back guarantee. If you complete 80%+ of recommended questions and do not pass your exam, we refund 100% of your subscription cost or extend your plan free until you pass.", order=8),
            NursePassFAQ(category="Technical Support", question="How do I contact customer support if I face an issue?", answer="You can contact us 24/7 via WhatsApp chat (+1-800-NURSEPASS), email (support@nursepass.ai), or submit a ticket through your user dashboard.", order=9)
        ]
        db.add_all(faqs)

    db.commit()
