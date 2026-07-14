"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  SearchCode, 
  ShieldCheck, 
  Stethoscope, 
  GraduationCap, 
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceData {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  currency: string;
  icon: string;
  badge: string | null;
  features: string[];
}

export default function PricingPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fallback mock service catalog to display if API is unreachable
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
      badge: "Popular",
      features: ["3 Complete SOP drafts", "Grammar & structure checking", "Covers 15+ majors", "Instant export to PDF/DOC"]
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
      badge: "Best Value",
      features: ["5 Document scans", "Verify against target requirements", "GPA conversion calculator", "Feedback report"]
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
      badge: "New",
      features: ["2 Complete visa scans", "Financial sponsor audit", "Immigration check rules", "Pre-refusal validation logs"]
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
      badge: "Popular",
      features: ["Comprehensive 10-page report", "Score card breakdown", "10 University matches", "Personalized improvements checklist"]
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
      badge: "Best Value",
      features: ["45 Min zoom call", "Course & country mapping", "Scholarship guidance", "Application checklist planning"]
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
      badge: "Best Value",
      features: ["60 Min NMC pathway call", "Eligibility checks and translations", "Collateral loan advice", "NEXT/USMLE prep guidance"]
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBaseUrl}/api/services`);
        if (!res.ok) throw new Error("API response error");
        const data = await res.json();
        setServices(data);
      } catch (err: any) {
        console.error("FastAPI service list unreachable:", err);
        setError("Failed to load services catalog. Server is offline.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Icon mapping helper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText": return FileText;
      case "SearchCode": return SearchCode;
      case "ShieldCheck": return ShieldCheck;
      case "Stethoscope": return Stethoscope;
      case "GraduationCap": return GraduationCap;
      default: return Sparkles;
    }
  };

  const handlePurchase = (serviceId: string) => {
    router.push(`/checkout?service=${serviceId}`);
  };

  return (
    <div className="bg-card pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="max-w-6xl mx-auto mb-6 flex justify-start">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2 border border-border rounded-full bg-card shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
            Transparent Pricing Plans
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Choose a custom service package to accelerate your admissions. Pay once with secure Razorpay checkouts. No subscriptions.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto text-center py-6 px-4 bg-rose-50 border border-rose-100 rounded-2xl mb-8">
            <p className="text-sm font-semibold text-rose-600">{error}</p>
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">Loading catalog offerings...</p>
          </div>
        )}

        {/* Dynamic Service Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, i) => {
              const Icon = getIcon(service.icon);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group relative"
                >
                  <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_-6px_rgba(37,99,235,0.08)] hover:border-primary/20/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full min-h-[420px] relative overflow-hidden">
                    {/* Top border accent line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary border border-primary/20/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <Icon className="w-5.5 h-5.5" />
                        </div>
                        {service.badge && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                            service.badge === "Popular" 
                              ? "bg-primary/10 text-primary border border-primary/20" 
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>
                            {service.badge}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                      <p className="text-xs text-muted-text font-medium mb-6 leading-relaxed">
                        {service.short_description}
                      </p>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-3xl font-black text-foreground">₹{service.price}</span>
                        <span className="text-xs text-muted-text font-semibold">one-time</span>
                      </div>

                      {/* Features */}
                      <ul className="flex flex-col gap-3.5 mb-8 border-t border-gray-50 pt-6">
                        {service.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-muted-foreground leading-tight font-medium">
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Purchase CTA */}
                    <Button
                      onClick={() => handlePurchase(service.id)}
                      className="w-full bg-primary hover:bg-primary text-white font-bold py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer group/btn"
                    >
                      <span>Purchase Package</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
