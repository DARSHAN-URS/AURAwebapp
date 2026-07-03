"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCheck, 
  Search, 
  FileText, 
  SearchCode, 
  Sparkles,
  Loader2,
  CheckCircle,
  Copy,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/SectionTitle";

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("eligibility");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Form states
  const [eligibilityData, setEligibilityData] = useState({
    gpa: "8.5",
    ielts: "7.5",
    country: "Canada",
    backlogs: "0"
  });

  const [matcherData, setMatcherData] = useState({
    major: "Computer Science",
    budget: "$25,000 - $45,000",
    country: "United Kingdom"
  });

  const [sopData, setSopData] = useState({
    name: "",
    degree: "Master of Science",
    subject: "Artificial Intelligence",
    experience: "Software Engineer Intern at Aura Tech"
  });

  const [docFile, setDocFile] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setResult(null);
    setLoading(false);
  };

  const runEligibilityChecker = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const isEligible = parseFloat(eligibilityData.gpa) >= 6.5 && parseFloat(eligibilityData.ielts) >= 6.0;
      setResult({
        score: isEligible ? 92 : 45,
        status: isEligible ? "Highly Eligible" : "Action Needed",
        details: isEligible 
          ? `Your profile is strong for universities in ${eligibilityData.country}. Your GPA of ${eligibilityData.gpa} and IELTS of ${eligibilityData.ielts} exceed the minimum cut-offs of top-tier schools.`
          : `Your score is below the average requirement. We suggest increasing your IELTS score or choosing a country like Germany/Dubai with alternative criteria.`
      });
    }, 1200);
  };

  const runUniversityMatcher = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult([
        { name: "University of Toronto", location: "Canada", score: "94%", fee: "$32,000/yr", link: "#" },
        { name: "Trinity College Dublin", location: "Ireland", score: "89%", fee: "$26,000/yr", link: "#" },
        { name: "King's College London", location: "UK", score: "85%", fee: "$34,000/yr", link: "#" },
      ].filter(u => matcherData.country === "All" || u.location === matcherData.country || matcherData.country === "United Kingdom" && u.location === "UK" || matcherData.country === "Canada" && u.location === "Canada"));
    }, 1500);
  };

  const runSOPGenerator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sopData.name) {
      alert("Please enter your name");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult(`STATEMENT OF PURPOSE

Dear Admissions Committee,

My name is ${sopData.name || "Student"}, and I am writing to express my eager interest in joining the ${sopData.degree} program in ${sopData.subject}. Throughout my academic journey, I have cultivated a deep passion for technological advancements. 

My professional training as a ${sopData.experience || "Student"} has provided me with practical engineering principles, analytical reasoning, and real-world problem-solving methodologies. Pursuing this advanced degree will allow me to engage with cutting-edge academic theories, carry out complex research, and prepare to lead development initiatives in the field. I chose your esteemed institution because of its renowned research laboratories and distinguished faculty members. 

Thank you for considering my application. I look forward to contributing to your vibrant student community.

Sincerely,
${sopData.name}`);
    }, 2000);
  };

  const handleCopySop = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const runDocumentChecker = (name: string) => {
    setLoading(true);
    setDocFile(name);
    setTimeout(() => {
      setLoading(false);
      setResult({
        name: name,
        verified: true,
        pages: 3,
        checks: [
          { label: "Valid signature detected", passed: true },
          { label: "GPA conversion format matching", passed: true },
          { label: "No signs of editing/tampering detected", passed: true },
          { label: "Fits visa agency official criteria", passed: true },
        ]
      });
    }, 1500);
  };

  return (
    <div className="bg-white pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide mb-4">
            Aura AI Suite
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            Interactive AI Sandbox
          </h1>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            Test-drive our proprietary AI algorithms. Provide details below to experience instant matched, verified, and drafted student profiles.
          </p>
        </div>

        {/* Workspace Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          
          {/* Left Navigation bar */}
          <div className="lg:col-span-4 bg-gray-50/60 border-r border-gray-100 p-6 flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Available Tools</h3>
            
            <button
              onClick={() => handleTabChange("eligibility")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === "eligibility"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span>Eligibility Checker</span>
            </button>

            <button
              onClick={() => handleTabChange("matcher")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === "matcher"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Search className="w-5 h-5" />
              <span>University Matcher</span>
            </button>

            <button
              onClick={() => handleTabChange("sop")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === "sop"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>SOP Draft Generator</span>
            </button>

            <button
              onClick={() => handleTabChange("doc-checker")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === "doc-checker"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <SearchCode className="w-5 h-5" />
              <span>Document Scan Auditor</span>
            </button>
          </div>

          {/* Right Interface Console */}
          <div className="lg:col-span-8 p-8 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-grow flex flex-col"
              >
                
                {/* 1. ELIGIBILITY TAB */}
                {activeTab === "eligibility" && (
                  <form onSubmit={runEligibilityChecker} className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-2">
                      <UserCheck className="w-5 h-5" />
                      <span>Academic Eligibility Profile</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Degree GPA / CGPA</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={eligibilityData.gpa}
                          onChange={(e) => setEligibilityData({ ...eligibilityData, gpa: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Language Exam Score (IELTS equivalent)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="9"
                          value={eligibilityData.ielts}
                          onChange={(e) => setEligibilityData({ ...eligibilityData, ielts: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Target Country</label>
                        <select
                          value={eligibilityData.country}
                          onChange={(e) => setEligibilityData({ ...eligibilityData, country: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                        >
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>United States</option>
                          <option>Australia</option>
                          <option>Ireland</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Academic Backlogs</label>
                        <input
                          type="number"
                          min="0"
                          value={eligibilityData.backlogs}
                          onChange={(e) => setEligibilityData({ ...eligibilityData, backlogs: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md w-full sm:w-fit cursor-pointer flex items-center gap-2 mt-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Auditing Profile...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Check Visa & Admission Eligibility</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* 2. MATCHER TAB */}
                {activeTab === "matcher" && (
                  <form onSubmit={runUniversityMatcher} className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-2">
                      <Search className="w-5 h-5" />
                      <span>Smart University Matcher</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Desired Major</label>
                        <input
                          type="text"
                          value={matcherData.major}
                          onChange={(e) => setMatcherData({ ...matcherData, major: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                          placeholder="e.g. Computer Science"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Annual Budget</label>
                        <select
                          value={matcherData.budget}
                          onChange={(e) => setMatcherData({ ...matcherData, budget: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                        >
                          <option>$10,000 - $25,000</option>
                          <option>$25,000 - $45,000</option>
                          <option>$45,000+</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
                        <select
                          value={matcherData.country}
                          onChange={(e) => setMatcherData({ ...matcherData, country: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                        >
                          <option>All</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Ireland</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md w-full sm:w-fit cursor-pointer flex items-center gap-2 mt-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Searching Schedules...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Find Best University Matches</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* 3. SOP TAB */}
                {activeTab === "sop" && (
                  <form onSubmit={runSOPGenerator} className="flex flex-col gap-5">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-2">
                      <FileText className="w-5 h-5" />
                      <span>Contextual SOP Generator</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Your Name</label>
                        <input
                          type="text"
                          value={sopData.name}
                          onChange={(e) => setSopData({ ...sopData, name: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                          placeholder="e.g. John Doe"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Degree Type</label>
                        <select
                          value={sopData.degree}
                          onChange={(e) => setSopData({ ...sopData, degree: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                        >
                          <option>Bachelor of Science</option>
                          <option>Master of Science</option>
                          <option>Master of Business Administration (MBA)</option>
                          <option>Doctorate (PhD)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Field of Study</label>
                        <input
                          type="text"
                          value={sopData.subject}
                          onChange={(e) => setSopData({ ...sopData, subject: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                          placeholder="e.g. Data Analytics"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Primary Internship/Job Role</label>
                        <input
                          type="text"
                          value={sopData.experience}
                          onChange={(e) => setSopData({ ...sopData, experience: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                          placeholder="e.g. Software Engineer Intern at Google"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md w-full sm:w-fit cursor-pointer flex items-center gap-2 mt-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Drafting SOP text...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Custom SOP Draft</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* 4. DOCUMENT CHECKER TAB */}
                {activeTab === "doc-checker" && (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-2">
                      <SearchCode className="w-5 h-5" />
                      <span>Document Scan Auditor</span>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Upload your transcript, SOP, or passport scan to perform a simulated authenticity and compliance check.
                    </p>

                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-all duration-300 bg-gray-50/50">
                      <SearchCode className="w-12 h-12 text-gray-400 mb-4 animate-pulse" />
                      <h4 className="font-bold text-sm text-gray-900 mb-1">Click to select files</h4>
                      <p className="text-xs text-gray-400 mb-6">PDF, PNG, JPG up to 10MB</p>
                      
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => runDocumentChecker("Academic_Transcript_CA.pdf")}
                          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs px-4 py-2.5 rounded-lg cursor-pointer"
                        >
                          Simulate Transcript.pdf
                        </Button>
                        <Button 
                          onClick={() => runDocumentChecker("Passport_Copy_Global.pdf")}
                          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs px-4 py-2.5 rounded-lg cursor-pointer"
                        >
                          Simulate Passport.pdf
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loader overlay inside workspace console */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-sm font-semibold text-gray-500">Processing input queries...</p>
                  </div>
                )}

                {/* Results Renderer */}
                {!loading && result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-t border-gray-100 pt-8 mt-8"
                  >
                    {/* Eligibility Report */}
                    {activeTab === "eligibility" && (
                      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-gray-900 text-sm">Eligibility Score Report</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.score > 80 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                            {result.status} ({result.score}%)
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{result.details}</p>
                      </div>
                    )}

                    {/* Matcher Report */}
                    {activeTab === "matcher" && (
                      <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-gray-950 text-sm">Perfect Matches Found ({result.length})</h4>
                        <div className="flex flex-col gap-3">
                          {result.map((univ: any, idx: number) => (
                            <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
                              <div>
                                <h5 className="font-bold text-gray-900 text-sm">{univ.name}</h5>
                                <p className="text-xs text-gray-400 mt-0.5">{univ.location} • Approximate Fee: {univ.fee}</p>
                              </div>
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                {univ.score} Match
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SOP Report */}
                    {activeTab === "sop" && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-950 text-sm">Generated SOP Outline</h4>
                          <Button
                            onClick={handleCopySop}
                            className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copied ? "Copied!" : "Copy SOP"}</span>
                          </Button>
                        </div>
                        <pre className="bg-gray-50 border border-gray-100 p-6 rounded-xl text-xs text-gray-600 overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                          {result}
                        </pre>
                      </div>
                    )}

                    {/* Document Checker Report */}
                    {activeTab === "doc-checker" && (
                      <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                          <CheckCircle className="w-5 h-5 shrink-0" />
                          <span>Audit Verification Passed for {result.name}</span>
                        </div>
                        <ul className="flex flex-col gap-2.5">
                          {result.checks.map((check: any, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{check.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
                
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
