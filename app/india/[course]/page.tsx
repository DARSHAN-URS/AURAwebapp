import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { 
  CheckCircle, Sparkles, BookOpen, AlertCircle, 
  HelpCircle, CircleDollarSign, GraduationCap, ArrowLeft
} from "lucide-react";
import CollegeMatcher from "@/components/india/CollegeMatcher";
import BookingButton from "@/components/india/BookingButton"; // We will create a small wrapper to keep page RSC

interface CourseData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroTag: string;
  heroDesc: string;
  eligibility: string[];
  process: string[];
  fees: {
    domestic: string;
    nri: string;
    international: string;
  };
  colleges: string[];
  faqs: { q: string; a: string }[];
}

const COURSE_DATA: Record<string, CourseData> = {
  mbbs: {
    title: "MBBS Admissions in India",
    metaTitle: "MBBS Admissions in India | NEET Score Card & NRI Quota Guides",
    metaDescription: "Secure medical seat admissions in India's top NMC approved government and private colleges. Check NEET cutoffs, eligibility limits, and direct NRI quotas.",
    heroTag: "🩺 Medical Pathways",
    heroDesc: "Study MBBS at elite medical colleges (AIIMS, CMC, Kasturba) with state-of-the-art hospitals, NMC-recognized degrees, and zero-commission consultancy guidance.",
    eligibility: [
      "Must have qualified NEET-UG entrance test with valid score card.",
      "Must have passed Class 12 with Physics, Chemistry, Biology (PCB) and English.",
      "Minimum 50% aggregate marks in PCB for General category (40% for reserved categories).",
      "Must be at least 17 years old by December 31st of the admission year."
    ],
    process: [
      "1. Register and qualify NEET-UG entrance examination.",
      "2. Participate in MCC (Medical Counselling Committee) central counselling or state-level counselling rounds.",
      "3. Select institutional choices and allocate preferences.",
      "4. Submit seat allocation logs and finalize admission with marksheets and certificate verifications."
    ],
    fees: {
      domestic: "₹1 Lakh - ₹25 Lakhs per year (Govt. vs. Private)",
      nri: "$18,000 - $25,000 USD per year",
      international: "$20,000 - $28,000 USD per year"
    },
    colleges: [
      "All India Institute of Medical Sciences (AIIMS), New Delhi",
      "Christian Medical College (CMC), Vellore",
      "Kasturba Medical College (KMC), Manipal",
      "Armed Forces Medical College (AFMC), Pune"
    ],
    faqs: [
      { q: "Is NEET qualified status mandatory for NRI quota medical seats?", a: "Yes. By Supreme Court order, NEET qualification is compulsory for all seats in all medical colleges in India, including NRI quota and management seats." },
      { q: "Can foreign nationals apply for MBBS in India?", a: "Yes. Foreign nationals can apply under the 15% institutional NRI/Foreign quota. They need to verify their Class 12 science equivalence certificates with AIU (Association of Indian Universities)." }
    ]
  },
  nursing: {
    title: "Nursing Admissions in India",
    metaTitle: "Nursing Admissions in India | B.Sc. & M.Sc. Nursing Pathways",
    metaDescription: "Discover premier nursing colleges in India. Learn about B.Sc. Nursing eligibility, top affiliated hospital networks, and fees structure guides.",
    heroTag: "🩹 Care & Health Pathways",
    heroDesc: "Build a global clinical career with recognized B.Sc. and M.Sc. Nursing degrees from AIIMS, CMC, and Apollo, linked directly with premium hospital systems.",
    eligibility: [
      "Class 12 pass from a recognized board with Physics, Chemistry, Biology, and English.",
      "Minimum 45% aggregate in science group subjects.",
      "Candidate must be medically fit.",
      "Common Entrance Tests (CET) or merit based depending on state parameters."
    ],
    process: [
      "1. Submit online applications to specific university channels or participate in state nursing counselling.",
      "2. Show Class 12 board marksheet verifying science group credentials.",
      "3. Allocate choice of nursing colleges during online allotment rounds.",
      "4. Undergo physical medical fit checks and complete admission steps."
    ],
    fees: {
      domestic: "₹50,000 - ₹2.5 Lakhs per year",
      nri: "$3,000 - $4,500 USD per year",
      international: "$3,500 - $5,000 USD per year"
    },
    colleges: [
      "AIIMS College of Nursing, New Delhi",
      "CMC College of Nursing, Vellore",
      "Apollo College of Nursing, Chennai",
      "Jamia Hamdard College of Nursing, New Delhi"
    ],
    faqs: [
      { q: "Are Indian nursing degrees valid globally?", a: "Yes. Degrees registered with the Indian Nursing Council (INC) are widely accepted worldwide, permitting candidates to sit for licensure tests like NCLEX-RN for US/Canada or CBT for the UK." },
      { q: "Is NEET required for B.Sc. Nursing admissions?", a: "For most colleges, NEET is not required, and admissions are based on Class 12 merit or state-level CETs. However, certain federal colleges (like AIIMS or JIPMER) run dedicated admission entrance exams." }
    ]
  },
  engineering: {
    title: "Engineering Admissions in India (B.Tech)",
    metaTitle: "Engineering Admissions in India | JEE Main, DASA & CIWG Quota Guide",
    metaDescription: "Apply for B.Tech programs in India's top engineering colleges. Learn about DASA quotas, CIWG fee structures, and admissions guides for NRIs.",
    heroTag: "⚙️ Engineering & Technology",
    heroDesc: "Enroll in premier engineering colleges (IITs, NITs, BITS) for computer science, robotics, or aerospace engineering. Check DASA/CIWG eligibility structures.",
    eligibility: [
      "Class 12 pass with Physics, Chemistry, Mathematics (PCM) and English.",
      "Minimum 75% aggregate in PCM for IIT/NIT entries (or top 20 percentile).",
      "For DASA/CIWG, must have completed classes 11 & 12 outside India.",
      "Must have a valid JEE Main or JEE Advanced score card."
    ],
    process: [
      "1. Appear for JEE Main or JEE Advanced examination.",
      "2. For DASA/CIWG candidates, register on the central DASA portal with JEE scores.",
      "3. Select institutional choices on the JoSAA / DASA counselling portal.",
      "4. Submit proof of NRI schooling certificates and secure allotments."
    ],
    fees: {
      domestic: "₹1.5 Lakhs - ₹5 Lakhs per year (Govt. vs. Private)",
      nri: "$8,000 - $10,000 USD per year (DASA Quota)",
      international: "$9,500 - $11,000 USD per year"
    },
    colleges: [
      "Indian Institute of Technology (IIT) Bombay, Mumbai",
      "National Institute of Technology (NIT) Trichy",
      "BITS Pilani, Pilani",
      "Delhi Technological University (DTU), Delhi"
    ],
    faqs: [
      { q: "What is the fee subsidy benefit for CIWG candidates?", a: "CIWG (Children of Indian Workers in Gulf) candidates pay a highly subsidized fee structure equivalent to domestic students (approx. ₹1.25 Lakhs / year), saving over 80% compared to standard DASA fees (~$8,000 USD)." },
      { q: "Can NRIs secure direct admission to IITs?", a: "No. Admission to IITs is strictly based on qualifying JEE Advanced. However, NRIs can use DASA quotas for direct admissions to premium NITs, IIITs, and government-funded institutes." }
    ]
  },
  management: {
    title: "Management Admissions in India (MBA/BBA)",
    metaTitle: "MBA & BBA Admissions in India | Top Business School Guides",
    metaDescription: "Study business management in India's top-ranked IIMs and elite business schools. Check CAT/GMAT score cutoffs and NRI quotas.",
    heroTag: "💼 Business & Management",
    heroDesc: "Join globally recognized MBA programs in India (IIM Ahmedabad, IIM Bangalore, SIBM) to target premium international roles in consulting and tech.",
    eligibility: [
      "Bachelor's degree with minimum 50% aggregate marks (or equivalent CGPA).",
      "For NRI/International, a valid GMAT or GRE score card is accepted in lieu of CAT.",
      "Freshers and experienced professionals are both eligible."
    ],
    process: [
      "1. Appear for CAT, GMAT, or GRE entrance tests.",
      "2. Register directly with IIMs under the GMAT quota or state MBA counselling channels.",
      "3. Shortlisted candidates are invited for Written Ability Tests (WAT) & Personal Interviews (PI).",
      "4. Final rankings are published based on composite scores."
    ],
    fees: {
      domestic: "₹10 Lakhs - ₹25 Lakhs (Total Program)",
      nri: "$30,000 - $35,000 USD (Total Program)",
      international: "$35,000 - $40,000 USD (Total Program)"
    },
    colleges: [
      "Indian Institute of Management (IIM) Ahmedabad",
      "IIM Bangalore",
      "Symbiosis Institute of Business Management (SIBM), Pune",
      "XLRI - Xavier School of Management, Jamshedpur"
    ],
    faqs: [
      { q: "Can NRIs apply to IIMs with GMAT scores?", a: "Yes. Most IIMs allow NRI and international applicants to submit GMAT scores (typically minimum 650+) instead of taking the domestic CAT exam." },
      { q: "What are the job placement statistics for top Indian B-schools?", a: "Top schools like IIMA and IIMB report 100% placement records, with average domestic packages exceeding ₹30 Lakhs per annum and international offers going over $100,000 USD." }
    ]
  }
};

// Generate static params for Next.js build caching
export async function generateStaticParams() {
  return [
    { course: "mbbs" },
    { course: "nursing" },
    { course: "engineering" },
    { course: "management" }
  ];
}

// Generate metadata dynamically for SEO
export async function generateMetadata({ params }: { params: Promise<{ course: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const courseKey = resolvedParams.course.toLowerCase();
  const data = COURSE_DATA[courseKey];
  
  if (!data) return {};

  return {
    title: `${data.metaTitle} | Aura Routes`,
    description: data.metaDescription,
    alternates: {
      canonical: `https://auraroutes.com/india/${courseKey}`
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://auraroutes.com/india/${courseKey}`,
      type: "website",
      images: [
        {
          url: "/images/logo.jpeg",
          width: 800,
          height: 600,
          alt: data.title
        }
      ]
    }
  };
}

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const resolvedParams = await params;
  const courseKey = resolvedParams.course.toLowerCase();
  const data = COURSE_DATA[courseKey];

  if (!data) {
    notFound();
  }

  // Schema markup for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": data.title,
    "description": data.metaDescription,
    "publisher": {
      "@type": "Organization",
      "name": "Aura Routes AI",
      "logo": "https://auraroutes.com/images/logo.jpeg"
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-16 sm:pb-20 border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/5 via-indigo-600/0 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center relative z-10">
          <Link href="/india" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Study in India Home</span>
          </Link>
          
          <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-4 py-1 text-xs font-bold text-primary mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>{data.heroTag}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            {data.title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
            {data.heroDesc}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Content (2 cols) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Eligibility */}
              <div className="bg-background border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
                <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>Admission Eligibility Criteria</span>
                </h3>
                <ul className="space-y-3">
                  {data.eligibility.map((el, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{el}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Admission Process */}
              <div className="bg-background border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
                <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>Admission Process Workflow</span>
                </h3>
                <ul className="space-y-4">
                  {data.process.map((pr, index) => (
                    <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed">
                      <span>{pr}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fee Structure */}
              <div className="bg-background border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
                <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>Estimated Fee Structure</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Domestic Students</span>
                    <p className="text-xs font-bold text-foreground mt-2">{data.fees.domestic}</p>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">NRI Quota / DASA</span>
                    <p className="text-xs font-extrabold text-primary mt-2">{data.fees.nri}</p>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">International</span>
                    <p className="text-xs font-bold text-foreground mt-2">{data.fees.international}</p>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-background border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
                <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="space-y-6">
                  {data.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-border/60 pb-6 last:border-b-0 last:pb-0">
                      <h4 className="font-extrabold text-foreground text-xs sm:text-sm flex items-start gap-2 leading-snug">
                        <HelpCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                        <span>{faq.q}</span>
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2 pl-6 font-medium">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sticky Sidebar (1 col) */}
            <div className="space-y-6 lg:sticky lg:top-24 h-fit">
              
              {/* Consultation CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/15 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
                <h3 className="text-lg font-extrabold mb-2 relative z-10">Free Admissions Counselling</h3>
                <p className="text-xs text-blue-100 leading-relaxed font-semibold mb-6 relative z-10">
                  Discuss NEET score qualification, JEE cutoffs, and seat booking timelines directly with an admissions director.
                </p>
                <BookingButton />
              </div>

              {/* Top Colleges */}
              <div className="bg-background border border-border p-6 rounded-3xl shadow-sm">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Top Verified Colleges</span>
                </h3>
                <ul className="space-y-3">
                  {data.colleges.map((college, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs font-bold text-foreground leading-snug">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{college}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Embedded Matcher Section */}
      <section className="py-20 sm:py-28 border-t border-border/50 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Match Your Scores & Profile</h2>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Input your budget, state filters, and score targets to query matched seats instantly.</p>
          </div>
          <CollegeMatcher initialCourse={resolvedParams.course.toUpperCase()} />
        </div>
      </section>

    </div>
  );
}
