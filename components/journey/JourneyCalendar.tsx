"use client";

import React, { useState } from "react";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  GraduationCap, 
  FileText,
  UserCheck,
  Plane,
  Inbox
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  type: string; // Application Deadline, Scholarship Deadline, Consultation, Visa Date, Biometrics, IELTS, Travel
  date: string;
}

interface JourneyCalendarProps {
  events: CalendarEvent[];
}

export default function JourneyCalendar({ events }: JourneyCalendarProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredEvents = events.filter(e => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Deadlines") return e.type.includes("Deadline");
    if (activeFilter === "Calls") return e.type === "Consultation";
    return e.type === "Visa Date" || e.type === "Biometrics" || e.type === "Interview" || e.type === "IELTS" || e.type === "Travel";
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getEventBadgeColor = (type: string) => {
    if (type.includes("Deadline")) return "bg-rose-50 border-rose-100 text-rose-600";
    if (type === "Consultation") return "bg-primary/10 border-primary/20 text-primary";
    if (type === "Travel") return "bg-emerald-50 border-emerald-100 text-emerald-600";
    return "bg-amber-50 border-amber-100 text-amber-600";
  };

  const getEventIcon = (type: string) => {
    if (type.includes("Deadline")) return <FileText className="w-4 h-4 text-rose-600" />;
    if (type === "Consultation") return <UserCheck className="w-4 h-4 text-primary" />;
    if (type === "Travel") return <Plane className="w-4 h-4 text-emerald-600" />;
    return <CalendarDays className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 w-full">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-xs font-black uppercase text-muted-text tracking-wider flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Milestone Journey Calendar
          </h3>
          <p className="text-[11px] text-muted-text mt-0.5 leading-snug">Track application submission dates, mock preps, and departure events.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 p-1 bg-background border border-border rounded-xl select-none w-fit">
          {["All", "Deadlines", "Calls", "Visa & Test"].map(tabName => (
            <button
              key={tabName}
              onClick={() => setActiveFilter(tabName)}
              className={`px-3 py-1 text-[10px] font-black rounded-lg cursor-pointer transition-all ${
                (activeFilter === "All" && tabName === "All") ||
                (activeFilter === "Deadlines" && tabName === "Deadlines") ||
                (activeFilter === "Calls" && tabName === "Calls") ||
                (activeFilter === "Visa & Test" && tabName === "Visa & Test")
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-text hover:text-muted-foreground"
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>
      </div>

      {/* Agenda list */}
      <div className="flex-1 min-h-[220px] overflow-y-auto max-h-[360px] pr-2 scrollbar-thin">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-muted-text select-none">
            <Inbox className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs font-bold">No upcoming schedule logs found in this category.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl transition-all hover:bg-background/50"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                    {getEventIcon(evt.type)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-foreground truncate block leading-none">{evt.title}</span>
                    <span className="text-[9px] font-bold text-muted-text uppercase tracking-wide block mt-1.5">{evt.type}</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <span className="text-xs font-extrabold text-foreground/90">
                    {new Date(evt.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${getEventBadgeColor(evt.type)}`}>
                    {evt.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
