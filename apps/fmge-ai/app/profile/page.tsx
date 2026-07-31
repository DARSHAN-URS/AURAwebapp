"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, ShieldCheck, Laptop, Smartphone, Bell, Check, LogOut, ExternalLink, ArrowRight } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "sso" | "sessions" | "notifications">("profile");

  // State
  const [fullName, setFullName] = useState("Dr. Rahul Sharma");
  const [email, setEmail] = useState("rahul.sharma@example.com");
  const [medicalCollege, setMedicalCollege] = useState("Kursk State Medical University");
  const [country, setCountry] = useState("Russia");
  const [targetExam, setTargetExam] = useState("FMGE Dec 2026");

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);

  // Active Sessions
  const [sessions, setSessions] = useState([
    { id: "1", device: "Chrome / Windows 11", ip: "103.21.124.89", location: "Bangalore, India", current: true, time: "Active now" },
    { id: "2", device: "Safari / iPhone 15 Pro", ip: "157.34.88.12", location: "Moscow, Russia", current: false, time: "2 hours ago" },
  ]);

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="pt-32 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-teal-600 text-white font-extrabold text-2xl flex items-center justify-center ring-4 ring-teal-500/20">
            RS
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{fullName}</h1>
            <p className="text-xs text-slate-500">{medicalCollege} • {country}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                Pro Clinical Pass
              </span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                AI Readiness: 84.5%
              </span>
            </div>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950">
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: "profile", label: "Profile & Academic Info" },
          { id: "sso", label: "Healthcare AI Suite SSO" },
          { id: "sessions", label: "Device Sessions" },
          { id: "notifications", label: "Notifications" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === "profile" && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-2xl">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Academic Profile</h3>
          
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Medical College</label>
                <input
                  type="text"
                  value={medicalCollege}
                  onChange={(e) => setMedicalCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <button className="px-6 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: SSO Product Access */}
      {activeTab === "sso" && (
        <div className="space-y-4 max-w-3xl">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Healthcare AI Suite Single Sign-On</h3>
          <p className="text-xs text-slate-500">Your account accesses all platform applications seamlessly.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="glass-panel p-5 rounded-2xl border border-teal-500/50 space-y-3">
              <span className="text-[10px] font-bold text-teal-600 uppercase bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">Active Product</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">FMGE AI</h4>
              <p className="text-xs text-slate-500">NBE Licensing & NExT Prep Engine</p>
              <div className="text-xs text-emerald-600 font-bold">Plan: Pro Clinical Pass</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Enabled SSO</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">NursePass AI</h4>
              <p className="text-xs text-slate-500">NCLEX, OET & Prometric Nursing Prep</p>
              <Link href="http://localhost:3001" className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline">
                <span>Launch App</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">Subscription Available</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Aura Routes</h4>
              <p className="text-xs text-slate-500">Global Study Abroad & Visa Matcher</p>
              <Link href="http://localhost:3000/pricing" className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline">
                <span>View Plans</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sessions */}
      {activeTab === "sessions" && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-2xl">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Active Device Sessions</h3>
          <div className="space-y-3">
            {sessions.map((sess) => (
              <div key={sess.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {sess.device.includes("iPhone") ? <Smartphone className="w-5 h-5 text-teal-600" /> : <Laptop className="w-5 h-5 text-teal-600" />}
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{sess.device}</h4>
                    <p className="text-[11px] text-slate-500">{sess.location} • IP: {sess.ip}</p>
                  </div>
                </div>
                {sess.current ? (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded">Current Session</span>
                ) : (
                  <button
                    onClick={() => revokeSession(sess.id)}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === "notifications" && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-xl">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Notification Preferences</h3>
          
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span>Email Study Reminders & Weekly Analytics</span>
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="w-4 h-4 accent-teal-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span>WhatsApp Daily Target Alerts</span>
              <input
                type="checkbox"
                checked={whatsappNotif}
                onChange={(e) => setWhatsappNotif(e.target.checked)}
                className="w-4 h-4 accent-teal-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span>AI Weak Area Revision Notifications</span>
              <input
                type="checkbox"
                checked={studyReminders}
                onChange={(e) => setStudyReminders(e.target.checked)}
                className="w-4 h-4 accent-teal-600"
              />
            </label>
          </div>
        </div>
      )}

    </div>
  );
}
