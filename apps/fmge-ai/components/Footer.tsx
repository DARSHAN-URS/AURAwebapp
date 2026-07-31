import React from "react";
import Link from "next/link";
import { Stethoscope, Mail, Phone, MapPin, Heart, Shield, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                FMGE <span className="text-teal-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier AI-driven preparation platform for Foreign Medical Graduates preparing for the NBE FMGE and NMC NExT licensing examinations in India.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-teal-400 bg-teal-950/60 border border-teal-800/80 px-3 py-1.5 rounded-full">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>NMC / NBE Syllabus Aligned</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1.5 rounded-full">
                <Award className="w-4 h-4 text-amber-400" />
                <span>89.4% Pass Success Rate</span>
              </div>
            </div>
          </div>

          {/* Col 2: Exam & Features */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Exam Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/qbank" className="hover:text-teal-400 transition-colors">15,000+ QBank</Link></li>
              <li><Link href="/mocks" className="hover:text-teal-400 transition-colors">300-Q NBE CBT Mocks</Link></li>
              <li><Link href="/ai-tutor" className="hover:text-teal-400 transition-colors">AI Clinical Tutor</Link></li>
              <li><Link href="/planner" className="hover:text-teal-400 transition-colors">AI Study Planner</Link></li>
              <li><Link href="/analytics" className="hover:text-teal-400 transition-colors">Weak Topic Radar</Link></li>
              <li><Link href="/syllabus" className="hover:text-teal-400 transition-colors">19 Subjects Syllabus</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources & Product */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Platform & Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-teal-400 transition-colors">About FMGE AI</Link></li>
              <li><Link href="/why-choose-us" className="hover:text-teal-400 transition-colors">Why Choose Us</Link></li>
              <li><Link href="/success-stories" className="hover:text-teal-400 transition-colors">Success Stories</Link></li>
              <li><Link href="/pricing" className="hover:text-teal-400 transition-colors">Pricing Plans</Link></li>
              <li><Link href="/blog" className="hover:text-teal-400 transition-colors">High-Yield Blog</Link></li>
              <li><Link href="/faq" className="hover:text-teal-400 transition-colors">FAQs & Support</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Legal & Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact Counselors</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-teal-400 transition-colors">Terms & Conditions</Link></li>
              <li className="pt-2 text-xs text-slate-500">
                Email: support@fmge.ai<br />
                WhatsApp: +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FMGE AI — Part of the Healthcare AI Suite. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Foreign Medical Graduates worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
