"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen, Calendar, Clock, Bookmark, Heart, Share2, Sparkles,
  ChevronRight, ArrowLeft, ArrowRight, Loader2, PlayCircle, Send,
  CheckCircle2, AlertTriangle, HelpCircle, Check, Copy, Twitter,
  Linkedin, MessageSquare, ListTodo, GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ContentBlock {
  type: "paragraph" | "heading" | "tip" | "warning" | "callout" | "list" | "table" | "image";
  text?: string;
  level?: number;
  id?: string;
  title?: string;
  emoji?: string;
  style?: "bullet" | "numbered";
  items?: string[];
  headers?: string[];
  rows?: string[][];
  url?: string;
  caption?: string;
  alt?: string;
}

export default function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  // Article state
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Scroll tracking for progress & active TOC heading
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // AI Assistant panel states
  const [aiInput, setAiInput] = useState("");
  const [aiResponses, setAiResponses] = useState<{ query: string; answer: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Social share indicators
  const [copied, setCopied] = useState(false);

  // Load article details
  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API}/api/article/${slug}`);
        if (!res.ok) {
          setData(null);
          return;
        }
        const body = await res.json();
        setData(body.article);
        setBookmarked(body.is_bookmarked);
        setLiked(body.is_liked);
        setLikeCount(body.article?.like_count || 0);

        // Record reading history starting at 0% progress
        if (user) {
          fetch(`${API}/api/learn/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ article_id: body.article.id, progress_percent: 0 }),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug, user]);

  // Reading progress tracker and active heading monitor
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const rect = el.getBoundingClientRect();
      const elementHeight = el.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY - el.offsetTop;
      
      const progress = Math.min(100, Math.max(0, (currentScroll / elementHeight) * 100));
      setScrollProgress(progress);

      // Track active heading
      const headings = el.querySelectorAll("h2, h3");
      let currentActive = "";
      for (let i = 0; i < headings.length; i++) {
        const h = headings[i];
        const hRect = h.getBoundingClientRect();
        if (hRect.top <= 120) {
          currentActive = h.id;
        }
      }
      if (currentActive) {
        setActiveHeadingId(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

  // Periodic reading progress persistence
  useEffect(() => {
    if (!data || !user) return;
    const interval = setInterval(() => {
      if (scrollProgress > 5) {
        fetch(`${API}/api/learn/history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ article_id: data.id, progress_percent: Math.round(scrollProgress) }),
        });
      }
    }, 8000); // sync reading progress every 8s

    return () => clearInterval(interval);
  }, [scrollProgress, data, user]);

  const handleBookmark = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const targetState = !bookmarked;
    setBookmarked(targetState);
    await fetch(`${API}/api/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article_id: data.id }),
    });
  };

  const handleLike = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const targetState = !liked;
    setLiked(targetState);
    setLikeCount((prev) => targetState ? prev + 1 : Math.max(0, prev - 1));
    await fetch(`${API}/api/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article_id: data.id }),
    });
  };

  // Ask AI endpoint trigger
  const handleAskAI = async (mode: string, queryText?: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    const q = queryText || aiInput;
    if (!q && mode === "custom") return;

    setAiLoading(true);
    setAiInput("");

    try {
      const res = await fetch(`${API}/api/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: data.id,
          question: q,
          mode: mode
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setAiResponses((prev) => [
          ...prev,
          { query: mode === "custom" ? q : `${mode.toUpperCase()} request`, answer: body.answer }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground opacity-45" />
        <h2 className="text-xl font-bold">Article not found</h2>
        <Link href="/learn"><Button variant="outline">Back to Knowledge Center Hub</Button></Link>
      </div>
    );
  }

  // Create JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "image": data.hero_image_url || "https://auraroutes.com/images/og-default.png",
    "datePublished": data.published_at,
    "dateModified": data.updated_at,
    "author": {
      "@type": "Person",
      "name": data.author_name,
      "jobTitle": data.author_role
    },
    "publisher": {
      "@type": "Organization",
      "name": "Aura Routes AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://auraroutes.com/images/logo.jpeg"
      }
    },
    "description": data.excerpt
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Dynamic JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Fixed Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-slate-800 z-50">
        <div className="bg-primary h-full transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-no-repeat" style={{ backgroundImage: `url(${data.hero_image_url})` }} />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 max-w-5xl py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-semibold">
            <Link href="/learn" className="hover:text-primary transition-colors">Learn Hub</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/learn/category/${data.category_id || "all"}`} className="hover:text-primary transition-colors">{data.category_name || "Guides"}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-500 truncate max-w-[200px]">{data.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {data.category_name}
            </span>
            {data.country && (
              <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {data.country}
              </span>
            )}
            <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2.5 py-1 rounded-full">
              {data.difficulty}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 max-w-4xl">
            {data.title}
          </h1>

          {data.subtitle && (
            <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed mb-6 font-medium">
              {data.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white uppercase shadow-sm">
                {data.author_name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-sm text-white">{data.author_name}</div>
                <div className="text-xs text-slate-400">{data.author_role}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Updated {new Date(data.updated_at).toLocaleDateString()}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {data.reading_time_minutes} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Table of Contents */}
          <aside className="hidden lg:block space-y-6 lg:col-span-1">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-4 scrollbar-none">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-4">Table of Contents</h3>
              <div className="space-y-2 border-l border-border/80">
                {(data.table_of_contents || []).map((heading: any) => (
                  <a 
                    key={heading.id} 
                    href={`#${heading.id}`}
                    className={`block text-xs font-semibold pl-4 py-1 border-l -ml-[1px] transition-all ${activeHeadingId === heading.id ? "text-primary border-primary font-bold scale-[1.02]" : "text-muted-foreground border-transparent hover:text-foreground"}`}
                    style={{ paddingLeft: `${heading.level * 8}px` }}
                  >
                    {heading.title}
                  </a>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-border/40 space-y-4">
                <div className="flex items-center gap-2">
                  <Button onClick={handleLike} variant="outline" className={`rounded-xl flex-grow h-10 gap-2 font-bold ${liked ? "bg-red-500/10 text-red-500 border-red-500/30" : ""}`}>
                    <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                    {likeCount} Likes
                  </Button>
                  <Button onClick={handleBookmark} variant="outline" className={`rounded-xl h-10 px-3 ${bookmarked ? "bg-primary/10 text-primary border-primary/30" : ""}`}>
                    <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-primary text-primary" : ""}`} />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Share Guide</div>
                <div className="flex items-center gap-1.5">
                  <Button onClick={handleCopyLink} size="icon" variant="ghost" className="rounded-xl hover:bg-muted">
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(data.title)}`} target="_blank" rel="noreferrer">
                    <Button size="icon" variant="ghost" className="rounded-xl hover:bg-muted"><Twitter className="w-4 h-4" /></Button>
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} target="_blank" rel="noreferrer">
                    <Button size="icon" variant="ghost" className="rounded-xl hover:bg-muted"><Linkedin className="w-4 h-4" /></Button>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Middle Column: Rich Content */}
          <main ref={contentRef} className="lg:col-span-2 space-y-6 prose dark:prose-invert max-w-none">
            {/* Render blocks */}
            {(data.content_blocks || []).map((block: ContentBlock, idx: number) => {
              switch (block.type) {
                case "heading":
                  if (block.level === 3) {
                    return <h3 key={idx} id={block.id} className="text-lg font-black mt-8 text-foreground leading-snug">{block.text}</h3>;
                  }
                  return <h2 key={idx} id={block.id} className="text-xl sm:text-2xl font-black mt-10 text-foreground leading-tight">{block.text}</h2>;
                  
                case "paragraph":
                  return <p key={idx} className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">{block.text}</p>;
                  
                case "tip":
                  return (
                    <div key={idx} className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 my-6 flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-emerald-500 text-sm mb-1">{block.title || "Pro Tip"}</div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{block.text}</p>
                      </div>
                    </div>
                  );
                  
                case "warning":
                  return (
                    <div key={idx} className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 my-6 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-amber-500 text-sm mb-1">{block.title || "Warning"}</div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{block.text}</p>
                      </div>
                    </div>
                  );
                  
                case "callout":
                  return (
                    <div key={idx} className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5 my-6 flex gap-3">
                      <span className="text-lg shrink-0 mt-0.5">{block.emoji || "💡"}</span>
                      <div>
                        <div className="font-bold text-indigo-400 text-sm mb-1">{block.title}</div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{block.text}</p>
                      </div>
                    </div>
                  );
                  
                case "list":
                  const ListTag = block.style === "numbered" ? "ol" : "ul";
                  return (
                    <div key={idx} className="my-5">
                      {block.title && <div className="font-bold text-sm sm:text-base mb-2 text-foreground">{block.title}</div>}
                      <ListTag className="space-y-2 pl-6 list-outside">
                        {(block.items || []).map((item, lidx) => (
                          <li key={lidx} className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ListTag>
                    </div>
                  );
                  
                case "table":
                  return (
                    <div key={idx} className="my-8 overflow-x-auto border border-border rounded-2xl">
                      {block.title && <div className="font-bold text-xs uppercase bg-muted/60 text-muted-foreground px-4 py-2 border-b border-border">{block.title}</div>}
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border">
                            {(block.headers || []).map((h, hidx) => (
                              <th key={hidx} className="px-4 py-2.5 text-left font-bold text-foreground">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(block.rows || []).map((row, ridx) => (
                            <tr key={ridx} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                              {row.map((cell, cidx) => (
                                <td key={cidx} className="px-4 py-2.5 text-muted-foreground leading-relaxed">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                  
                case "image":
                  return (
                    <figure key={idx} className="my-8 rounded-2xl overflow-hidden border border-border">
                      <img src={block.url} alt={block.alt} className="object-cover w-full h-auto" />
                      {block.caption && <figcaption className="bg-muted/40 text-[10px] text-muted-foreground text-center py-2 border-t border-border">{block.caption}</figcaption>}
                    </figure>
                  );
                  
                default:
                  return null;
              }
            })}

            {/* FAQs Accordion */}
            {data.faqs?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border/80 space-y-4">
                <h3 className="text-xl font-black text-foreground mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {data.faqs.map((faq: any, fidx: number) => (
                    <div key={fidx} className="bg-muted/30 border border-border/60 rounded-2xl p-5">
                      <div className="font-bold text-sm text-foreground flex gap-2">
                        <HelpCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                        {faq.q}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2 pl-6 font-medium">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Right Column: AI Assistant */}
          <aside className="space-y-6 lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-500/10 rounded-3xl p-5 shadow-inner">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Ask Aura AI</h3>
                  <p className="text-[10px] text-indigo-300 font-semibold">Trained on this article</p>
                </div>
              </div>

              {/* Quick Prompt chips */}
              <div className="space-y-1.5 mb-4">
                <button onClick={() => handleAskAI("summarize")} className="w-full text-left text-xs bg-card hover:bg-muted border border-border/80 hover:border-primary/20 text-muted-foreground font-semibold px-3 py-2 rounded-xl transition-all flex items-center justify-between group">
                  <span>Summarise this guide</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <button onClick={() => handleAskAI("explain")} className="w-full text-left text-xs bg-card hover:bg-muted border border-border/80 hover:border-primary/20 text-muted-foreground font-semibold px-3 py-2 rounded-xl transition-all flex items-center justify-between group">
                  <span>Explain in simple terms</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <button onClick={() => handleAskAI("checklist")} className="w-full text-left text-xs bg-card hover:bg-muted border border-border/80 hover:border-primary/20 text-muted-foreground font-semibold px-3 py-2 rounded-xl transition-all flex items-center justify-between group">
                  <span>Generate checklist</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>

              {/* Chat Thread */}
              {aiResponses.length > 0 && (
                <div className="border-t border-indigo-500/10 pt-4 mt-4 space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin">
                  {aiResponses.map((res, ridx) => (
                    <div key={ridx} className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400">You: {res.query}</div>
                      <div className="text-xs bg-slate-900/60 border border-slate-800/40 p-3 rounded-xl leading-relaxed text-slate-300 font-medium">
                        {res.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {aiLoading && (
                <div className="flex items-center justify-center py-4 gap-2 text-xs text-indigo-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Aura AI is thinking...</span>
                </div>
              )}

              {/* Custom Input */}
              <div className="relative mt-4 border-t border-indigo-500/10 pt-4">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskAI("custom")}
                  placeholder="Ask a question about this..."
                  className="w-full bg-slate-950/60 border border-slate-800/60 rounded-xl py-2 pl-3 pr-9 text-xs placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                />
                <button onClick={() => handleAskAI("custom")} className="absolute right-2 top-[26px] text-muted-foreground hover:text-primary transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
