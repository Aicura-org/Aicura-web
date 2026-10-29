import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://aicuradiagnostics.com").replace(
  /\/+$/,
  ""
);

export const viewport: Viewport = {
  themeColor: "#0f3938",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AiCura Diagnostics | Health Checkups & Home Sample Collection",
    template: "%s",
  },
  description:
    "Certified Diagnostic Lab with convenient home sample collection, full body health checkup packages, and accurate digital reports across Kochi & Kerala.",
  keywords: [
    "AiCura Diagnostics",
    "diagnostic lab",
    "blood test home collection",
    "full body checkup",
    "health checkup packages",
    "pathology lab",
    "medical laboratory",
    "home blood sample collection",
  ],
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "AiCura Diagnostics",
    title: "AiCura Diagnostics | Health Checkups & Home Sample Collection",
    description:
      "Book diagnostic lab tests and preventive health packages online with doorstep home sample collection and fast digital reports.",
    url: siteUrl,
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "AiCura Diagnostics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AiCura Diagnostics | Health Checkups & Home Sample Collection",
    description:
      "Certified Diagnostic Lab with convenient home sample collection and personalized healthcare support.",
    images: ["/android-chrome-512x512.png"],
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AiCura Diagnostics",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "DiagnosticLab",
    name: "AiCura Diagnostics",
    url: siteUrl,
    logo: `${siteUrl}/android-chrome-512x512.png`,
    image: `${siteUrl}/android-chrome-512x512.png`,
    description:
      "Certified Diagnostic Lab offering full body health checkup packages, pathology blood testing, and doorstep home sample collection.",
    availableService: [
      {
        "@type": "MedicalTest",
        name: "Full Body Health Checkup Packages",
      },
      {
        "@type": "MedicalTest",
        name: "Doorstep Home Blood Sample Collection",
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased text-slate-800 bg-slate-50 min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
