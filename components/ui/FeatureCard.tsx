"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  badge?: string;
  icon: LucideIcon;
  href?: string;
  index: number;
}

export default function FeatureCard({
  title,
  description,
  badge,
  icon: Icon,
  href,
  index,
}: FeatureCardProps) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return (
        <Link href={href} className="block h-full group">
          {children}
        </Link>
      );
    }
    return <div className="h-full group">{children}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="h-full"
    >
      <CardWrapper>
        <div className="bg-white h-full p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-6px_rgba(37,99,235,0.08)] hover:border-blue-100/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
          <div>
            {/* Icon Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Icon className="w-6 h-6" />
              </div>
              {badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-gray-50 border border-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                  {badge}
                </span>
              )}
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-500">
              {description}
            </p>
          </div>

          {href && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 mt-6 group-hover:gap-2.5 transition-all">
              <span>Try Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </CardWrapper>
    </motion.div>
  );
}
