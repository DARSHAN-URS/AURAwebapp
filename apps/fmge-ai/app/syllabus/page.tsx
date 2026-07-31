import React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle, ChevronRight, Stethoscope } from "lucide-react";

export default function SyllabusPage() {
  const subjectsData = [
    { name: "Anatomy", weightage: "17 Qs", topics: ["Neuroanatomy", "Upper & Lower Limb", "Head & Neck", "Embryology", "Histology"] },
    { name: "Physiology", weightage: "17 Qs", topics: ["Neurophysiology", "CVS & Respiratory", "Renal Physiology", "Endocrinology"] },
    { name: "Biochemistry", weightage: "16 Qs", topics: ["Metabolism of Carbohydrates/Lipids", "Enzymology", "Molecular Biology", "Vitamins"] },
    { name: "Pathology", weightage: "13 Qs", topics: ["General Pathology & Inflammation", "Hematology", "Systemic Pathology", "Neoplasia"] },
    { name: "Microbiology", weightage: "13 Qs", topics: ["Bacteriology", "Virology & HIV", "Parasitology", "Mycology & Immunology"] },
    { name: "Pharmacology", weightage: "13 Qs", topics: ["Autonomic Nervous System", "Cardiovascular Drugs", "Antimicrobials", "CNS Drugs"] },
    { name: "Forensic Medicine (FMT)", weightage: "10 Qs", topics: ["Thanatology & Autopsy", "Toxicology & Poisons", "Medical Jurisprudence"] },
    { name: "Community Medicine (PSM)", weightage: "15 Qs", topics: ["Epidemiology & Biostats", "National Health Programs", "Immunization Schedule"] },
    { name: "General Medicine", weightage: "33 Qs", topics: ["Cardiology (ECG)", "Pulmonology (ABG)", "Nephrology", "Endocrinology", "Neurology"] },
    { name: "General Surgery", weightage: "32 Qs", topics: ["GI Surgery", "Urology", "Trauma & ATLS", "Oncosurgery", "Hernias"] },
    { name: "Obstetrics & Gynecology", weightage: "30 Qs", topics: ["Antenatal & High-Risk Pregnancy", "Labor & PPH", "Gynec Oncology", "Contraception"] },
    { name: "Pediatrics", weightage: "15 Qs", topics: ["Neonatology", "Developmental Milestones", "Pediatric Nutrition", "Genetics"] },
    { name: "Orthopedics", weightage: "10 Qs", topics: ["Fractures & Dislocations", "Bone Tumors", "Pediatric Ortho", "Spine"] },
    { name: "Ophthalmology", weightage: "15 Qs", topics: ["Cataract & Cornea", "Glaucoma & Retina", "Refractive Errors", "Neuro-Ophtha"] },
    { name: "ENT (Otorhinolaryngology)", weightage: "15 Qs", topics: ["Otology & Hearing Loss", "Sinusitis & Rhinology", "Laryngeal Carcinoma"] },
    { name: "Dermatology & STD", weightage: "7 Qs", topics: ["Psoriasis & Eczema", "Leprosy", "Syphilis & STDs", "Bullous Pemphigoid"] },
    { name: "Psychiatry", weightage: "7 Qs", topics: ["Schizophrenia", "Bipolar & Depression", "Substance Dependence", "Phobias"] },
    { name: "Radiology", weightage: "7 Qs", topics: ["X-Ray Sign Interpretations", "CT & MRI Scanning", "Radiation Physics & Safety"] },
    { name: "Anesthesiology", weightage: "7 Qs", topics: ["General & Local Anesthesia", "Airway Management", "CPR & ACLS Protocols"] },
  ];

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          Official NBE Blueprint
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          FMGE & NExT <span className="gradient-text">19 Subject Syllabus Explorer</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Complete high-yield topic directory mapped against the latest National Board of Examinations (NBE) marks distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectsData.map((sub, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>{sub.name}</span>
              </h3>
              <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded border border-teal-200 dark:border-teal-800">
                {sub.weightage}
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Top Exam Topics:</span>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {sub.topics.map((t, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
