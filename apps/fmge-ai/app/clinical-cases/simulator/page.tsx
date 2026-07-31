"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { ImageZoomModal } from "@/components/qbank/ImageZoomModal";
import {
  Stethoscope, Send, Sparkles, CheckCircle2, AlertTriangle, ArrowLeft,
  FileText, Activity, Heart, Eye, Maximize2, ShieldCheck
} from "lucide-react";

export default function ClinicalSimulatorPage() {
  const [activeTab, setActiveTab] = useState<"history" | "exam" | "labs" | "diagnosis">("history");
  const [chatMessages, setChatMessages] = useState([
    { sender: "patient", text: "“Doctor, please help! I felt a heavy crushing pressure in my chest about 2 hours ago while climbing stairs. The pain goes up into my left neck and arm, and I am sweating profusely.”" }
  ]);
  const [userChatInput, setUserChatInput] = useState("");
  const [activeExamSystem, setActiveExamSystem] = useState("CVS");
  const [orderedLabs, setOrderedLabs] = useState<string[]>(["12-Lead ECG", "Serum Cardiac Biomarkers"]);
  const [primaryDiag, setPrimaryDiag] = useState("Acute Inferior Wall Myocardial Infarction");
  const [treatmentPlan, setTreatmentPlan] = useState("Aspirin 325mg + Clopidogrel 600mg loading + Heparin bolus + Immediate Primary PCI");
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const userText = userChatInput;
    setChatMessages((prev) => [...prev, { sender: "doctor", text: userText }]);
    setUserChatInput("");

    setTimeout(() => {
      let reply = "“The pain is constant, Doctor. It feels like a tight band around my chest and hasn't let up at all.”";
      if (userText.toLowerCase().includes("diabetic") || userText.toLowerCase().includes("history")) {
        reply = "“I have had Type 2 Diabetes for 6 years and high blood pressure, but I sometimes forget my medications.”";
      }
      setChatMessages((prev) => [...prev, { sender: "patient", text: reply }]);
    }, 600);
  };

  const examFindings: Record<string, string> = {
    CVS: "S1 and S2 present. S4 gallop heard at apex. No murmur or pericardial rub. JVP is not elevated.",
    RS: "Bilateral vesicular breath sounds. Fine bilateral basal crepitations present at lung bases.",
    ABDOMEN: "Soft, non-tender, no organomegaly. Normal bowel sounds.",
    NEURO: "Alert, conscious, oriented x 3. Pupils equal and reactive to light. No focal neurological deficits."
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-7xl">
        
        {/* Top EMR Header Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/clinical-cases" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:text-teal-600">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-slate-900 dark:text-white">EMR Case #101 • Mr. Rajesh Kumar (45M)</h1>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">Emergency ACS</span>
              </div>
              <p className="text-xs text-slate-500">Chief Complaint: 2-hour retrosternal chest pain radiating to left jaw & arm</p>
            </div>
          </div>

          {/* Vitals Ribbon */}
          <div className="flex items-center gap-3 bg-slate-900 text-white p-2.5 rounded-xl text-xs font-mono shrink-0">
            <div><span className="text-slate-400">BP:</span> 150/90</div>
            <div><span className="text-slate-400">HR:</span> 98 bpm</div>
            <div><span className="text-slate-400">SpO2:</span> 96%</div>
            <div><span className="text-slate-400">Temp:</span> 98.4°F</div>
          </div>
        </div>

        {/* EMR Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: EMR Navigation Tabs & Workspace */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* EMR Workspace Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              {[
                { id: "history", label: "History Taking Chat" },
                { id: "exam", label: "Physical Examination" },
                { id: "labs", label: "Labs & Radiology Reports" },
                { id: "diagnosis", label: "Diagnosis & Treatment Plan" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-teal-600 text-white shadow-md"
                      : "bg-white dark:bg-slate-900 border border-slate-200 text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Conversational AI History Taking Chat */}
            {activeTab === "history" && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col min-h-[420px]">
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[320px] p-2">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        msg.sender === "doctor"
                          ? "bg-teal-600 text-white font-medium"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <input
                    type="text"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    placeholder="Ask patient questions (e.g., pain onset, radiation, medical history)..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-1 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ask</span>
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Physical Examination */}
            {activeTab === "exam" && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Physical Examination Findings</h3>
                
                <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  {["CVS", "RS", "ABDOMEN", "NEURO"].map((sys) => (
                    <button
                      key={sys}
                      onClick={() => setActiveExamSystem(sys)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        activeExamSystem === sys ? "bg-slate-900 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                      }`}
                    >
                      {sys} Exam
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2">
                  <div className="font-bold text-teal-400">{activeExamSystem} SYSTEM FINDINGS:</div>
                  <p>{examFindings[activeExamSystem]}</p>
                </div>
              </div>
            )}

            {/* Tab 3: Labs & Radiology Reports */}
            {activeTab === "labs" && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Lab & Radiology Investigation Reports</h3>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">12-Lead ECG Report</span>
                      <button
                        onClick={() => setShowImageZoom(true)}
                        className="text-[11px] font-bold text-teal-600 hover:underline flex items-center gap-1"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>View High-Res ECG</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                      ST-segment elevation of 2.5 mm in leads II, III, and aVF with reciprocal ST depression in I and aVL.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Serum Cardiac Biomarkers</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                      Troponin I: 4.8 ng/mL (Normal &lt; 0.04 ng/mL) | CK-MB: 48 U/L (Normal &lt; 25 U/L).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Diagnosis & Treatment Plan */}
            {activeTab === "diagnosis" && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Diagnosis</label>
                  <input
                    type="text"
                    value={primaryDiag}
                    onChange={(e) => setPrimaryDiag(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Emergency Treatment & Management Plan</label>
                  <textarea
                    rows={4}
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  />
                </div>

                <button
                  onClick={() => setShowEvaluationModal(true)}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Diagnosis & Get AI Reasoning Score</span>
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Quick EMR Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Active EMR Case Quick Summary</h4>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p>• Patient: Mr. Rajesh Kumar (45M)</p>
                <p>• History: 2h crushing chest pain + radiating to jaw</p>
                <p>• ECG: ST elevation II, III, aVF (Inferior MI)</p>
                <p>• Troponin I: 4.8 ng/mL (Markedly Elevated)</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* AI Reasoning Evaluation Modal */}
      {showEvaluationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/20">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">AI Reasoning Score: 92.5%</h3>
              <p className="text-xs text-slate-400">Diagnostic Accuracy: 100% Correct Primary Diagnosis</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-left text-slate-300">
              <span className="font-bold text-teal-400 block mb-1">Evidence-Based Clinical Feedback:</span>
              <p className="leading-relaxed">
                Excellent diagnostic reasoning! ST elevation in leads II, III, aVF represents Inferior Wall MI (RCA occlusion). Immediate dual antiplatelet therapy (Aspirin + Clopidogrel) and primary PCI pathway are gold-standard interventions.
              </p>
            </div>

            <button
              onClick={() => setShowEvaluationModal(false)}
              className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-xs shadow"
            >
              Close & Save Case to Progress
            </button>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {showImageZoom && (
        <ImageZoomModal
          imageUrl="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80"
          title="12-Lead ECG — ST Elevations in II, III, aVF"
          onClose={() => setShowImageZoom(false)}
        />
      )}
    </SidebarLayout>
  );
}
