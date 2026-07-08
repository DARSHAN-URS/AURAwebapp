import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { BookingProvider } from "@/components/common/BookingContext";
import { AuthProvider } from "@/components/common/AuthContext";
import { ThemeProvider } from "next-themes";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Aura Routes | AI-Powered Study Abroad & Immigration Platform",
  description: "Aura Routes uses advanced AI profile evaluation, university matching, SOP drafting, and direct visa processing to secure admissions at 1500+ top global universities.",
  keywords: [
    "Study Abroad AI",
    "University Matcher",
    "MBBS Abroad Admissions",
    "SOP Generator",
    "Student Visa Eligibility Checker",
    "Education Loans",
    "Student Accommodation",
    "Aura Routes Platform"
  ],
  icons: {
    icon: "/images/logo.jpeg",
    shortcut: "/images/logo.jpeg",
    apple: "/images/logo.jpeg",
  },
  openGraph: {
    title: "Aura Routes | AI-Powered Study Abroad & Immigration Platform",
    description: "Get matched with 1,500+ global universities, draft SOPs, and check visa success rates instantly with our proprietary student AI suite.",
    url: "https://auraroutes.com",
    siteName: "Aura Routes",
    images: [
      {
        url: "/images/logo.jpeg",
        width: 800,
        height: 600,
        alt: "Aura Routes - AI-Powered Study Abroad",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Routes | AI-Powered Study Abroad & Immigration Platform",
    description: "AI-driven profile builder, zero-commission matching, and end-to-end relocation services for international students.",
    images: ["/images/logo.jpeg"],
    creator: "@AuraRoutes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Aura Routes",
    "url": "https://auraroutes.com",
    "logo": "https://auraroutes.com/images/logo.jpeg",
    "description": "AI-Powered Study Abroad & Immigration Platform for international students.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "WZ-69, 1st Floor, Om Vihar Phase-1, Main Kabaddi Road",
      "addressLocality": "Uttam Nagar, New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110059",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98912-63337",
      "contactType": "customer service",
      "email": "info@auraroutes.com",
      "availableLanguage": ["en", "hi"]
    }
  };

  return (
    <html
      lang="en"
      className="h-full"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="aura-theme"
        >
          <AuthProvider>
            <BookingProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <WhatsAppButton />
            </BookingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
