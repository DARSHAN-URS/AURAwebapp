"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";

interface CountryCardProps {
  name: string;
  code: string;
  tagline: string;
  fact: string;
  desc: string;
  bgClass: string;
  index: number;
}

export default function CountryCard({
  name,
  code,
  tagline,
  fact,
  desc,
  bgClass,
  index,
}: CountryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link href={`/universities?country=${name.toLowerCase()}`} className="group block h-full">
        <div className={`h-full bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_-6px_rgba(0,0,0,0.06)] hover:border-gray-200/80 transition-all duration-300 flex flex-col justify-between overflow-hidden relative min-h-[300px]`}>
          
          {/* Subtle Background Accent Gradient */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${bgClass} rounded-bl-full filter blur-xl opacity-80 group-hover:scale-125 transition-transform duration-300`} />
          
          {/* Huge faint country ISO code in background */}
          <div className="absolute right-6 bottom-4 text-7xl sm:text-8xl font-black text-gray-100/50 pointer-events-none select-none tracking-tight font-sans z-0 group-hover:scale-110 group-hover:text-blue-50/50 transition-all duration-300">
            {code}
          </div>

          <div className="relative z-10">
            {/* Header with destination badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl" role="img" aria-label={`${name} flag`}>
                {getFlagEmoji(code)}
              </span>
              <span className="font-extrabold text-lg text-gray-900">{name}</span>
            </div>

            {/* Tagline */}
            <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50/60 border border-blue-100/50 px-2.5 py-0.5 rounded-full mb-4">
              {tagline}
            </span>

            {/* Description */}
            <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-[90%]">
              {desc}
            </p>
          </div>

          {/* Fact and Footer link */}
          <div className="relative z-10 mt-auto pt-6 border-t border-gray-50 flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-gray-600 leading-tight">
                {fact}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all w-fit">
              <span>View Universities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}

// Helper function to return flag emoji
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
