"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, CheckCircle2, ShieldCheck,
  Building2, Briefcase, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useBooking } from "@/components/common/BookingContext";

// Dynamic import — R3F cannot run on server
const HeroOrb = dynamic(() => import("@/components/three/HeroOrb"), {
  ssr: false,
  loading: () => null,
});

const FLOATING_CARDS = [
  {
    icon: Building2,
    title: "1,500+ Universities",
    sub: "Matched to your profile",
    iconBg: "bg-primary/15 text-blue-400",
    pos: "absolute top-6 right-2 sm:right-6",
    delay: 0,
  },
  {
    icon: CheckCircle2,
    title: "NEET-to-MBBS",
    sub: "NMC & WHO approved",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    pos: "absolute bottom-20 left-2 sm:left-4",
    delay: 1.5,
  },
  {
    icon: ShieldCheck,
    title: "98.4% Visa Success",
    sub: "AI-verified document audits",
    iconBg: "bg-indigo-500/15 text-indigo-400",
    pos: "absolute top-1/2 -translate-y-1/2 -left-2 sm:left-0",
    delay: 0.8,
  },
  {
    icon: Briefcase,
    title: "50+ Career Countries",
    sub: "Global jobs post-grad",
    iconBg: "bg-amber-500/15 text-amber-400",
    pos: "absolute bottom-8 right-2 sm:right-4",
    delay: 2,
  },
  {
    icon: MapPin,
    title: "1M+ Student Beds",
    sub: "Verified near campus",
    iconBg: "bg-rose-500/15 text-rose-400",
    pos: "absolute top-14 left-2 sm:left-6",
    delay: 1,
  },
];

const STATS = [
  { value: "25K+", label: "Students Guided" },
  { value: "1,500+", label: "Universities" },
  { value: "98.4%", label: "Visa Success" },
  { value: "1M+", label: "Student Beds" },
];

const floatAnim = (delay: number): any => ({
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: { duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay },
  },
});

export default function Hero() {
  const { openBooking } = useBooking();

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-background select-none">

      {/* Background grid */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full stroke-border/40 [mask-image:radial-gradient(80%_70%_at_center,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse" x="50%" y="-1">
              <path d="M.5 60V.5H60" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" strokeWidth="0" />
        </svg>
        {/* Dark radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(217,91%,60%,0.12),transparent)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">


            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[3.8rem] font-black text-foreground tracking-tight leading-[1.07] mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Intelligent Routes to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-violet-500">
                Global Careers
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mb-8 font-medium"
            >
              <span className="text-foreground block font-bold mb-2">AI-Powered Global Career Partner</span>
              Aura Routes AI brings university selection, admissions, accommodation, education loans, and global career opportunities together in one intelligent platform — built for Indian students and NRI families.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10"
            >
              <Button
                onClick={openBooking}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-200 text-sm flex items-center gap-2 cursor-pointer h-12"
              >
                Book Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Link href="/ai-tools" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground font-bold px-8 rounded-full transition-all duration-200 text-sm flex items-center justify-center gap-2 h-12 cursor-pointer"
                >
                  Explore AI Tools
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-8 border-t border-border w-full max-w-lg"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-black text-foreground">{s.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Hero Image + R3F Orb + Cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-[560px]">

            {/* R3F orb — full size, centered behind image */}
            <div className="absolute inset-0 z-0">
              <HeroOrb />
            </div>

            {/* Hero student photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-[320px] sm:w-[380px] h-[460px] rounded-3xl overflow-hidden shadow-2xl shadow-black/40 z-10 border border-border/50"
            >
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                alt="International students studying on university campus"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 320px, 380px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 via-transparent to-transparent" />

              {/* Social proof toast */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="bg-card/90 backdrop-blur-md rounded-2xl p-3.5 border border-border/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60"
                        alt="Student"
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-foreground">Sneha got into U of T 🎉</p>
                      <p className="text-[9px] text-muted-foreground font-medium">M.S. Computer Science · Canada</p>
                    </div>
                    <div className="ml-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 block animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating cards */}
            {FLOATING_CARDS.map((card, i) => {
              const Icon = card.icon;
              const anim = floatAnim(card.delay);
              return (
                <motion.div
                  key={i}
                  variants={anim}
                  initial="initial"
                  animate="animate"
                  className={`${card.pos} bg-card/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-border/60 flex items-center gap-3 z-20 max-w-[200px]`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[11px] text-foreground leading-tight">{card.title}</h4>
                    <p className="text-[9px] text-muted-foreground mt-0.5 leading-snug">{card.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
