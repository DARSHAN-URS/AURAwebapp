"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Globe2, Shield, Award, GraduationCap, BookOpen, DollarSign,
  Compass, Sparkles, Clock, Calendar, ArrowLeft, Loader2,
  ChevronRight, ArrowUpDown, LayoutGrid, Eye, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CATEGORY_META: Record<string, { icon: any; gradient: string; text: string }> = {
  "countries": { icon: Globe2, gradient: "from-blue-900 via-blue-950 to-slate-950", text: "text-primary" },
  "visa-guides": { icon: Shield, gradient: "from-indigo-900 via-indigo-950 to-slate-950", text: "text-indigo-500" },
  "scholarships": { icon: Award, gradient: "from-amber-900 via-amber-950 to-slate-950", text: "text-amber-500" },
  "universities": { icon: GraduationCap, gradient: "from-violet-900 via-violet-950 to-slate-950", text: "text-violet-500" },
  "ielts": { icon: BookOpen, gradient: "from-emerald-900 via-emerald-950 to-slate-950", text: "text-emerald-500" },
  "education-loans": { icon: DollarSign, gradient: "from-green-900 via-green-950 to-slate-950", text: "text-green-500" },
  "pr-pathways": { icon: Compass, gradient: "from-cyan-900 via-cyan-950 to-slate-950", text: "text-cyan-500" },
  "mbbs-abroad": { icon: Sparkles, gradient: "from-red-900 via-red-950 to-slate-950", text: "text-red-500" },
};

const DEFAULT_META = { icon: BookOpen, gradient: "from-slate-900 via-slate-950 to-slate-950", text: "text-slate-500" };

export default function CategoryArchive({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  // Data states
  const [category, setCategory] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [sortBy, setSortBy] = useState("latest");
  const [difficulty, setDifficulty] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 9;

  // Load all categories for sidebar
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d))
      .catch((e) => console.error(e));
  }, []);

  // Fetch category detail & articles
  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    const loadData = async () => {
      try {
        // Resolve target category first
        const catRes = await fetch(`${API}/api/categories`);
        const cats = await catRes.json();
        const found = cats.find((c: any) => c.slug === slug);
        setCategory(found);

        // Fetch articles
        const artRes = await fetch(
          `${API}/api/articles?category=${slug}&page=${page}&limit=${limit}&difficulty=${difficulty === "all" ? "" : difficulty}`
        );
        const artData = await artRes.json();
        setArticles(artData.data || []);
        setTotal(artData.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug, page, difficulty]);

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === "popular") {
      return (b.view_count || 0) - (a.view_count || 0);
    }
    if (sortBy === "reading_time") {
      return (b.reading_time_minutes || 0) - (a.reading_time_minutes || 0);
    }
    // Default latest
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  if (loading && !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const meta = category ? (CATEGORY_META[category.slug] || DEFAULT_META) : DEFAULT_META;
  const Icon = meta.icon;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Category Hero */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${meta.gradient} border-b border-border/40 py-16`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 max-w-6xl">
          <button onClick={() => router.push("/learn")} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold mb-6 group transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Learn Hub
          </button>

          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-card/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 ${meta.text}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
                {category?.name || "Topic Guides"}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
                {category?.description || "Curated expert guides and articles."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Article List */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border/80 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{total} Articles found</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-semibold flex items-center gap-0.5"><ArrowUpDown className="w-3.5 h-3.5" /> Sort:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-background border border-border rounded-lg px-2 py-1 font-bold outline-none cursor-pointer focus:border-primary"
                  >
                    <option value="latest">Latest Releases</option>
                    <option value="popular">Popularity</option>
                    <option value="reading_time">Reading Duration</option>
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-semibold">Level:</span>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="bg-background border border-border rounded-lg px-2 py-1 font-bold outline-none cursor-pointer focus:border-primary"
                  >
                    <option value="all">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List Grid */}
            {sortedArticles.length === 0 ? (
              <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl">
                <BookOpen className="w-12 h-12 text-muted-foreground opacity-30 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-1">No articles found</h3>
                <p className="text-xs text-muted-foreground">Try relaxing your difficulty filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sortedArticles.map((art) => (
                  <div key={art.id} className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col justify-between">
                    <Link href={`/learn/${art.slug}`} className="block flex-grow">
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                        {art.hero_image_url && (
                          <img src={art.hero_image_url} alt="" className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500" />
                        )}
                        <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-md text-[9px] font-bold text-primary border border-border px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {art.difficulty}
                        </span>
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
                          {art.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>
                    </Link>
                    <div className="px-5 pb-5 border-t border-border/30 pt-3 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{art.view_count || 0} views</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {art.reading_time_minutes} min</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > limit && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)}
                  variant="outline" size="sm" className="rounded-xl font-bold"
                >
                  Previous
                </Button>
                <span className="text-xs font-bold px-3">Page {page}</span>
                <Button 
                  disabled={page * limit >= total} 
                  onClick={() => setPage(page + 1)}
                  variant="outline" size="sm" className="rounded-xl font-bold"
                >
                  Next
                </Button>
              </div>
            )}

          </div>

          {/* Sidebar Columns: Other Topics */}
          <aside className="space-y-6 lg:col-span-1">
            <div className="bg-card border border-border rounded-3xl p-5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-4">Related Topics</h3>
              <div className="space-y-2">
                {categories.map((c) => {
                  const isActive = c.slug === slug;
                  return (
                    <Link key={c.slug} href={`/learn/category/${c.slug}`} className="block">
                      <div className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold hover:bg-muted transition-colors ${isActive ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"}`}>
                        <span>{c.name}</span>
                        <span className="bg-muted px-1.5 py-0.5 text-[10px] rounded-md font-bold text-muted-foreground shrink-0">{c.article_count}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Support Promo Box */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-5 text-center">
              <GraduationCap className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-1">Tailored Admissions Support</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Let Aura Routes AI analyze your grades to find the best universities for you.
              </p>
              <Link href="/universities">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl h-9 text-xs">
                  Run Profile Matcher
                </Button>
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
