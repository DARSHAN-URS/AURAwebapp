"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/common/BookingContext";

const DESTINATIONS = [
  {
    country: "Canada",
    tagline: "Up to 3-Year PGWP",
    desc: "Renowned for its world-class universities and welcoming immigration pathways.",
    image: "https://images.unsplash.com/photo-1517090186835-e348b621c9ca?auto=format&fit=crop&q=80&w=800",
    badge: "Top Choice",
    badgeColor: "bg-red-500",
  },
  {
    country: "United Kingdom",
    tagline: "2-Year Graduate Visa",
    desc: "Steeped in academic prestige with fast-track master's degrees in just 1 year.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800",
    badge: "Trending",
    badgeColor: "bg-blue-500",
  },
  {
    country: "Australia",
    tagline: "Extended Post-Study Rights",
    desc: "Dynamic lifestyle, relaxed work rules, and highly regarded education system.",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=800",
    badge: "Popular",
    badgeColor: "bg-emerald-500",
  },
  {
    country: "Germany",
    tagline: "Zero Tuition Fees",
    desc: "Public universities charge €0 tuition — world-class engineering at minimal cost.",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800",
    badge: "Free Education",
    badgeColor: "bg-amber-500",
  },
  {
    country: "United States",
    tagline: "3-Year STEM OPT",
    desc: "Home to 8 of the global top 10 universities — the hub of innovation and research.",
    image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=800",
    badge: "Prestigious",
    badgeColor: "bg-indigo-500",
  },
  {
    country: "Dubai (UAE)",
    tagline: "Tax-Free Careers",
    desc: "Emerging global educational hub with fast visa processing and luxurious lifestyle.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
    badge: "NRI Favourite",
    badgeColor: "bg-yellow-500",
  },
];

export default function Countries() {
  const { openBooking } = useBooking();

  return (
    <section className="py-24 sm:py-32 bg-[#F8FAFC] border-t border-gray-100" id="destinations">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-[1.1]">
              Study in the World's{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Leading Hubs
              </span>
            </h2>
          </div>
          <Button
            onClick={openBooking}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-full text-xs flex items-center gap-2 cursor-pointer shrink-0 shadow-lg shadow-blue-600/20"
          >
            Get Country Guide
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Destination Cards — 3-col image grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest, i) => (
            <motion.div
              key={dest.country}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 cursor-pointer h-64 sm:h-72"
            >
              {/* Full bleed image */}
              <Image
                src={dest.image}
                alt={dest.country}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-600"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />


              {/* Content overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">{dest.tagline}</p>
                <h3 className="text-lg font-black text-white mb-1">{dest.country}</h3>
                <p className="text-[11px] text-gray-300 font-medium leading-snug hidden group-hover:block transition-all">
                  {dest.desc}
                </p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 mt-2 group-hover:gap-2 transition-all">
                  <span>Explore Pathway</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
