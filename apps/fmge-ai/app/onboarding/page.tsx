"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stethoscope, CheckCircle2, ArrowRight, ArrowLeft, Brain, Sparkles, Award, Shield, Check } from "lucide-react";

const allSubjects = [
  "Anatomy", "Physiology", "Biochemistry", "Pathology", "Microbiology",
  "Pharmacology", "Forensic Medicine (FMT)", "Community Medicine (PSM)",
  "General Medicine", "General Surgery", "Obstetrics & Gynecology",
  "Pediatrics", "Orthopedics", "Ophthalmology", "ENT", "Dermatology",
  "Psychiatry", "Radiology", "Anesthesiology"
];

const sampleDiagnosticQs = [
  {
    id: 1,
    subject: "General Medicine",
    q: "A 55-year-old male presents with sudden severe tearing chest pain radiating to the back with unequal radial pulses. Diagnosis?",
    options: ["Myocardial Infarction", "Aortic Dissection", "Pulmonary Embolism", "Pneumothorax"],
    correct: 1
  },
  {
    id: 2,
    subject: "Pharmacology",
    q: "Which anti-hypertensive drug is contraindicated in pregnancy due to risk of fetal renal dysgenesis?",
    options: ["Labetalol", "Methyldopa", "Enalapril (ACEi)", "Nifedipine"],
    correct: 2
  },
  {
    id: 3,
    subject: "Pathology",
    q: "Reed-Sternberg cells with 'owl-eye' nucleoli are pathognomonic histological findings in:",
    options: ["Non-Hodgkin Lymphoma", "Hodgkin Lymphoma", "Multiple Myeloma", "Burkitt Lymphoma"],
    correct: 1
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1 State
  const [targetExam, setTargetExam] = useState("FMGE Dec 2026");
  const [medicalCollege, setMedicalCollege] = useState("Kursk State Medical University");
  const [country, setCountry] = useState("Russia");

  // Step 2 State
  const [studyStatus, setStudyStatus] = useState("Intermediate");
  const [dailyHours, setDailyHours] = useState("2–4 Hours");
  const [studyMode, setStudyMode] = useState("AI Tutor & QBank");

  // Step 3 State
  const [weakSubjects, setWeakSubjects] = useState<string[]>(["Pharmacology", "Community Medicine (PSM)"]);
  const [strongSubjects, setStrongSubjects] = useState<string[]>(["General Medicine", "Anatomy"]);

  // Step 4 State (Diagnostic Test)
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<number, number>>({});
  const [diagnosticSubmitted, setDiagnosticSubmitted] = useState(false);

  const toggleWeakSubject = (sub: string) => {
    setWeakSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const toggleStrongSubject = (sub: string) => {
    setStrongSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleFinishOnboarding = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Progress Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
              {step}
            </span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {step === 1 && "Step 1: Exam & Medical College"}
              {step === 2 && "Step 2: Study Habits & Schedule"}
              {step === 3 && "Step 3: Weak & Strong Subjects"}
              {step === 4 && "Step 4: Initial AI Diagnostic Assessment"}
            </span>
          </div>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">Step {step} of 4</span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Target Exam */}
      {step === 1 && (
        <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Target Exam & College</h2>
            <p className="text-xs text-slate-500">Configure your primary exam objective and medical background.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Target Session</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["FMGE Dec 2026", "FMGE June 2027", "NExT 2027"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTargetExam(opt)}
                    className={`p-4 rounded-xl text-xs font-bold border transition-all text-left ${
                      targetExam === opt
                        ? "bg-teal-50 dark:bg-teal-950 border-teal-500 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Medical College</label>
                <input
                  type="text"
                  value={medicalCollege}
                  onChange={(e) => setMedicalCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Country of Study</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <span>Next: Study Habits</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Study Habits */}
      {step === 2 && (
        <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Study Status & Daily Schedule</h2>
            <p className="text-xs text-slate-500">Helps AI calculate your daily micro-task revision targets.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Current Preparation Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Beginner (0-30%)", "Intermediate (30-70%)", "Advanced (70%+)"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStudyStatus(opt)}
                    className={`p-3.5 rounded-xl text-xs font-bold border transition-all text-left ${
                      studyStatus === opt
                        ? "bg-teal-50 dark:bg-teal-950 border-teal-500 text-teal-900 dark:text-teal-200"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Daily Available Study Time</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["< 1 Hour", "1–2 Hours", "2–4 Hours", "4+ Hours"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDailyHours(opt)}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      dailyHours === opt
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <span>Next: Subject Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Subject Selection */}
      {step === 3 && (
        <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Weak & Strong Subjects</h2>
            <p className="text-xs text-slate-500">Select which of the 19 FMGE medical subjects need priority AI revision.</p>
          </div>

          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Select Weak Subjects (Priority Focus):</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {allSubjects.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleWeakSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    weakSubjects.includes(sub)
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <span>Next: Take Diagnostic Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Diagnostic Assessment */}
      {step === 4 && (
        <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Initial AI Diagnostic Assessment</h2>
            <p className="text-xs text-slate-500">Solve 3 high-yield questions to calibrate your initial FMGE Pass Probability.</p>
          </div>

          {diagnosticSubmitted ? (
            <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white">Diagnostic Completed!</h3>
              <div className="text-sm font-bold text-teal-800 dark:text-teal-200">
                Initial AI Readiness Score: <span className="text-emerald-600 text-lg">84.5%</span> (Est. 194/300 Marks)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Your personalized 19-subject study schedule has been generated and loaded into your dashboard.
              </p>
              <button
                onClick={handleFinishOnboarding}
                className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg"
              >
                Go to FMGE AI Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {sampleDiagnosticQs.map((qItem) => (
                <div key={qItem.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-600">Question {qItem.id} • {qItem.subject}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">{qItem.q}</p>
                  <div className="space-y-2">
                    {qItem.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setDiagnosticAnswers((prev) => ({ ...prev, [qItem.id]: optIdx }))}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-all ${
                          diagnosticAnswers[qItem.id] === optIdx
                            ? "bg-teal-50 border-teal-500 text-teal-900 dark:bg-teal-950 dark:text-teal-200 font-bold"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setDiagnosticSubmitted(true)}
                  className="px-8 py-3 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-lg shadow-teal-600/30"
                >
                  Submit Diagnostic & Complete Onboarding
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
