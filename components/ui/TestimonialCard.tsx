"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  university: string;
  course: string;
  quote: string;
  rating: number;
  avatar: string;
  index: number;
}

export default function TestimonialCard({
  name,
  university,
  course,
  quote,
  rating,
  avatar,
  index,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="h-full"
    >
      <div className="bg-card h-full p-6 sm:p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg hover:border-primary/20/50 transition-all duration-300 flex flex-col justify-between select-none">
        <div>
          {/* Rating Stars Grid */}
          <div className="flex items-center gap-1 mb-6">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Testimonial Quote */}
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed font-semibold italic mb-8">
            "{quote}"
          </p>
        </div>

        {/* Profile Card Header */}
        <div className="flex items-center gap-3.5 pt-6 border-t border-gray-50 mt-auto">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shadow-sm shrink-0 bg-background">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div>
            <h4 className="font-extrabold text-foreground text-xs">{name}</h4>
            <p className="text-[10px] text-muted-text font-bold leading-tight mt-0.5">
              {course}
            </p>
            <p className="text-[9px] text-primary font-black tracking-wide uppercase mt-0.5">
              {university}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
