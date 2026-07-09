"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe2, GraduationCap, BedDouble, CircleDollarSign, Briefcase, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SERVICES = [
  {
    id: "university-discovery",
    icon: GraduationCap,
    title: "University & Course Discovery",
    description: "Explore 1,500+ universities and 500,000+ courses worldwide, matched to your profile, budget, and goals.",
    href: "/universities",
    badge: "Core Service",
    iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600",
    imageAlt: "University campus building",
  },
  {
    id: "mbbs-abroad",
    icon: Sparkles,
    title: "NEET-to-MBBS Abroad",
    description: "Find NMC & WHO-approved medical universities based on your NEET score, budget, and country preference.",
    href: "/services#mbbs-abroad",
    badge: "Medical Track",
    iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600",
    imageAlt: "Medical students in classroom",
  },
  {
    id: "accommodation",
    icon: BedDouble,
    title: "Student Accommodation",
    description: "Browse and book from over 1 million verified student beds near your campus — safe and affordable.",
    href: "/services#accommodation",
    badge: "1M+ Beds",
    iconBg: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600",
    imageAlt: "Modern student accommodation room",
  },
  {
    id: "education-loans",
    icon: CircleDollarSign,
    title: "Education Loans",
    description: "Compare loan options from trusted banking partners — all in one place with zero hidden charges.",
    href: "/services#loans",
    badge: "Partner Banks",
    iconBg: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600",
    imageAlt: "Financial planning and loan documents",
  },
  {
    id: "global-careers",
    icon: Briefcase,
    title: "Global Career Opportunities",
    description: "Discover job vacancies across 50+ countries to plan your post-graduation career path.",
    href: "/services#careers",
    badge: "50+ Countries",
    iconBg: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600",
    imageAlt: "Professionals working in a global office",
  },
  {
    id: "ai-guidance",
    icon: Globe2,
    title: "AI-Powered Guidance",
    description: "Get instant answers and document checks at every stage — powered by intelligent AI, available 24/7.",
    href: "/ai-tools",
    badge: "AI Suite",
    iconBg: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=600",
    imageAlt: "AI technology interface",
  },
];

export default function Services() {
  return (
    <section className="py-24 sm:py-32 bg-white" id="services">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-[1.1] mb-4">
            Everything You Need,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              In One Place
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-medium">
            From your first university search to your arrival abroad — Aura Routes AI guides you through every step of your global journey.
          </p>
        </div>

        {/* Services Grid — image cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group"
              >
                <Link href={service.href}>
                  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                    
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-all duration-300 ${service.iconBg} border-current/20`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-gray-950 mb-2 group-hover:text-blue-600 transition-colors tracking-tight">
                          {service.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-5 group-hover:gap-2.5 transition-all">
                        Learn More
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
