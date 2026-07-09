"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { 
  CreditCard, 
  ArrowLeft, 
  ArrowRight,
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";


interface ServiceData {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  currency: string;
  icon: string;
  features: string[];
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");

  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Billing States
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const rzpKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_simulation";

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.email && !billingEmail) setBillingEmail(user.email);
      const metadata = user.user_metadata || {};
      const fullName = metadata.full_name || metadata.name || "";
      if (fullName && !billingName) setBillingName(fullName);
    }
  }, [user, billingEmail, billingName]);


  // Mock catalog local fallbacks if API is offline
  const fallbackServices: ServiceData[] = [
    {
      id: "ai-sop-generator",
      slug: "ai-sop-generator",
      title: "AI SOP Generator",
      short_description: "Auto-draft premium Statements of Purpose.",
      description: "Utilize context-aware LLM architectures to compile structured Statements of Purpose aligned to destination-specific guidelines.",
      price: 999.00,
      currency: "INR",
      icon: "FileText",
      features: ["3 Complete SOP drafts", "Grammar & structure checking"]
    },
    {
      id: "ai-doc-checker",
      slug: "ai-doc-checker",
      title: "AI Document Checker",
      short_description: "Validate transcripts and credentials.",
      description: "Upload academic transcripts and recommendation files to scan for gaps against targeted university check gates.",
      price: 499.00,
      currency: "INR",
      icon: "SearchCode",
      features: ["5 Document scans", "Verify against target requirements"]
    },
    {
      id: "ai-visa-doc-checker",
      slug: "ai-visa-doc-checker",
      title: "AI Visa Document Checker",
      short_description: "Optimize visa files for approvals.",
      description: "Perform structural audits of sponsor letters, logs, and passport scans to eliminate error points prior to submission.",
      price: 699.00,
      currency: "INR",
      icon: "ShieldCheck",
      features: ["2 Complete visa scans", "Financial sponsor audit"]
    },
    {
      id: "ai-eligibility-premium",
      slug: "ai-eligibility-premium",
      title: "AI Eligibility Premium Report",
      short_description: "Deep-dive immigration evaluation logs.",
      description: "Acquire detailed breakdowns of strengths, weaknesses, university target lists, and visa probability meters.",
      price: 799.00,
      currency: "INR",
      icon: "Sparkles",
      features: ["Comprehensive 10-page report", "Score card breakdown"]
    },
    {
      id: "study-abroad-consultation",
      slug: "study-abroad-consultation",
      title: "Study Abroad Consultation",
      short_description: "1-on-1 advisor slot booking.",
      description: "Book a live 45-minute virtual meeting with our senior advisors to map profiles and shortlists.",
      price: 999.00,
      currency: "INR",
      icon: "GraduationCap",
      features: ["45 Min zoom call", "Course & country mapping"]
    },
    {
      id: "mbbs-abroad-consultation",
      slug: "mbbs-abroad-consultation",
      title: "MBBS Abroad Consultation",
      short_description: "NMC approved medical pathways guidance.",
      description: "Comprehensive mapping session for medical aspirants targeting approved medical colleges in Georgia, Kazakhstan, or Egypt.",
      price: 1499.00,
      currency: "INR",
      icon: "Stethoscope",
      features: ["60 Min NMC pathway call", "Eligibility checks and translations"]
    }
  ];

  useEffect(() => {
    if (!serviceId) {
      router.push("/services");
      return;
    }

    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        // Call list API and filter locally (highly robust and avoids parameter mismatched query issues!)
        const res = await fetch(`${apiBaseUrl}/api/services`);
        if (!res.ok) throw new Error("API Offline");
        const list: ServiceData[] = await res.json();
        const matched = list.find((item) => item.id === serviceId);
        if (matched) {
          setService(matched);
        } else {
          throw new Error("Mismatched Service ID");
        }
      } catch (err) {
        console.error("Failed fetching service details from server:", err);
        alert("Failed to retrieve service checkout details. Server is offline.");
        router.push("/services");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [serviceId]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingName || !billingEmail) {
      setFormError("Billing Name and Email address are required.");
      return;
    }
    setFormError(null);
    setCheckingOut(true);

    try {
      // 1. Create order on FastAPI backend
      const orderRes = await fetch(`${apiBaseUrl}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_id: service?.id, user_id: user?.id || "guest_user" })
      });

      if (!orderRes.ok) throw new Error("Unable to create checkout order on the server.");
      const orderData = await orderRes.json();

      // 2. If running in simulated sandbox, approve immediately without loading script
      if (orderData.razorpay_order_id.startsWith("order_sim_")) {
        const verifyRes = await fetch(`${apiBaseUrl}/api/payment/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.razorpay_order_id,
            razorpay_payment_id: `pay_sim_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
            razorpay_signature: "simulated_verification_sig",
            billing_name: billingName,
            email: billingEmail
          })
        });

        if (!verifyRes.ok) throw new Error("Transaction verification check failed.");
        const paymentData = await verifyRes.json();
        router.push(`/payment/success?receipt=${paymentData.receipt_number}&service=${service?.title}`);
        return;
      }

      // 3. Trigger Razorpay Checkout overlay script (for production/test keys)
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: rzpKeyId,
          amount: Math.round(orderData.amount * 100),
          currency: orderData.currency,
          name: "Aura Routes AI",
          description: service?.title,
          order_id: orderData.razorpay_order_id,
          handler: async function (response: any) {
            try {
              // Post to verify
              const verifyRes = await fetch(`${apiBaseUrl}/api/payment/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  billing_name: billingName,
                  email: billingEmail
                })
              });

              if (!verifyRes.ok) throw new Error("Cryptographic payment signature mismatch.");
              const paymentData = await verifyRes.json();
              router.push(`/payment/success?receipt=${paymentData.receipt_number}&service=${service?.title}`);
            } catch (err: any) {
              router.push(`/payment/failed?error=${encodeURIComponent(err.message)}`);
            }
          },
          prefill: {
            name: billingName,
            email: billingEmail,
          },
          theme: {
            color: "#2563EB"
          },
          modal: {
            ondismiss: function () {
              setCheckingOut(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error("Razorpay script not loaded yet. Please wait a moment and try again.");
      }

    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "An error occurred during order generation.");
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-gray-500">Preparing transaction summary...</p>
      </div>
    );
  }

  return (
    <>
      {/* Load Razorpay Script */}
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
        {/* Left Column: Form Info */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="border-b border-gray-50 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Secure Billing Details</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Provide your name and email to receive the invoice receipt.</p>
          </div>

          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-xs sm:text-sm font-semibold rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase">Billing Name</label>
              <input
                type="text"
                value={billingName}
                onChange={(e) => setBillingName(e.target.value)}
                placeholder="e.g. Aman Sharma"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase">Email Address (for Receipt)</label>
              <input
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                placeholder="e.g. aman@gmail.com"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
                required
              />
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl flex items-start gap-2.5 text-xs text-blue-800 leading-relaxed mt-4">
              <ShieldAlert className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Payments are securely verified and cryptographically checked on our backend servers. Double charges are automatically audited and refunded.
              </span>
            </div>

            <Button
              type="submit"
              disabled={checkingOut}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {checkingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Contacting Payment Gateway...</span>
                </>
              ) : (
                <>
                  <span>Pay Securely ₹{service?.price}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-extrabold text-gray-950 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            <span>Order Summary</span>
          </h3>

          <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 mb-6">
            <div>
              <h4 className="font-bold text-gray-900 text-sm">{service?.title}</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{service?.short_description}</p>
            </div>
            
            <div className="flex justify-between items-center text-sm font-semibold text-gray-800 pt-2">
              <span>Item Total</span>
              <span>₹{service?.price}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
              <span>GST & Processing Fees</span>
              <span className="text-emerald-600">₹0.00 (Waived)</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-base font-extrabold text-gray-950 mb-6">
            <span>Total Payable</span>
            <span>₹{service?.price}</span>
          </div>

          <button
            onClick={() => router.push("/services")}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:gap-2 transition-all w-fit cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Package</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-sm font-semibold text-gray-500">Loading checkout forms...</p>
          </div>
        }>
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  );
}
