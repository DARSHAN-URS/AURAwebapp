import os

filepath = r"c:\Users\Sunil\OneDrive\Desktop\AURA\backend\app\services\match_service.py"
addition_path = r"C:\Users\Sunil\OneDrive\Desktop\AURA\scratch\mbbs_match_addition.txt"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

if "def evaluate_mbbs_abroad_matches_ai" not in content:
    with open(addition_path, "r", encoding="utf-8") as f:
        addition = f.read()
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.rstrip() + "\n" + addition)
    print("SUCCESS: MBBS matching functions added to match_service.py")
else:
    print("SUCCESS: MBBS matching functions already exist")
