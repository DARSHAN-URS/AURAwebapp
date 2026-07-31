import os

filepath = r"c:\Users\Sunil\OneDrive\Desktop\AURA\backend\app\api\university_matcher.py"
addition_path = r"C:\Users\Sunil\OneDrive\Desktop\AURA\scratch\matcher_addition.txt"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Modify imports to include Indian College items
if "IndianCollegeProfileInput" not in content:
    # Let's add them at standard import locations
    content = content.replace(
        "from ..schemas import (",
        "from ..schemas import (\n    IndianCollegeProfileInput,\n    IndianCollegeMatchResponse,"
    )
    content = content.replace(
        "from ..services.match_service import evaluate_university_matches_ai",
        "from ..services.match_service import evaluate_university_matches_ai, evaluate_indian_college_matches_ai"
    )

if "match_indian_colleges" not in content:
    with open(addition_path, "r", encoding="utf-8") as f:
        addition = f.read()
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.rstrip() + "\n" + addition)
    print("SUCCESS: Indian college endpoints added to university_matcher.py")
else:
    print("SUCCESS: Indian college endpoints already exist")
