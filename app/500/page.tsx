import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, MessageCircle, RefreshCw } from "lucide-react";
import { BRAND } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Server error",
  robots: { index: false, follow: false },
};

export default function ServerErrorPage() {
  return (
    <section className="aw-state">
      <div className="aw-state__inner">
        <div className="aw-state__icon" aria-hidden="true">
          <AlertTriangle size={34} />
        </div>
        <p className="aw-eyebrow" style={{ justifyContent: "center" }}>
          500 · Server error
        </p>
        <h1>Something went wrong at our end.</h1>
        <p>
          This is not you. Refresh the page or head back home. If the problem
          persists, message our Nairobi team on WhatsApp and we will look into it.
        </p>
        <div className="aw-state__actions">
          <Link href="/500" className="aw-btn aw-btn--green" prefetch={false}>
            <RefreshCw size={15} aria-hidden="true" />
            Try Again
          </Link>
          <a
            href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(BRAND.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="aw-btn aw-btn--outline"
          >
            <MessageCircle size={15} aria-hidden="true" />
            WhatsApp {BRAND.whatsappDisplay}
          </a>
        </div>
        <p className="aw-small aw-mt-2">
          <Link href="/" className="aw-link">
            Return to the homepage
          </Link>
        </p>
      </div>
    </section>
  );
}
