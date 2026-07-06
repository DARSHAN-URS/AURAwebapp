"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  MapPin, 
  Wallet, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Calculator,
  Compass, 
  HelpCircle, 
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Printer,
  FileCheck,
  Check,
  Percent,
  X,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChecklistItem {
  id: string;
  item_name: string;
  status: string;
  notes?: string;
}

interface TimelineItem {
  id: string;
  event_title: string;
  event_date: string;
  status: string;
}

interface Recommendation {
  id: string;
  title: string;
  message: string;
}

export default function VisaSuccessCenter() {
  const router = useRouter();

  // Selected Country Workspace
  const [selectedCountry, setSelectedCountry] = useState("Canada");
  const [activeTab, setActiveTab] = useState<"dashboard" | "checklist" | "financial" | "coach" | "timeline">("dashboard");
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Financial Form States
  const [tuitionFee, setTuitionFee] = useState("1800000"); // 18 Lakhs
  const [livingExpenses, setLivingExpenses] = useState("1000000"); // 10 Lakhs
  const [scholarship, setScholarship] = useState("200000"); // 2 Lakhs
  const [loan, setLoan] = useState("1500000"); // 15 Lakhs
  const [savings, setSavings] = useState("1200000"); // 12 Lakhs
  const [financialResult, setFinancialResult] = useState<any>(null);
  const [finLoading, setFinLoading] = useState(false);

  // Interview Coach States
  const [selectedQuestion, setSelectedQuestion] = useState("Why did you select this specific university?");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [coachFeedback, setCoachFeedback] = useState<any>(null);
  const [coachLoading, setCoachLoading] = useState(false);

  // Questionnaire Assessment
  const [showAssessment, setShowAssessment] = useState(false);
  const [acadScore, setAcadScore] = useState(85);
  const [finScore, setFinScore] = useState(80);
  const [docScore, setDocScore] = useState(70);
  const [travelScore, setTravelScore] = useState(60);
  const [interviewScore, setInterviewScore] = useState(75);
  const [readinessReport, setReadinessReport] = useState<any>(null);
  const [assessLoading, setAssessLoading] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const countriesList = ["Canada", "USA", "UK", "Germany", "Australia", "Ireland", "New Zealand"];

  const visaQuestions = [
    "Why did you select this specific university?",
    "How will you finance your tuition fees and living expenses?",
    "What are your career plans after graduation?",
    "Why did you choose this target country instead of studying in India?"
  ];

  // Fetch Dashboard details
  const fetchDashboard = async (country: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/visa/dashboard?country=${country}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDashboardData(data);
      if (data.financial) {
        setFinancialResult(data.financial);
      }
      if (data.readiness) {
        setReadinessReport(data.readiness);
      }
    } catch (err) {
      console.warn("Backend offline. Setting up local visa dashboard fallbacks.");
      setupFallbackDashboard(country);
    } finally {
      setLoading(false);
    }
  };

  const setupFallbackDashboard = (country: string) => {
    setDashboardData({
      profile: {
        country,
        visa_type: "Student Visa",
        current_stage: "Documents"
      },
      readiness: readinessReport || {
        overall_score: 74,
        risk_level: "Medium",
        critical_issues: [
          "Financial liquid proof balance is near minimum requirements bounds.",
          "Biometrics pre-appointment date not yet locked."
        ],
        suggested_improvements: [
          "Submit verified fixed deposits sponsor certifications.",
          "Schedule upfront biometric pre-check scans."
        ]
      },
      checklist: [
        { id: "c1", item_name: "Valid Passport copy scan", status: "Completed" },
        { id: "c2", item_name: "University Official Admission Letter", status: "Completed" },
        { id: "c3", item_name: "GIC Deposit Account statement", status: "Pending" },
        { id: "c4", item_name: "Upfront Medical exam clearance", status: "Pending" },
        { id: "c5", item_name: "SOP visa draft copy", status: "Needs Review" }
      ],
      tasks: [],
      financial: financialResult || {
        tuition_fee: 1800000,
        living_expenses: 1000000,
        scholarship_amount: 200000,
        education_loan: 1500000,
        savings: 1200000,
        required_funds: 2800000,
        available_funds: 2900000,
        funding_gap: 0,
        readiness_score: 95
      },
      timeline: [
        { id: "t1", event_title: "Obtain University Admission Pack", event_date: "2025-10-15", status: "Completed" },
        { id: "t2", event_title: "Open GIC Blocked Savings Account", event_date: "2025-11-20", status: "Pending" },
        { id: "t3", event_title: "Upfront immigration medical checkups", event_date: "2026-02-10", status: "Pending" },
        { id: "t4", event_title: "Submit biometric scans and file logs", event_date: "2026-04-05", status: "Pending" }
      ],
      recommendations: [
        { id: "r1", title: "Schedule Upfront Medicals early", message: "Medical checklists validation queues take up to 20 days in high seasons." },
        { id: "r2", title: "GIC Funds buffer check", message: "Ensure sponsor funding matches GIC guidelines with a buffer of 10% for currency rates swings." }
      ]
    });
  };

  useEffect(() => {
    fetchDashboard(selectedCountry);
  }, [selectedCountry]);

  // Submit assessment questionnaire
  const handleStartReadinessAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssessLoading(true);

    const payload = {
      country: selectedCountry,
      academic_readiness: acadScore,
      financial_readiness: finScore,
      document_readiness: docScore,
      travel_readiness: travelScore,
      interview_readiness: interviewScore
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/visa/readiness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setReadinessReport(data);
      setShowAssessment(false);
      fetchDashboard(selectedCountry);
    } catch (err) {
      // Mock result fallback
      const mockReport = {
        overall_score: intCalcReadiness(),
        risk_level: intCalcReadiness() > 75 ? "Low" : "Medium",
        critical_issues: ["Sponsor assets proof needs validation logs."],
        suggested_improvements: ["Verify sponsor bank statement signatures."]
      };
      setReadinessReport(mockReport);
      setShowAssessment(false);
    } finally {
      setAssessLoading(false);
    }
  };

  const intCalcReadiness = () => {
    return Math.round((acadScore + finScore + docScore + travelScore + interviewScore) / 5);
  };

  // Financial Calculator Submit
  const handleCalculateFinancials = async (e: React.FormEvent) => {
    e.preventDefault();
    setFinLoading(true);

    const payload = {
      country: selectedCountry,
      tuition_fee: parseFloat(tuitionFee) || 0,
      living_expenses: parseFloat(livingExpenses) || 0,
      scholarship_amount: parseFloat(scholarship) || 0,
      education_loan: parseFloat(loan) || 0,
      savings: parseFloat(savings) || 0
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/visa/financial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setFinancialResult(data);
      fetchDashboard(selectedCountry);
    } catch (err) {
      // Offline calculation fallback
      const req = payload.tuition_fee + payload.living_expenses;
      const avail = payload.scholarship_amount + payload.education_loan + payload.savings;
      const gap = Math.max(0, req - avail);
      const score = req > 0 ? Math.min(100, Math.round((avail / req) * 100)) : 100;
      setFinancialResult({
        tuition_fee: payload.tuition_fee,
        living_expenses: payload.living_expenses,
        scholarship_amount: payload.scholarship_amount,
        education_loan: payload.education_loan,
        savings: payload.savings,
        required_funds: req,
        available_funds: avail,
        funding_gap: gap,
        readiness_score: score
      });
    } finally {
      setFinLoading(false);
    }
  };

  // Submit Interview Coach practice answer
  const handleCoachAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim()) return;
    setCoachLoading(true);

    const payload = {
      country: selectedCountry,
      question: selectedQuestion,
      student_answer: studentAnswer
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/visa/interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      // We grab the last answer feedback from questions array
      if (data.questions && data.questions.length > 0) {
        setCoachFeedback(data.questions[data.questions.length - 1]);
      }
    } catch (err) {
      // Mock feedback response fallback
      setTimeout(() => {
        setCoachFeedback({
          feedback: "Good response outline. However, you should add precise career opportunities you will target back in India.",
          score: 80,
          rating: "Good",
          suggestions: "Try adding sentences like: 'Upon graduation, I intend to join top tech consulting firms in Mumbai as a Systems Engineer.'"
        });
      }, 1000);
    } finally {
      setCoachLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentReadiness = dashboardData?.readiness?.overall_score || 70;

  return (
    <div className="bg-white min-h-screen pt-32 pb-24" id="print-area">
      {/* Global CSS for print */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">AI Student Visa Coach</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Pre-flight checks, financial audits, and visa interview practice panels.</p>
          </div>

          <div className="flex items-center gap-3 no-print">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
            >
              {countriesList.map((c) => (
                <option key={c} value={c}>
                  {c} Workspace
                </option>
              ))}
            </select>

            <Button
              onClick={handlePrint}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer h-10"
            >
              <Printer className="w-4 h-4" />
              <span>Export Readiness Plan</span>
            </Button>
          </div>
        </div>

        {/* Global Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <p className="text-sm font-semibold text-gray-500">Loading {selectedCountry} checklist data...</p>
          </div>
        ) : (
          <div>
            
            {/* View Tabs Selector */}
            <div className="flex flex-wrap items-center gap-2 bg-gray-50/50 border border-gray-150 rounded-2xl p-2.5 mb-8 no-print">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("dashboard")}
                className={`h-9 px-4 rounded-xl text-xs font-bold cursor-pointer ${
                  activeTab === "dashboard" ? "bg-white text-blue-600 shadow-xs border border-gray-250/20" : "text-gray-500"
                }`}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("checklist")}
                className={`h-9 px-4 rounded-xl text-xs font-bold cursor-pointer ${
                  activeTab === "checklist" ? "bg-white text-blue-600 shadow-xs border border-gray-250/20" : "text-gray-500"
                }`}
              >
                Visa Checklist
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("financial")}
                className={`h-9 px-4 rounded-xl text-xs font-bold cursor-pointer ${
                  activeTab === "financial" ? "bg-white text-blue-600 shadow-xs border border-gray-250/20" : "text-gray-500"
                }`}
              >
                Financial Planner
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("coach")}
                className={`h-9 px-4 rounded-xl text-xs font-bold cursor-pointer ${
                  activeTab === "coach" ? "bg-white text-blue-600 shadow-xs border border-gray-250/20" : "text-gray-500"
                }`}
              >
                Interview Coach
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("timeline")}
                className={`h-9 px-4 rounded-xl text-xs font-bold cursor-pointer ${
                  activeTab === "timeline" ? "bg-white text-blue-600 shadow-xs border border-gray-250/20" : "text-gray-500"
                }`}
              >
                Timeline Planner
              </Button>
            </div>

            {/* TAB CONTENT SPACES */}
            <div>
              
              {/* TAB 1: VISA DASHBOARD MAIN OVERVIEW */}
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Readiness Score gauge & assessment trigger */}
                  <div className="flex flex-col gap-6 lg:col-span-2">
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
                      
                      {/* Circular Gauge */}
                      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                          <circle cx="50" cy="50" r="42" stroke="#2563eb" strokeWidth="8" fill="transparent"
                            strokeDasharray={264}
                            strokeDashoffset={264 - (264 * currentReadiness) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-black text-gray-900">{currentReadiness}%</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Readiness</span>
                        </div>
                      </div>

                      {/* Score stats explanations */}
                      <div className="flex-1">
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                          AI Assessment report
                        </span>
                        <h3 className="font-extrabold text-gray-950 text-lg mt-2">Visa Approval Likelihood</h3>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          Your overall score is compiled across academic history, blocks finance proof, check verification files, and interview practices.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-4">
                          <Button
                            onClick={() => setShowAssessment(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full text-xs cursor-pointer shadow-xs"
                          >
                            <span>Run AI Readiness Audit</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Critical Issues & Suggestions panels */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs">
                      <h3 className="font-extrabold text-gray-950 text-sm mb-4 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <span>Critical Approval Risks & Improvements</span>
                      </h3>

                      <div className="flex flex-col gap-4">
                        {dashboardData?.readiness?.critical_issues?.map((issue: string, idx: number) => (
                          <div key={idx} className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl flex gap-3 items-start">
                            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-xs font-black text-rose-800">Risk Factor Flagged</h5>
                              <p className="text-xs text-rose-700 mt-0.5 font-semibold leading-relaxed">{issue}</p>
                            </div>
                          </div>
                        ))}

                        {dashboardData?.readiness?.suggested_improvements?.map((imp: string, idx: number) => (
                          <div key={idx} className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl flex gap-3 items-start">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-xs font-black text-emerald-800">Actionable Suggestion</h5>
                              <p className="text-xs text-emerald-700 mt-0.5 font-semibold leading-relaxed">{imp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: recommendations feeds & stage info */}
                  <div className="flex flex-col gap-6">
                    {/* Stage status card */}
                    <div className="bg-gray-50 border border-gray-150 rounded-3xl p-6">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Immigration Target</span>
                      <h4 className="font-black text-gray-900 text-lg mt-1">{selectedCountry} Student Visa</h4>
                      
                      <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Stage: {dashboardData?.profile?.current_stage} stage</span>
                      </div>
                    </div>

                    {/* AI Recommendation feeds cards */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
                      <h4 className="font-extrabold text-gray-950 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500/10" />
                        <span>Actionable AI Checklist Notes</span>
                      </h4>

                      {dashboardData?.recommendations?.map((r: any) => (
                        <div key={r.id} className="border border-gray-100 p-4 rounded-2xl flex gap-3 items-start shadow-xs">
                          <Check className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <h5 className="text-xs font-bold text-gray-900">{r.title}</h5>
                            <p className="text-[10px] text-gray-400 leading-normal mt-0.5">{r.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: DOCUMENT CHECKLISTS */}
              {activeTab === "checklist" && (
                <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="border-b border-gray-50 pb-3 mb-6">
                    <h3 className="font-extrabold text-gray-950 text-sm flex items-center gap-1.5">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      <span>Required Document Checklist</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Audit status checks for mandatory visa file slots.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {dashboardData?.checklist?.map((item: any) => (
                      <div key={item.id} className="bg-gray-50/50 border border-gray-150 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm">{item.item_name}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Checked status parameters logic.</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                            item.status === "Completed" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : item.status === "Needs Review" 
                                ? "bg-amber-50 text-amber-700 border-amber-100" 
                                : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: FINANCIAL PLANNER CALCULATOR */}
              {activeTab === "financial" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Form parameters entry */}
                  <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs lg:col-span-2">
                    <form onSubmit={handleCalculateFinancials} className="flex flex-col gap-5">
                      <div className="border-b border-gray-50 pb-3">
                        <h3 className="font-extrabold text-gray-950 text-sm flex items-center gap-1.5">
                          <Calculator className="w-5 h-5 text-blue-600" />
                          <span>Financial Readiness Calculator</span>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Verify sponsor coverage buffers and blocks deposits targets.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Estimated Tuition Fee (INR / Year)</label>
                          <input
                            type="number"
                            value={tuitionFee}
                            onChange={(e) => setTuitionFee(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Estimated Living Expenses (INR / Year)</label>
                          <input
                            type="number"
                            value={livingExpenses}
                            onChange={(e) => setLivingExpenses(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Scholarships (INR)</label>
                          <input
                            type="number"
                            value={scholarship}
                            onChange={(e) => setScholarship(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Education Loan (INR)</label>
                          <input
                            type="number"
                            value={loan}
                            onChange={(e) => setLoan(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Savings / Blocks (INR)</label>
                          <input
                            type="number"
                            value={savings}
                            onChange={(e) => setSavings(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-xs text-xs"
                      >
                        {finLoading ? <Loader2 className="w-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                        <span>Calculate Funding Readiness</span>
                      </Button>
                    </form>
                  </div>

                  {/* Right Column: calculations results display matrix */}
                  <div className="bg-gray-50 border border-gray-150 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-4">Funding Summary Result</h4>
                      
                      {financialResult ? (
                        <div className="flex flex-col gap-4">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Required Funds Target:</span>
                            <p className="text-lg font-black text-gray-900">₹{(financialResult.required_funds / 100000).toFixed(2)} Lakhs</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Available Funds:</span>
                            <p className="text-lg font-black text-gray-900">₹{(financialResult.available_funds / 100000).toFixed(2)} Lakhs</p>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-3">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Funding Gap / Deficit:</span>
                            <p className={`text-xl font-black ${financialResult.funding_gap > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                              ₹{(financialResult.funding_gap / 100000).toFixed(2)} Lakhs
                            </p>
                          </div>

                          <div className="bg-white border border-gray-150 p-4 rounded-xl mt-4">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Financial Safety Score:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-black text-blue-600">{financialResult.readiness_score}/100</span>
                              <span className="text-[10px] font-bold text-gray-450">Preparedness</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 leading-normal">Submit tuition fee and savings balances to calculate funding ratios.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: MOCK INTERVIEW COACH PRACTICE CHANNEL */}
              {activeTab === "coach" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Question practice console */}
                  <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs lg:col-span-2">
                    <form onSubmit={handleCoachAnswerSubmit} className="flex flex-col gap-5">
                      <div className="border-b border-gray-50 pb-3">
                        <h3 className="font-extrabold text-gray-950 text-sm flex items-center gap-1.5">
                          <HelpCircle className="w-5 h-5 text-blue-600" />
                          <span>AI Interview Coach Simulator</span>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Submit responses to common officer queries to review rating score.</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Select Practice Question</label>
                        <select
                          value={selectedQuestion}
                          onChange={(e) => {
                            setSelectedQuestion(e.target.value);
                            setCoachFeedback(null);
                            setStudentAnswer("");
                          }}
                          className="bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                        >
                          {visaQuestions.map((q, idx) => (
                            <option key={idx} value={q}>{q}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Type your answer response</label>
                        <textarea
                          rows={4}
                          value={studentAnswer}
                          onChange={(e) => setStudentAnswer(e.target.value)}
                          className="bg-gray-50 border border-gray-250 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          placeholder="Provide a detailed, professional reply..."
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-xs text-xs"
                      >
                        {coachLoading ? <Loader2 className="w-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        <span>Evaluate Interview Answer</span>
                      </Button>
                    </form>
                  </div>

                  {/* Right Column: AI critique grading display report cards */}
                  <div className="bg-gray-50 border border-gray-150 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-4">Coach Evaluation Report</h4>

                      {coachFeedback ? (
                        <div className="flex flex-col gap-4">
                          
                          <div>
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                              Critique Summary
                            </span>
                            <p className="text-xs text-gray-700 font-semibold leading-relaxed mt-2">{coachFeedback.feedback}</p>
                          </div>

                          <div className="border-t border-gray-200 pt-3">
                            <span className="text-[10px] text-gray-450 font-bold uppercase">Wording Suggestions:</span>
                            <p className="text-xs text-gray-600 leading-normal mt-1 italic">"{coachFeedback.suggestions}"</p>
                          </div>

                          <div className="bg-white border border-gray-150 p-4 rounded-xl mt-4 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] text-gray-400 font-bold uppercase">Answer Score:</span>
                              <p className="text-xl font-black text-blue-650">{coachFeedback.score}/100</p>
                            </div>
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              coachFeedback.rating === "Good" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                            }`}>
                              {coachFeedback.rating} Rating
                            </span>
                          </div>

                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 leading-normal">Submit your practice answer to evaluate grammar, structural strength, and immigration safety factors.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: TIMELINE PLANNER SCHEDULES */}
              {activeTab === "timeline" && (
                <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="border-b border-gray-50 pb-3 mb-6">
                    <h3 className="font-extrabold text-gray-950 text-sm flex items-center gap-1.5">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>AI Visa Roadmap Timeline</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Immigration roadmap milestones and scheduling checks.</p>
                  </div>

                  <div className="relative pl-6 border-l border-gray-150 flex flex-col gap-6 ml-2 mt-4">
                    {dashboardData?.timeline?.map((event: any) => (
                      <div key={event.id} className="relative">
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-600 absolute -left-[33px] top-1 border border-white" />
                        
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                          <div>
                            <h4 className="font-extrabold text-gray-950 text-xs sm:text-sm">{event.event_title}</h4>
                            <span className="text-[10px] text-gray-400 font-bold mt-0.5">Scheduling Target checkpoint log.</span>
                          </div>
                          
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full shrink-0">
                            Date: {event.event_date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* READINESS QUESTIONNAIRE ASSESSMENT SCREEN PANEL */}
        {/* ==================================================================== */}
        <AnimatePresence>
          {showAssessment && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 no-print"
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <button 
                  onClick={() => setShowAssessment(false)}
                  className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-450 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="border-b border-gray-50 pb-4 mb-6">
                  <h3 className="text-lg font-black text-gray-950 flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span>Run AI Readiness Audit</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Select self-evaluation readiness scores to grade approval confidence.</p>
                </div>

                <form onSubmit={handleStartReadinessAssessment} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-450 uppercase">
                      <span>Academic Readiness</span>
                      <span>{acadScore}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={acadScore} 
                      onChange={(e) => setAcadScore(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-450 uppercase">
                      <span>Financial Readiness</span>
                      <span>{finScore}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={finScore} 
                      onChange={(e) => setFinScore(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-450 uppercase">
                      <span>Document Preparedness</span>
                      <span>{docScore}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={docScore} 
                      onChange={(e) => setDocScore(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-450 uppercase">
                      <span>Travel / Medical Readiness</span>
                      <span>{travelScore}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={travelScore} 
                      onChange={(e) => setTravelScore(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-450 uppercase">
                      <span>Interview Confidence</span>
                      <span>{interviewScore}%</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={interviewScore} 
                      onChange={(e) => setInterviewScore(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer" 
                    />
                  </div>

                  <div className="flex flex-col gap-1 mt-4">
                    <Button
                      type="submit"
                      className="bg-blue-650 hover:bg-blue-755 text-white font-bold py-3 rounded-full text-xs shadow-md cursor-pointer"
                    >
                      {assessLoading ? <Loader2 className="w-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      <span>Generate AI Audit Report</span>
                    </Button>
                  </div>
                </form>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
