import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let post = {
    slug: slug,
    title: "FMGE 2026 Strategy: Must-Know High-Yield Topics Across All 19 Subjects",
    category: "Exam Strategy",
    author: "Dr. S. K. Mehta (NMC Educator)",
    published_at: "2026-07-15",
    read_time: "8 min read",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80",
    content: `
# FMGE 2026 Strategy: Must-Know High-Yield Topics Across All 19 Subjects

Clearing the **Foreign Medical Graduate Examination (FMGE)** requires targeted preparation. With a cutoff of **150 out of 300 (50%)**, focusing on high-weightage clinical and para-clinical subjects is the fastest path to guaranteed victory.

---

## High Weightage Subjects Breakdown

1. **General Medicine (33 Qs)**: Focus heavily on Cardiology (ECG signs, MI management), Pulmonology (ABG analysis, Asthma vs COPD), and Nephrology.
2. **General Surgery (32 Qs)**: Prioritize GI surgery (Appendicitis, Bowel Obstruction), Trauma protocols (ATLS), and Breast / Thyroid lumps.
3. **Obstetrics & Gynecology (30 Qs)**: Master Antenatal care milestones, PPH management, Eclampsia, and FIGO staging for Cervical Cancer.
4. **PSM / Community Medicine (15 Qs)**: Biostatistics (Sens/Spec, p-value), Vaccines schedule, and National Health Programs (NTCP, NVBDCP).

---

## 5 Golden Rules to Cross the 150 Target

- **Daily 100 Qs Practice**: Active recall through clinical vignette MCQs beats passive reading.
- **Master Image-Based Questions (IBQs)**: Pathology histology slides and Radiology X-ray signs carry free marks.
- **Simulate Full NBE CBT Environment**: Take at least 10 Grand Tests with the exact 150-minute Part A & Part B timers.
- **Review Weak Areas Instantly**: Use FMGE AI's radar chart to fix Pharmacology drug interactions and Anatomy neuro-tracts.
    `
  };

  try {
    const res = await fetch(`http://localhost:8000/api/fmge/blog/${slug}`, { cache: "no-store" });
    const data = await res.json();
    if (data.success && data.post) {
      post = data.post;
    }
  } catch (e) {}

  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blog Catalog</span>
      </Link>

      <div className="space-y-4">
        <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-y border-slate-200 dark:border-slate-800 py-3">
          <span className="flex items-center gap-1"><User className="w-4 h-4 text-teal-600" /> {post.author}</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.published_at}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.read_time}</span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
        <img src={post.image} alt={post.title} className="w-full h-80 object-cover" />
      </div>

      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
        {post.content}
      </div>
    </div>
  );
}
