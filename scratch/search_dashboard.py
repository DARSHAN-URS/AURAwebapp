with open(r"c:\Users\Sunil\OneDrive\Desktop\AURA\website\app\dashboard\page.tsx", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f, 1):
        if "overview" in line or "profile_completeness" in line:
            print(f"Line {idx}: {line.strip()}")
