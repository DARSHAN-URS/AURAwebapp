import React from "react";

export default function TermsPage() {
  const lastUpdated = "June 2026";

  return (
    <div className="bg-white pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Last Updated: {lastUpdated}
        </p>

        <div className="prose prose-blue max-w-none text-sm sm:text-base text-gray-600 flex flex-col gap-6 leading-relaxed">
          <p>
            Welcome to Aura Routes. By accessing our website, using our AI tools, or booking free/premium consultations, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">1. Use of AI Tools & Matchers</h2>
          <p>
            Our AI-powered tools, including the Eligibility Checker, University Matcher, and SOP Generator, are provided for informational and planning purposes only:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li><strong>No Guarantee:</strong> A high match score or eligibility projection does not guarantee university admission or student visa approval. Final decisions reside solely with the respective educational institutions and immigration authorities.</li>
            <li><strong>SOP Generation:</strong> The Statement of Purpose (SOP) generator compiles drafts based on the details you input. It is the user's responsibility to verify, edit, and review these drafts before submission to avoid plagiarism flags or misrepresentations.</li>
            <li><strong>Acceptable Use:</strong> You agree not to scrape, reverse-engineer, or attempt to exploit vulnerabilities in our AI engines or application pipelines.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">2. Accuracy of Submitted Information</h2>
          <p>
            You certify that all profiles, transcripts, test scores, work histories, and financial documents uploaded to the platform are 100% genuine and accurate. Aura Routes reserves the right to suspend accounts or terminate service if any details are flagged as forged, edited, or intentionally misleading.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">3. Limitation of Liability</h2>
          <p>
            Aura Routes serves as a direct matching and filing coordinator. Under no circumstances shall Aura Routes or its parent entity be liable for any direct, indirect, incidental, or consequential damages resulting from university rejections, visa declines, loan denials, or housing lease contract disputes.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">4. Third-Party Links & Partner Platforms</h2>
          <p>
            Our services integrate links to third-party scheduling software (Calendly), chat modules (WhatsApp), bank loan systems, and housing provider databases. We do not control or assume liability for the privacy practices, pricing, or terms of service of these external providers.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">5. Agreement Modifications</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Your continued usage of the website or scheduling tools following post updates represents explicit agreement to the modified guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
