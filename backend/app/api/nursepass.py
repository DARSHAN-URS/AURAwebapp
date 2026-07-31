from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

from ..database import get_db
from ..models_nursepass import (
    NursePassExam,
    NursePassAIFeature,
    NursePassPricingPlan,
    NursePassCoupon,
    NursePassTestimonial,
    NursePassBlogPost,
    NursePassFAQ,
    NursePassContactLead,
    NursePassSubscriber,
    NursePassAnalyticsEvent
)

router = APIRouter(prefix="/api/v1/nursepass", tags=["NursePass Marketing & Landing"])

# --- Request Schemas ---

class CouponVerifyRequest(BaseModel):
    code: str
    plan_id: str

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    target_exam: Optional[str] = None
    message: Optional[str] = None

class ConsultationRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    target_exam: Optional[str] = None
    preferred_slot: Optional[str] = None

class NewsletterRequest(BaseModel):
    email: EmailStr
    source: Optional[str] = "footer_newsletter"

class AnalyticsEventRequest(BaseModel):
    event_name: str
    path: str
    metadata_json: Optional[Dict[str, Any]] = None

class RazorpayInitRequest(BaseModel):
    plan_id: str
    billing_cycle: str # "monthly" or "annual"
    coupon_code: Optional[str] = None

# --- Endpoints ---

@router.get("/exams")
def get_all_exams(db: Session = Depends(get_db)):
    exams = db.query(NursePassExam).all()
    return {"status": "success", "exams": exams}

@router.get("/exams/{slug}")
def get_exam_by_slug(slug: str, db: Session = Depends(get_db)):
    exam = db.query(NursePassExam).filter(NursePassExam.slug == slug).first()
    if not exam:
        raise HTTPException(status_code=404, detail=f"Exam '{slug}' not found")
    return {"status": "success", "exam": exam}

@router.get("/ai-features")
def get_all_ai_features(db: Session = Depends(get_db)):
    features = db.query(NursePassAIFeature).all()
    return {"status": "success", "features": features}

@router.get("/ai-features/{slug}")
def get_ai_feature_by_slug(slug: str, db: Session = Depends(get_db)):
    feature = db.query(NursePassAIFeature).filter(NursePassAIFeature.slug == slug).first()
    if not feature:
        raise HTTPException(status_code=404, detail=f"AI feature '{slug}' not found")
    return {"status": "success", "feature": feature}

@router.get("/pricing")
def get_pricing_plans(db: Session = Depends(get_db)):
    plans = db.query(NursePassPricingPlan).all()
    return {"status": "success", "plans": plans}

@router.post("/coupons/verify")
def verify_coupon(req: CouponVerifyRequest, db: Session = Depends(get_db)):
    coupon = db.query(NursePassCoupon).filter(NursePassCoupon.code == req.code.upper(), NursePassCoupon.is_active == True).first()
    if not coupon:
        raise HTTPException(status_code=400, detail="Invalid or expired coupon code")
    
    plan = db.query(NursePassPricingPlan).filter(NursePassPricingPlan.plan_id == req.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    discount_amount = 0.0
    if coupon.discount_percent > 0:
        discount_amount = round((plan.monthly_price * coupon.discount_percent) / 100.0, 2)
    elif coupon.discount_flat > 0:
        discount_amount = min(plan.monthly_price, coupon.discount_flat)

    return {
        "status": "success",
        "valid": True,
        "code": coupon.code,
        "discount_percent": coupon.discount_percent,
        "discount_flat": coupon.discount_flat,
        "discount_amount": discount_amount,
        "description": coupon.description
    }

@router.get("/testimonials")
def get_testimonials(
    exam: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(NursePassTestimonial)
    if exam:
        query = query.filter(NursePassTestimonial.exam_passed.ilike(f"%{exam}%"))
    if country:
        query = query.filter(NursePassTestimonial.country.ilike(f"%{country}%"))
    testimonials = query.all()
    return {"status": "success", "testimonials": testimonials}

@router.get("/blogs")
def get_blogs(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(NursePassBlogPost)
    if category and category.lower() != "all":
        query = query.filter(NursePassBlogPost.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (NursePassBlogPost.title.ilike(f"%{search}%")) |
            (NursePassBlogPost.excerpt.ilike(f"%{search}%"))
        )
    blogs = query.order_by(NursePassBlogPost.published_at.desc()).all()
    return {"status": "success", "blogs": blogs}

@router.get("/blogs/{slug}")
def get_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    blog = db.query(NursePassBlogPost).filter(NursePassBlogPost.slug == slug).first()
    if not blog:
        raise HTTPException(status_code=404, detail=f"Blog article '{slug}' not found")
    
    # Fetch related articles
    related = db.query(NursePassBlogPost).filter(
        NursePassBlogPost.category == blog.category,
        NursePassBlogPost.id != blog.id
    ).limit(3).all()
    
    return {"status": "success", "blog": blog, "related": related}

@router.get("/faqs")
def get_faqs(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(NursePassFAQ)
    if category and category.lower() != "all":
        query = query.filter(NursePassFAQ.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (NursePassFAQ.question.ilike(f"%{search}%")) |
            (NursePassFAQ.answer.ilike(f"%{search}%"))
        )
    faqs = query.order_by(NursePassFAQ.order.asc()).all()
    return {"status": "success", "faqs": faqs}

@router.post("/contact")
def submit_contact(req: ContactRequest, db: Session = Depends(get_db)):
    lead = NursePassContactLead(
        name=req.name,
        email=req.email,
        phone=req.phone,
        target_exam=req.target_exam,
        lead_type="contact",
        message=req.message
    )
    db.add(lead)
    db.commit()
    return {"status": "success", "message": "Thank you for contacting NursePass! A nurse counselor will reach out within 2 hours."}

@router.post("/consultation")
def book_consultation(req: ConsultationRequest, db: Session = Depends(get_db)):
    lead = NursePassContactLead(
        name=req.name,
        email=req.email,
        phone=req.phone,
        target_exam=req.target_exam,
        lead_type="consultation",
        preferred_slot=req.preferred_slot
    )
    db.add(lead)
    db.commit()
    return {"status": "success", "message": "Consultation successfully booked! Confirmation email and calendar invite sent."}

@router.post("/newsletter")
def subscribe_newsletter(req: NewsletterRequest, db: Session = Depends(get_db)):
    existing = db.query(NursePassSubscriber).filter(NursePassSubscriber.email == req.email).first()
    if existing:
        return {"status": "success", "message": "You are already subscribed to NursePass updates!"}
    
    sub = NursePassSubscriber(email=req.email, source=req.source or "footer_newsletter")
    db.add(sub)
    db.commit()
    return {"status": "success", "message": "Successfully subscribed to NursePass nursing exam updates and study tips!"}

@router.post("/analytics/event")
def track_analytics_event(req: AnalyticsEventRequest, db: Session = Depends(get_db)):
    event = NursePassAnalyticsEvent(
        event_name=req.event_name,
        path=req.path,
        metadata_json=req.metadata_json
    )
    db.add(event)
    db.commit()
    return {"status": "success", "recorded": True}

@router.post("/payments/razorpay-init")
def init_razorpay_checkout(req: RazorpayInitRequest, db: Session = Depends(get_db)):
    plan = db.query(NursePassPricingPlan).filter(NursePassPricingPlan.plan_id == req.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    price = plan.annual_price if req.billing_cycle == "annual" else plan.monthly_price
    
    if req.coupon_code:
        coupon = db.query(NursePassCoupon).filter(NursePassCoupon.code == req.coupon_code.upper()).first()
        if coupon:
            if coupon.discount_percent > 0:
                price = price * (1 - (coupon.discount_percent / 100.0))
            elif coupon.discount_flat > 0:
                price = max(0.0, price - coupon.discount_flat)
                
    amount_cents = int(round(price * 100))
    order_id = f"order_np_{int(datetime.utcnow().timestamp())}_{plan.plan_id}"
    
    return {
        "status": "success",
        "order_id": order_id,
        "plan_name": plan.name,
        "amount": price,
        "amount_in_subunits": amount_cents,
        "currency": plan.currency,
        "key_id": "rzp_test_nursepass_key", # Sandbox / Live key placeholder
        "notes": {
            "billing_cycle": req.billing_cycle,
            "coupon": req.coupon_code
        }
    }
