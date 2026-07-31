with open(r"c:\Users\Sunil\OneDrive\Desktop\AURA\website\app\dashboard\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
for i in range(1180, 1220):
    if i < len(lines):
        print(f"{i+1}: {lines[i].rstrip()}")
