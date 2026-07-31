import os

filepath = r"c:\Users\Sunil\OneDrive\Desktop\AURA\backend\app\services\match_service.py"
addition_path = r"C:\Users\Sunil\OneDrive\Desktop\AURA\scratch\match_addition.txt"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

if "def evaluate_indian_college_matches_ai" not in content:
    with open(addition_path, "r", encoding="utf-8") as f:
        addition = f.read()
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.rstrip() + "\n" + addition)
    print("SUCCESS: Indian college matching functions added to match_service.py")
else:
    print("SUCCESS: Indian college matching functions already exist")
