import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, LockKeyhole, ShieldCheck, Wallet } from "lucide-react";
import JobForm from "@/components/JobForm";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Post a job",
  description:
    "Post a freelance job on Aaron Works and receive proposals from verified East African talent within hours. Escrow-protected payments.",
  alternates: { canonical: "/post-job" },
};

export default async function PostJobPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=%2Fpost-job");
  }

  return (
    <>
      <section className="aw-pagehead">
        <div className="aw-wrap">
          <nav className="aw-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Post a job</span>
          </nav>
          <h1>Post a job</h1>
          <p>
            Describe the work once and reach verified freelancers across East
            Africa. Proposals usually start arriving within two hours.
          </p>
        </div>
      </section>

      <section className="aw-section aw-section--tight">
        <div className="aw-wrap">
          <div className="aw-detail">
            <JobForm />

            <aside className="aw-sidebar">
              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>What happens next</h2>
                <ol className="aw-steps">
                  <li>
                    <div>
                      <strong>We review the brief</strong>
                      <span>Most jobs go live immediately; sensitive categories are checked by our team.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Freelancers pitch</strong>
                      <span>You will see each proposal with a rate and delivery estimate in your dashboard.</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Fund escrow and start</strong>
                      <span>Money is held safely and released as milestones are approved.</span>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>Buyer protection</h2>
                <ul className="aw-facts">
                  <li>
                    <span>
                      <Wallet size={13} aria-hidden="true" /> Escrow
                    </span>
                    <strong>Funds held by Aaron Works</strong>
                  </li>
                  <li>
                    <span>
                      <BadgeCheck size={13} aria-hidden="true" /> Vetting
                    </span>
                    <strong>ID & portfolio checks</strong>
                  </li>
                  <li>
                    <span>
                      <ShieldCheck size={13} aria-hidden="true" /> Disputes
                    </span>
                    <strong>Mediated within 5 days</strong>
                  </li>
                  <li>
                    <span>
                      <LockKeyhole size={13} aria-hidden="true" /> Privacy
                    </span>
                    <strong>Contact details stay private</strong>
                  </li>
                </ul>
              </div>

              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>Need help scoping?</h2>
                <p className="aw-small">
                  Send us the rough idea and our Nairobi team will help you shape a
                  brief and a realistic budget.
                </p>
                <a
                  href="https://wa.me/254112272061?text=Hello%20Aaron%20Works%2C%20I%20would%20like%20to%20post%20a%20job%20or%20find%20a%20freelancer."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aw-btn aw-btn--outline aw-btn--block"
                >
                  WhatsApp +254 112 272 061
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
