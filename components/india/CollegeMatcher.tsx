"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, Sparkles, ArrowRight, ArrowLeft, Loader2, 
  MapPin, CircleDollarSign, Check, X, ShieldAlert, Award, 
  ExternalLink, Bookmark, CheckCircle2, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

interface IndianCollegeRecommendation {
  match_percentage: number;
  college_name: string;
  location: string;
  course: string;
  specializations: string;
  estimated_fees: string;
  eligibility: string;
  hostel_available: boolean;
  website: string;
  ai_recommendation_summary: string;
}

export default function CollegeMatcher({ initialCourse = "" }: { initialCourse?: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1 = Questionnaire, 2 = Results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form inputs
  const [course, setCourse] = useState(initialCourse || "MBBS");
  const [budget, setBudget] = useState("15 - 25 Lakhs");
  const [preferredState, setPreferredState] = useState("");
  const [preferredCity, setPreferredCity] = useState("");
  const [neetScore, setNeetScore] = useState("");
  const [dasaEligible, setDasaEligible] = useState(false);
  const [nriStatus, setNriStatus] = useState(false);

  // Output Matches
  const [recommendations, setRecommendations] = useState<IndianCollegeRecommendation[]>([]);
  const [savedColleges, setSavedColleges] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (initialCourse) {
      setCourse(initialCourse);
    }
  }, [initialCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Growth hack: if user is not logged in, prompt them to login
    if (!user) {
      setStep(1);
      setError("Please sign in or create an account to view your AI matches.");
      router.push("/login?redirect=" + window.location.pathname);
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      course,
      budget,
      preferred_state: preferredState || null,
      preferred_city: preferredCity || null,
      neet_score: neetScore ? parseInt(neetScore) : null,
      dasa_eligible: dasaEligible,
      nri_status: nriStatus
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/india/college-matcher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to match colleges. Status code: " + res.status);
      }

      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setStep(2);
    } catch (err: any) {
      console.error("Indian college matcher request failed:", err);
      setError("AI Matcher service is currently processing data. Please try again in a few moments.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCollege = async (college: IndianCollegeRecommendation) => {
    if (savedColleges.includes(college.college_name)) return;
    
    setSavedColleges((prev) => [...prev, college.college_name]);

    try {
      // Reusing the existing saved favorites backend API
      await fetch(`${apiBaseUrl}/api/university/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: college.college_name,
          country: "India",
          course: college.course,
          tuition_fee: college.estimated_fees,
          match_percentage: college.match_percentage
        })
      });
    } catch (err) {
      console.error("Failed to save favorite college:", err);
    }
  };

  // Extract unique states for filters
  const statesList = ["All", ...Array.from(new Set(recommendations.map(r => r.location.split(",")[1]?.trim()).filter(Boolean)))];

  const filteredRecs = recommendations
    .filter(r => {
      const matchesSearch = r.college_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.specializations.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = stateFilter === "All" || r.location.includes(stateFilter);
      return matchesSearch && matchesState;
    })
    .sort((a, b) => b.match_percentage - a.match_percentage);

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Questionnaire Form */}
      {step === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl relative"
        >
          {loading && (
            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-3xl z-40 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-extrabold text-foreground">Matching Indian Colleges...</p>
                <p className="text-xs text-muted-foreground mt-1">Analyzing NEET cutoffs, NRI seats, and state budgets.</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 border-b border-border pb-6 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI Indian College Matcher</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Find optimal seats matching your score, quota eligibility, and budget.</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs sm:text-sm font-semibold rounded-2xl mb-6 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Course Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Select Course</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-semibold text-foreground"
                >
                  <option value="MBBS">MBBS</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Engineering">Engineering (B.Tech)</option>
                  <option value="Management">Management (MBA/BBA)</option>
                </select>
              </div>

              {/* Budget Range */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Annual Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-semibold text-foreground"
                >
                  <option value="Under 5 Lakhs">Under ₹5 Lakhs</option>
                  <option value="5 - 15 Lakhs">₹5 - ₹15 Lakhs</option>
                  <option value="15 - 25 Lakhs">₹15 - ₹25 Lakhs</option>
                  <option value="25 - 40 Lakhs">₹25 - ₹40 Lakhs</option>
                  <option value="Above 40 Lakhs">Above ₹40 Lakhs</option>
                </select>
              </div>

              {/* State Preference */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferred State (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra, Delhi"
                  value={preferredState}
                  onChange={(e) => setPreferredState(e.target.value)}
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-semibold text-foreground"
                />
              </div>

              {/* City Preference */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferred City (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Pune"
                  value={preferredCity}
                  onChange={(e) => setPreferredCity(e.target.value)}
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-semibold text-foreground"
                />
              </div>

              {/* NEET Score - conditional for MBBS */}
              {course === "MBBS" && (
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">NEET UG Score (out of 720)</label>
                  <input
                    type="number"
                    min="0"
                    max="720"
                    placeholder="e.g. 620"
                    value={neetScore}
                    onChange={(e) => setNeetScore(e.target.value)}
                    required={course === "MBBS"}
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-semibold text-foreground"
                  />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Entering a valid NEET score helps compute qualification probabilities.</p>
                </div>
              )}
            </div>

            {/* Quota Checkboxes */}
            <div className="border-t border-border pt-6 mt-6">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 block">Quota & Admission Status</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 bg-background border border-border rounded-xl p-4 cursor-pointer hover:bg-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={dasaEligible}
                    onChange={(e) => setDasaEligible(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-foreground block">DASA / CIWG Eligible</span>
                    <span className="text-[10px] text-muted-foreground">For foreign citizens, OCIs, PIOs or NRIs studying outside India.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-background border border-border rounded-xl p-4 cursor-pointer hover:bg-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={nriStatus}
                    onChange={(e) => setNriStatus(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-foreground block">NRI Quota Seat Interest</span>
                    <span className="text-[10px] text-muted-foreground">Interested in direct admission under 15% institutional NRI/Management quota.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-border flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full px-8 py-3.5 flex items-center gap-1.5 shadow-lg shadow-primary/25 cursor-pointer"
              >
                <span>Find Matched Colleges</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Results View */}
      {step === 2 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-border p-6 rounded-3xl shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full">AI Evaluation Complete</span>
              <h2 className="text-xl font-bold text-foreground mt-1.5 flex items-center gap-1.5">
                <span>Matched Indian Colleges</span>
                <span className="text-xs font-normal text-muted-foreground">({filteredRecs.length} options found)</span>
              </h2>
            </div>
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="rounded-full gap-1.5 text-xs font-bold h-9 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Preferences</span>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search college name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-primary text-foreground"
              />
            </div>
            
            {statesList.length > 2 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">State:</span>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                >
                  {statesList.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* College Card List */}
          {filteredRecs.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-3xl p-6">
              <p className="font-extrabold text-foreground">No matches found for your filter criteria.</p>
              <p className="text-xs text-muted-foreground mt-1">Try relaxing state preferences or check query spellings.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredRecs.map((col, idx) => (
                <div 
                  key={idx} 
                  className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {col.course}
                        </span>
                        {col.hostel_available && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2.5 py-0.5 rounded-full uppercase">
                            Hostel Available
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                        {col.college_name}
                      </h3>
                      
                      <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{col.location}</span>
                      </p>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex items-center gap-1.5 shrink-0 bg-primary/5 border border-primary/10 rounded-2xl px-4 py-2 w-fit">
                      <Award className="w-4 h-4 text-primary" />
                      <div className="flex flex-col leading-none">
                        <span className="text-sm font-black text-primary">{col.match_percentage}%</span>
                        <span className="text-[8px] uppercase tracking-wider text-muted-foreground mt-0.5">Match Score</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-background/50 border border-border/60 rounded-2xl p-4 sm:p-5 mb-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black block">Specializations</span>
                      <span className="text-xs font-bold text-foreground block mt-1 line-clamp-2 leading-relaxed">
                        {col.specializations}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black block">Estimated Fees</span>
                      <span className="text-xs font-bold text-primary block mt-1 flex items-center gap-1">
                        <CircleDollarSign className="w-3.5 h-3.5 text-primary" />
                        <span>{col.estimated_fees}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black block">Eligibility Met</span>
                      <span className="text-xs font-semibold text-foreground block mt-1 leading-relaxed">
                        {col.eligibility}
                      </span>
                    </div>
                  </div>

                  {/* AI recommendation block */}
                  <div className="border-l-4 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-r-2xl p-4 mb-6">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">Aura AI Advisor Match Rationale</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {col.ai_recommendation_summary}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-border/30 pt-4">
                    {col.website ? (
                      <a 
                        href={col.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <span>Visit College Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <div />}

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleSaveCollege(col)}
                        variant="ghost"
                        className="h-8 rounded-full text-xs font-bold flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {savedColleges.includes(col.college_name) ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Save to Favorites</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

    </div>
  );
}
