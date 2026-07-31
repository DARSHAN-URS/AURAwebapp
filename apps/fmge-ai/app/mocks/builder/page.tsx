"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Settings, Sparkles, Play, Sliders, CheckCircle2 } from "lucide-react";

const availableSubjects = [
  "General Medicine", "General Surgery", "Obstetrics & Gynecology",
  "Pharmacology", "Pathology", "Community Medicine (PSM)",
  "Anatomy", "Physiology", "Biochemistry", "Microbiology",
  "Forensic Medicine", "Pediatrics", "Orthopedics", "Ophthalmology",
  "ENT", "Dermatology", "Psychiatry", "Radiology", "Anesthesia"
];

export default function CustomTestBuilderPage() {
  const router = useRouter();
  const [testTitle, setTestTitle] = useState("My Custom FMGE Practice Test");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["General Medicine", "Pharmacology"]);
  const [questionCount, setQuestionCount] = useState(30);
  const [difficulty, setDifficulty] = useState("AI Adaptive");
  const [adaptiveMode, setAdaptiveMode] = useState(true);

  const toggleSubject = (sub: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleLaunchTest = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/mocks/simulation?test_id=custom-01");
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200">
            Interactive Test Generator
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Custom Test Builder
          </h1>
          <p className="text-xs text-slate-500">
            Configure custom test parameters or generate an adaptive AI test targeting your weak subjects.
          </p>
        </div>

        <form onSubmit={handleLaunchTest} className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Test Title</label>
            <input
              type="text"
              required
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Question Count & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Question Count</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 30, 60, 150].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      questionCount === num
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="AI Adaptive">AI Adaptive (Personalized)</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard (NBE Standard)">Hard (NBE Standard)</option>
                <option value="Previous Year PYQs">Previous Year PYQs</option>
              </select>
            </div>
          </div>

          {/* Subject Selectors */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Select Subjects</label>
            <div className="flex flex-wrap gap-2">
              {availableSubjects.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedSubjects.includes(sub)
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Custom Test Session</span>
            </button>
          </div>
        </form>
      </div>
    </SidebarLayout>
  );
}
