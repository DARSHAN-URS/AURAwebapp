import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "FMGE AI", template: "%s | FMGE AI" },
  description: "AI-powered FMGE preparation platform — coming soon.",
};

export default function FMGELayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
