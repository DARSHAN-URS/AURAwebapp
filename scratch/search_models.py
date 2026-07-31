with open(r"c:\Users\Sunil\OneDrive\Desktop\AURA\backend\app\models.py", "r", encoding="cp1252") as f:
    lines = f.readlines()
for i in range(1315, 1345):
    if i < len(lines):
        print(f"{i+1}: {lines[i].strip()}")
