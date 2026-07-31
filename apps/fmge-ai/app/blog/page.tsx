import React from "react";
import Link from "next/link";
import { BookOpen, Clock, Calendar, ArrowRight } from "lucide-react";

export default async function BlogCatalogPage() {
  let posts = [
    {
      slug: "fmge-2026-high-yield-topics-19-subjects",
      title: "FMGE 2026 Strategy: Must-Know High-Yield Topics Across All 19 Subjects",
      category: "Exam Strategy",
      author: "Dr. S. K. Mehta (NMC Educator)",
      published_at: "2026-07-15",
      read_time: "8 min read",
      summary: "Comprehensive subject-wise breakdown of weightage, recurring NBE question patterns, and top 20 high-yield topics every foreign medical graduate must revise.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80"
    },
    {
      slug: "how-to-master-image-based-questions-ibqs",
      title: "Mastering Image-Based Questions (IBQs) in FMGE: Radiology & Pathology",
      category: "Medical Concepts",
      author: "FMGE AI Academic Team",
      published_at: "2026-07-20",
      read_time: "6 min read",
      summary: "Over 25% of NBE questions now feature clinical imagery. Learn how to systematically read X-rays, CT scans, histopathology slides, and dermatological lesions.",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80"
    },
    {
      slug: "nmc-next-exam-updates-for-foreign-medical-graduates",
      title: "NMC & NBE Latest Guidelines: FMGE to NExT Transition Roadmap",
      category: "NMC Announcements",
      author: "Dr. Vikas Verma",
      published_at: "2026-07-28",
      read_time: "5 min read",
      summary: "Everything you need to know about National Exit Test (NExT) regulations, eligibility criteria for FMGs, and step-by-step registration guidelines.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80"
    }
  ];

  try {
    const res = await fetch("http://localhost:8000/api/fmge/blog", { cache: "no-store" });
    const data = await res.json();
    if (data.success && data.posts) {
      posts = data.posts;
    }
  } catch (e) {}

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          NBE Exam Intelligence
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          FMGE & NExT <span className="gradient-text">High-Yield Medical Blog</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Exam strategies, medical mnemonics, NMC policy updates, and IBQ analysis by senior medical faculty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-shadow group"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-teal-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded">
                  {post.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.published_at}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.read_time}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
