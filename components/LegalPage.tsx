import Link from "next/link";

export default function LegalPage({
  title,
  intro,
  updated = "19 October 2026",
  children,
}: {
  title: string;
  intro: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="aw-section aw-section--tight">
      <div className="aw-wrap">
        <div className="aw-legal">
          <div className="aw-legal__brand">
            <span className="aw-logo__mark" aria-hidden="true">
              A
            </span>
            <span className="aw-logo__word">
              <b>Aaron Works</b>
              <span>Find talent. Get work done.</span>
            </span>
            <span style={{ marginLeft: "auto" }} className="aw-pill">
              Kenya
            </span>
          </div>

          <p className="aw-crumbs" style={{ marginBottom: 16 }}>
            <Link href="/">Home</Link> <span>/</span> <span>Legal</span> <span>/</span>{" "}
            <span>{title}</span>
          </p>

          <h1>{title}</h1>
          <p className="aw-lead" style={{ marginBottom: 10 }}>
            {intro}
          </p>
          <p className="aw-legal__updated">Last updated: {updated}</p>

          {children}

          <div className="aw-panel" style={{ marginTop: 36 }}>
            <h3 style={{ marginTop: 0 }}>Questions about this policy?</h3>
            <p className="aw-small" style={{ marginBottom: 12 }}>
              Write to our Nairobi team at{" "}
              <a href="mailto:legal@aaronworks.co.ke" className="aw-link">
                legal@aaronworks.co.ke
              </a>{" "}
              or message +254 112 272 061 on WhatsApp. We respond within five
              working days.
            </p>
            <div className="aw-inline aw-gap-1 aw-wrapflex">
              <Link href="/legal/privacy-policy" className="aw-btn aw-btn--outline aw-btn--sm">
                Privacy policy
              </Link>
              <Link href="/legal/terms" className="aw-btn aw-btn--outline aw-btn--sm">
                Terms of service
              </Link>
              <Link href="/legal/cookie-policy" className="aw-btn aw-btn--outline aw-btn--sm">
                Cookie policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
