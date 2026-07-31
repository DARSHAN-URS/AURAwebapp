import sys
import os
sys.path.insert(0, r"c:\Users\Sunil\OneDrive\Desktop\AURA\backend")

import json
from fastapi.testclient import TestClient
from app.main import app
from app.auth import get_current_user
from app.database import SessionLocal
from app.models import MBBSUniversity, UniversityMatch

client = TestClient(app)

# Override auth dependency
def mock_user():
    return {"sub": "test_mbbs_verification_user", "email": "test.mbbs@auraroutes.com", "role": "authenticated"}

app.dependency_overrides[get_current_user] = mock_user

print("--------------------------------------------------")
print("VERIFYING MBBS ABROAD MATCHER ENDPOINTS")
print("--------------------------------------------------")

# 1. Test Catalog GET
print("1. Testing GET /api/mbbs-matcher/catalog...")
response = client.get("/api/mbbs-matcher/catalog")
if response.status_code == 200:
    data = response.json()
    print(f"SUCCESS: Catalog returned {len(data)} colleges.")
    if len(data) > 0:
        print(f"Sample College: {data[0]['name']} in {data[0]['country']} (Fees: {data[0]['annual_fees']}, Duration: {data[0]['duration']} years)")
else:
    print(f"FAILURE: Status code {response.status_code}. Content: {response.text}")

# 2. Test Matcher POST
print("\n2. Testing POST /api/mbbs-matcher (Qualified score)...")
payload = {
    "neet_score": 350,
    "category": "General",
    "budget": "15 - 25 Lakhs",
    "preferred_countries": ["Georgia", "Russia"],
    "preferred_language": "English",
    "hostel_required": True,
    "scholarship_required": False,
    "passport_status": "Available"
}
response = client.post("/api/mbbs-matcher", json=payload)
if response.status_code == 200:
    data = response.json()
    recs = data.get("recommendations", [])
    print(f"SUCCESS: Matcher returned {len(recs)} matches.")
    for idx, r in enumerate(recs[:2]):
        print(f"  Match #{idx+1}: {r['university_name']} in {r['country']} | Match Score: {r['match_percentage']}% | Fees: {r['estimated_tuition']}")
else:
    print(f"FAILURE: Status code {response.status_code}. Content: {response.text}")

# 3. Test Matcher History GET
print("\n3. Testing GET /api/mbbs-matcher/history...")
response = client.get("/api/mbbs-matcher/history")
if response.status_code == 200:
    data = response.json()
    print(f"SUCCESS: History returned {len(data)} records.")
    if len(data) > 0:
        print(f"First match record ID: {data[0]['id']} with {len(data[0]['recommendations'])} recommendations.")
else:
    print(f"FAILURE: Status code {response.status_code}. Content: {response.text}")

# Cleanup test user matches
print("\nCleaning up test user database matches...")
db = SessionLocal()
db.query(UniversityMatch).filter(UniversityMatch.user_id == "test_mbbs_verification_user").delete()
db.commit()
db.close()
print("Cleanup done.")

print("--------------------------------------------------")
print("TEST RUN COMPLETED")
print("--------------------------------------------------")
