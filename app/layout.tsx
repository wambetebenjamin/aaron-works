import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Preloader from "@/components/Preloader";
import CookieConsent from "@/components/CookieConsent";
import AppProviders from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BRAND } from "@/lib/seed";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: "Aaron Works — Find talent. Get work done.",
    template: "%s · Aaron Works",
  },
  description:
    "Aaron Works connects East African businesses with verified freelancers across design, tech, writing, video, data and more. Secure escrow, dispute resolution and Kenya-based support.",
  keywords: [
    "freelancers Kenya",
    "hire freelancer Nairobi",
    "East Africa freelance marketplace",
    "post a job Kenya",
    "graphic designer Kenya",
    "web developer Nairobi",
  ],
  authors: [{ name: BRAND.name }],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    title: "Aaron Works — Find talent. Get work done.",
    description:
      "A Kenyan freelancer marketplace connecting East African businesses with skilled, verified freelancers.",
    images: [{ url: "/images/hero-freelancer.jpg", width: 500, height: 750, alt: "Freelancer working on a laptop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaron Works — Find talent. Get work done.",
    description:
      "Hire verified freelancers across design, tech, writing and more. Secure escrow, Kenya-based support.",
    images: ["/images/hero-freelancer.jpg"],
  },
  icons: {
    icon: [{ url: "/template/images/favicon.ico" }],
    apple: [{ url: "/template/images/apple-touch-icon.png" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#a8cf45",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: BRAND.siteUrl,
    description:
      "Freelancer marketplace connecting East African businesses with skilled freelancers across design, tech, writing, video, data and consulting.",
    areaServed: ["KE", "UG", "TZ", "RW"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+${BRAND.whatsapp}`,
        contactType: "customer support",
        areaServed: "KE",
        availableLanguage: ["English", "Swahili"],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Template stylesheet is served verbatim from /public/template so its
            relative @imports and font paths keep working. Order is deliberate:
            template first, Aaron Works layer second. */}
        <link rel="stylesheet" href="/template/style.css" />
        <link rel="stylesheet" href="/aw.css" />
      </head>
      <body className="realestate_version">
        <a href="#main" className="aw-skip">
          Skip to content
        </a>
        <Preloader />
        <AppProviders>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </AppProviders>
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
