"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  MapPin,
  CircleDollarSign,
  Heart,
  Plus,
  Trash2,
  Printer,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Check,
  Percent,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UniversityRecommendation {
  match_percentage: number;
  university_name: string;
  country: string;
  course: string;
  tuition_fee: string;
  living_cost: string;
  scholarship_opportunities: string;
  admission_requirements: string;
  visa_difficulty: string;
  employment_opportunities: string;
  ai_recommendation_summary: string;
}

export default function UniversityMatcher() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Questionnaire State
  const [nationality, setNationality] = useState("Indian");
  const [currentCountry, setCurrentCountry] = useState("India");
  const [qualification, setQualification] = useState("Bachelor of Science");
  const [gpa, setGpa] = useState("80");
  const [gradYear, setGradYear] = useState("2025");
  const [englishExam, setEnglishExam] = useState("IELTS");
  const [englishScore, setEnglishScore] = useState("7.5");
  const [neetScore, setNeetScore] = useState("");

  const [preferredCountries, setPreferredCountries] = useState<string[]>(["Canada", "USA"]);
  const [degreeLevel, setDegreeLevel] = useState("Master's");
  const [courseInterest, setCourseInterest] = useState("Computer Science");
  const [budget, setBudget] = useState("20 - 30 Lakhs");
  const [intake, setIntake] = useState("Fall 2026");
  const [scholarshipRequired, setScholarshipRequired] = useState(false);

  // 2. Results State
  const [recommendations, setRecommendations] = useState<UniversityRecommendation[]>([]);
  const [filteredRecs, setFilteredRecs] = useState<UniversityRecommendation[]>([]);
  const [savedUnis, setSavedUnis] = useState<string[]>([]);
  
  // 3. Search / Filter / Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("match"); // match, fee, ranking

  // 4. Comparison State
  const [compareList, setCompareList] = useState<UniversityRecommendation[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const countriesList = ["USA", "Canada", "UK", "Germany", "Australia", "Ireland", "New Zealand"];

  const handleCountryToggle = (country: string) => {
    setPreferredCountries((prev) => 
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleStartMatching = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      nationality,
      current_country: currentCountry,
      highest_qualification: qualification,
      gpa_percentage: parseFloat(gpa) || 80.0,
      graduation_year: parseInt(gradYear) || 2025,
      english_exam: englishExam,
      english_score: parseFloat(englishScore) || 7.0,
      neet_score: neetScore ? parseInt(neetScore) : null,
      preferred_countries: preferredCountries,
      degree_level: degreeLevel,
      course: courseInterest,
      budget,
      preferred_intake: intake,
      scholarship_required: scholarshipRequired
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/university-matcher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Verification failed");
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setFilteredRecs(data.recommendations || []);
      setStep(3);
    } catch (err) {
      console.warn("Backend offline. Loading local recommendations fallback.");
      const mockRecs: UniversityRecommendation[] = [
        {
          match_percentage: 95,
          university_name: "University of Toronto",
          country: "Canada",
          course: "M.S. in Computer Science",
          tuition_fee: "$38,000 - $58,000 CAD",
          living_cost: "$18,000 - $22,000 CAD",
          scholarship_opportunities: "Eligible for standard international student merit waivers.",
          admission_requirements: "GPA: 80% equivalent. IELTS: 7.0+ overall.",
          visa_difficulty: "Medium",
          employment_opportunities: "3 years PGWP (Post-Graduation Work Permit) with strong local tech hub options.",
          ai_recommendation_summary: "Strong compatibility based on your solid GPA and preference for Canada. Excellent research facilities."
        },
        {
          match_percentage: 92,
          university_name: "TUM (Technical University of Munich)",
          country: "Germany",
          course: "M.S. in Software Engineering",
          tuition_fee: "€0 - €6,000 EUR",
          living_cost: "€11,000 - €13,000 EUR",
          scholarship_opportunities: "TUM scholarship and DAAD grants available.",
          admission_requirements: "Strict subject match on bachelor course credits. IELTS: 6.5+.",
          visa_difficulty: "Low",
          employment_opportunities: "18 months job-seeker visa with massive industrial links in Bavaria.",
          ai_recommendation_summary: "Matches your budget parameters perfectly as tuition fees are negligible. Strong coding focus."
        },
        {
          match_percentage: 88,
          university_name: "NYU (New York University)",
          country: "USA",
          course: "M.S. in Computer Science",
          tuition_fee: "$52,000 - $58,000 USD",
          living_cost: "$22,000 - $26,000 USD",
          scholarship_opportunities: "Limited merit scholarships for international students.",
          admission_requirements: "GRE score recommended (315+). IELTS: 7.5+.",
          visa_difficulty: "Medium",
          employment_opportunities: "3 years OPT STEM extension. Major employers in NY Finance & Tech.",
          ai_recommendation_summary: "Superb ranking and placement rates. Fits your interest in top-tier US education."
        }
      ];
      setRecommendations(mockRecs);
      setFilteredRecs(mockRecs);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  // Filter / Sort processing
  React.useEffect(() => {
    let result = [...recommendations];

    // Search query
    if (searchQuery) {
      result = result.filter(r => 
        r.university_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.course.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Country filter
    if (countryFilter !== "All") {
      result = result.filter(r => r.country.toLowerCase() === countryFilter.toLowerCase());
    }

    // Sort by selection
    if (sortBy === "match") {
      result.sort((a, b) => b.match_percentage - a.match_percentage);
    } else if (sortBy === "fee") {
      // Basic text sort fallback
      result.sort((a, b) => a.tuition_fee.localeCompare(b.tuition_fee));
    }

    setFilteredRecs(result);
  }, [searchQuery, countryFilter, sortBy, recommendations]);

  // Save to favorites handler
  const handleSaveUni = async (uni: UniversityRecommendation) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/university/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: uni.university_name,
          country: uni.country,
          course: uni.course,
          tuition_fee: uni.tuition_fee,
          match_percentage: uni.match_percentage
        })
      });
      if (res.ok) {
        setSavedUnis((prev) => [...prev, uni.university_name]);
      }
    } catch (err) {
      setSavedUnis((prev) => [...prev, uni.university_name]);
    }
  };

  // Compare handlers
  const handleCompareToggle = (uni: UniversityRecommendation) => {
    setCompareList((prev) => {
      const exists = prev.find(item => item.university_name === uni.university_name);
      if (exists) {
        return prev.filter(item => item.university_name !== uni.university_name);
      } else {
        if (prev.length >= 3) {
          alert("You can compare a maximum of 3 universities at a time.");
          return prev;
        }
        return [...prev, uni];
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
      {/* Dynamic printer rules */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; border: none; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl" id="print-area">
        
        {/* Full-screen AI Matching Loader */}
        {loading && (
          <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 max-w-sm text-center px-6">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
                <Sparkles className="w-6 h-6 text-indigo-500 absolute animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-gray-900 mb-2">Analyzing Suitabilities</h3>
                <p className="text-xs text-gray-450 leading-relaxed">
                  Aura Matching Engine is comparing your GPA, tuition parameters, visa history limits, and study goals against global universities...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide mb-4">
            AI Shortlister
          </span>
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight leading-tight">
            AI University Matcher
          </h1>
          <p className="text-xs text-gray-450 mt-1 leading-snug">
            Shortlist and rank courses in target countries matching your budget.
          </p>
        </div>

        {/* STEP 1: Personal & Academic profile details */}
        {step === 1 && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <form onSubmit={() => setStep(2)} className="flex flex-col gap-6">
              <div className="border-b border-gray-50 pb-4">
                <h2 className="text-lg font-bold text-gray-950 flex items-center gap-1.5">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span>Academic Scoping Profile</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Please provide your grades and language targets.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Country Residence</label>
                  <input
                    type="text"
                    value={currentCountry}
                    onChange={(e) => setCurrentCountry(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Graduation Year</label>
                  <input
                    type="number"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">English Test Type</label>
                  <select
                    value={englishExam}
                    onChange={(e) => setEnglishExam(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                  >
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="PTE">PTE Academic</option>
                    <option value="None">No English Exam</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">English Score</label>
                  <input
                    type="text"
                    value={englishScore}
                    onChange={(e) => setEnglishScore(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">NEET Score (Medical only)</label>
                  <input
                    type="number"
                    value={neetScore}
                    onChange={(e) => setNeetScore(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
              >
                <span>Preferences Setup</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </Button>
            </form>
          </div>
        )}

        {/* STEP 2: Preferred country checklist, degree, and budget */}
        {step === 2 && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <form onSubmit={handleStartMatching} className="flex flex-col gap-6">
              <div className="border-b border-gray-50 pb-4">
                <h2 className="text-lg font-bold text-gray-950 flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Choose Study Preferences</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Specify targeted locations and maximum fees bounds.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Target Countries</label>
                <div className="flex flex-wrap gap-2.5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Target Degree Level</label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                  >
                    <option value="Bachelor's">Bachelor's Degree</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="Ph.D.">Doctorate (Ph.D.)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Target Course / Major</label>
                  <input
                    type="text"
                    value={courseInterest}
                    onChange={(e) => setCourseInterest(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Target Budget Range</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                  >
                    <option value="10 - 20 Lakhs">10 - 20 Lakhs INR / Year</option>
                    <option value="20 - 30 Lakhs">20 - 30 Lakhs INR / Year</option>
                    <option value="30 - 45 Lakhs">30 - 45 Lakhs INR / Year</option>
                    <option value="Above 45 Lakhs">Above 45 Lakhs INR / Year</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Preferred Intake</label>
                  <select
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                  >
                    <option value="Fall 2026">Fall 2026</option>
                    <option value="Spring 2027">Spring 2027</option>
                    <option value="Fall 2027">Fall 2027</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <input
                  type="checkbox"
                  checked={scholarshipRequired}
                  onChange={(e) => setScholarshipRequired(e.target.checked)}
                  className="w-4.5 h-4.5 accent-blue-600 cursor-pointer"
                  id="scholarship"
                />
                <label htmlFor="scholarship" className="text-xs font-bold text-gray-700 cursor-pointer">
                  I require scholarship / financial aid options
                </label>
              </div>

              <div className="flex items-center justify-between gap-4 mt-4 border-t border-gray-50 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-gray-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Academic</span>
                </button>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg flex items-center gap-2 cursor-pointer text-xs"
                >
                  <Sparkles className="w-4 h-4 fill-white/10" />
                  <span>Match Universities</span>
                </Button>
              </div>

            </form>
          </div>
        )}

        {/* STEP 3: Matches recommendations catalog result grid workspace */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            
            {/* Filter Top Nav panel bar */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 no-print">
              
              <div className="relative w-full md:w-60">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-blue-600 w-full font-medium"
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-600 font-bold"
                  >
                    <option value="All">All Countries</option>
                    {countriesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-[10px] text-gray-400 font-bold uppercase whitespace-nowrap">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-600 font-bold"
                  >
                    <option value="match">Match %</option>
                    <option value="fee">Tuition Fee</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Recommendations log cards grid */}
            <div className="flex flex-col gap-8">
              {filteredRecs.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-12 text-center">
                  <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-950 text-sm">No Matches Match Filters</h3>
                  <p className="text-xs text-gray-400">Try modifying search tags or location filters.</p>
                </div>
              ) : (
                filteredRecs.map((uni, idx) => {
                  const saved = savedUnis.includes(uni.university_name);
                  const compared = compareList.some(item => item.university_name === uni.university_name);
                  return (
                    <div 
                      key={uni.university_name} 
                      className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />

                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-50 pb-4 mb-6">
                        <div>
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Rank #{idx + 1} Recommendation
                          </span>
                          <h3 className="font-black text-gray-950 text-xl mt-2 leading-snug">
                            {uni.university_name}
                          </h3>
                          <p className="text-xs text-gray-400 font-bold mt-1 leading-snug">
                            {uni.country} • {uni.course}
                          </p>
                        </div>

                        {/* Radial match percentage badge */}
                        <div className="flex items-center gap-2 bg-blue-50/30 border border-blue-100 px-3 py-1.5 rounded-full shrink-0">
                          <Percent className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-black text-blue-600">{uni.match_percentage}% Fit</span>
                        </div>
                      </div>

                      {/* Info logs tables */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        
                        <div className="flex flex-col gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Estimated Tuition Fee:</span>
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">{uni.tuition_fee}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Estimated Living Cost:</span>
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">{uni.living_cost}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Scholarships Info:</span>
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">{uni.scholarship_opportunities}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Admission Thresholds:</span>
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">{uni.admission_requirements}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Visa Difficulty & Processing:</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${
                              uni.visa_difficulty === "Low" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>
                              {uni.visa_difficulty} Visa Refusal Risk
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Post-Study Placements:</span>
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5">{uni.employment_opportunities}</p>
                          </div>
                        </div>

                      </div>

                      {/* AI Summary card reasoning */}
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">AI Match Reasoning:</span>
                        <p className="text-xs text-gray-600 leading-relaxed font-semibold">{uni.ai_recommendation_summary}</p>
                      </div>

                      {/* Card Actions bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50 no-print">
                        <div className="flex items-center gap-3">
                          
                          <Button
                            variant="ghost"
                            onClick={() => handleSaveUni(uni)}
                            disabled={saved}
                            className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                              saved 
                                ? "text-emerald-600 bg-emerald-50" 
                                : "text-gray-500 hover:text-gray-900 border border-gray-200"
                            }`}
                          >
                            {saved ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                            <span>{saved ? "Saved to Profile" : "Save Favorite"}</span>
                          </Button>

                          <Button
                            variant="ghost"
                            onClick={() => handleCompareToggle(uni)}
                            className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer border ${
                              compared 
                                ? "text-blue-600 bg-blue-50 border-blue-200" 
                                : "text-gray-500 hover:text-gray-900 border-gray-200"
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                            <span>{compared ? "In Compare Stack" : "Add to Compare"}</span>
                          </Button>

                        </div>

                        <Button
                          onClick={() => router.push(`/dashboard?tab=overview`)}
                          className="h-9 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <span>Apply Course</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom print log options */}
            <div className="flex items-center justify-between border-t border-gray-150 pt-8 no-print">
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="rounded-full px-6 text-gray-500 flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Adjust Preferences</span>
              </Button>

              <Button
                onClick={handlePrint}
                className="h-10 px-6 rounded-full bg-blue-650 hover:bg-blue-750 text-white font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Export Recommendations Report</span>
              </Button>
            </div>

          </div>
        )}

        {/* 5. COMPARISON FLOATING DRAWER OVERLAY */}
        {compareList.length > 0 && !showCompareModal && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-950 text-white px-6 py-4 rounded-full shadow-2xl z-40 flex items-center gap-6 no-print max-w-md w-full border border-gray-800">
            <div className="flex-1">
              <h4 className="text-xs font-extrabold flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>Comparing Universities</span>
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {compareList.length} of 3 selected.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCompareList([])}
                className="text-[10px] text-gray-400 hover:text-white font-bold mr-1"
              >
                Clear
              </button>
              
              <Button
                onClick={() => setShowCompareModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] py-1.5 px-4 rounded-full shadow-md cursor-pointer h-7"
              >
                Compare Now
              </Button>
            </div>
          </div>
        )}

        {/* 6. SIDE-BY-SIDE MATRIX DIALOG MODAL */}
        <AnimatePresence>
          {showCompareModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl"
              >
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-450 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="border-b border-gray-50 pb-4 mb-6">
                  <h3 className="text-lg font-black text-gray-950 flex items-center gap-1.5">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>University Matrix Comparison</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Side-by-side analysis of targeted course selections.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-150">
                        <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-40">Features</th>
                        {compareList.map(uni => (
                          <th key={uni.university_name} className="py-3 px-4 font-black text-gray-950 text-xs sm:text-sm">
                            {uni.university_name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-50 text-xs text-gray-700">
                        <td className="py-3 font-bold text-gray-400">Match likelihood</td>
                        {compareList.map(uni => (
                          <td key={uni.university_name} className="py-3 px-4 font-black text-blue-600">
                            {uni.match_percentage}% Fit
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-50 text-xs text-gray-700">
                        <td className="py-3 font-bold text-gray-400">Target Country</td>
                        {compareList.map(uni => (
                          <td key={uni.university_name} className="py-3 px-4 font-semibold">
                            {uni.country}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-50 text-xs text-gray-700">
                        <td className="py-3 font-bold text-gray-400">Matched Course</td>
                        {compareList.map(uni => (
                          <td key={uni.university_name} className="py-3 px-4 font-semibold">
                            {uni.course}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-50 text-xs text-gray-700">
                        <td className="py-3 font-bold text-gray-400">Tuition Fees</td>
                        {compareList.map(uni => (
                          <td key={uni.university_name} className="py-3 px-4 font-semibold">
                            {uni.tuition_fee}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-50 text-xs text-gray-700">
                        <td className="py-3 font-bold text-gray-400">Living Expenses</td>
                        {compareList.map(uni => (
                          <td key={uni.university_name} className="py-3 px-4 font-semibold">
                            {uni.living_cost}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-50 text-xs text-gray-700">
                        <td className="py-3 font-bold text-gray-400">Admissions Criteria</td>
                        {compareList.map(uni => (
                          <td key={uni.university_name} className="py-3 px-4 font-semibold text-gray-600 leading-normal">
                            {uni.admission_requirements}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-50 text-xs text-gray-700">
                        <td className="py-3 font-bold text-gray-400">Visa processing risk</td>
                        {compareList.map(uni => (
                          <td key={uni.university_name} className="py-3 px-4">
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {uni.visa_difficulty} Risk
                            </span>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-8 border-t border-gray-50 pt-4">
                  <Button
                    onClick={() => setShowCompareModal(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-full text-xs cursor-pointer shadow-md"
                  >
                    Close Comparison
                  </Button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
