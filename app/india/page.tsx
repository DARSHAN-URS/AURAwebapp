"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  GraduationCap, Sparkles, Phone, Compass, BookOpen, 
  MapPin, CheckCircle, ChevronRight, HelpCircle, 
  Mail, MessageSquare, Building2, School, Globe, ArrowRight,
  TrendingUp, CircleDollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CollegeMatcher from "@/components/india/CollegeMatcher";
import { useBooking } from "@/components/common/BookingContext";

// Translation / Language Content Architecture ready for French
const CONTENT = {
  en: {
    heroTag: "🇮🇳 Elevate Your Future in India",
    heroTitle: "Study in India's Elite Institutions",
    heroSubtitle: "Get matched with top-tier IITs, IIMs, medical universities, and private colleges. Check NRI quotas, DASA eligibility, and secure admissions with Aura AI.",
    btnConsult: "Book Free Consultation",
    btnMatcher: "Try AI Matcher",
    whyIndiaTitle: "Why Choose India for Higher Education?",
    whyIndiaSubtitle: "A powerhouse of academic excellence, innovation, and high-ROI education.",
    whyIndia1Title: "Top-Tier Institutions",
    whyIndia1Desc: "Home to globally ranked institutions like IITs, IIMs, AIIMS, and BITS, famous for rigorous training and strong career prospects.",
    whyIndia2Title: "DASA & CIWG Schemes",
    whyIndia2Desc: "Special quotas for NRI, OCI, and foreign students to secure seats in prestigious government engineering colleges at highly subsidized fee structures.",
    whyIndia3Title: "Stellar ROI & Affordability",
    whyIndia3Desc: "A fraction of the cost of UK/USA education, combined with cutting-edge laboratories, tech hubs, and multi-national placements.",
    whyIndia4Title: "Vibrant Culture & English Medium",
    whyIndia4Desc: "All professional courses are taught entirely in English. Experience rich diversity, historical heritage, and an welcoming international student ecosystem.",
    coursesTitle: "Popular Pathways & Courses",
    coursesSubtitle: "Click to explore admission criteria, DASA quotas, structures and seat matrices.",
    matcherTitle: "AI College Seat Matcher",
    matcherSubtitle: "Analyze your score, state preferences, budget and quota category (DASA/CIWG/NRI) to fetch instant matches from our verified Indian college database.",
    nriTitle: "NRI & International Admissions Guide",
    nriSubtitle: "Learn about special quotas, application processes, and entry channels for overseas candidates.",
    comparisonTitle: "Global Tuition Fee Comparison",
    comparisonSubtitle: "India offers world-class professional training at unmatched affordability.",
    contactTitle: "Get in Touch with our India Advisors",
    contactSubtitle: "Have questions about NEET thresholds, DASA registrations, or visa steps? Speak with our team.",
  },
  fr: {
    heroTag: "🇮🇳 Élevez Votre Avenir en Inde",
    heroTitle: "Étudiez dans les Institutions d'Élite de l'Inde",
    heroSubtitle: "Associez-vous aux meilleurs IIT, IIM, universités médicales et collèges privés. Vérifiez les quotas NRI, l'éligibilité DASA et sécurisez vos admissions avec Aura AI.",
    btnConsult: "Réserver une Consultation Gratuite",
    btnMatcher: "Essayer l'AI Matcher",
    whyIndiaTitle: "Pourquoi Choisir l'Inde pour l'Enseignement Supérieur?",
    whyIndiaSubtitle: "Un pôle d'excellence académique, d'innovation et d'enseignement à ROI élevé.",
    whyIndia1Title: "Institutions de Premier Plan",
    whyIndia1Desc: "Foyer d'institutions classées mondialement comme les IIT, IIM, AIIMS et BITS, réputées pour leur formation rigoureuse et leurs solides perspectives de carrière.",
    whyIndia2Title: "Programmes DASA & CIWG",
    whyIndia2Desc: "Quotas spéciaux pour les étudiants NRI, OCI et étrangers pour obtenir des places dans de prestigieux collèges d'ingénieurs publics à des frais très subventionnés.",
    whyIndia3Title: "Excellent ROI & Abordabilité",
    whyIndia3Desc: "Une fraction du coût de l'éducation au Royaume-Uni/aux États-Unis, combinée à des laboratoires de pointe, des pôles technologiques et des placements multinationaux.",
    whyIndia4Title: "Culture Vibrante & Cours en Anglais",
    whyIndia4Desc: "Tous les cours professionnels sont enseignés entièrement en anglais. Découvrez une riche diversité, un patrimoine historique et un écosystème accueillant pour les étudiants internationaux.",
    coursesTitle: "Voies Populaires & Cours",
    coursesSubtitle: "Cliquez pour explorer les critères d'admission, les quotas DASA, les structures et les matrices de places.",
    matcherTitle: "AI College Seat Matcher",
    matcherSubtitle: "Analysez votre score, vos préférences d'État, votre budget et votre catégorie de quota (DASA/CIWG/NRI) pour obtenir des correspondances instantanées.",
    nriTitle: "Guide d'Admission pour les NRI et Internationaux",
    nriSubtitle: "Découvrez les quotas spéciaux, les processus de candidature et les canaux d'entrée pour les candidats d'outre-mer.",
    comparisonTitle: "Comparaison Mondiale des Frais de Scolarité",
    comparisonSubtitle: "L'Inde propose une formation professionnelle de classe mondiale à un coût inégalé.",
    contactTitle: "Contactez nos Conseillers pour l'Inde",
    contactSubtitle: "Des questions sur les seuils NEET, les inscriptions DASA ou les étapes de visa? Parlez à notre équipe.",
  }
};

export default function StudyInIndiaLanding() {
  const [locale] = useState<"en" | "fr">("en"); // French architecture ready, default to English
  const t = CONTENT[locale];
  const { openBooking } = useBooking();

  const courses = [
    { name: "MBBS", slug: "mbbs", desc: "NMC-approved medical colleges with state-of-the-art hospitals.", icon: GraduationCap, color: "from-red-500/20 to-orange-500/20 text-red-500" },
    { name: "Nursing", slug: "nursing", desc: "Top B.Sc. & M.Sc. nursing institutes linked with premium hospital networks.", icon: Compass, color: "from-blue-500/20 to-teal-500/20 text-blue-500" },
    { name: "Engineering", slug: "engineering", desc: "Elite B.Tech programs in computer science, electronics, and mechanical engineering.", icon: Building2, color: "from-indigo-500/20 to-purple-500/20 text-indigo-500" },
    { name: "Management", slug: "management", desc: "High-ranked MBA programs with premium consulting and product placements.", icon: BookOpen, color: "from-amber-500/20 to-orange-500/20 text-amber-500" },
  ];

  const faqs = [
    { q: "What are DASA and CIWG schemes?", a: "DASA (Direct Admission of Students Abroad) and CIWG (Children of Indian Workers in Gulf) are programs by the Govt. of India to allot 15% supernumerary seats in premier NITs, IIITs, and SPAs to NRI, OCI, and foreign nationals. CIWG offers a highly subsidized tuition fee structure equivalent to domestic Indian students." },
    { q: "Is NEET mandatory for NRI MBBS admissions in India?", a: "Yes, qualifying the National Eligibility cum Entrance Test (NEET-UG) is legally mandatory for all students (domestic, NRI, OCI, and foreign nationals) seeking admission to any medical college in India, including AIIMS and private institutions." },
    { q: "How does the AI Document Checker evaluate Indian certificates?", a: "Our AI document checker has specialized rules loaded for India that parse Class 10 & 12 board marksheets (CBSE, ICSE, State Boards), verify science group PCB/PCM marks percentages, check passport dates, and analyze NRI sponsor documents for validity." },
    { q: "Can international students work in India post-graduation?", a: "International students generally need to convert their Student Visa to a Business or Employment Visa after securing a placement. Aura Routes partners with top recruiters to guide students through placement cycles." }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-36 pb-20 sm:pb-28 border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/5 via-indigo-600/0 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-4 py-1 text-xs font-bold text-primary mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>{t.heroTag}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-6 text-foreground max-w-4xl mx-auto"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 font-medium"
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              onClick={openBooking}
              className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full px-8 py-4 h-11 flex items-center gap-1.5 shadow-lg shadow-primary/25 cursor-pointer"
            >
              <span>{t.btnConsult}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <a href="#matcher">
              <Button variant="outline" className="rounded-full px-8 h-11 text-xs font-bold cursor-pointer">
                {t.btnMatcher}
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. OVERVIEW & WHY INDIA */}
      <section className="py-20 sm:py-28 bg-card relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t.whyIndiaTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
              {t.whyIndiaSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t.whyIndia1Title, desc: t.whyIndia1Desc, icon: School },
              { title: t.whyIndia2Title, desc: t.whyIndia2Desc, icon: Globe },
              { title: t.whyIndia3Title, desc: t.whyIndia3Desc, icon: CircleDollarSign },
              { title: t.whyIndia4Title, desc: t.whyIndia4Desc, icon: Compass },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-background border border-border p-6 rounded-2xl flex flex-col items-start shadow-[0_4px_20px_-4px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-foreground text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. POPULAR COURSES */}
      <section className="py-20 sm:py-28 border-y border-border/50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t.coursesTitle}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {t.coursesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, idx) => {
              const Icon = course.icon;
              return (
                <Link key={idx} href={`/india/${course.slug}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${course.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-extrabold text-foreground text-lg mb-2">{course.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-6">
                        {course.desc}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group">
                      <span>Explore Pathway</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. AI COLLEGE MATCHER */}
      <section id="matcher" className="py-20 sm:py-28 bg-card relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t.matcherTitle}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {t.matcherSubtitle}
            </p>
          </div>

          <CollegeMatcher />
        </div>
      </section>

      {/* 5. NRI / INTERNATIONAL STUDENT GUIDE */}
      <section className="py-20 sm:py-28 border-y border-border/50 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t.nriTitle}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {t.nriSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-extrabold text-foreground text-lg mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>Understanding DASA & CIWG</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium mb-4">
                The **DASA Scheme** enables foreign nationals and NRI students to secure engineering, architecture, and planning admissions at premier NITs, IIITs, and SPAs based on JEE Main scores or high school marks.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                The **CIWG Quota** allocates one-third of the 15% DASA supernumerary seats to kids of Indian workers in Gulf countries. These candidates pay domestic tuition fees (approx. ₹1.25 Lakhs per year) instead of standard DASA fees (~$8,000 USD).
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-extrabold text-foreground text-lg mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>15% Institutional NRI Quotas</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium mb-4">
                Almost all top private and state universities in India allocate up to **15% of seats under the NRI quota**. This route is ideal for students who want direct entry into medical, nursing, engineering, or business schools without going through standard competitive domestic counselling.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                Applicants must provide an NRI sponsor declaration proving relationship links, sponsor passport/visa scans, and proof of international funds transfer to qualify.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TUITION FEE COMPARISON */}
      <section className="py-20 sm:py-28 bg-card border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t.comparisonTitle}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {t.comparisonSubtitle}
            </p>
          </div>

          <div className="overflow-hidden border border-border rounded-3xl bg-background shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/5 border-b border-border">
                  <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Country</th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Est. Annual Tuition (MBBS/Eng)</th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Living Cost / Year</th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground">Total Budget Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs font-bold text-foreground">
                <tr>
                  <td className="px-6 py-4 flex items-center gap-2">🇺🇸 USA</td>
                  <td className="px-6 py-4">$45,000 - $60,000 USD</td>
                  <td className="px-6 py-4">$18,000 - $22,000 USD</td>
                  <td className="px-6 py-4 text-rose-500 font-extrabold">High ($65,000+)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 flex items-center gap-2">🇬🇧 UK</td>
                  <td className="px-6 py-4">£28,000 - £42,000 GBP</td>
                  <td className="px-6 py-4">£12,000 - £15,000 GBP</td>
                  <td className="px-6 py-4 text-rose-500 font-extrabold">High ($50,000+)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 flex items-center gap-2">🇦🇺 Australia</td>
                  <td className="px-6 py-4">$35,000 - $48,000 AUD</td>
                  <td className="px-6 py-4">$21,000 - $25,000 AUD</td>
                  <td className="px-6 py-4 text-rose-500 font-extrabold">High ($40,000+)</td>
                </tr>
                <tr className="bg-emerald-500/5">
                  <td className="px-6 py-4 flex items-center gap-2 font-black text-emerald-600 dark:text-emerald-400">🇮🇳 India (Aura Routes Matches)</td>
                  <td className="px-6 py-4 font-black text-emerald-600 dark:text-emerald-400">$3,000 - $18,000 USD</td>
                  <td className="px-6 py-4 font-black text-emerald-600 dark:text-emerald-400">$2,000 - $4,000 USD</td>
                  <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-black">Ultra Affordable (Save up to 75%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. WHATSAPP FLOATING CTA SECTION */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-xl font-extrabold">Connect Directly via WhatsApp</h3>
            <p className="text-xs text-emerald-100 font-semibold mt-1">Get immediate answers from our senior counsellors on course seat availability.</p>
          </div>
          <a href="https://wa.me/919891263337" target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-black rounded-full px-8 py-3.5 shadow-lg flex items-center gap-1.5 cursor-pointer">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </Button>
          </a>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 sm:py-28 bg-card border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-background border border-border p-6 rounded-2xl">
                <h4 className="font-extrabold text-foreground text-sm flex items-start gap-2.5 leading-snug">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed font-semibold pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION */}
      <section className="py-20 sm:py-28 bg-background relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t.contactTitle}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {t.contactSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-foreground text-sm mb-1">Call Advisor</h4>
              <p className="text-xs text-muted-foreground font-semibold mb-4">+91-98912-63337</p>
              <a href="tel:+919891263337">
                <Button variant="outline" size="sm" className="rounded-full text-xs font-bold w-full cursor-pointer">Call Now</Button>
              </a>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-foreground text-sm mb-1">Email Queries</h4>
              <p className="text-xs text-muted-foreground font-semibold mb-4">info@auraroutes.com</p>
              <a href="mailto:info@auraroutes.com">
                <Button variant="outline" size="sm" className="rounded-full text-xs font-bold w-full cursor-pointer">Email Now</Button>
              </a>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-foreground text-sm mb-1">Consultation Call</h4>
              <p className="text-xs text-muted-foreground font-semibold mb-4">Free Mentoring Session</p>
              <Button onClick={openBooking} variant="outline" size="sm" className="rounded-full text-xs font-bold w-full cursor-pointer">Book Slot</Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
