import React from "react";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalApplication",
    "name": "FMGE AI",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "AI-powered preparation platform for Foreign Medical Graduates preparing for NBE FMGE and NMC NExT licensing exams.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "14280"
    },
    "provider": {
      "@type": "Organization",
      "name": "Healthcare AI Suite",
      "url": "https://fmge.ai"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
