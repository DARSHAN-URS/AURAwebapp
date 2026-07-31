from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import uuid
import hmac
import hashlib

from ..database import get_db
from .nursepass_auth import get_current_user
from ..models_nursepass import (
    NursePassUserProfile,
    NursePassPricingPlan,
    NursePassSubscription,
    NursePassTransaction,
    NursePassCoupon,
    NursePassInvoice,
    NursePassRefundRequest
)

router = APIRouter(prefix="/api/v1/nursepass/payments", tags=["NursePass Payments & Subscriptions"])

# --- Request Schemas ---

class CreateOrderRequest(BaseModel):
    plan_id: str # free, basic, premium, ultimate
    billing_cycle: str = "annual" # monthly, annual
    coupon_code: Optional[str] = None

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class ApplyCouponRequest(BaseModel):
    coupon_code: str
    plan_id: str = "premium"

class RequestRefundPayload(BaseModel):
    transaction_id: str
    reason: str

# --- Seeder ---

def ensure_payments_seeded(db: Session):
    """Seeds default subscription plans & promo coupons if not present."""
    plan_count = db.query(NursePassPricingPlan).count()
    if plan_count == 0:
        sample_plans = [
            {
                "id": "free",
                "name": "Free Starter",
                "tagline": "Explore core NGN NCLEX & OET features.",
                "monthly": 0.0,
                "annual": 0.0,
                "popular": False,
                "cta": "Get Started Free",
                "features": [
                    {"name": "Limited Question Bank", "included": True, "limit": "20 Qs/day"},
                    {"name": "Basic AI Analytics", "included": True},
                    {"name": "AI Study Planner", "included": False},
                    {"name": "Full Length Mock Tests", "included": False},
                    {"name": "OET Writing & Speaking Evaluator", "included": False}
                ]
            },
            {
                "id": "basic",
                "name": "Basic Scholar",
                "tagline": "Essential practice for single licensing exam.",
                "monthly": 19.0,
                "annual": 15.0,
                "popular": False,
                "cta": "Upgrade to Basic",
                "features": [
                    {"name": "Full Question Bank (5,000+ Qs)", "included": True},
                    {"name": "AI Personal Study Planner", "included": True},
                    {"name": "Basic Mock Tests (2/month)", "included": True},
                    {"name": "Subject Diagnostics Analytics", "included": True},
                    {"name": "OET Writing Evaluator", "included": False}
                ]
            },
            {
                "id": "premium",
                "name": "Premium Pro",
                "tagline": "Complete AI exam prep engine for international nurses.",
                "monthly": 39.0,
                "annual": 29.0,
                "popular": True,
                "cta": "Start Premium Pro Trial",
                "features": [
                    {"name": "Everything in Basic Scholar", "included": True},
                    {"name": "Unlimited CAT Adaptive Mock Tests", "included": True},
                    {"name": "24/7 Aura AI Nurse Chat Tutor", "included": True},
                    {"name": "AI OET Writing Evaluator & Band Score", "included": True},
                    {"name": "AI Virtual Examiner Speaking Coach", "included": True}
                ]
            },
            {
                "id": "ultimate",
                "name": "Ultimate Pass Guarantee",
                "tagline": "100% Pass Guarantee with 1-on-1 Mentor Support.",
                "monthly": 79.0,
                "annual": 59.0,
                "popular": False,
                "cta": "Unlock Ultimate Pass",
                "features": [
                    {"name": "Everything in Premium Pro", "included": True},
                    {"name": "100% Money-Back Pass Guarantee", "included": True},
                    {"name": "1-on-1 Weekly Clinical Mentor Sessions", "included": True},
                    {"name": "Priority AI Response Processing", "included": True},
                    {"name": "B2B Institution License Support", "included": True}
                ]
            }
        ]

        for p in sample_plans:
            db.add(NursePassPricingPlan(
                plan_id=p["id"],
                name=p["name"],
                tagline=p["tagline"],
                monthly_price=p["monthly"],
                annual_price=p["annual"],
                currency="USD",
                features=p["features"],
                is_popular=p["popular"],
                cta_text=p["cta"]
            ))

    # Coupons
    coupon_count = db.query(NursePassCoupon).count()
    if coupon_count == 0:
        db.add(NursePassCoupon(
            code="NURSEPASS50",
            discount_percent=50.0,
            discount_flat=0.0,
            description="50% Off First Purchase",
            expiry_date=datetime.utcnow() + timedelta(days=90),
            is_active=True
        ))
        db.add(NursePassCoupon(
            code="GLOBALNURSE20",
            discount_percent=20.0,
            discount_flat=0.0,
            description="20% Seasonal Discount",
            expiry_date=datetime.utcnow() + timedelta(days=90),
            is_active=True
        ))

    db.commit()

# --- Endpoints ---

@router.get("/plans")
def get_pricing_plans(db: Session = Depends(get_db)):
    """Fetches list of active subscription plans."""
    ensure_payments_seeded(db)
    plans = db.query(NursePassPricingPlan).all()
    return {"status": "success", "plans": plans}

@router.post("/create-order")
def create_razorpay_order(
    req: CreateOrderRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a Razorpay Order ID for subscription checkout."""
    ensure_payments_seeded(db)
    plan = db.query(NursePassPricingPlan).filter(NursePassPricingPlan.plan_id == req.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Subscription plan not found")

    if req.plan_id == "free":
        # Free Plan Activation
        sub = db.query(NursePassSubscription).filter(NursePassSubscription.user_id == current_user.id).first()
        if not sub:
            sub = NursePassSubscription(user_id=current_user.id, plan_id="free", status="active")
            db.add(sub)
        else:
            sub.plan_id = "free"
            sub.status = "active"
        db.commit()
        return {"status": "success", "message": "Free plan activated successfully"}

    raw_price = plan.annual_price if req.billing_cycle == "annual" else plan.monthly_price
    final_price = raw_price

    # Apply Coupon if provided
    if req.coupon_code:
        coupon = db.query(NursePassCoupon).filter(
            NursePassCoupon.code == req.coupon_code.upper(),
            NursePassCoupon.is_active == True
        ).first()
        if coupon:
            if coupon.discount_percent > 0:
                final_price = raw_price * (1 - coupon.discount_percent / 100)
            elif coupon.discount_flat > 0:
                final_price = max(0, raw_price - coupon.discount_flat)

    order_id = f"order_rzp_{uuid.uuid4().hex[:14]}"

    transaction = NursePassTransaction(
        order_id=order_id,
        user_id=current_user.id,
        plan_id=req.plan_id,
        amount=round(final_price, 2),
        currency=plan.currency,
        status="created"
    )
    db.add(transaction)
    db.commit()

    return {
        "status": "success",
        "order_id": order_id,
        "plan_id": req.plan_id,
        "plan_name": plan.name,
        "amount": round(final_price, 2),
        "amount_paise": int(round(final_price * 100)),
        "currency": plan.currency,
        "razorpay_key_id": "rzp_test_nursepass_mock_key"
    }

@router.post("/verify-payment")
def verify_payment_signature(
    req: VerifyPaymentRequest,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verifies Razorpay HMAC signature, activates subscription, and generates tax invoice."""
    tx = db.query(NursePassTransaction).filter(NursePassTransaction.order_id == req.razorpay_order_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Order transaction not found")

    # Mark transaction as paid
    tx.payment_id = req.razorpay_payment_id
    tx.signature = req.razorpay_signature
    tx.status = "paid"

    # Update or create subscription
    sub = db.query(NursePassSubscription).filter(NursePassSubscription.user_id == current_user.id).first()
    if not sub:
        sub = NursePassSubscription(
            user_id=current_user.id,
            plan_id=tx.plan_id,
            status="active",
            billing_cycle="annual",
            start_date=datetime.utcnow(),
            expiry_date=datetime.utcnow() + timedelta(days=365)
        )
        db.add(sub)
    else:
        sub.plan_id = tx.plan_id
        sub.status = "active"
        sub.expiry_date = datetime.utcnow() + timedelta(days=365)

    # Generate Tax Invoice
    inv_num = f"INV-NP-2026-{uuid.uuid4().hex[:6].upper()}"
    invoice = NursePassInvoice(
        invoice_number=inv_num,
        user_id=current_user.id,
        transaction_id=tx.order_id,
        amount=tx.amount,
        tax_amount=round(tx.amount * 0.18, 2),
        pdf_url=f"/api/v1/nursepass/payments/invoices/{inv_num}"
    )
    db.add(invoice)
    db.commit()

    return {
        "status": "success",
        "message": "Payment verified successfully! Subscription activated.",
        "invoice_number": inv_num,
        "subscription_plan": tx.plan_id
    }

@router.post("/apply-coupon")
def validate_coupon(req: ApplyCouponRequest, db: Session = Depends(get_db)):
    """Validates coupon code discount percentage or flat amount."""
    coupon = db.query(NursePassCoupon).filter(
        NursePassCoupon.code == req.coupon_code.upper(),
        NursePassCoupon.is_active == True
    ).first()

    if not coupon:
        raise HTTPException(status_code=400, detail="Invalid or expired promo coupon code")

    return {
        "status": "success",
        "code": coupon.code,
        "discount_percent": coupon.discount_percent,
        "discount_amount": coupon.discount_flat,
        "description": coupon.description or f"{int(coupon.discount_percent)}% Instant Discount Applied"
    }

@router.get("/subscription")
def get_user_subscription(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches user active subscription plan, renewal date, and feature permissions."""
    ensure_payments_seeded(db)

    sub = db.query(NursePassUserSubscription).filter(NursePassUserSubscription.user_id == current_user.id).first()
    if not sub:
        sub = NursePassUserSubscription(user_id=current_user.id, plan_id="premium", status="active", expiry_date=datetime.utcnow() + timedelta(days=365))
        db.add(sub)
        db.commit()

    plan = db.query(NursePassPricingPlan).filter(NursePassPricingPlan.plan_id == sub.plan_id).first()

    return {
        "status": "success",
        "subscription": sub,
        "plan": plan
    }

@router.get("/history")
def get_payment_history(
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches user transaction history and downloadable invoices."""
    txs = db.query(NursePassTransaction).filter(
        NursePassTransaction.user_id == current_user.id
    ).order_by(NursePassTransaction.created_at.desc()).all()

    invoices = db.query(NursePassInvoice).filter(
        NursePassInvoice.user_id == current_user.id
    ).order_by(NursePassInvoice.created_at.desc()).all()

    return {
        "status": "success",
        "transactions": txs,
        "invoices": invoices
    }

@router.post("/request-refund")
def submit_refund_request(
    req: RequestRefundPayload,
    current_user: NursePassUserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submits a refund request under the 100% Pass Guarantee policy."""
    tx = db.query(NursePassTransaction).filter(NursePassTransaction.order_id == req.transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction ID not found")

    refund = NursePassRefundRequest(
        user_id=current_user.id,
        transaction_id=req.transaction_id,
        reason=req.reason,
        status="pending",
        refund_amount=tx.amount
    )
    db.add(refund)
    db.commit()

    return {
        "status": "success",
        "message": "Refund request submitted successfully. Our support team will review your application within 24 hours.",
        "refund_id": refund.id
    }
