"use client";

import React, { useState } from "react";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Bookmark, Search, Trash2 } from "lucide-react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([
    { id: "b1", title: "Pharmacology • Digoxin Toxicity ECG Sign", subject: "Pharmacology", type: "question", date: "2 days ago" },
    { id: "b2", title: "Inferior Wall MI & RCA Occlusion Vignette", subject: "General Medicine", type: "clinical_case", date: "3 days ago" },
    { id: "b3", title: "High Yield Triads in Internal Medicine", subject: "Neurology", type: "note", date: "5 days ago" },
  ]);

  const deleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Bookmarked Items</h1>
          <p className="text-xs text-slate-500">Access saved questions, clinical vignettes, and AI tutor notes.</p>
        </div>

        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{bm.title}</h4>
                  <p className="text-[11px] text-slate-500">{bm.subject} • Saved {bm.date}</p>
                </div>
              </div>
              <button
                onClick={() => deleteBookmark(bm.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
