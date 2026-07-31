"use client";

import React, { useState } from "react";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { FileText, Plus, Pin, Trash2, Save } from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState([
    {
      id: "n1",
      title: "High Yield Triads in Internal Medicine",
      content: "• Normal Pressure Hydrocephalus: Wet, Wacky, Wobbly\n• Charcot Triad: Fever, RUQ Pain, Jaundice\n• Cushing Triad: HTN, Bradycardia, Irregular Breathing",
      subject: "General Medicine",
      pinned: true
    },
    {
      id: "n2",
      title: "Pharmacology Antidotes Cheat Sheet",
      content: "• Paracetamol → N-Acetylcysteine\n• Opioids → Naloxone\n• Heparin → Protamine Sulfate\n• Warfarin → Vitamin K",
      subject: "Pharmacology",
      pinned: false
    }
  ]);

  const [activeNoteId, setActiveNoteId] = useState("n1");
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const updateContent = (val: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, content: val } : n))
    );
  };

  const createNewNote = () => {
    const newId = `n-${Date.now()}`;
    const newNote = {
      id: newId,
      title: "New Medical Note",
      content: "Write your revision notes in Markdown...",
      subject: "General Medicine",
      pinned: false
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newId);
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Personal Medical Notes</h1>
            <p className="text-xs text-slate-500">Rich markdown notes with instant search and subject tagging.</p>
          </div>
          <button
            onClick={createNewNote}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Note</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Notes List */}
          <div className="md:col-span-4 space-y-2">
            {notes.map((n) => (
              <div
                key={n.id}
                onClick={() => setActiveNoteId(n.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  n.id === activeNoteId
                    ? "bg-teal-50 dark:bg-teal-950/80 border-teal-500 text-teal-900 dark:text-teal-200"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs truncate">{n.title}</h4>
                  {n.pinned && <Pin className="w-3 h-3 text-teal-600 fill-teal-600" />}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{n.subject}</span>
              </div>
            ))}
          </div>

          {/* Right Editor */}
          <div className="md:col-span-8 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{activeNote.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-teal-50 dark:bg-teal-950 text-teal-600 font-bold px-2 py-0.5 rounded border">
                  {activeNote.subject}
                </span>
              </div>
            </div>

            <textarea
              rows={12}
              value={activeNote.content}
              onChange={(e) => updateContent(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
