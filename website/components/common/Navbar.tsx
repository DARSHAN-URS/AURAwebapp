"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu, X, ArrowRight, Sparkles, GraduationCap,
  UserCheck, FileText, SearchCode, Award, Building2,
  Phone, BookOpen, BedDouble, CircleDollarSign, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useBooking } from "@/components/common/BookingContext";
import { useAuth } from "@/components/common/AuthContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─── Dropdown data ────────────────────────────────────────────────────────────

const SERVICES_ITEMS = [
  { title: "University & Course Discovery", href: "/universities", description: "1,500+ universities matched to your profile", icon: GraduationCap },
  { title: "NEET-to-MBBS Abroad", href: "/services#mbbs-abroad", description: "NMC & WHO-approved medical pathways", icon: BookOpen },
  { title: "Student Accommodation", href: "/services#accommodation", description: "1M+ verified beds near your campus", icon: BedDouble },
  { title: "Education Loans", href: "/services#loans", description: "Compare partner bank loan options", icon: CircleDollarSign },
];

const AI_ITEMS = [
  { title: "AI Eligibility Checker", href: "/eligibility", description: "Check visa & admission eligibility", icon: UserCheck },
  { title: "AI SOP Generator", href: "/sop", description: "Draft compelling Statements of Purpose", icon: FileText },
  { title: "AI Document Checker", href: "/visa-check", description: "Verify docs against country checklists", icon: SearchCode },
  { title: "AI Scholarship Finder", href: "/scholarships", description: "Discover funding for your profile", icon: Award },
];

// ─── Dropdown menu component ──────────────────────────────────────────────────

interface DropdownItem {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function NavDropdown({
  label,
  items,
  footerHref,
  footerLabel,
  isActive,
  headerExtra,
}: {
  label: string;
  items: DropdownItem[];
  footerHref: string;
  footerLabel: string;
  isActive?: boolean;
  headerExtra?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => {
          if (!ref.current?.contains(e.relatedTarget as Node)) {
            setTimeout(() => setOpen(false), 100);
          }
        }}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isActive ? "text-primary font-semibold" : "text-muted-foreground",
          open && "bg-accent text-accent-foreground"
        )}
        aria-expanded={open}
      >
        {label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-[520px] bg-popover border border-border rounded-2xl shadow-2xl shadow-black/20 p-4 z-50"
          >
            {headerExtra && (
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {label === "Services" ? "What We Offer" : "AI Student Suite"}
                </p>
                {headerExtra}
              </div>
            )}
            {!headerExtra && (
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1 mb-3">
                What We Offer
              </p>
            )}
            <ul className="grid grid-cols-2 gap-1">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition-colors group"
                    >
                      <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 pt-3 border-t border-border px-1">
              <Link
                href={footerHref}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:gap-2.5 transition-all"
              >
                {footerLabel}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Navbar ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openBooking } = useBooking();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinkClass = (href: string) =>
    cn(
      "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      isActive(href) ? "text-primary bg-primary/8 font-semibold" : "text-muted-foreground"
    );

  return (
    <>
      {/* ── Main Header ─────────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border/60 bg-background/95 backdrop-blur-xl shadow-sm"
            : "border-b border-transparent bg-background/80 backdrop-blur-md"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── Logo ─────────────────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-border shadow-xs bg-card flex items-center justify-center">
                <Image src="/images/logo.jpeg" alt="Aura Routes" width={32} height={32} priority className="object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  Aura <span className="text-primary">Routes</span>
                </span>
                <span className="text-[9px] text-muted-foreground font-medium tracking-wider uppercase">AI Study Abroad</span>
              </div>
            </Link>

            {/* ── Desktop Nav ──────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-0.5">
              <Link href="/" className={navLinkClass("/")}>Home</Link>
              <Link href="/about" className={navLinkClass("/about")}>About</Link>

              <NavDropdown
                label="Services"
                items={SERVICES_ITEMS}
                footerHref="/services"
                footerLabel="View all services"
                isActive={isActive("/services")}
              />

              <NavDropdown
                label="AI Tools"
                items={AI_ITEMS}
                footerHref="/ai-tools"
                footerLabel="Explore all AI tools"
                isActive={isActive("/ai-tools")}
              />

              <Link href="/universities" className={navLinkClass("/universities")}>Universities</Link>
              <Link href="/contact" className={navLinkClass("/contact")}>Contact</Link>
            </nav>

            {/* ── Desktop Right ────────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              <a href="tel:+919876543210" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                <Phone className="w-3.5 h-3.5" />
                Call Us
              </a>
              <ThemeToggle />
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="rounded-full h-9 text-xs font-bold cursor-pointer">
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={signOut} variant="ghost" className="text-xs font-bold rounded-full h-9 cursor-pointer">
                    Log Out
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="rounded-full h-9 text-xs font-bold cursor-pointer">
                    Log In
                  </Button>
                </Link>
              )}
              <Button
                onClick={openBooking}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 rounded-full h-9 text-xs shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
              >
                Book Free Consultation
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* ── Mobile Right ─────────────────────────────────────── */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Toggle navigation"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileOpen ? "x" : "menu"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute"
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile Drawer ────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-border bg-background/98 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1">

                {/* Main links */}
                {[
                  { label: "Home", href: "/" },
                  { label: "About", href: "/about" },
                  { label: "Services", href: "/services" },
                  { label: "Universities", href: "/universities" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive(link.href) ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* AI Tools section */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-3 mb-2">
                    AI Tools
                  </p>
                  <div className="space-y-0.5">
                    {AI_ITEMS.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{tool.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* CTA footer */}
                <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2.5">
                  {user ? (
                    <>
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full" variant="outline">Dashboard</Button>
                      </Link>
                      <Button onClick={() => { signOut(); setMobileOpen(false); }} className="w-full" variant="ghost">Log Out</Button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full" variant="outline">Log In / Sign Up</Button>
                    </Link>
                  )}
                  <Button
                    onClick={() => { openBooking(); setMobileOpen(false); }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full text-sm h-10 cursor-pointer flex items-center justify-center gap-2"
                  >
                    Book Free Consultation
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <a
                    href="tel:+919876543210"
                    className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Our Advisors
                  </a>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>
    </>
  );
}
