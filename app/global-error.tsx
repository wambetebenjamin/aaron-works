"use client";

import { RefreshCw, MessageCircle } from "lucide-react";

/**
 * Root error boundary. `app/error.tsx` covers route segments; this file is the
 * last-resort 500 screen, so it must render its own <html>/<body> and cannot
 * rely on the root layout or the component layer being mounted.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const whatsapp =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254112272061";
  const message =
    "Hello Aaron Works, I would like to post a job or find a freelancer.";

  return (
    <html lang="en">
      <head>
        <title>Server error · Aaron Works</title>
        <meta name="robots" content="noindex" />
        <link rel="stylesheet" href="/template/style.css" />
        <link rel="stylesheet" href="/aw.css" />
      </head>
      <body className="realestate_version" style={{ margin: 0 }}>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 32,
            background: "#f6f8f0",
            fontFamily: '"Noto Sans", Helvetica, Arial, sans-serif',
            color: "#49524d",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 620 }}>
            <p
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#076799",
                marginBottom: 14,
              }}
            >
              500 · Something went wrong
            </p>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                lineHeight: 1.15,
                fontWeight: 700,
                color: "#1f1f1f",
                margin: "0 0 16px",
              }}
            >
              We hit a snag on our side.
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.8, margin: "0 0 26px" }}>
              The page could not be loaded. Try again — if it keeps happening, our
              Nairobi support team is one WhatsApp message away.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: 0,
                  borderRadius: 4,
                  padding: "13px 24px",
                  background: "#a8cf45",
                  color: "#1f2b0a",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <RefreshCw size={15} aria-hidden="true" />
                Try Again
              </button>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 4,
                  padding: "12px 22px",
                  border: "1px solid #076799",
                  color: "#076799",
                  background: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                <MessageCircle size={15} aria-hidden="true" />
                WhatsApp +254 112 272 061
              </a>
            </div>
            {error?.digest ? (
              <p style={{ fontSize: 12.5, color: "#6f7a73", marginTop: 22 }}>
                Reference: {error.digest}
              </p>
            ) : null}
            <p style={{ fontSize: 12.5, color: "#6f7a73", marginTop: 22 }}>
              <a href="/" style={{ color: "#076799" }}>
                Return to the homepage
              </a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
