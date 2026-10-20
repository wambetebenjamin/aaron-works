"use client";

import Link from "next/link";
import { AlertTriangle, MessageCircle, RefreshCw } from "lucide-react";
import { BRAND } from "@/lib/seed";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="aw-state">
      <div className="aw-state__inner">
        <div className="aw-state__icon" aria-hidden="true">
          <AlertTriangle size={34} />
        </div>
        <p className="aw-eyebrow" style={{ justifyContent: "center" }}>
          500 · Something went wrong
        </p>
        <h1>We hit a snag on our side.</h1>
        <p>
          The page could not be loaded right now. Try again — if it keeps
          happening, our Nairobi support team is one WhatsApp message away.
        </p>
        <div className="aw-state__actions">
          <button type="button" className="aw-btn aw-btn--green" onClick={() => reset()}>
            <RefreshCw size={15} aria-hidden="true" />
            Try Again
          </button>
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
        {error?.digest ? (
          <p className="aw-small aw-mt-2">Reference: {error.digest}</p>
        ) : null}
        <p className="aw-small aw-mt-2">
          <Link href="/" className="aw-link">
            Return to the homepage
          </Link>
        </p>
      </div>
    </section>
  );
}
