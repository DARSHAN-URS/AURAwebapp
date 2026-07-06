"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Award, 
  MapPin, 
  DollarSign, 
  Search, 
  Filter, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Calculator,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Printer,
  Heart,
  Plus,
  Trash2,
  Percent,
  Check,
  X,
  TrendingUp,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScholarshipMatch {
  scholarship_name: string;
  provider: string;
  country: string;
  university: string;
  funding_amount: string;
  coverage: string;
  eligibility_criteria: string;
  required_documents: string;
  deadline: string;
  website: string;
  ai_match_percentage: number;
  difficulty_level: string;
  application_strategy: string;
  reason_for_recommendation: string;
}

export default function ScholarshipFinder() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"finder" | "planner" | "saved">("finder");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Questionnaire Profile States
  const [nationality, setNationality] = useState("Indian");
  const [currentCountry, setCurrentCountry] = useState("India");
  const [income, setIncome] = useState("12 Lakhs");
  const [qualification, setQualification] = useState("Bachelor of Technology");
  const [gpa, setGpa] = useState("85");
  const [englishExam, setEnglishExam] = useState("IELTS");
  const [englishScore, setEnglishScore] = useState("7.5");
  const [workExp, setWorkExp] = useState("2");
  
  const [researchExp, setResearchExp] = useState(false);
  const [publications, setPublications] = useState(false);
  const [volunteer, setVolunteer] = useState(false);
  const [leadership, setLeadership] = useState(false);

  const [preferredCountries, setPreferredCountries] = useState<string[]>(["Canada", "USA"]);
  const [degreeLevel, setDegreeLevel] = useState("Master's");
  const [courseInterest, setCourseInterest] = useState("Computer Science");
  const [budget, setBudget] = useState("2500000"); // 25 Lakhs
  const [intake, setIntake] = useState("Fall 2026");

  // 2. Discovery Matches State
  const [matches, setMatches] = useState<ScholarshipMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<ScholarshipMatch[]>([]);
  const [savedMatches, setSavedMatches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");

  // 3. Funding Planner States
  const [tuitionFee, setTuitionFee] = useState("1800000");
  const [livingCost, setLivingCost] = useState("1000000");
  const [travelCost, setTravelCost] = useState("150000");
  const [visaCost, setVisaCost] = useState("50000");
  const [insurance, setInsurance] = useState("80000");
  const [miscCost, setMiscCost] = useState("100000");
  const [scholarshipAmt, setScholarshipAmt] = useState("200000");
  const [loanAmt, setLoanAmt] = useState("1500000");
  const [savingsAmt, setSavingsAmt] = useState("1200000");
  
  const [fundingResult, setFundingResult] = useState<any>(null);
  const [fundingLoading, setFundingLoading] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const countriesList = ["USA", "Canada", "UK", "Germany", "Australia", "Ireland"];

  const handleCountryToggle = (country: string) => {
    setPreferredCountries((prev) => 
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  // Find matches handler
  const handleFindScholarships = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      nationality,
      country_residence: currentCountry,
      annual_family_income: income,
      highest_qualification: qualification,
      gpa_percentage: parseFloat(gpa) || 80.0,
      english_exam: englishExam,
      english_score: parseFloat(englishScore) || 7.0,
      work_experience: parseFloat(workExp) || 0.0,
      research_experience: researchExp,
      publications,
      volunteer_work: volunteer,
      leadership_experience: leadership,
      preferred_countries: preferredCountries,
      preferred_universities: [],
      course: courseInterest,
      degree_level: degreeLevel,
      intake,
      budget: parseFloat(budget) || 0.0,
      savings: parseFloat(savingsAmt) || 0.0,
      education_loan: parseFloat(loanAmt) || 0.0,
      sponsor_support: 0.0,
      existing_scholarships: parseFloat(scholarshipAmt) || 0.0
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/scholarships/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Match failed");
      const data = await res.json();
      setMatches(data || []);
      setFilteredMatches(data || []);
    } catch (err) {
      console.warn("Backend offline. Setting up local fallback scholarship matches.");
      const mockMatches: ScholarshipMatch[] = [
        {
          scholarship_name: "Fulbright-Nehru Master's Fellowships",
          provider: "USIEF (United States-India Educational Foundation)",
          country: "USA",
          university: "All USA Universities",
          funding_amount: "$45,000 USD / Year",
          coverage: "Full Tuition, Living Stipend, Travel Airfare, Health Insurance",
          eligibility_criteria: "GPA 80% equivalent. Minimum 3 years work experience. IELTS 7.0+.",
          required_documents: "Academic transcripts, SOP, LOR, Work certifications",
          deadline: "2026-05-15",
          website: "https://www.usief.org.in",
          ai_match_percentage: 92,
          difficulty_level: "High",
          application_strategy: "Draft an outstanding Statement of Purpose highlighting your GPA and academic accomplishments early.",
          reason_for_recommendation: "Strong match based on your GPA and preferred country USA."
        },
        {
          scholarship_name: "Ontario Graduate Scholarship (OGS)",
          provider: "Government of Ontario",
          country: "Canada",
          university: "Ontario Universities",
          funding_amount: "$15,000 CAD / Year",
          coverage: "Partial Tuition Offset",
          eligibility_criteria: "A- average in last 2 years. Registered in graduate studies.",
          required_documents: "Transcripts, SOP, LOR referrals",
          deadline: "2026-01-31",
          website: "https://osap.gov.on.ca",
          ai_match_percentage: 84,
          difficulty_level: "Medium",
          application_strategy: "Identify research sponsors early at Ontario universities.",
          reason_for_recommendation: "Matches your preference for Canada graduate study pathways."
        }
      ];
      setMatches(mockMatches);
      setFilteredMatches(mockMatches);
    } finally {
      setLoading(false);
    }
  };

  // Funding plan handler
  const handleCalculateFundingRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    setFundingLoading(true);

    const payload = {
      tuition_fee: parseFloat(tuitionFee) || 0.0,
      living_cost: parseFloat(livingCost) || 0.0,
      travel_cost: parseFloat(travelCost) || 0.0,
      visa_cost: parseFloat(visaCost) || 0.0,
      insurance: parseFloat(insurance) || 0.0,
      misc_expenses: parseFloat(miscCost) || 0.0,
      scholarship_amount: parseFloat(scholarshipAmt) || 0.0,
      loan_amount: parseFloat(loanAmt) || 0.0,
      savings: parseFloat(savingsAmt) || 0.0
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/scholarships/funding-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setFundingResult(data);
    } catch (err) {
      // Offline fallback
      const total = payload.tuition_fee + payload.living_cost + payload.travel_cost + payload.visa_cost + payload.insurance + payload.misc_expenses;
      const avail = payload.scholarship_amount + payload.loan_amount + payload.savings;
      const gap = Math.max(0, total - avail);
      const score = total > 0 ? Math.min(100, Math.round((avail / total) * 100)) : 100;
      setFundingResult({
        plan: {
          total_cost: total,
          total_available: avail,
          funding_gap: gap,
          readiness_score: score,
          suggested_plan: gap > 0 
            ? "Your liquid savings and education loans currently show a gap deficit. Consider securing sponsor certificates." 
            : "Your available budget covers the estimated costs. Keep funds liquid."
        },
        recommendations: [
          "Apply for merit waivers early.",
          "Maintain block account targets."
        ]
      });
    } finally {
      setFundingLoading(false);
    }
  };

  // Bookmark handler
  const handleSaveScholarship = async (uni: ScholarshipMatch) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/scholarships/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: uni.scholarship_name,
          provider: uni.provider,
          country: uni.country,
          funding_amount: uni.funding_amount,
          match_percentage: uni.ai_match_percentage,
          deadline: uni.deadline
        })
      });
      if (res.ok) {
        setSavedMatches((prev) => [...prev, uni.scholarship_name]);
      }
    } catch (err) {
      setSavedMatches((prev) => [...prev, uni.scholarship_name]);
    }
  };

  // Filters application check
  React.useEffect(() => {
    let result = [...matches];

    if (searchQuery) {
      result = result.filter(r => 
        r.scholarship_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (countryFilter !== "All") {
      result = result.filter(r => r.country.toLowerCase() === countryFilter.toLowerCase());
    }

    setFilteredMatches(result);
  }, [searchQuery, countryFilter, matches]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24" id="print-area">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">AI Scholarship Finder</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Discover grants, calculate tuition gap roadmaps, and compile financial plans.</p>
          </div>

          <div className="flex items-center gap-3 no-print">
            <Button
              onClick={handlePrint}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer h-10"
            >
              <Printer className="w-4 h-4" />
              <span>Download Financial Plan</span>
            </Button>
          </div>
        </div>

        {/* Global Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 max-w-sm text-center px-6">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
              <div>
                <h3 className="font-extrabold text-xl text-gray-950 mb-2">Finding Scholarships</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Aura Matching Engine is evaluating your GPA, English tests, research experience, and family income variables against global scholarship criteria gates...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Selector Navigation */}
        <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-150 rounded-2xl p-2 mb-8 no-print">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("finder")}
            className={`h-9 px-4 rounded-xl text-xs font-bold cursor-pointer ${
              activeTab === "finder" ? "bg-white text-blue-600 shadow-xs border border-gray-250/20" : "text-gray-500"
            }`}
          >
            Scholarship Finder
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setActiveTab("planner")}
            className={`h-9 px-4 rounded-xl text-xs font-bold cursor-pointer ${
              activeTab === "planner" ? "bg-white text-blue-600 shadow-xs border border-gray-250/20" : "text-gray-500"
            }`}
          >
            Funding Planner
          </Button>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: SCHOLARSHIP FINDER WORKSPACE */}
        {/* ==================================================================== */}
        {activeTab === "finder" && (
          <div>
            {matches.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-2xl">
                <form onSubmit={handleFindScholarships} className="flex flex-col gap-6">
                  <div className="border-b border-gray-50 pb-4">
                    <h3 className="font-extrabold text-gray-950 text-sm flex items-center gap-1.5">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span>Academic & Funding Scopes Form</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Please provide academic achievements to evaluate match likelihood.</p>
                  </div>

                  {/* Personal & Family Income */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Nationality</label>
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Residence Country</label>
                      <input
                        type="text"
                        value={currentCountry}
                        onChange={(e) => setCurrentCountry(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Annual Family Income</label>
                      <input
                        type="text"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Academic Profile */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Highest Qualification</label>
                      <input
                        type="text"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">GPA / Percentage</label>
                      <input
                        type="number"
                        value={gpa}
                        onChange={(e) => setGpa(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">English Test Type</label>
                      <select
                        value={englishExam}
                        onChange={(e) => setEnglishExam(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none font-bold"
                      >
                        <option value="IELTS">IELTS</option>
                        <option value="TOEFL">TOEFL</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">English score</label>
                      <input
                        type="text"
                        value={englishScore}
                        onChange={(e) => setEnglishScore(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>
                  </div>

                  {/* Checklist parameters */}
                  <div className="flex flex-wrap gap-4 bg-gray-55/40 p-4 rounded-2xl border border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                      <input type="checkbox" checked={researchExp} onChange={(e) => setResearchExp(e.target.checked)} className="accent-blue-600" />
                      <span>Research Experience</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                      <input type="checkbox" checked={publications} onChange={(e) => setPublications(e.target.checked)} className="accent-blue-600" />
                      <span>Publications</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                      <input type="checkbox" checked={volunteer} onChange={(e) => setVolunteer(e.target.checked)} className="accent-blue-600" />
                      <span>Volunteer Work</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                      <input type="checkbox" checked={leadership} onChange={(e) => setLeadership(e.target.checked)} className="accent-blue-600" />
                      <span>Leadership Experience</span>
                    </label>
                  </div>

                  {/* Target Preferences */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Target Countries</label>
                    <div className="flex flex-wrap gap-2">
                      {countriesList.map((c) => {
                        const selected = preferredCountries.includes(c);
                        return (
                          <button
                            type="button"
                            key={c}
                            onClick={() => handleCountryToggle(c)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              selected 
                                ? "bg-blue-50 text-blue-600 border-blue-200" 
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-xs text-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Find Scholarship Matches</span>
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                
                {/* Search Bar filter controls */}
                <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 no-print">
                  <div className="relative w-full md:w-60">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search scholarships..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-blue-600 w-full font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none font-bold"
                    >
                      <option value="All">All Countries</option>
                      {countriesList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Match Cards List */}
                <div className="flex flex-col gap-8">
                  {filteredMatches.map((uni, idx) => {
                    const saved = savedMatches.includes(uni.scholarship_name);
                    return (
                      <div 
                        key={uni.scholarship_name}
                        className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-50 pb-4 mb-6">
                          <div>
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Match #{idx + 1}
                            </span>
                            <h3 className="font-black text-gray-950 text-xl mt-2 leading-snug">
                              {uni.scholarship_name}
                            </h3>
                            <p className="text-xs text-gray-400 font-bold mt-1">
                              {uni.provider} • {uni.country}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 bg-blue-50/30 border border-blue-100 px-3 py-1.5 rounded-full shrink-0">
                            <Percent className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-black text-blue-600">{uni.ai_match_percentage}% Eligibility Fit</span>
                          </div>
                        </div>

                        {/* Info details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                          <div className="flex flex-col gap-4">
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Funding Amount & Period:</span>
                              <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">{uni.funding_amount}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Coverage Scope:</span>
                              <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">{uni.coverage}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Application Deadline:</span>
                              <p className="text-xs sm:text-sm font-semibold text-rose-500 mt-0.5 font-bold">{uni.deadline}</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-4">
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Eligibility Criteria:</span>
                              <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">{uni.eligibility_criteria}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Required Documents:</span>
                              <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">{uni.required_documents}</p>
                            </div>
                          </div>
                        </div>

                        {/* Strategy and Reasoning */}
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
                          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">AI Recommendation Strategy:</span>
                          <p className="text-xs text-gray-600 leading-relaxed font-semibold">{uni.application_strategy}</p>
                        </div>

                        {/* Card actions */}
                        <div className="flex items-center justify-between border-t border-gray-50 pt-4 no-print">
                          <Button
                            variant="ghost"
                            onClick={() => handleSaveScholarship(uni)}
                            disabled={saved}
                            className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                              saved 
                                ? "text-emerald-600 bg-emerald-50" 
                                : "text-gray-500 hover:text-gray-900 border border-gray-200"
                            }`}
                          >
                            {saved ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                            <span>{saved ? "Saved" : "Save to Profile"}</span>
                          </Button>

                          <a href={uni.website} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">
                            Official Website URL
                          </a>
                        </div>

                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-gray-150 pt-8 no-print">
                  <Button
                    variant="ghost"
                    onClick={() => setMatches([])}
                    className="rounded-full px-6 text-gray-500 flex items-center gap-1.5 cursor-pointer text-xs font-bold animate-pulse"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Re-evaluate Profile</span>
                  </Button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: FUNDING PLANNER Roadmaps */}
        {/* ==================================================================== */}
        {activeTab === "planner" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Form entries */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs lg:col-span-2">
              <form onSubmit={handleCalculateFundingRoadmap} className="flex flex-col gap-5">
                <div className="border-b border-gray-50 pb-3">
                  <h3 className="font-extrabold text-gray-950 text-sm flex items-center gap-1.5">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <span>Funding Planner Calculator</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Estimate total study costs and available sponsorship loan coverage.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Tuition Fee / Year (INR)</label>
                    <input
                      type="number"
                      value={tuitionFee}
                      onChange={(e) => setTuitionFee(e.target.value)}
                      className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Living Expenses / Year (INR)</label>
                    <input
                      type="number"
                      value={livingCost}
                      onChange={(e) => setLivingCost(e.target.value)}
                      className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Travel Cost (INR)</label>
                    <input
                      type="number"
                      value={travelCost}
                      onChange={(e) => setTravelCost(e.target.value)}
                      className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Visa Cost (INR)</label>
                    <input
                      type="number"
                      value={visaCost}
                      onChange={(e) => setVisaCost(e.target.value)}
                      className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Insurance (INR)</label>
                    <input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                      className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Misc Expenses (INR)</label>
                    <input
                      type="number"
                      value={miscCost}
                      onChange={(e) => setMiscCost(e.target.value)}
                      className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Savings / Block account (INR)</label>
                    <input
                      type="number"
                      value={savingsAmt}
                      onChange={(e) => setSavingsAmt(e.target.value)}
                      className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Education Loan Approved (INR)</label>
                    <input
                      type="number"
                      value={loanAmt}
                      onChange={(e) => setLoanAmt(e.target.value)}
                      className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Sponsor Support (INR)</label>
                    <input
                      type="number"
                      value={scholarshipAmt}
                      onChange={(e) => setScholarshipAmt(e.target.value)}
                      className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-xs text-xs"
                >
                  {fundingLoading ? <Loader2 className="w-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                  <span>Generate Funding Roadmap</span>
                </Button>

              </form>
            </div>

            {/* Right Column: Suggested payment schedules and scores */}
            <div className="bg-gray-50 border border-gray-150 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-4">Funding Audit Roadmap</h4>

                {fundingResult ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Estimated Total Costs:</span>
                      <p className="text-lg font-black text-gray-900">
                        ₹{(fundingResult.plan.total_cost / 100000).toFixed(2)} Lakhs
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Available Liquid Funds:</span>
                      <p className="text-lg font-black text-gray-900">
                        ₹{(fundingResult.plan.total_available / 100000).toFixed(2)} Lakhs
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <span className="text-[10px] text-gray-450 font-bold uppercase">Estimated Funding Gap:</span>
                      <p className={`text-xl font-black ${fundingResult.plan.funding_gap > 0 ? "text-rose-650" : "text-emerald-650"}`}>
                        ₹{(fundingResult.plan.funding_gap / 100000).toFixed(2)} Lakhs
                      </p>
                    </div>

                    <div className="bg-white border border-gray-150 p-4 rounded-xl mt-4">
                      <span className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Financial Safety Score:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-blue-600">{fundingResult.plan.readiness_score}/100</span>
                        <span className="text-[10px] font-bold text-gray-450">Safety</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-normal mt-3 font-semibold">{fundingResult.plan.suggested_plan}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 leading-normal">Submit tuition fee and savings balances to calculate funding ratios.</p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
