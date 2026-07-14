import { 
  GraduationCap, 
  Stethoscope, 
  FileCheck, 
  Home as HomeIcon, 
  CircleDollarSign, 
  Briefcase, 
  UserCheck, 
  Search, 
  FileText, 
  SearchCode, 
  Award, 
  CheckSquare, 
  FileEdit, 
  MessageSquareCode,
  MapPin,
  Clock,
  Compass,
  FileBadge,
  PlaneTakeoff
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "AI Tools", href: "/ai-tools" },
  { label: "Universities", href: "/universities" },
  { label: "Contact", href: "/contact" },
];

export const TRUSTED_NUMBERS = [
  { value: "1,500+", label: "Universities", sub: "Global Partners" },
  { value: "500k+", label: "Courses", sub: "Undergrad & Postgrad" },
  { value: "1M+", label: "Student Beds", sub: "Secure Accommodations" },
  { value: "50+", label: "Countries", sub: "Global Destinations" },
];

export const SERVICES = [
  {
    id: "study-abroad",
    title: "Study Abroad Consultancy",
    description: "Get personalized guidance from expert mentors and our advanced AI to choose the perfect course and university aligned with your career aspirations.",
    icon: GraduationCap,
    slug: "/services#study-abroad",
  },
  {
    id: "mbbs-abroad",
    title: "MBBS Abroad Pathways",
    description: "Secure admissions in top NMC/WHO-approved medical universities across the globe with comprehensive guidance on licenses and eligibility.",
    icon: Stethoscope,
    slug: "/services#mbbs-abroad",
  },
  {
    id: "visa-assistance",
    title: "Visa Assistance",
    description: "Experience a hassle-free visa application process guided by AI checker systems and seasoned immigration legal advisors.",
    icon: FileCheck,
    slug: "/services#visa-assistance",
  },
  {
    id: "accommodation",
    title: "Student Accommodation",
    description: "Access a selection of safe, verified, and affordable student houses, PBSAs, and shared rentals close to your campus.",
    icon: HomeIcon,
    slug: "/services#accommodation",
  },
  {
    id: "loans",
    title: "Education Loans",
    description: "Get pre-approved education loans with competitive interest rates and minimal paperwork from our leading banking partners.",
    icon: CircleDollarSign,
    slug: "/services#loans",
  },
  {
    id: "career-support",
    title: "Career & Placement Support",
    description: "Avail pre-departure briefing, resume building workshops, mock interviews, and landing services to jumpstart your career abroad.",
    icon: Briefcase,
    slug: "/services#career-support",
  },
];

export const AI_FEATURES = [
  {
    title: "Eligibility Checker",
    description: "Evaluate your profile instantly against destination-specific immigration criteria and university cut-offs.",
    badge: "Free Tool",
    icon: UserCheck,
    href: "/eligibility",
  },
  {
    title: "University Matcher",
    description: "Find the best-fitting courses and universities based on your grades, budget, exam scores, and career goals.",
    badge: "Smart Match",
    icon: Search,
    href: "/ai-tools#matcher",
  },
  {
    title: "SOP Generator",
    description: "Draft compelling, highly personalized Statements of Purpose (SOPs) tailored to university guidelines using AI.",
    badge: "Premium",
    icon: FileText,
    href: "/sop",
  },
  {
    title: "Document Checker",
    description: "Upload and verify your transcripts, recommendation letters, and certificates against target admission requirements.",
    badge: "Advanced AI",
    icon: SearchCode,
    href: "/ai-tools#doc-checker",
  },
  {
    title: "Scholarship Finder",
    description: "Discover active institutional, governmental, and private scholarships matching your profile to minimize costs.",
    badge: "Updated Daily",
    icon: Award,
    href: "/ai-tools#scholarships",
  },
  {
    title: "Visa Eligibility Checker",
    description: "Calculate your visa success probability and get a customized checklist of required documents.",
    badge: "Highly Accurate",
    icon: CheckSquare,
    href: "/ai-tools#visa-checker",
  },
  {
    title: "Blog Generator",
    description: "Instantly research living expenses, housing guidelines, student visa procedures, and community insights.",
    badge: "Content Tool",
    icon: FileEdit,
    href: "/ai-tools#blog-gen",
  },
  {
    title: "AI Chat Assistant",
    description: "Have a real-time conversation with our AI-mentor to answer your doubts about studying abroad.",
    badge: "24/7 Support",
    icon: MessageSquareCode,
    href: "/ai-tools#chat",
  },
];

export const COUNTRIES = [
  {
    name: "Canada",
    code: "CA",
    tagline: "Co-op & PGWP Opportunities",
    fact: "Up to 3-year Post-Graduation Work Permits.",
    desc: "Renowned for its high-ranking universities, welcoming environment, and straightforward immigration path.",
    bgClass: "from-red-500/20 to-red-600/5",
  },
  {
    name: "United Kingdom",
    code: "GB",
    tagline: "2-Year Graduate Visa (PSW)",
    fact: "Fast-track master degrees (1 year duration).",
    desc: "Steeped in academic prestige with world-famous research institutions and rich historical hubs.",
    bgClass: "from-blue-500/20 to-blue-600/5",
  },
  {
    name: "United States",
    code: "US",
    tagline: "3-Year STEM OPT Extensions",
    fact: "Home to 8 of the global top 10 universities.",
    desc: "The global hub of innovation, research facilities, and diverse career prospects across industries.",
    bgClass: "from-indigo-500/20 to-indigo-600/5",
  },
  {
    name: "Australia",
    code: "AU",
    tagline: "Extended Post-Study Rights",
    fact: "High minimum wage & relaxed student work rules.",
    desc: "Dynamic lifestyle, highly regarded education structure, and extensive post-graduation work benefits.",
    bgClass: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    name: "Germany",
    code: "DE",
    tagline: "Zero Tuition Fees",
    fact: "Public universities charge €0 tuition fees.",
    desc: "Industrial powerhouse offering world-class engineering and technology courses, with high job prospects.",
    bgClass: "from-amber-500/20 to-amber-600/5",
  },
  {
    name: "Ireland",
    code: "IE",
    tagline: "Tech Capital of Europe",
    fact: "Headquarters to Google, Apple, Meta & Pfizer.",
    desc: "English-speaking European nation boasting highly innovative universities and top-tier job opportunities.",
    bgClass: "from-green-500/20 to-green-600/5",
  },
  {
    name: "New Zealand",
    code: "NZ",
    tagline: "High Quality of Life",
    fact: "100% support services for international students.",
    desc: "Stunning scenery, a peaceful society, and practical, industry-aligned higher education structures.",
    bgClass: "from-teal-500/20 to-teal-600/5",
  },
  {
    name: "Dubai (UAE)",
    code: "AE",
    tagline: "Tax-Free Careers & Fast Visas",
    fact: "99% visa approval rate & luxurious lifestyle.",
    desc: "Emerging modern global educational hub hosting top branch campuses with great tax-free career paths.",
    bgClass: "from-yellow-500/20 to-yellow-600/5",
  },
];

export const WHY_AURA_ROUTES = [
  {
    title: "AI-Powered Direct Audits",
    description: "Instead of traditional agents guessing your matches, our neural models audit your scores, backlogs, finances, and preferences directly against real-time university database schemas.",
  },
  {
    title: "100% Transparent Fee Structure",
    description: "Zero hidden charges, commissions, or forced partnerships. You pay only for what you choose—direct admissions pathways with complete transparency.",
  },
  {
    title: "Integrated Life-Cycle Support",
    description: "We don't stop at admissions. Aura Routes manages your education loans, verified housing near your campus, flight bookings, and post-study settlement assistance.",
  },
  {
    title: "AI Visa Pre-Refusal Checks",
    description: "Our AI document checker scans your SOP drafts and financial paperwork against embassy guidelines to identify potential gaps before submission.",
  },
];

export const STUDENT_JOURNEY = [
  {
    step: "01",
    title: "Profile Creation & Evaluation",
    description: "Input your academic details, language scores (IELTS/TOEFL/PTE), budgets, and target countries into our secure AI profile builder.",
    icon: UserCheck,
  },
  {
    step: "02",
    title: "AI Course & University Matching",
    description: "Our machine learning engine curates a customized list of best-fit programs, highlighting fee waivers, acceptance chances, and scholarship potential.",
    icon: Search,
  },
  {
    step: "03",
    title: "SOP Drafting & Document Verification",
    description: "Write compelling SOPs using our context-aware AI builder, while our algorithm scans your transcripts for admission requirements.",
    icon: FileBadge,
  },
  {
    step: "04",
    title: "Seamless Applications",
    description: "Submit applications to multiple universities simultaneously with a single unified form, managed by senior coordinators.",
    icon: Clock,
  },
  {
    step: "05",
    title: "Finance & Visa Approval",
    description: "Acquire pre-approved loans, pay tuition, and file your student visa under the direct supervision of certified visa legal experts.",
    icon: PlaneTakeoff,
  },
  {
    step: "06",
    title: "Pre-Departure & Accommodation Matching",
    description: "Join pre-departure networks, book verified housings near your college, buy student insurance, and land prepared for success.",
    icon: HomeIcon,
  },
];

export const TESTIMONIALS = [
  {
    name: "Sneha Patel",
    university: "University of Toronto, Canada",
    course: "M.S. in Computer Science",
    quote: "Aura Routes' University Matcher saved me weeks of manual search. The AI correctly identified that my profile was strong enough for U of T and predicted a 90% match score. I got in with a partial scholarship!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
  },
  {
    name: "Aman Sharma",
    university: "Trinity College Dublin, Ireland",
    course: "MSc in Finance",
    quote: "The SOP Generator and Document Checker are unmatched. It pointed out missing parameters in my recommendation letters that would have definitely delayed my application. Highly recommend this tech-first approach.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
  },
  {
    name: "Sarah Jenkins",
    university: "King's College London, UK",
    course: "BSc in Business Administration",
    quote: "The integrated loan and accommodation booking made moving to London stress-free. I had a verified student bed booked and my loan approved within 10 days of getting my university offer letter.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
  },
  {
    name: "Vikram Malhotra",
    university: "LMU Munich, Germany",
    course: "M.Sc. in Data Science",
    quote: "Securing tuition-free education in Germany seemed complex, but Aura Routes laid out every step clearly. The timeline tracker kept my documents synchronized and got my visa approved in record time.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
  },
];

export const FAQS = [
  {
    question: "How does the AI University Matcher work?",
    answer: "Our AI analysis tool takes into account your academic GPA, standardized test scores (GRE/GMAT), English language proficiency scores (IELTS/TOEFL/PTE), budgetary limits, work experience, and personal preferences. It cross-references this data with thousands of active programs globally to predict admission probabilities and recommend the most suitable courses.",
  },
  {
    question: "Are your AI tools free to use?",
    answer: "Yes, our core AI matching, eligibility checklists, and basic SOP outline generator are 100% free for students to explore. Premium verification, direct visa filing assistance, and deep-dive consulting options are available with fully transparent custom pricing.",
  },
  {
    question: "Do you assist with education loans and visas?",
    answer: "Absolutely. Aura Routes is a full-lifecycle platform. We have partnerships with top banks and financial institutions to secure low-interest education loans. Additionally, our dedicated visa legal team uses custom checklists to ensure your visa files are error-free.",
  },
  {
    question: "What is MBBS Abroad, and how does Aura Routes support it?",
    answer: "We offer special admission pathways for medical students (MBBS) to NMC and WHO-approved universities in countries like Georgia, Kazakhstan, Egypt, etc. We handle the university applications, MCI eligibility check, translation, legalizations, and provide guide courses for standard licensure exams.",
  },
  {
    question: "How do I book student housing through the platform?",
    answer: "Once you receive your university offer letter, our accommodation finder filters verified PBSAs (Purpose-Built Student Accommodations) and shared apartments close to your campus. You can compare rates, amenities, and execute bookings directly via our dashboard.",
  },
  {
    question: "How can I book a personal consultation?",
    answer: "You can click on any 'Book Consultation' button across our platform to launch the Calendly scheduler, which allows you to book a free 1-on-1 slot with a senior study abroad advisor.",
  },
];
