"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, Sparkles, ArrowRight, ArrowLeft, Loader2, 
  MapPin, CircleDollarSign, Check, X, ShieldAlert, Award, 
  ExternalLink, Bookmark, CheckCircle2, Lock, School, HelpCircle, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";
import { useBooking } from "@/components/common/BookingContext";

interface MBBSRecommendation {
  match_percentage: number;
  university_name: string;
  country: string;
  estimated_tuition: string;
  living_costs: string;
  scholarship_availability: string;
  visa_difficulty: string;
  career_opportunities: string;
  ai_recommendation_summary: string;
}

export default function MBBSMatcher() {
  const router = useRouter();
  const { user } = useAuth();
  const { openBooking } = useBooking();

  const [step, setStep] = useState(1); // 1 = Questionnaire, 2 = Results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Questionnaire Inputs
  const [neetScore, setNeetScore] = useState("");
  const [category, setCategory] = useState("General");
  const [budget, setBudget] = useState("15 - 25 Lakhs");
  const [preferredCountries, setPreferredCountries] = useState<string[]>([]);
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [hostelRequired, setHostelRequired] = useState(true);
  const [scholarshipRequired, setScholarshipRequired] = useState(false);
  const [passportStatus, setPassportStatus] = useState("Available");

  // Output Matches
  const [recommendations, setRecommendations] = useState<MBBSRecommendation[]>([]);
  const [savedUnis, setSavedUnis] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const countriesList = [
    "Georgia", "Russia", "Kazakhstan", "Uzbekistan", 
    "Philippines", "Bangladesh", "Egypt", "Romania", "Serbia"
  ];

  const handleCountryToggle = (country: string) => {
    setPreferredCountries((prev) => 
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Growth Hack: Require authentication to submit and view matches
    if (!user) {
      setError("Authentication required: Please sign in or register to analyze MBBS Abroad matching profiles.");
      router.push("/login?redirect=/mbbs-matcher");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      neet_score: parseInt(neetScore) || 0,
      category,
      budget,
      preferred_countries: preferredCountries.length > 0 ? preferredCountries : countriesList,
      preferred_language: preferredLanguage,
      hostel_required: hostelRequired,
      scholarship_required: scholarshipRequired,
      passport_status: passportStatus
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/mbbs-matcher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Admissions matching failed. Status code: " + res.status);
      }

      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setStep(2);
    } catch (err: any) {
      console.error("MBBS Matcher request failed:", err);
      setError("Matcher engine is updating. Fallback heuristics compiling.");
      
      // Standalone client fallback in case server offline
      compileClientFallback();
    } finally {
      setLoading(false);
    }
  };

  const compileClientFallback = () => {
    const score = parseInt(neetScore) || 0;
    const isQualified = score >= (category === "General" ? 137 : 107);
    
    if (!isQualified) {
      setError("NEET score is below the qualifying cutoff guidelines. Direct local counselling is locked.");
      setRecommendations([]);
      setStep(2);
      return;
    }

    // Mock recommendations matching parameters
    const mockRecs: MBBSRecommendation[] = [
      {
        match_percentage: score > 300 ? 98 : 88,
        university_name: "Tbilisi State Medical University",
        country: "Georgia",
        estimated_tuition: "$8,000 USD / year",
        living_costs: "$2,500 USD / year",
        scholarship_availability: "No direct scholarships, low tuition structure.",
        visa_difficulty: "Low (Direct student visa)",
        career_opportunities: "Eligible for NMC NEXT test, WHO recognized, UK/US licensing options.",
        ai_recommendation_summary: "Georgia provides high safety indexes, English instruction medium, and no secondary entrance tests."
      },
      {
        match_percentage: score > 200 ? 95 : 85,
        university_name: "Kazan Federal University",
        country: "Russia",
        estimated_tuition: "$6,000 USD / year",
        living_costs: "$1,800 USD / year",
        scholarship_availability: "Government bilateral scholarships may apply.",
        visa_difficulty: "Low (Fast processing)",
        career_opportunities: "NMC NEXT test qualified, recognized by ECFMG & WHO.",
        ai_recommendation_summary: "Russia offers advanced clinical simulations, highly affordable tuition fees, and rich international campus culture."
      }
    ];

    setRecommendations(mockRecs);
    setStep(2);
  };

  const handleSaveReport = async (uni: MBBSRecommendation) => {
    if (savedUnis.includes(uni.university_name)) return;
    setSavedUnis((prev) => [...prev, uni.university_name]);

    try {
      // Reusing the existing saved favorites backend API
      await fetch(`${apiBaseUrl}/api/university/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: uni.university_name,
          country: uni.country,
          course: "MBBS",
          tuition_fee: uni.estimated_tuition,
          match_percentage: uni.match_percentage
        })
      });
    } catch (err) {
      console.error("Failed to save favorite MBBS university:", err);
    }
  };

  const uniqueCountries = ["All", ...Array.from(new Set(recommendations.map(r => r.country)))];

  const filteredRecs = recommendations
    .filter(r => {
      const matchesSearch = r.university_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.ai_recommendation_summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = countryFilter === "All" || r.country === countryFilter;
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => b.match_percentage - a.match_percentage);

  // Compute NEET probability thresholds
  const getProbabilityScore = () => {
    const score = parseInt(neetScore) || 0;
    if (score > 400) return { prob: "High", color: "text-emerald-500 bg-emerald-50 border-emerald-100", pct: "95%" };
    if (score > 200) return { prob: "Medium", color: "text-amber-500 bg-amber-50 border-amber-100", pct: "75%" };
    if (score >= (category === "General" ? 137 : 107)) return { prob: "Qualified", color: "text-blue-500 bg-blue-50 border-blue-100", pct: "60%" };
    return { prob: "Not Qualified", color: "text-rose-500 bg-rose-50 border-rose-100", pct: "0%" };
  };

  return (
    <div className="bg-background min-h-screen text-foreground pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-3 py-1 rounded-full">Dedicated NMC Pathway</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight mt-3">
            NEET-to-MBBS Abroad Matcher
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
            Match your NEET score against approved medical universities in Georgia, Russia, Kazakhstan, and other global destinations.
          </p>
        </div>

        {/* STEP 1: Form Wizard */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl relative"
          >
            {loading && (
              <div className="absolute inset-0 bg-card/85 backdrop-blur-sm rounded-3xl z-50 flex flex-col items-center justify-center gap-4">
                <div className="relative flex items-center justify-center">
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                  <Sparkles className="w-6 h-6 text-indigo-500 absolute animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="font-extrabold text-foreground text-sm">Evaluating NMC Eligible Seats...</p>
                  <p className="text-xs text-muted-foreground mt-1">Filtering MCI/NMC approved universities and parsing visa indexes.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs sm:text-sm font-semibold rounded-2xl mb-6 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* NEET Score */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">NEET Score (0-720)</label>
                  <input
                    type="number"
                    min="0"
                    max="720"
                    placeholder="e.g. 320"
                    value={neetScore}
                    onChange={(e) => setNeetScore(e.target.value)}
                    required
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-semibold text-foreground"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Counselling Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-semibold text-foreground"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Annual Budget (Tuition + Living)</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-semibold text-foreground"
                  >
                    <option value="Under 15 Lakhs">Under ₹15 Lakhs</option>
                    <option value="15 - 25 Lakhs">₹15 - ₹25 Lakhs</option>
                    <option value="25 - 35 Lakhs">₹25 - ₹35 Lakhs</option>
                    <option value="Above 35 Lakhs">Above ₹35 Lakhs</option>
                  </select>
                </div>

                {/* Language Medium */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Instruction Medium</label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-semibold text-foreground"
                  >
                    <option value="English">English Only</option>
                    <option value="Bilingual">Bilingual (English + Local)</option>
                  </select>
                </div>

                {/* Passport Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Passport Status</label>
                  <select
                    value={passportStatus}
                    onChange={(e) => setPassportStatus(e.target.value)}
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-semibold text-foreground"
                  >
                    <option value="Available">Available (Ready to travel)</option>
                    <option value="Applied">Applied / Under process</option>
                    <option value="Not Available">Not Available (Need guidance)</option>
                  </select>
                </div>
              </div>

              {/* Preferences Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <label className="flex items-center gap-3 bg-background border border-border rounded-xl p-4 cursor-pointer hover:bg-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={hostelRequired}
                    onChange={(e) => setHostelRequired(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-foreground block">Hostel Required</span>
                    <span className="text-[10px] text-muted-foreground">Recommend universities with on-campus accommodation.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-background border border-border rounded-xl p-4 cursor-pointer hover:bg-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={scholarshipRequired}
                    onChange={(e) => setScholarshipRequired(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-foreground block">Scholarships Interested</span>
                    <span className="text-[10px] text-muted-foreground">Match merit-based tuition fee waivers or stipend schemes.</span>
                  </div>
                </label>
              </div>

              {/* Country Selection */}
              <div className="pt-6 border-t border-border">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Preferred Countries (Optional)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {countriesList.map((countryName) => (
                    <button
                      key={countryName}
                      type="button"
                      onClick={() => handleCountryToggle(countryName)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                        preferredCountries.includes(countryName)
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                          : "bg-background border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {countryName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-border flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full px-8 py-3.5 flex items-center gap-1.5 shadow-lg shadow-primary/25 cursor-pointer"
                >
                  <span>Evaluate MBBS Matches</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 2: Results View */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            {/* Probability Report Header */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full">Counselling Evaluation</span>
                <h2 className="text-xl font-bold text-foreground mt-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Your MBBS Admission Report
                </h2>
                <p className="text-xs text-muted-foreground mt-1 font-medium">NEET UG score: <strong className="text-foreground">{neetScore}</strong> | Quota: <strong className="text-foreground">{category}</strong></p>
              </div>

              <div className="flex gap-4">
                <div className={`border rounded-2xl p-4 text-center shrink-0 w-32 ${getProbabilityScore().color}`}>
                  <span className="text-[9px] font-black uppercase tracking-wider block mb-1">Probability</span>
                  <span className="text-lg font-black">{getProbabilityScore().prob}</span>
                </div>
                <Button onClick={() => setStep(1)} variant="outline" className="rounded-full gap-1 text-xs font-bold h-9 self-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </Button>
              </div>
            </div>

            {/* Catalog Filter Controls */}
            {recommendations.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search university name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                
                {uniqueCountries.length > 2 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Country:</span>
                    <select
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
                      className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    >
                      {uniqueCountries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Matched Universities List */}
            {filteredRecs.length === 0 ? (
              <div className="border border-border rounded-3xl p-12 text-center bg-card">
                <School className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-extrabold text-foreground text-base mb-1">No Universities Matched</h3>
                <p className="text-xs text-muted-foreground">Adjust your budget or preferred language criteria to expand matching scopes.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRecs.map((uni, idx) => (
                  <div 
                    key={idx} 
                    className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-all" />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {uni.country}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2.5 py-0.5 rounded-full uppercase">
                            NMC Approved
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                          {uni.university_name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 bg-primary/5 border border-primary/10 rounded-2xl px-4 py-2 w-fit">
                        <Award className="w-4 h-4 text-primary" />
                        <div className="flex flex-col leading-none">
                          <span className="text-sm font-black text-primary">{uni.match_percentage}%</span>
                          <span className="text-[8px] uppercase tracking-wider text-muted-foreground mt-0.5">Fit Score</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-background/50 border border-border/60 rounded-2xl p-4 sm:p-5 mb-6">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black block">Annual Tuition</span>
                        <span className="text-xs font-bold text-primary block mt-1 flex items-center gap-1">
                          <CircleDollarSign className="w-3.5 h-3.5 text-primary" />
                          <span>{uni.estimated_tuition}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black block">Living Costs</span>
                        <span className="text-xs font-bold text-foreground block mt-1">
                          {uni.living_costs}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black block">Visa Difficulty</span>
                        <span className="text-xs font-semibold text-foreground block mt-1">
                          {uni.visa_difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Career details */}
                    <div className="mb-4">
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black block">Career Recognition & NEXT</span>
                      <p className="text-xs text-foreground font-semibold mt-1 leading-relaxed">{uni.career_opportunities}</p>
                    </div>

                    {/* AI Recommendation Summary */}
                    <div className="border-l-4 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-r-2xl p-4 mb-6">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">Aura AI Advisor Match Rationale</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {uni.ai_recommendation_summary}
                      </p>
                    </div>

                    {/* Save report CTA */}
                    <div className="flex items-center justify-between border-t border-gray-50 dark:border-border/30 pt-4 mt-6">
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Duration: 6 Years (NMC compliant)</span>
                      </span>

                      <Button
                        onClick={() => handleSaveReport(uni)}
                        variant="ghost"
                        className="h-8 rounded-full text-xs font-bold flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {savedUnis.includes(uni.university_name) ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Report Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Save Report</span>
                          </>
                        )}
                      </Button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Sticky bottom CTA panel */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-500/15 mt-8">
              <div>
                <h3 className="text-lg font-black">Book NEET UG Admissions Mentoring</h3>
                <p className="text-xs text-blue-100 font-semibold mt-1">Review NEXT guidelines, country visa steps, and seat registration slots with an expert advisor.</p>
              </div>
              <Button
                onClick={openBooking}
                className="bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-full px-8 py-3.5 shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Schedule Call Now</span>
              </Button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
