import os

filepath = r"c:\Users\Sunil\OneDrive\Desktop\AURA\backend\app\services\payment_service.py"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

if "def seed_mbbs_universities" not in content:
    addition = """

def seed_mbbs_universities(db: Session):
    \"\"\"
    Seeds verified NMC-approved MBBS universities abroad (Georgia, Russia, Kazakhstan, etc.)
    \"\"\"
    from ..models import MBBSUniversity

    if db.query(MBBSUniversity).count() > 0:
        return

    logger.info("Seeding top NMC-approved MBBS universities database...")
    unis = [
        {
            "name": "Tbilisi State Medical University",
            "country": "Georgia",
            "nmc_approved": True,
            "annual_fees": "$8,000 USD",
            "hostel_fees": "$1,200 USD",
            "living_cost": "$2,500 USD",
            "duration": 6,
            "language": "English",
            "eligibility": "50% in Class 12 PCB (General), NEET Qualified",
            "minimum_neet": 137,
            "recognition": "WHO, NMC, ECFMG, WFME",
            "status": "Active"
        },
        {
            "name": "Kazan Federal University",
            "country": "Russia",
            "nmc_approved": True,
            "annual_fees": "$6,000 USD",
            "hostel_fees": "$500 USD",
            "living_cost": "$1,800 USD",
            "duration": 6,
            "language": "English",
            "eligibility": "50% in Class 12 PCB, NEET Qualified",
            "minimum_neet": 137,
            "recognition": "WHO, NMC, UNESCO",
            "status": "Active"
        },
        {
            "name": "Kazakh National Medical University",
            "country": "Kazakhstan",
            "nmc_approved": True,
            "annual_fees": "$5,000 USD",
            "hostel_fees": "$600 USD",
            "living_cost": "$1,500 USD",
            "duration": 5,
            "language": "English",
            "eligibility": "50% in Class 12 PCB, NEET Qualified",
            "minimum_neet": 137,
            "recognition": "WHO, NMC, ECFMG",
            "status": "Active"
        },
        {
            "name": "Tashkent Medical Academy",
            "country": "Uzbekistan",
            "nmc_approved": True,
            "annual_fees": "$4,500 USD",
            "hostel_fees": "$600 USD",
            "living_cost": "$1,400 USD",
            "duration": 6,
            "language": "English",
            "eligibility": "50% in Class 12 PCB, NEET Qualified",
            "minimum_neet": 137,
            "recognition": "WHO, NMC, ECFMG",
            "status": "Active"
        },
        {
            "name": "University of Perpetual Help System DALTA",
            "country": "Philippines",
            "nmc_approved": True,
            "annual_fees": "$5,500 USD",
            "hostel_fees": "$1,000 USD",
            "living_cost": "$2,000 USD",
            "duration": 6,
            "language": "English",
            "eligibility": "50% in Class 12 PCB, NMAT and NEET Qualified",
            "minimum_neet": 137,
            "recognition": "WHO, NMC, ECFMG, CHED",
            "status": "Active"
        },
        {
            "name": "Dhaka National Medical College",
            "country": "Bangladesh",
            "nmc_approved": True,
            "annual_fees": "$7,500 USD",
            "hostel_fees": "$1,000 USD",
            "living_cost": "$1,500 USD",
            "duration": 5,
            "language": "English",
            "eligibility": "GPA 7.0 combined in SSC and HSC (minimum GPA 3.5 in Biology), NEET Qualified",
            "minimum_neet": 137,
            "recognition": "WHO, NMC, BMDC",
            "status": "Active"
        },
        {
            "name": "Cairo University Faculty of Medicine",
            "country": "Egypt",
            "nmc_approved": True,
            "annual_fees": "$6,000 USD",
            "hostel_fees": "$1,200 USD",
            "living_cost": "$2,200 USD",
            "duration": 6,
            "language": "English",
            "eligibility": "50% in Class 12 PCB, NEET Qualified",
            "minimum_neet": 137,
            "recognition": "WHO, NMC, ECFMG",
            "status": "Active"
        },
        {
            "name": "Carol Davila University of Medicine and Pharmacy",
            "country": "Romania",
            "nmc_approved": True,
            "annual_fees": "$8,500 USD",
            "hostel_fees": "$1,500 USD",
            "living_cost": "$3,000 USD",
            "duration": 6,
            "language": "English",
            "eligibility": "High School Diploma with Biology and Chemistry credits, NEET Qualified",
            "minimum_neet": 137,
            "recognition": "WHO, NMC, ECFMG, COMS",
            "status": "Active"
        },
        {
            "name": "University of Belgrade Faculty of Medicine",
            "country": "Serbia",
            "nmc_approved": True,
            "annual_fees": "$9,000 USD",
            "hostel_fees": "$1,800 USD",
            "living_cost": "$3,500 USD",
            "duration": 6,
            "language": "English",
            "eligibility": "Class 12 PCB high marks, Entrance Test in Bio & Chem, NEET Qualified",
            "minimum_neet": 137,
            "recognition": "WHO, NMC, ECFMG",
            "status": "Active"
        }
    ]

    for u in unis:
        db.add(MBBSUniversity(**u))
    db.commit()
    logger.info("MBBS universities seeded successfully.")
"""
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.rstrip() + "\n" + addition)
    print("SUCCESS: seed_mbbs_universities added to payment_service.py")
else:
    print("SUCCESS: seed_mbbs_universities already exists")
