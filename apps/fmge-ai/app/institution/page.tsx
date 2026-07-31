"use client";

import React from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import {
  Building2, Users, Layers, AlertTriangle, ChevronRight, Plus, Upload,
  BookOpen, CheckCircle2, TrendingUp, Award, Calendar
} from "lucide-react";

const departments = [
  { name: "General Medicine", head: "Dr. V. K. Ivanov", students: 420, passRate: "88.5%" },
  { name: "General Surgery", head: "Dr. Dmitry Sokolov", students: 380, passRate: "84.2%" },
  { name: "Obstetrics & Gynecology", head: "Prof. Maria Popova", students: 310, passRate: "91.0%" },
  { name: "Pediatrics", head: "Dr. Anna Smirnova", students: 290, passRate: "85.6%" },
  { name: "Pharmacology", head: "Prof. Elena Petrov", students: 350, passRate: "76.4%" },
  { name: "Community Medicine (PSM)", head: "Dr. Sergey Volkov", students: 410, passRate: "72.0%" }
];

export default function InstitutionAdminDashboardPage() {
  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl">
        
        {/* Header Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 dark:border-slate-800 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Enterprise Institution LMS Portal</span>
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Kursk State Medical University</h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Cohort performance monitoring, batch enrollment codes, faculty assignments, and AI candidate risk radar.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shrink-0 min-w-[220px]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">Enrolled FMGE Candidates</span>
            <div className="text-3xl font-black text-teal-400 mt-1">1,420 Doctors</div>
            <span className="text-xs font-bold text-emerald-300 mt-1 block">86.2% Projected Pass Rate</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href="/institution/batches"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
          >
            <Layers className="w-4 h-4 text-teal-600" />
            <span>Manage Batches & Bulk CSV</span>
          </Link>

          <Link
            href="/institution/assignments"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Assign Mocks & Cases</span>
          </Link>

          <Link
            href="/faculty/portal"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Users className="w-4 h-4" />
            <span>Faculty Professor Portal</span>
          </Link>
        </div>

        {/* AI Student Risk Radar Alert */}
        <div className="glass-panel p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Student Risk Radar Alert</h3>
                <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">14 Candidates At-Risk</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">14 students are currently projected below the 150/300 FMGE passing cutoff. Faculty intervention recommended.</p>
            </div>
          </div>

          <Link
            href="/faculty/portal"
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow shrink-0"
          >
            Review At-Risk Students
          </Link>
        </div>

        {/* 10 Departments Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Medical College Departments</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-teal-600 uppercase bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border">
                    Department
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{dept.name}</h3>
                  <p className="text-xs text-slate-500">Head: {dept.head}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Enrolled Doctors:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{dept.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Projected Pass:</span>
                    <span className="font-bold text-emerald-600">{dept.passRate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}
