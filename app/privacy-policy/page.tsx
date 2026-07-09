import React from "react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 2026";

  return (
    <div className="bg-card pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs font-semibold text-muted-text uppercase tracking-widest mb-8">
          Last Updated: {lastUpdated}
        </p>

        <div className="prose prose-blue max-w-none text-sm sm:text-base text-muted-foreground flex flex-col gap-6 leading-relaxed">
          <p>
            Welcome to Aura Routes AI. We value your privacy and are committed to protecting the personal data you share with us. This Privacy Policy details how we collect, process, secure, and utilize your profiling, contact, and academic credentials when using our AI tools and consultation services.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-6 mb-2">1. Information We Collect</h2>
          <p>
            We collect information that you explicitly submit on our platform. This includes:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li><strong>Contact details:</strong> Name, email address, telephone numbers, and communication details.</li>
            <li><strong>Academic credentials:</strong> GPA, transcript grades, language certification scores (IELTS/TOEFL/PTE), backlog histories, and major of interest.</li>
            <li><strong>Financial data:</strong> Annual budgets, sponsorship files, and education loan interest configurations.</li>
            <li><strong>Immigration info:</strong> Passport copies, visa refusal files, and country of interest coordinates.</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-6 mb-2">2. How We Utilize Your Data</h2>
          <p>
            We process your information exclusively to deliver study abroad matching, visa auditing, and accommodation booking lifecycle operations. Specifically, we:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>Run algorithmic profile matches against university database cut-offs.</li>
            <li>Draft custom Statement of Purpose (SOP) structures through generative AI templates.</li>
            <li>Facilitate education loan and verified accommodation partner linkages.</li>
            <li>Submit visa files to certified immigration portal gateways.</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-6 mb-2">3. Third-Party Sharing</h2>
          <p>
            Aura Routes AI does not sell, rent, or trade your personal credentials to third-party marketing entities. Your data is shared strictly with:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>Your selected target universities during direct applications submission.</li>
            <li>Our verified banking partners to process education loan applications you initiate.</li>
            <li>PBSA housing operators to process accommodation lease agreements you request.</li>
            <li>Authorized legal immigration partners assisting in student visa processing.</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-6 mb-2">4. Data Protection & Security</h2>
          <p>
            We implement industry-standard AES-256 encryption on all stored databases, alongside TLS secure socket layers for transmitting files. While we employ maximum technical protocols to protect your details, no network connection is 100% immune; you assume responsibility for securing your account portal passwords.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-6 mb-2">5. Your Legal Rights</h2>
          <p>
            Depending on your jurisdiction (such as GDPR, CCPA, or local state guidelines), you have the right to inspect, edit, restrict, or request complete deletion of the personal data we store. For any such queries, reach out directly to <a href="mailto:info@auraroutes.com" className="text-primary underline">info@auraroutes.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
