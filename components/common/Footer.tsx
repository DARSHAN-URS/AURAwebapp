"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { NAV_LINKS } from "@/constants";

export default function Footer() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith("/dashboard")) {
    return null;
  }
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border text-muted-foreground pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="relative w-9 h-9 overflow-hidden rounded-lg border border-border shadow-sm bg-card flex items-center justify-center">
                <Image
                  src="/images/logo.jpeg"
                  alt="Aura Routes Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">
                Aura Routes <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground mt-2">
              Aura Routes AI | AI-Powered Global Career Partner | <a href="https://auraroutes.com" className="hover:text-primary transition-colors">auraroutes.com</a>
            </p>
            <div className="flex items-center gap-4 mt-3">
              <a href="#" className="p-2 rounded-full bg-card border border-border text-muted-text hover:text-primary hover:border-primary/20 shadow-sm transition-all duration-200" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-card border border-border text-muted-text hover:text-primary hover:border-primary/20 shadow-sm transition-all duration-200" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-card border border-border text-muted-text hover:text-primary hover:border-primary/20 shadow-sm transition-all duration-200" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-card border border-border text-muted-text hover:text-primary hover:border-primary/20 shadow-sm transition-all duration-200" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">Company</h3>
            <ul className="flex flex-col gap-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary hover:underline transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">Our Services</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/services#study-abroad" className="hover:text-primary hover:underline transition-all">
                  Study Abroad Consultancy
                </Link>
              </li>
              <li>
                <Link href="/services#mbbs-abroad" className="hover:text-primary hover:underline transition-all">
                  MBBS Abroad
                </Link>
              </li>
              <li>
                <Link href="/services#visa-assistance" className="hover:text-primary hover:underline transition-all">
                  Visa Assistance
                </Link>
              </li>
              <li>
                <Link href="/services#accommodation" className="hover:text-primary hover:underline transition-all">
                  Student Accommodation
                </Link>
              </li>
              <li>
                <Link href="/services#loans" className="hover:text-primary hover:underline transition-all">
                  Education Loans & Insurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">Contact Info</h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>WZ-69, 1st Floor, Om Vihar Phase-1, Near Aryan International School, Main Kabaddi Road, Uttam Nagar, New Delhi — 110059 (Near Uttam Nagar West Metro)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:info@auraroutes.com" className="hover:text-primary hover:underline transition-all">
                  info@auraroutes.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+919891263337" className="hover:text-primary hover:underline transition-all">
                  +91 98912 63337
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-text">
          <p>© {currentYear} Aura Routes AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-primary hover:underline transition-all">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary hover:underline transition-all">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
