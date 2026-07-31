"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Stethoscope, Activity, ChevronDown, Check, Sparkles } from "lucide-react";

export type ProductType = "AURA" | "NURSEPASS" | "FMGE";

export interface ProductSwitcherProps {
  currentProduct?: ProductType;
}

export default function ProductSwitcher({ currentProduct }: ProductSwitcherProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-detect current product from path if not provided
  let activeProd: ProductType = currentProduct || "AURA";
  if (pathname.includes("/exams") || pathname.includes("/nursepass") || pathname.includes("/ai-features") || pathname.includes("/certificates")) {
    activeProd = "NURSEPASS";
  } else if (pathname.includes("/fmge")) {
    activeProd = "FMGE";
  }

  const products = [
    {
      id: "AURA",
      name: "Aura Routes",
      tagline: "Global Study Abroad & Visa Matcher",
      href: "/dashboard",
      icon: Compass,
      color: "text-teal-400"
    },
    {
      id: "NURSEPASS",
      name: "NursePass AI",
      tagline: "Nursing Licensing Prep (NCLEX, CBT, OET)",
      href: "/dashboard",
      icon: Stethoscope,
      color: "text-emerald-400"
    },
    {
      id: "FMGE",
      name: "FMGE AI",
      tagline: "Medical Licensing Exam AI Prep",
      href: "/dashboard",
      icon: Activity,
      color: "text-cyan-400"
    }
  ];

  const currentObj = products.find((p) => p.id === activeProd) || products[0];
  const IconComponent = currentObj.icon;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-200 text-xs font-extrabold flex items-center gap-2 transition-all"
      >
        <span className="flex items-center gap-1.5">
          <IconComponent className={`w-4 h-4 ${currentObj.color}`} />
          <span className="text-white">{currentObj.name}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2 mb-1">
            <span>HEALTHCARE AI SUITE</span>
            <Sparkles className="w-3 h-3 text-emerald-400" />
          </div>

          {products.map((p) => {
            const PIcon = p.icon;
            const isSelected = p.id === activeProd;
            return (
              <Link
                key={p.id}
                href={p.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-start justify-between p-2.5 rounded-xl transition-all ${
                  isSelected ? "bg-emerald-950/60 border border-emerald-800/60" : "hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <PIcon className={`w-4 h-4 mt-0.5 ${p.color}`} />
                  <div>
                    <div className="text-xs font-extrabold text-white">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{p.tagline}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
