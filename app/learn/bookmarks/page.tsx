"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bookmark, Clock, Calendar, ArrowLeft, Loader2,
  Trash2, ArrowRight, BookOpen, Share2, Star,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function BookmarksHub() {
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API}/api/learn/bookmarks`);
      if (res.ok) {
        const body = await res.json();
        setData(body);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const removeBookmark = async (bookmarkId: string, articleId: string) => {
    // Optimistic UI updates
    setData((prev) => prev.filter((bk) => bk.bookmark_id !== bookmarkId));
    await fetch(`${API}/api/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article_id: articleId }),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Redirect to login if guest user
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <Bookmark className="w-12 h-12 text-muted-foreground opacity-30" />
        <h2 className="text-xl font-bold">Sign In Required</h2>
        <p className="text-sm text-muted-foreground max-w-sm">Please log in to save articles, view your bookmarks, and continue reading.</p>
        <Link href="/login"><Button className="bg-primary text-white font-bold rounded-xl px-6">Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-b border-border/40 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <button onClick={() => router.push("/learn")} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold mb-6 group transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Learn Hub
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Saved Articles</h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage all your bookmarked guides and articles.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-12">
        {data.length === 0 ? (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl">
            <Bookmark className="w-12 h-12 text-muted-foreground opacity-30 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">No Saved Articles</h3>
            <p className="text-xs text-muted-foreground mb-6">Browse the Study Abroad guides and tap the bookmark to save them here.</p>
            <Link href="/learn">
              <Button className="bg-primary text-white font-bold rounded-xl">Browse Guides</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.map((item) => (
              <div key={item.bookmark_id} className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col justify-between">
                <Link href={`/learn/${item.article.slug}`} className="block flex-grow">
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    {item.article.hero_image_url && (
                      <img src={item.article.hero_image_url} alt="" className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500" />
                    )}
                    <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-md text-[9px] font-bold text-primary border border-border px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {item.article.category_name}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeBookmark(item.bookmark_id, item.article.id);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/80 hover:bg-red-500/80 text-white hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
                      {item.article.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.article.excerpt}
                    </p>
                  </div>
                </Link>
                <div className="px-5 pb-5 border-t border-border/30 pt-3 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.article.reading_time_minutes} min read</span>
                  <Link href={`/learn/${item.article.slug}`} className="text-primary hover:underline flex items-center gap-0.5">
                    Read now <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
