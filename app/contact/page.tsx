import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Mail, MapPin, MessageCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { BRAND } from "@/lib/seed";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact support",
  description:
    "Talk to the Aaron Works team in Nairobi about posting a job, hiring talent or a contract in progress.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="aw-pagehead">
        <div className="aw-wrap">
          <nav className="aw-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </nav>
          <h1>Talk to a real person in Nairobi</h1>
          <p>
            Questions about escrow, a proposal or a contract in progress? Our team
            answers Monday to Saturday, 8am–6pm EAT.
          </p>
        </div>
      </section>

      <section className="aw-section aw-section--tight">
        <div className="aw-wrap">
          <div className="aw-detail">
            <ContactForm />

            <aside className="aw-sidebar">
              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>Support details</h2>
                <ul className="aw-facts">
                  <li>
                    <span>
                      <MessageCircle size={13} aria-hidden="true" /> WhatsApp
                    </span>
                    <strong>
                      <a
                        href={whatsappLink(BRAND.whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aw-link"
                      >
                        {BRAND.whatsappDisplay}
                      </a>
                    </strong>
                  </li>
                  <li>
                    <span>
                      <Mail size={13} aria-hidden="true" /> Email
                    </span>
                    <strong>
                      <a href={`mailto:${BRAND.email}`} className="aw-link">
                        {BRAND.email}
                      </a>
                    </strong>
                  </li>
                  <li>
                    <span>
                      <MapPin size={13} aria-hidden="true" /> Office
                    </span>
                    <strong>Westlands, Nairobi</strong>
                  </li>
                  <li>
                    <span>
                      <Clock3 size={13} aria-hidden="true" /> Hours
                    </span>
                    <strong>Mon–Sat, 8am–6pm EAT</strong>
                  </li>
                </ul>
              </div>

              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>Response times</h2>
                <p className="aw-small">
                  WhatsApp: usually within 30 minutes. Email: within one working
                  day. Disputes: acknowledged within one working day, decision
                  within five working days of complete evidence.
                </p>
                <Link href="/legal/terms" className="aw-btn aw-btn--outline aw-btn--block">
                  Read dispute process
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
