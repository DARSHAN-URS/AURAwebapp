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
        <div className="bg-card h-full p-6 sm:p-8 rounded-2xl border border-border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-6px_rgba(37,99,235,0.08)] hover:border-primary/20/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
          <div>
            {/* Icon Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Icon className="w-6 h-6" />
              </div>
              {badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-background border border-border text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                  {badge}
                </span>
              )}
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {href && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-6 group-hover:gap-2.5 transition-all">
              <span>Try Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </CardWrapper>
    </motion.div>
  );
}
