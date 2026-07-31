import sys
import os
sys.path.insert(0, r"c:\Users\Sunil\OneDrive\Desktop\AURA\backend")

from fastapi.testclient import TestClient
from app.main import app
from app.auth import get_current_user
from app.database import SessionLocal
from app.models import Profile, UserCountryTier, EligibilityRequest, EligibilityResult, Order, Payment

client = TestClient(app)

TEST_USER_ID = "test_tier_user"
TEST_EMAIL = "test.tier@auraroutes.com"

# Override get_current_user dependency for verification
def mock_user():
    return {"sub": TEST_USER_ID, "email": TEST_EMAIL, "role": "authenticated"}

app.dependency_overrides[get_current_user] = mock_user

print("--------------------------------------------------")
print("VERIFYING TIERED COUNTRY ACCESS SYSTEM")
print("--------------------------------------------------")

db = SessionLocal()

# Cleanup previous test data to isolate runs
db.query(UserCountryTier).filter(UserCountryTier.user_id == TEST_USER_ID).delete()
db.query(Profile).filter(Profile.user_id == TEST_USER_ID).delete()
db.query(EligibilityRequest).filter(EligibilityRequest.email == TEST_EMAIL).delete()
db.commit()

# Create a test profile for user
profile = Profile(
    user_id=TEST_USER_ID,
    email=TEST_EMAIL,
    full_name="Test Tier Student"
)
db.add(profile)
db.commit()

# 1. Test Dashboard overview default tier
print("1. Testing GET /api/dashboard (Free Tier 1)...")
response = client.get("/api/dashboard")
if response.status_code == 200:
    data = response.json()
    print(f"SUCCESS: Default Country Tier: {data.get('country_tier')} | Name: {data.get('country_tier_name')}")
else:
    print(f"FAILURE: Status code {response.status_code}. Content: {response.text}")

# 2. Test eligibility check for Free country (Canada)
print("\n2. Testing POST /api/eligibility/check (Free country: Canada)...")
payload = {
    "personal_info": {
        "full_name": "Test Tier Student",
        "email": TEST_EMAIL,
        "phone": "+919891263337",
        "country_residence": "India",
        "nationality": "Indian"
    },
    "academic_profile": {
        "qualification": "High School",
        "gpa_10th": 85.0,
        "gpa_12th": 88.0,
        "grad_year": 2026
    },
    "english_proficiency": {
        "english_exam": "Not Yet Taken"
    },
    "study_preferences": {
        "preferred_country": "Canada",
        "preferred_course": "Computer Science",
        "preferred_intake": "Sept/Fall 2026",
        "budget_range": "$15,000 - $25,000 / €13,000 - €22,000",
        "scholarship_required": False
    },
    "additional_info": {}
}
# Mock openai_service to skip API cost calls
from unittest.mock import patch
from app.schemas import AIResultEvaluation

mock_ai_result = AIResultEvaluation(
    overall_score=85,
    admission_probability="High",
    scholarship_potential="Medium",
    visa_readiness="High",
    strengths=["Good marks in PCM"],
    weaknesses=["No English exam score"],
    suggested_improvements=["Take IELTS"],
    recommended_countries=["Canada"],
    recommended_universities=[{"name": "University of Toronto", "location": "Toronto", "reasoning": "High fit"}],
    suggested_next_steps=["Book booking call"]
)

with patch("app.api.endpoints.evaluate_student_profile", return_value=mock_ai_result):
    response = client.post("/api/eligibility/check", json=payload)
    if response.status_code == 201:
        print("SUCCESS: Checked eligibility for free country Canada.")
    else:
        print(f"FAILURE: Status code {response.status_code}. Content: {response.text}")

# 3. Test eligibility check for Locked country (Georgia)
print("\n3. Testing POST /api/eligibility/check (Locked country: Georgia)...")
payload["study_preferences"]["preferred_country"] = "Georgia"
response = client.post("/api/eligibility/check", json=payload)
if response.status_code == 403:
    print(f"SUCCESS: Correctly blocked access (403 Forbidden). Detail: {response.json().get('detail')}")
else:
    print(f"FAILURE: Status code {response.status_code}. Content: {response.text}")

# 4. Simulate Successful Upgrade to Tier 2
print("\n4. Simulating successful purchase and unlocking Tier 2 country access...")
from app.services.journey_automation import JourneyAutomationService
from app.models import Service
from app.services.payment_service import seed_initial_services

seed_initial_services(db)
tier_service = db.query(Service).filter(Service.slug == "tier-2-country-access").first()

# Setup simulated order and payment in DB
from app.services.payment_service import create_order_transaction
order = create_order_transaction(db, tier_service, TEST_USER_ID)
import uuid
sim_pay_id = f"pay_sim_{uuid.uuid4().hex[:12]}"
sim_sig = f"sig_sim_{uuid.uuid4().hex[:12]}"

payment = Payment(
    order_id=order.id,
    razorpay_payment_id=sim_pay_id,
    razorpay_signature=sim_sig,
    amount=order.amount,
    payment_method="UPI",
    receipt_number="INV_SIM_T2"
)
db.add(payment)
order.payment_status = "paid"
db.commit()

# Trigger automation event
JourneyAutomationService.on_payment_completed(db, TEST_USER_ID, "tier-2-country-access")

# Check dashboard tier info again
response = client.get("/api/dashboard")
if response.status_code == 200:
    data = response.json()
    print(f"SUCCESS: Upgraded Country Tier: {data.get('country_tier')} | Name: {data.get('country_tier_name')}")
else:
    print(f"FAILURE: Dashboard check failed. Content: {response.text}")

# 5. Check eligibility for newly unlocked country (Georgia)
print("\n5. Re-testing eligibility for newly unlocked country Georgia...")
with patch("app.api.endpoints.evaluate_student_profile", return_value=mock_ai_result):
    response = client.post("/api/eligibility/check", json=payload)
    if response.status_code == 201:
        print("SUCCESS: Eligibility check for Georgia succeeded after upgrade!")
    else:
        print(f"FAILURE: Status code {response.status_code}. Content: {response.text}")

# 6. Cleanup test data
print("\nCleaning up test database records...")
db.query(UserCountryTier).filter(UserCountryTier.user_id == TEST_USER_ID).delete()
db.query(Profile).filter(Profile.user_id == TEST_USER_ID).delete()
db.query(EligibilityRequest).filter(EligibilityRequest.email == TEST_EMAIL).delete()
db.query(Order).filter(Order.user_id == TEST_USER_ID).delete()
db.commit()
db.close()
print("Cleanup completed.")

print("--------------------------------------------------")
print("TEST RUN COMPLETED")
print("--------------------------------------------------")
