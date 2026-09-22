import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AiCura Diagnostics | Health Checkups & Home Sample Collection",
  description: "NABL Compliant Lab with convenient home sample collection and personalized healthcare support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased text-slate-800 bg-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
