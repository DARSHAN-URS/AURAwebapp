"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export default function SectionTitle({
  badge,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionTitleProps) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`max-w-3xl mb-12 sm:mb-16 ${isCenter ? "mx-auto text-center" : "text-left"} ${className}`}
    >
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 tracking-wide uppercase mb-3">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-gray-500 leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
