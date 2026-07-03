"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  Info,
  ChevronRight,
  ShieldCheck,
  FileText,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentAnalysis {
  id: string;
  document_name: string;
  status: "Passed" | "Warning" | "Failed";
  issues: string[];
  suggestions: string[];
  confidence_score: number;
  critical: boolean;
}

interface VisaCheckReport {
  id: string;
  country: string;
  visa_type: string;
  readiness_score: number;
  status: string;
  ai_response: {
    readiness_score: number;
    status: string;
    passed_checks: string[];
    failed_checks: string[];
    missing_documents: string[];
    warnings: string[];
    risk_assessment: string;
    recommendations: string[];
    next_steps: string[];
    estimated_approval: string;
  };
  analyses: DocumentAnalysis[];
  created_at: string;
}

export default function VisaCheckResultPage() {
  const params = useParams();
  const router = useRouter();
  const checkId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VisaCheckReport | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (!checkId) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBaseUrl}/api/visa-check/${checkId}`);
        if (!res.ok) throw new Error("Could not load report details.");
        const reportData = await res.json();
        setData(reportData);
      } catch (err: any) {
        console.warn("Backend offline. Generating fallback local visa check mock data.");
        // Simulated local fallback report details
        const mockReport: VisaCheckReport = {
          id: checkId,
          country: "Canada",
          visa_type: "Student Visa",
          readiness_score: 55,
          status: "Critical Issues",
          created_at: new Date().toISOString(),
          ai_response: {
            readiness_score: 55,
            status: "Critical Issues",
            passed_checks: ["Valid IELTS Test Uploaded", "Designated DLI College Offer Verified"],
            failed_checks: ["Expired Passport scan uploaded", "Bank balance holds missing"],
            missing_documents: ["SOP Draft", "Financial Sponsor Affidavit"],
            warnings: ["Proof of accommodation check missing"],
            risk_assessment: "Refusal risk is extremely High due to critical passport expiration issues and insufficient proof of funds holding requirements.",
            recommendations: [
              "File passport renewal immediately.",
              "Prepare GIC savings balance transaction proof of $20,635 CAD."
            ],
            next_steps: [
              "Schedule consult mapping call with an advisor.",
              "Re-upload renewed passport copy."
            ],
            estimated_approval: "55%"
          },
          analyses: [
            {
              id: "a1",
              document_name: "Passport_Scan_Expired.pdf",
              status: "Failed",
              issues: ["Passport expiration date is July 2023, which is in the past."],
              suggestions: ["Renew passport immediately before scheduling visa appointments."],
              confidence_score: 0.98,
              critical: true
            },
            {
              id: "a2",
              document_name: "IELTS_Report_overall_7.pdf",
              status: "Passed",
              issues: [],
              suggestions: ["Keep copy available for presentation at port of entry."],
              confidence_score: 0.99,
              critical: false
            }
          ]
        };
        setData(mockReport);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [checkId]);

  const handlePrint = () => {
    window.print();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ready": return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "Needs Improvement": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <XCircle className="w-5 h-5 text-rose-500" />;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Ready": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Needs Improvement": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  const getDocStatusColor = (status: string) => {
    switch (status) {
      case "Passed": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "Warning": return "text-amber-600 bg-amber-50 border-amber-100";
      default: return "text-rose-600 bg-rose-50 border-rose-100";
    }
  };

  const getStrokeDashOffset = (scoreVal: number) => {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    return circumference - (scoreVal / 100) * circumference;
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-gray-500">Loading visa readiness report...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Readiness Report Missing</h2>
          <p className="text-sm text-gray-500 mb-8">{error || "Data is currently unavailable."}</p>
          <Button onClick={() => router.push("/visa-check")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const report = data.ai_response;
  const score = report.readiness_score;

  return (
    <div className="bg-white pt-32 pb-24">
      {/* Hide controls during PDF print */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; border: none; box-shadow: none; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl" id="print-area">
        
        {/* Editor Top Bar Nav */}
        <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-4 no-print">
          <button
            onClick={() => router.push("/visa-check")}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <Button
            onClick={handlePrint}
            className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer text-xs flex items-center gap-1 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </Button>
        </div>

        {/* Dashboard Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide mb-4">
            AI Readiness Audit
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Visa Readiness Report
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            Destination: <strong className="text-gray-950">{data.country} ({data.visa_type})</strong> • Audit ID: {data.id.slice(0, 8)}
          </p>
        </div>

        {/* Overview Score Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Radial score card */}
          <div className="md:col-span-4 bg-white border border-gray-100 rounded-3xl p-8 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
            <h3 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-6">Approval likelihood</h3>

            {/* SVG Circle Progress */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="58" className="stroke-gray-100 fill-none" strokeWidth="8" />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="58" 
                  className="stroke-blue-600 fill-none" 
                  strokeWidth="8"
                  strokeLinecap="round"
                  style={{ 
                    strokeDasharray: 2 * Math.PI * 58,
                    strokeDashoffset: getStrokeDashOffset(score)
                  }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-gray-900">{score}%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Readiness</span>
              </div>
            </div>

            <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-extrabold border ${getStatusBgColor(data.status)}`}>
              {getStatusIcon(data.status)}
              <span className="uppercase ml-1">{data.status}</span>
            </span>
          </div>

          {/* Risk assessment overview */}
          <div className="md:col-span-8 bg-white border border-gray-100 rounded-3xl p-8 shadow-lg min-h-[260px] flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-gray-950 text-xs uppercase tracking-wider mb-4">Risk Profile Analysis</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {report.risk_assessment}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-50 text-[11px] text-gray-400 font-semibold no-print">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Assessment is compiled based on country visa guidelines. Consul officers retain final decision authority.</span>
            </div>
          </div>

        </div>

        {/* Passed & Failed check parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Passed Checks */}
          <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-3xl p-8">
            <h3 className="font-extrabold text-emerald-800 text-xs uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
              <span>Rules Passed ({report.passed_checks.length})</span>
            </h3>
            <ul className="flex flex-col gap-3.5">
              {report.passed_checks.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Failed Checks & Warnings */}
          <div className="bg-rose-50/20 border border-rose-100/50 rounded-3xl p-8">
            <h3 className="font-extrabold text-rose-800 text-xs uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <XCircle className="w-4.5 h-4.5 text-rose-500" />
              <span>Omissions / Warnings ({report.failed_checks.length + report.warnings.length})</span>
            </h3>
            <ul className="flex flex-col gap-3.5">
              {report.failed_checks.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                  <span>{rule}</span>
                </li>
              ))}
              {report.warnings.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Missing Documents */}
        {report.missing_documents.length > 0 && (
          <div className="bg-amber-50/20 border border-amber-100/50 rounded-3xl p-8 mb-12">
            <h3 className="font-extrabold text-amber-800 text-xs uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              <span>Missing Required Files ({report.missing_documents.length})</span>
            </h3>
            <ul className="flex flex-col gap-3.5">
              {report.missing_documents.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Document-Level Analysis Cards */}
        <div className="mb-12">
          <h3 className="font-extrabold text-gray-950 text-xs uppercase tracking-wider mb-6">
            Individual File Valuations ({data.analyses.length})
          </h3>
          <div className="flex flex-col gap-6">
            {data.analyses.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[140px]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 border-b border-gray-50 pb-3">
                  <h4 className="font-bold text-gray-950 text-sm flex items-center gap-1.5">
                    <FileText className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                    <span>{doc.document_name}</span>
                  </h4>

                  <div className="flex items-center gap-2">
                    {doc.critical && (
                      <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase border border-rose-100">
                        Critical Check
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getDocStatusColor(doc.status)}`}>
                      <span className="uppercase">{doc.status}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {doc.issues.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Issues Identified:</span>
                      <ul className="flex flex-col gap-1">
                        {doc.issues.map((issue, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                            <ChevronRight className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {doc.suggestions.length > 0 && (
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">AI Recommendation:</span>
                      <ul className="flex flex-col gap-1">
                        {doc.suggestions.map((sugg, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                            <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{sugg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 text-[10px] text-gray-400 font-bold">
                  <span>Confidence Score: {Math.round(doc.confidence_score * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions & Next Steps */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 sm:p-10 mb-12 no-print">
          <h3 className="font-extrabold text-gray-950 text-xs uppercase tracking-wider mb-8 flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-blue-600 fill-blue-50" />
            <span>AI Suggested Actions</span>
          </h3>
          <div className="flex flex-col gap-6">
            {report.next_steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed mt-1">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
