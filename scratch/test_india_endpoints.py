import sys
import os
sys.path.insert(0, r"c:\Users\Sunil\OneDrive\Desktop\AURA\backend")

import json
from fastapi.testclient import TestClient
from app.main import app
from app.auth import get_current_user
from app.database import SessionLocal
from app.models import IndianCollege

client = TestClient(app)

# Override get_current_user dependency for testing matching
def mock_user():
    return {"sub": "test_verification_user", "email": "test.verify@auraroutes.com", "role": "authenticated"}

app.dependency_overrides[get_current_user] = mock_user

print("--------------------------------------------------")
print("VERIFYING STUDY IN INDIA BACKEND ENDPOINTS")
print("--------------------------------------------------")

# 1. Test Catalog GET
print("1. Testing GET /api/india/colleges/catalog...")
response = client.get("/api/india/colleges/catalog")
if response.status_code == 200:
    data = response.json()
    print(f"SUCCESS: Catalog returned {len(data)} colleges.")
    if len(data) > 0:
        print(f"Sample College: {data[0]['name']} in {data[0]['city']}, {data[0]['state']} (Course: {data[0]['course']})")
else:
    print(f"FAILURE: Status code {response.status_code}. Content: {response.text}")

# 2. Test Matcher POST (with NEET score for MBBS)
print("\n2. Testing POST /api/india/college-matcher (MBBS with NEET score)...")
payload = {
    "course": "MBBS",
    "budget": "15 - 25 Lakhs",
    "preferred_state": "Tamil Nadu",
    "preferred_city": "Vellore",
    "neet_score": 620,
    "dasa_eligible": False,
    "nri_status": False
}
response = client.post("/api/india/college-matcher", json=payload)
if response.status_code == 200:
    data = response.json()
    recs = data.get("recommendations", [])
    print(f"SUCCESS: Matcher returned {len(recs)} matches.")
    for idx, r in enumerate(recs[:2]):
        print(f"  Match #{idx+1}: {r['college_name']} | Match Score: {r['match_percentage']}% | Fees: {r['estimated_fees']}")
else:
    print(f"FAILURE: Status code {response.status_code}. Content: {response.text}")

# 3. Test Matcher POST (Engineering with DASA eligibility)
print("\n3. Testing POST /api/india/college-matcher (Engineering with DASA)...")
payload = {
    "course": "Engineering",
    "budget": "5 - 15 Lakhs",
    "preferred_state": "Tamil Nadu",
    "preferred_city": "Tiruchirappalli",
    "neet_score": None,
    "dasa_eligible": True,
    "nri_status": False
}
response = client.post("/api/india/college-matcher", json=payload)
if response.status_code == 200:
    data = response.json()
    recs = data.get("recommendations", [])
    print(f"SUCCESS: Matcher returned {len(recs)} matches.")
    for idx, r in enumerate(recs[:2]):
        print(f"  Match #{idx+1}: {r['college_name']} | Match Score: {r['match_percentage']}% | Fees: {r['estimated_fees']}")
else:
    print(f"FAILURE: Status code {response.status_code}. Content: {response.text}")

print("--------------------------------------------------")
print("TEST RUN COMPLETED")
print("--------------------------------------------------")
