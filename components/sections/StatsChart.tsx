"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { TrendingUp, Users, GraduationCap, ShieldCheck } from "lucide-react";

const monthlyData = [
  { month: "Jul", students: 980, visas: 920 },
  { month: "Aug", students: 1200, visas: 1140 },
  { month: "Sep", students: 1450, visas: 1380 },
  { month: "Oct", students: 1350, visas: 1290 },
  { month: "Nov", students: 1700, visas: 1640 },
  { month: "Dec", students: 1580, visas: 1510 },
  { month: "Jan", students: 1900, visas: 1820 },
  { month: "Feb", students: 2100, visas: 2050 },
  { month: "Mar", students: 2400, visas: 2340 },
  { month: "Apr", students: 2650, visas: 2590 },
  { month: "May", students: 2850, visas: 2790 },
  { month: "Jun", students: 3100, visas: 3050 },
];

const countryData = [
  { country: "Canada", count: 6800 },
  { country: "UK", count: 5200 },
  { country: "Australia", count: 4700 },
  { country: "Germany", count: 3900 },
  { country: "USA", count: 2800 },
  { country: "UAE", count: 1800 },
];

const COUNTRY_COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const KPI_CARDS = [
  { label: "Students Guided", value: "25,000+", delta: "+18% this year", icon: Users, color: "text-primary" },
  { label: "Universities Matched", value: "1,500+", delta: "+120 added", icon: GraduationCap, color: "text-indigo-500" },
  { label: "Visa Success Rate", value: "98.4%", delta: "Consistently maintained", icon: ShieldCheck, color: "text-emerald-500" },
  { label: "Applications Filed", value: "42,000+", delta: "+32% YoY growth", icon: TrendingUp, color: "text-violet-500" },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3.5 py-2.5 shadow-xl text-xs">
      <p className="font-bold text-foreground mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span>{p.name}:</span>
          <span className="font-bold text-foreground">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

export default function StatsChart() {
  return (
    <section className="py-24 sm:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Trusted by Thousands,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
              Growing Every Month
            </span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Real-time metrics from our platform — every number represents a student's journey toward their global future.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {KPI_CARDS.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <Icon className={`w-5 h-5 mb-3 ${kpi.color}`} />
                <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{kpi.value}</p>
                <p className="text-xs font-bold text-foreground/70 mt-1">{kpi.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.delta}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main area chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-foreground text-sm">Student Enrollments vs Visas Approved</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">July 2024 – June 2025</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-primary inline-block" />Students</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-violet-500 inline-block" />Visas</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradVisas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="students" name="Students" stroke="#3b82f6" strokeWidth={2} fill="url(#gradStudents)" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
                <Area type="monotone" dataKey="visas" name="Visas" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradVisas)" dot={false} activeDot={{ r: 4, fill: "#8b5cf6" }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Country bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="mb-6">
              <h3 className="font-black text-foreground text-sm">Top Destinations</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Students by country 2024–25</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={countryData} layout="vertical" margin={{ top: 0, right: 5, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="country" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={55} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Students" radius={[0, 6, 6, 0]} maxBarSize={18}>
                  {countryData.map((_, index) => (
                    <Cell key={index} fill={COUNTRY_COLORS[index % COUNTRY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
