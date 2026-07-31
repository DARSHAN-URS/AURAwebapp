import os

filepath = r"c:\Users\Sunil\OneDrive\Desktop\AURA\backend\app\services\payment_service.py"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

if "def seed_indian_colleges" not in content:
    addition = """

def seed_indian_colleges(db: Session):
    \"\"\"
    Seeds a representative list of top Indian colleges for MBBS, Nursing, Engineering, and Management.
    \"\"\"
    from ..models import IndianCollege

    if db.query(IndianCollege).count() > 0:
        return

    logger.info("Seeding top Indian colleges database...")
    colleges = [
        # MBBS
        {
            "name": "All India Institute of Medical Sciences (AIIMS)",
            "location": "Ansari Nagar, New Delhi",
            "state": "Delhi",
            "city": "New Delhi",
            "course": "MBBS",
            "specializations": "General Medicine, Surgery, Pediatrics, Cardiology, Neurology",
            "neet_required": True,
            "dasa_eligible": False,
            "ciwg_eligible": False,
            "nri_fee_structure": "$22,000 USD / year",
            "international_fee_structure": "$25,000 USD / year",
            "hostel_available": True,
            "website": "https://www.aiims.edu",
            "status": "Active"
        },
        {
            "name": "Christian Medical College (CMC)",
            "location": "Ida Scudder Road, Vellore",
            "state": "Tamil Nadu",
            "city": "Vellore",
            "course": "MBBS",
            "specializations": "General Medicine, Surgery, Orthopedics, Ophthalmology",
            "neet_required": True,
            "dasa_eligible": True,
            "ciwg_eligible": True,
            "nri_fee_structure": "$18,000 USD / year",
            "international_fee_structure": "$20,000 USD / year",
            "hostel_available": True,
            "website": "https://www.cmch-vellore.edu",
            "status": "Active"
        },
        {
            "name": "Armed Forces Medical College (AFMC)",
            "location": "Wanowrie, Pune",
            "state": "Maharashtra",
            "city": "Pune",
            "course": "MBBS",
            "specializations": "General Medicine, Military Medicine, Surgery",
            "neet_required": True,
            "dasa_eligible": False,
            "ciwg_eligible": False,
            "nri_fee_structure": None,
            "international_fee_structure": None,
            "hostel_available": True,
            "website": "https://www.afmc.nic.in",
            "status": "Active"
        },
        {
            "name": "Kasturba Medical College (KMC)",
            "location": "Madhav Nagar, Manipal",
            "state": "Karnataka",
            "city": "Manipal",
            "course": "MBBS",
            "specializations": "General Medicine, Surgery, Pediatrics, Dermatology",
            "neet_required": True,
            "dasa_eligible": True,
            "ciwg_eligible": True,
            "nri_fee_structure": "$24,000 USD / year",
            "international_fee_structure": "$26,000 USD / year",
            "hostel_available": True,
            "website": "https://www.manipal.edu",
            "status": "Active"
        },
        # Nursing
        {
            "name": "AIIMS College of Nursing",
            "location": "Ansari Nagar, New Delhi",
            "state": "Delhi",
            "city": "New Delhi",
            "course": "Nursing",
            "specializations": "B.Sc. Nursing, M.Sc. Psychiatric Nursing, M.Sc. Pediatric Nursing",
            "neet_required": False,
            "dasa_eligible": False,
            "ciwg_eligible": False,
            "nri_fee_structure": "$4,000 USD / year",
            "international_fee_structure": "$5,000 USD / year",
            "hostel_available": True,
            "website": "https://www.aiims.edu",
            "status": "Active"
        },
        {
            "name": "CMC College of Nursing",
            "location": "Kagithapattarai, Vellore",
            "state": "Tamil Nadu",
            "city": "Vellore",
            "course": "Nursing",
            "specializations": "B.Sc. Nursing, M.Sc. Medical Surgical Nursing",
            "neet_required": False,
            "dasa_eligible": True,
            "ciwg_eligible": False,
            "nri_fee_structure": "$3,500 USD / year",
            "international_fee_structure": "$4,000 USD / year",
            "hostel_available": True,
            "website": "https://www.cmch-vellore.edu",
            "status": "Active"
        },
        # Engineering
        {
            "name": "Indian Institute of Technology Bombay (IITB)",
            "location": "Powai, Mumbai",
            "state": "Maharashtra",
            "city": "Mumbai",
            "course": "Engineering",
            "specializations": "Computer Science, Electrical, Mechanical, Aerospace, Chemical",
            "neet_required": False,
            "dasa_eligible": False,
            "ciwg_eligible": False,
            "nri_fee_structure": "$8,000 USD / year",
            "international_fee_structure": "$10,000 USD / year",
            "hostel_available": True,
            "website": "https://www.iitb.ac.in",
            "status": "Active"
        },
        {
            "name": "National Institute of Technology (NIT) Trichy",
            "location": "Tanjore Main Road, Tiruchirappalli",
            "state": "Tamil Nadu",
            "city": "Tiruchirappalli",
            "course": "Engineering",
            "specializations": "Computer Science, Electronics & Communication, Mechanical, Civil",
            "neet_required": False,
            "dasa_eligible": True,
            "ciwg_eligible": True,
            "nri_fee_structure": "$8,000 USD / year",
            "international_fee_structure": "$9,500 USD / year",
            "hostel_available": True,
            "website": "https://www.nitt.edu",
            "status": "Active"
        },
        {
            "name": "BITS Pilani",
            "location": "Vidya Vihar, Pilani",
            "state": "Rajasthan",
            "city": "Pilani",
            "course": "Engineering",
            "specializations": "Computer Science, Electronics & Instrumentation, Mechanical, Chemical",
            "neet_required": False,
            "dasa_eligible": True,
            "ciwg_eligible": True,
            "nri_fee_structure": "$9,000 USD / year",
            "international_fee_structure": "$11,000 USD / year",
            "hostel_available": True,
            "website": "https://www.bits-pilani.ac.in",
            "status": "Active"
        },
        # Management
        {
            "name": "Indian Institute of Management Ahmedabad (IIMA)",
            "location": "Vastrapur, Ahmedabad",
            "state": "Gujarat",
            "city": "Ahmedabad",
            "course": "Management",
            "specializations": "Post Graduate Programme (PGP) in Management, PGP-FABM",
            "neet_required": False,
            "dasa_eligible": False,
            "ciwg_eligible": False,
            "nri_fee_structure": "$35,000 USD / program",
            "international_fee_structure": "$40,000 USD / program",
            "hostel_available": True,
            "website": "https://www.iima.ac.in",
            "status": "Active"
        },
        {
            "name": "IIM Bangalore (IIMB)",
            "location": "Bannerghatta Road, Bangalore",
            "state": "Karnataka",
            "city": "Bangalore",
            "course": "Management",
            "specializations": "MBA, Post Graduate Programme in Business Analytics",
            "neet_required": False,
            "dasa_eligible": False,
            "ciwg_eligible": False,
            "nri_fee_structure": "$33,000 USD / program",
            "international_fee_structure": "$38,000 USD / program",
            "hostel_available": True,
            "website": "https://www.iimb.ac.in",
            "status": "Active"
        },
        {
            "name": "Symbiosis Institute of Business Management (SIBM)",
            "location": "Lavale, Pune",
            "state": "Maharashtra",
            "city": "Pune",
            "course": "Management",
            "specializations": "MBA in Marketing, Finance, HR, Operations",
            "neet_required": False,
            "dasa_eligible": True,
            "ciwg_eligible": False,
            "nri_fee_structure": "$15,000 USD / year",
            "international_fee_structure": "$18,000 USD / year",
            "hostel_available": True,
            "website": "https://www.sibmpune.edu.in",
            "status": "Active"
        }
    ]

    for col in colleges:
        db.add(IndianCollege(**col))
    db.commit()
    logger.info("Indian colleges seeded successfully.")
"""
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.rstrip() + "\n" + addition)
    print("SUCCESS: seed_indian_colleges added to payment_service.py")
else:
    print("SUCCESS: seed_indian_colleges already exists")
