"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, Clock, Calendar, ArrowLeft, Loader2,
  ChevronRight, Sparkles, Filter, X, ArrowRight, CornerDownRight,
  Eye, HelpCircle, RefreshCw, Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // AI Search Mode
  const [aiSearchMode, setAiSearchMode] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Filters
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedReadingTime, setSelectedReadingTime] = useState("all");

  // History & LocalStorage
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  // Autocomplete
  const [autocomplete, setAutocomplete] = useState<any[]>([]);
  const [autoLoading, setAutoLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load configuration and cached history
  useEffect(() => {
    // Categories
    fetch(`${API}/api/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d))
      .catch((e) => console.error(e));

    // Local Storage Recent Searches
    const saved = localStorage.getItem("aura_learn_recent_searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Load recent history if logged in
    if (user) {
      fetch(`${API}/api/learn/history`)
        .then((r) => r.json())
        .then((d) => setRecentArticles(d.slice(0, 4)))
        .catch((e) => console.error(e));
    }
  }, [user]);

  // Execute full-text search
  const performSearch = async (searchQ: string) => {
    if (!searchQ.trim()) return;
    setLoading(true);

    // Save to recent searches
    const nextSearches = [searchQ, ...recentSearches.filter((s) => s !== searchQ)].slice(0, 6);
    setRecentSearches(nextSearches);
    localStorage.setItem("aura_learn_recent_searches", JSON.stringify(nextSearches));

    try {
      let url = `${API}/api/articles?q=${encodeURIComponent(searchQ)}`;
      if (selectedCategory !== "all") url += `&category=${selectedCategory}`;
      if (selectedDifficulty !== "all") url += `&difficulty=${selectedDifficulty}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const body = await res.json();
        let filtered = body.data || [];
        
        // Custom front-end filters
        if (selectedReadingTime !== "all") {
          if (selectedReadingTime === "short") {
            filtered = filtered.filter((a: any) => (a.reading_time_minutes || 0) <= 8);
          } else if (selectedReadingTime === "long") {
            filtered = filtered.filter((a: any) => (a.reading_time_minutes || 0) > 8);
          }
        }
        
        setResults(filtered);
        setTotal(filtered.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Execute AI semantic query
  const performAISearch = async (searchQ: string) => {
    if (!searchQ.trim()) return;
    setAiLoading(true);
    setAiResponse("");

    try {
      const res = await fetch(`${API}/api/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: results[0]?.id || "", // context article fallback, or search keyword evaluation
          question: `Regarding study abroad: ${searchQ}. Answer in a detailed guidelines format. Recommend specific pathways if applicable.`,
          mode: "custom"
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setAiResponse(body.answer);
      } else {
        setAiResponse("Aura AI is currently busy. Displaying article matching list instead.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Run initial search from query params
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
      if (aiSearchMode) {
        performAISearch(initialQuery);
      }
    }
  }, [initialQuery, selectedCategory, selectedDifficulty, selectedReadingTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    if (aiSearchMode) {
      performAISearch(query);
    }
  };

  const handleRecentClick = (qText: string) => {
    setQuery(qText);
    performSearch(qText);
    if (aiSearchMode) {
      performAISearch(qText);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("aura_learn_recent_searches");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header Search Area */}
      <div className="border-b border-border/40 bg-card/60 sticky top-16 z-30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/learn")} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <form onSubmit={handleSubmit} className="flex-grow flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={aiSearchMode ? "Ask Aura AI any study abroad question..." : "Search key guides..."}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              <Button type="submit" className="rounded-xl font-bold bg-primary hover:opacity-95 text-white h-10 px-5">
                {aiSearchMode ? "Ask AI" : "Search"}
              </Button>
            </form>
          </div>

          {/* AI Search Mode Toggle Switch */}
          <div className="flex items-center justify-between mt-4 bg-muted/30 border border-border/40 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <div className="text-xs">
                <span className="font-bold text-foreground">Aura AI Search Agent</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Let AI formulate answer syntheses from all articles.</p>
              </div>
            </div>
            <button 
              onClick={() => setAiSearchMode(!aiSearchMode)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 outline-none ${aiSearchMode ? "bg-primary" : "bg-slate-800"}`}
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${aiSearchMode ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-5 space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <Filter className="w-4 h-4" /> Filters
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
                >
                  <option value="all">All Topics</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Level</label>
                <select 
                  value={selectedDifficulty} 
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Reading time */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reading Time</label>
                <select 
                  value={selectedReadingTime} 
                  onChange={(e) => setSelectedReadingTime(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
                >
                  <option value="all">All Durations</option>
                  <option value="short">Short (&le; 8 min)</option>
                  <option value="long">Long (&gt; 8 min)</option>
                </select>
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-card border border-border rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Recent Searches</span>
                  <button onClick={clearRecentSearches} className="text-[9px] font-bold text-red-500 hover:underline">Clear</button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((s, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleRecentClick(s)}
                      className="w-full text-left text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <CornerDownRight className="w-3 h-3 shrink-0" />
                      <span className="truncate">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right Column: Results & AI Pane */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* AI Synthesized Answer Block */}
            {aiSearchMode && query && (
              <div className="bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-500/20 rounded-3xl p-6 shadow-inner space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">Aura AI Synthesized Answer</h3>
                    <p className="text-[10px] text-indigo-300 font-bold">Query: "{query}"</p>
                  </div>
                </div>

                {aiLoading ? (
                  <div className="flex items-center justify-center py-6 gap-2 text-xs text-indigo-400">
                    <Loader2 className="w-4 animate-spin" />
                    <span>Synthesizing data...</span>
                  </div>
                ) : aiResponse ? (
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium bg-slate-950/40 p-4 rounded-2xl border border-slate-800/40">
                    {aiResponse}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic">Submit search to trigger AI analysis.</div>
                )}
              </div>
            )}

            {/* Articles matching list */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-4">
                {aiSearchMode ? "Recommended Articles" : "Matched Articles"} ({total})
              </h3>
              
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 animate-spin text-primary" /></div>
              ) : results.length === 0 ? (
                <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl">
                  <BookOpen className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                  <h4 className="font-bold text-sm">No articles matched</h4>
                  <p className="text-xs text-muted-foreground">Try spelling checks or reducing filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((art) => (
                    <div key={art.id} className="bg-card border border-border rounded-3xl p-5 hover:shadow-md hover:border-primary/20 transition-all group flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-32 h-24 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                        {art.hero_image_url && (
                          <img src={art.hero_image_url} alt="" className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">
                            {art.category_name}
                          </span>
                          <Link href={`/learn/${art.slug}`}>
                            <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                              {art.title}
                            </h4>
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1.5">
                            {art.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold mt-3">
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {art.reading_time_minutes} min read</span>
                          <span>•</span>
                          <span>{art.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}

export default function KnowledgeSearch() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <SearchContent />
    </React.Suspense>
  );
}
