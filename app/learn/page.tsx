"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, GraduationCap, Award, Shield, DollarSign,
  TrendingUp, Users, ArrowRight, Bookmark, Clock, ChevronRight,
  Globe2, Sparkles, Loader2, PlayCircle, History, MessageSquare,
  BookOpenCheck, Compass, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Define categories with custom metadata mapping
const CATEGORY_META: Record<string, { icon: any; gradient: string; text: string }> = {
  "countries": { icon: Globe2, gradient: "from-blue-600 to-cyan-500", text: "text-primary" },
  "visa-guides": { icon: Shield, gradient: "from-indigo-600 to-purple-500", text: "text-indigo-500" },
  "scholarships": { icon: Award, gradient: "from-amber-600 to-orange-500", text: "text-amber-500" },
  "universities": { icon: GraduationCap, gradient: "from-violet-600 to-fuchsia-500", text: "text-violet-500" },
  "ielts": { icon: BookOpen, gradient: "from-emerald-600 to-teal-500", text: "text-emerald-500" },
  "education-loans": { icon: DollarSign, gradient: "from-green-600 to-emerald-500", text: "text-green-500" },
  "pr-pathways": { icon: Compass, gradient: "from-cyan-600 to-blue-500", text: "text-cyan-500" },
  "mbbs-abroad": { icon: Sparkles, gradient: "from-red-600 to-rose-500", text: "text-red-500" },
};

const DEFAULT_META = { icon: BookOpen, gradient: "from-slate-600 to-slate-500", text: "text-slate-500" };

export default function KnowledgeHub() {
  const { user } = useAuth();
  const router = useRouter();

  // Search & Autocomplete
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Data state
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load basic hub data
  useEffect(() => {
    const loadHubData = async () => {
      try {
        const [catRes, featRes] = await Promise.all([
          fetch(`${API}/api/categories`),
          fetch(`${API}/api/learn/featured`),
        ]);
        const cats = await catRes.json();
        const feat = await featRes.json();

        setCategories(cats);
        setFeatured(feat.featured || []);
        setTrending(feat.trending || []);
        setLatest(feat.latest || []);
      } catch (err) {
        console.error("Failed to load hub data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHubData();
  }, []);

  // Load authenticated data (bookmarks & history)
  useEffect(() => {
    if (!user) return;

    const loadAuthData = async () => {
      try {
        const [histRes, bkRes] = await Promise.all([
          fetch(`${API}/api/learn/history`),
          fetch(`${API}/api/learn/bookmarks`),
        ]);
        if (histRes.ok) {
          const hist = await histRes.json();
          setHistory(hist.slice(0, 3));
        }
        if (bkRes.ok) {
          const bk = await bkRes.json();
          setBookmarks(bk.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load auth data:", err);
      }
    };
    loadAuthData();
  }, [user]);

  // Autocomplete search handler
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`${API}/api/learn/articles?q=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close search suggestions on click outside
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/learn/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-semibold">Loading Knowledge Center...</p>
        </div>
      </div>
    );
  }

  const primaryFeatured = featured[0];
  const sideFeatured = featured.slice(1);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ─── HERO SEARCH SECTION ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-20 border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.18),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 text-xs font-bold text-primary mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              AURA ROUTES AI INTEL HUB
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4"
          >
            Study Abroad <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Intelligence</span> Center
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-medium"
          >
            Master your entire global admission, scholarship, and student visa journey through curated guides, real stories, and interactive AI.
          </motion.p>

          {/* Search Box */}
          <div ref={searchRef} className="relative max-w-2xl mx-auto z-50">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, countries, visa checklists, and study loans..."
                  className="w-full h-14 pl-12 pr-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all shadow-inner"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-2xl h-14 px-6 bg-gradient-to-r from-primary to-indigo-600 text-white font-bold hover:opacity-95 shadow-md">
                Search
              </Button>
            </form>

            {/* Suggestions drop */}
            <AnimatePresence>
              {(suggestions.length > 0 || searchLoading) && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-left z-50"
                >
                  {searchLoading ? (
                    <div className="flex items-center justify-center p-6 text-slate-400 gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span>Scanning knowledge base...</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800/60">
                      {suggestions.map((item) => (
                        <Link 
                          key={item.id} 
                          href={`/learn/${item.slug}`}
                          className="flex items-center gap-3 p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                        >
                          <BookOpen className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                          <div className="flex-grow min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{item.title}</div>
                            <div className="text-xs text-slate-400 truncate">{item.excerpt}</div>
                          </div>
                          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 uppercase font-black tracking-wider">
                            {item.category_name || "Guide"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* ─── TABBED CATEGORIES ROW ────────────────────────────────────────────── */}
        <div className="mb-12 overflow-x-auto pb-2 flex gap-2 scrollbar-none">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.slug] || DEFAULT_META;
            const Icon = meta.icon;
            return (
              <Link key={cat.slug} href={`/learn/category/${cat.slug}`} className="shrink-0">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card border border-border/80 text-sm font-semibold hover:border-primary/40 hover:text-primary transition-all">
                  <Icon className={`w-4 h-4 ${meta.text}`} />
                  {cat.name}
                  {cat.article_count > 0 && (
                    <span className="bg-muted px-1.5 py-0.5 text-[10px] rounded-md font-bold text-muted-foreground">
                      {cat.article_count}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </div>

        {/* ─── CONTINUE READING & BOOKMARKS (IF AUTHENTICATED) ───────────────────── */}
        {user && (history.length > 0 || bookmarks.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* History */}
            {history.length > 0 && (
              <div className="bg-card border border-border/80 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    Continue Reading
                  </h3>
                  <Link href="/learn/history" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                    View History <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="space-y-3.5">
                  {history.map((hist) => (
                    <Link key={hist.history_id} href={`/learn/${hist.article.slug}`} className="block group">
                      <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 hover:bg-muted/80 transition-colors">
                        <div className="font-semibold text-xs leading-tight mb-1 group-hover:text-primary transition-colors">
                          {hist.article.title}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="w-full bg-slate-800 rounded-full h-1.5 mr-4 max-w-[200px]">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${hist.progress_percent}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground font-bold shrink-0">{hist.progress_percent}% read</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bookmarks */}
            {bookmarks.length > 0 && (
              <div className="bg-card border border-border/80 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-primary" />
                    Saved Articles
                  </h3>
                  <Link href="/learn/bookmarks" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="space-y-3.5">
                  {bookmarks.map((bk) => (
                    <Link key={bk.bookmark_id} href={`/learn/${bk.article.slug}`} className="block group">
                      <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 hover:bg-muted/80 transition-colors flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                          {bk.article.hero_image_url && (
                            <img src={bk.article.hero_image_url} alt="" className="object-cover w-full h-full" />
                          )}
                        </div>
                        <div className="min-w-0 flex-grow">
                          <div className="font-semibold text-xs leading-tight group-hover:text-primary transition-colors truncate">
                            {bk.article.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{bk.article.category_name}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── FEATURED GUIDES SECTION ────────────────────────────────────────── */}
        {primaryFeatured && (
          <div className="mb-16">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <BookOpenCheck className="w-6 h-6 text-primary" />
              Featured Guides
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Primary Featured Card */}
              <div className="lg:col-span-2 bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group">
                <Link href={`/learn/${primaryFeatured.slug}`} className="block h-full">
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                    {primaryFeatured.hero_image_url && (
                      <img 
                        src={primaryFeatured.hero_image_url} 
                        alt={primaryFeatured.title} 
                        className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
                      />
                    )}
                    <span className="absolute top-4 left-4 z-20 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {primaryFeatured.category_name}
                    </span>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="font-semibold">{primaryFeatured.author_name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {primaryFeatured.reading_time_minutes} min read</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black group-hover:text-primary transition-colors leading-tight mb-3">
                      {primaryFeatured.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {primaryFeatured.excerpt}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Sidebar Featured List */}
              <div className="space-y-6">
                {sideFeatured.map((art) => (
                  <div key={art.id} className="bg-card border border-border rounded-3xl p-5 hover:shadow-lg hover:border-primary/20 transition-all group">
                    <Link href={`/learn/${art.slug}`} className="block">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                        {art.category_name}
                      </span>
                      <h4 className="font-bold text-base group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                        {art.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                        <span>{art.author_name}</span>
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {art.reading_time_minutes} min</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── POPULAR COUNTRIES GUIDE HUB ──────────────────────────────────────── */}
        <section className="mb-16 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black flex items-center gap-2">
                <Globe2 className="w-6 h-6 text-primary" />
                Popular Country Guides
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Explore comprehensive, visa-approved guidelines to relocate and study.</p>
            </div>
            <Link href="/learn/category/countries">
              <Button variant="outline" className="rounded-xl font-bold border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/10">
                View All Country Guides <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Canada", slug: "complete-guide-to-studying-in-canada-2025", emoji: "🇨🇦" },
              { name: "United Kingdom", slug: "uk-student-visa-complete-guide-2025", emoji: "🇬🇧" },
              { name: "Australia", slug: "australia-student-visa-subclass-500-guide", emoji: "🇦🇺" },
              { name: "Germany", slug: "german-student-visa-guide-2025", emoji: "🇩🇪" },
            ].map((c) => (
              <Link key={c.name} href={`/learn/${c.slug}`} className="block group">
                <div className="bg-card border border-border hover:border-primary/45 rounded-2xl p-5 text-center transition-all cursor-pointer shadow-sm">
                  <div className="text-4xl mb-2 group-hover:scale-108 transition-transform">{c.emoji}</div>
                  <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 flex items-center justify-center gap-0.5">
                    Read Guide <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── LATEST & TRENDING ARTICLES GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main list: Latest */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Latest Knowledge Releases
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latest.map((art) => (
                <div key={art.id} className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col justify-between">
                  <Link href={`/learn/${art.slug}`} className="block flex-grow">
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      {art.hero_image_url && (
                        <img src={art.hero_image_url} alt="" className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500" />
                      )}
                      <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-md text-[9px] font-bold text-primary border border-border px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {art.category_name}
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
                    <span>{art.author_name}</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {art.reading_time_minutes} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right list: Trending */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Trending Topics
            </h2>
            <div className="space-y-4">
              {trending.map((art, idx) => (
                <div key={art.id} className="flex gap-4 p-3 hover:bg-muted/40 rounded-2xl transition-colors group">
                  <div className="text-xl font-black text-muted-foreground shrink-0 w-8 text-center pt-1 group-hover:text-primary transition-colors">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <Link href={`/learn/${art.slug}`} className="block">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">
                        {art.category_name}
                      </span>
                      <h5 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h5>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        {art.reading_time_minutes} min read
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Assistant Promo CTA Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
              <div className="relative z-10">
                <Sparkles className="w-8 h-8 text-indigo-200 mb-3" />
                <h4 className="font-bold text-base mb-1">Ask Aura AI</h4>
                <p className="text-xs text-indigo-100 leading-relaxed mb-4">
                  Confused about visa guidelines or financial statements? Aura AI is trained on every article to assist you instantly.
                </p>
                <Link href="/ai-tools">
                  <Button size="sm" className="w-full bg-card text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl">
                    Open Aura AI Panel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
