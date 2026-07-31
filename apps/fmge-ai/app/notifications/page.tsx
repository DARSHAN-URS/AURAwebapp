"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import {
  Bell, CheckCircle2, MessageSquare, AlertTriangle, ShieldCheck, Sparkles,
  Sliders, Send, Search, CheckCheck, Trash2, Archive, X, Settings
} from "lucide-react";

export default function NotificationsInboxPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showPreferences, setShowPreferences] = useState(false);
  const [quickReplyText, setQuickReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      category: "AI Intervention",
      priority: "HIGH",
      title: "Pharmacology Revision Recommended",
      body: "Your accuracy in Pharmacology is 61.5%. AI recommends revising Autonomic Drugs before your next Mock.",
      time: "10m ago",
      read: false,
      url: "/qbank?subject=pharmacology"
    },
    {
      id: "n2",
      category: "Faculty Message",
      priority: "HIGH",
      title: "Assignment from Dr. V. K. Ivanov (Kursk Med Univ)",
      body: "Please review the 5 emergency ECG clinical cases assigned for your cohort before Friday.",
      time: "2h ago",
      read: false,
      url: "/clinical-cases"
    },
    {
      id: "n3",
      category: "Study Reminder",
      priority: "MEDIUM",
      title: "Daily Goal Status: 15 / 20 MCQs Completed",
      body: "Complete 5 more questions to maintain your 7-day study streak!",
      time: "4h ago",
      read: false,
      url: "/qbank"
    },
    {
      id: "n4",
      category: "Institution Announcement",
      priority: "MEDIUM",
      title: "NBE FMGE Dec 2026 Examination Schedule Released",
      body: "Official notification from NBE regarding registration window & exam dates.",
      time: "Yesterday",
      read: true,
      url: "/syllabus"
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSendQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReplyText.trim()) return;

    setReplySent(true);
    setQuickReplyText("");
    setTimeout(() => setReplySent(false), 3000);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl">
        
        {/* Header Bar */}
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 dark:border-slate-800 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
                Unified Communication Center
              </span>
              {unreadCount > 0 && (
                <span className="text-xs font-bold text-rose-300 bg-rose-950 px-3 py-1 rounded-full border border-rose-800">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Smart Notifications & <span className="text-teal-400">Communication Inbox</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              AI-driven study reminders, faculty messages, clinical assignments, and NBE examination announcements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-teal-300" />
              <span>Mark All Read</span>
            </button>

            <button
              onClick={() => setShowPreferences(true)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20"
              title="Notification Preferences"
            >
              <Settings className="w-4 h-4 text-slate-200" />
            </button>
          </div>
        </div>

        {/* Split Inbox Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Notification Feed */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Category Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
              {["All", "AI Intervention", "Faculty Message", "Study Reminder", "Institution Announcement"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-teal-600 text-white shadow"
                      : "bg-white dark:bg-slate-900 border border-slate-200 text-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Notifications Feed Cards */}
            <div className="space-y-3">
              {notifications
                .filter((n) => activeCategory === "All" || n.category === activeCategory)
                .map((n) => (
                  <div
                    key={n.id}
                    className={`glass-panel p-5 rounded-2xl border transition-all space-y-2 ${
                      !n.read
                        ? "border-teal-300 dark:border-teal-900 bg-teal-50/20 dark:bg-teal-950/20 shadow-sm"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          n.priority === "HIGH" ? "bg-rose-100 text-rose-800" : "bg-teal-100 text-teal-800"
                        }`}>
                          {n.priority}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{n.category}</span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{n.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.body}</p>

                    <div className="pt-2 flex justify-end">
                      <Link
                        href={n.url}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow"
                      >
                        View & Take Action
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Column: Faculty Quick Reply Panel */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">Quick Reply to Faculty</h3>
              </div>

              {replySent && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                  Quick reply delivered to Dr. V. K. Ivanov!
                </div>
              )}

              <form onSubmit={handleSendQuickReply} className="space-y-3">
                <p className="text-xs text-slate-500">Replying to: Dr. V. K. Ivanov (Emergency ECG Assignment)</p>
                <textarea
                  rows={3}
                  value={quickReplyText}
                  onChange={(e) => setQuickReplyText(e.target.value)}
                  placeholder="Type your response to faculty..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 text-white shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-base">Notification Preferences</h3>
              <button onClick={() => setShowPreferences(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span>In-App Notifications</span>
                <input type="checkbox" defaultChecked className="accent-teal-500 w-4 h-4" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span>Email Alerts & Daily Digest</span>
                <input type="checkbox" defaultChecked className="accent-teal-500 w-4 h-4" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span>WhatsApp Instant Reminders</span>
                <input type="checkbox" defaultChecked className="accent-teal-500 w-4 h-4" />
              </label>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold">Quiet Hours (Do Not Disturb):</span>
                <p className="text-slate-400 text-[11px]">22:00 PM – 06:00 AM (AI delays non-emergency notifications)</p>
              </div>
            </div>

            <button
              onClick={() => setShowPreferences(false)}
              className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-xs shadow"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
