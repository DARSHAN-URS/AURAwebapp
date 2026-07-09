"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, ArrowRight, Sparkles, GraduationCap,
  UserCheck, FileText, SearchCode, Award, BookOpen, BedDouble,
  CircleDollarSign, ChevronDown, Globe2, Inbox, Settings, Phone,
  LayoutDashboard, LogOut, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useBooking } from "@/components/common/BookingContext";
import { useAuth } from "@/components/common/AuthContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─── Dropdown data ─────────────────────────────────────────────────────────────

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

// App nav links shown when logged in
const APP_NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explorer", href: "/explorer", icon: Globe2 },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "AI Tools", href: "/ai-tools", icon: Sparkles },
  { label: "Inbox", href: "/inbox", icon: Inbox },
];

// ─── Dropdown component ────────────────────────────────────────────────────────

interface DropdownItem {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function NavDropdown({
  label, items, footerHref, footerLabel, isActive,
}: {
  label: string;
  items: DropdownItem[];
  footerHref: string;
  footerLabel: string;
  isActive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
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
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1 mb-3">
              {label === "Services" ? "What We Offer" : "AI Student Suite"}
            </p>
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
                        <span className="text-xs font-bold text-foreground leading-tight group-hover:text-primary transition-colors block mb-0.5">
                          {item.title}
                        </span>
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
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openBooking } = useBooking();
  const { user, signOut } = useAuth();

  // Hide navbar entirely on dashboard & settings pages (they have their own sidebar)
  const shouldHide = pathname && (pathname.startsWith("/dashboard") || pathname.startsWith("/settings"));

  // Redirect logged-in users away from the landing page to dashboard
  useEffect(() => {
    if (shouldHide) return;
    if (user && pathname === "/") {
      router.replace("/dashboard");
    }
  }, [user, pathname, router]);

  useEffect(() => {
    if (shouldHide) return;
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (shouldHide) return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (shouldHide) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinkClass = (href: string) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      isActive(href) ? "text-primary bg-primary/8 font-semibold" : "text-muted-foreground"
    );

  return (
    <>
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

            {/* ── Logo — goes to dashboard if logged in, home if not ── */}
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="relative w-8 h-8 overflow-hidden rounded-lg border border-border shadow-xs bg-card flex items-center justify-center">
                <Image src="/images/logo.jpeg" alt="Aura Routes AI" width={32} height={32} priority className="object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  Aura Routes <span className="text-primary">AI</span>
                </span>
                <span className="text-[9px] text-muted-foreground font-medium tracking-wider uppercase">Intelligent Routes to Global Careers</span>
              </div>
            </Link>

            {/* ── Desktop Nav ────────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {user ? (
                /* ── LOGGED IN: clean app navigation ── */
                <>
                  {APP_NAV_LINKS.map(({ label, href, icon: Icon }) => (
                    <Link key={href} href={href} className={navLinkClass(href)}>
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </Link>
                  ))}
                </>
              ) : (
                /* ── LOGGED OUT: marketing navigation ── */
                <>
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
                  <Link href="/universities" className={navLinkClass("/universities")}>AI Matcher</Link>
                  <Link href="/explorer" className={navLinkClass("/explorer")}>
                    <Globe2 className="w-3.5 h-3.5" />
                    Explorer
                  </Link>
                  <Link href="/contact" className={navLinkClass("/contact")}>Contact</Link>
                </>
              )}
            </nav>

            {/* ── Desktop Right ──────────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              {user ? (
                /* ── LOGGED IN right side ── */
                <>
                  <ThemeToggle />
                  <Link href="/settings">
                    <Button variant="ghost" size="sm" className="rounded-full h-9 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer">
                      <User className="w-3.5 h-3.5" />
                      {user.email?.split("@")[0] ?? "Profile"}
                    </Button>
                  </Link>
                  <Button
                    onClick={signOut}
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-9 gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </Button>
                  <Link href="/dashboard">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 rounded-full h-9 text-xs shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-150 flex items-center gap-1.5 cursor-pointer">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                /* ── LOGGED OUT right side ── */
                <>
                  <a href="tel:+919891263337" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                    <Phone className="w-3.5 h-3.5" />
                    Call Us
                  </a>
                  <ThemeToggle />
                  <Link href="/login">
                    <Button variant="outline" className="rounded-full h-9 text-xs font-bold cursor-pointer">
                      Log In
                    </Button>
                  </Link>
                  <Button
                    onClick={openBooking}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 rounded-full h-9 text-xs shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
                  >
                    Book Free Consultation
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>

            {/* ── Mobile Right ───────────────────────────────────────── */}
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

        {/* ── Mobile Drawer ──────────────────────────────────────────── */}
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

                {user ? (
                  /* ── Mobile: LOGGED IN ── */
                  <>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-3 mb-1">
                      My Account
                    </p>
                    {APP_NAV_LINKS.map(({ label, href, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive(href) ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    ))}
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
                      <Button
                        onClick={() => { signOut(); setMobileOpen(false); }}
                        variant="ghost"
                        className="w-full justify-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </Button>
                    </div>
                  </>
                ) : (
                  /* ── Mobile: LOGGED OUT ── */
                  <>
                    {[
                      { label: "Home", href: "/" },
                      { label: "About", href: "/about" },
                      { label: "Services", href: "/services" },
                      { label: "AI Matcher", href: "/universities" },
                      { label: "Explorer", href: "/explorer" },
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

                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-3 mb-2">AI Tools</p>
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

                    <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2.5">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full" variant="outline">Log In / Sign Up</Button>
                      </Link>
                      <Button
                        onClick={() => { openBooking(); setMobileOpen(false); }}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full text-sm h-10 cursor-pointer flex items-center justify-center gap-2"
                      >
                        Book Free Consultation
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <a
                        href="tel:+919891263337"
                        className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call Our Advisors
                      </a>
                    </div>
                  </>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>
    </>
  );
}
