import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Headphones,
  Quote,
  Scale,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";
import FreelancerCard from "@/components/FreelancerCard";
import { CATEGORIES, HOW_IT_WORKS, STATS, TESTIMONIALS, TRUST_POINTS } from "@/lib/seed";
import { getStore } from "@/lib/db";
import { formatKES, whatsappLink } from "@/lib/utils";
import { BRAND } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Aaron Works — Find talent. Get work done.",
  description:
    "Hire verified freelancers across East Africa for design, web development, writing, video, social media, data entry, translation and consulting. Escrow-protected payments and Kenya-based support.",
  alternates: { canonical: "/" },
};

const TRUST_ICONS = {
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  scale: Scale,
  headphones: Headphones,
} as const;

export default async function HomePage() {
  const store = await getStore();
  const featured = store.freelancers.slice(0, 4);
  const totalFreelancers = STATS[0].value.toLocaleString("en-KE");

  return (
    <>
      <section className="aw-hero">
        <div className="aw-wrap">
          <div className="aw-hero__grid">
            <div className="aw-rise">
              <div className="aw-hero__badges">
                <span className="aw-chip aw-chip--green">
                  <span className="aw-dot" aria-hidden="true" />
                  {totalFreelancers}+ verified freelancers
                </span>
                <span className="aw-chip">Kenya · Uganda · Tanzania · Rwanda</span>
              </div>

              <h1 className="aw-hero__title">
                Find talent.
                <br />
                <span className="aw-mark">Get work done.</span>
              </h1>

              <p className="aw-hero__sub">
                Aaron Works connects East African businesses with skilled,
                verified freelancers in design, tech, writing, video and more.
                Every project runs on secure escrow, with a Nairobi-based team
                behind it.
              </p>

              <div className="aw-hero__ctas">
                <Link href="/freelancers" className="aw-btn aw-btn--green">
                  <Users size={16} aria-hidden="true" />
                  Find a freelancer
                </Link>
                <Link href="/post-job" className="aw-btn aw-btn--blue">
                  Post a job
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <div className="aw-hero__proof">
                <span className="aw-proofitem">
                  <ShieldCheck size={15} aria-hidden="true" /> Escrow on every project
                </span>
                <span className="aw-proofitem">
                  <BadgeCheck size={15} aria-hidden="true" /> Verified profiles
                </span>
                <span className="aw-proofitem">
                  <Clock3 size={15} aria-hidden="true" /> Average reply under 2 hours
                </span>
              </div>
            </div>

            <div className="aw-hero__media">
              <Image
                src="/images/hero-freelancer.jpg"
                alt="East African freelancer working on a laptop at a wooden desk in a home office"
                width={500}
                height={750}
                priority
                sizes="(max-width: 960px) 90vw, 470px"
                className="aw-hero__img"
                style={{ height: "auto" }}
              />

              <div className="aw-float aw-float--top">
                <span className="aw-float__icon aw-float__icon--green">
                  <ShieldCheck size={16} aria-hidden="true" />
                </span>
                <span>
                  Payment held in escrow
                  <small>Released only when you approve</small>
                </span>
              </div>

              <div className="aw-float aw-float--bottom">
                <span className="aw-float__icon aw-float__icon--blue">
                  <BadgeCheck size={15} aria-hidden="true" />
                </span>
                <span>
                  Amina H. · Brand designer
                  <small>4.9 rating · 132 jobs completed</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="aw-section">
        <div className="aw-wrap">
          <div className="aw-head aw-head--center">
            <span className="aw-eyebrow">Skill categories</span>
            <h2 className="aw-h2">Hire for the work you actually need</h2>
            <p className="aw-lead">
              Eight specialisms, hundreds of vetted professionals. Every category
              is screened by our Nairobi team before it goes live.
            </p>
          </div>

          <div className="aw-catgrid">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/freelancers?category=${encodeURIComponent(category.name)}`}
                className="aw-cat"
              >
                <span className="aw-cat__icon">
                  <CategoryIcon name={category.icon} />
                </span>
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.blurb}</p>
                </div>
                <span className="aw-cat__count">
                  {category.count.toLocaleString("en-KE")} freelancers
                  <ArrowRight size={12} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="aw-section aw-section--tint" id="how-it-works">
        <div className="aw-wrap">
          <div className="aw-head aw-head--center">
            <span className="aw-eyebrow">How it works</span>
            <h2 className="aw-h2">Two flows, one marketplace</h2>
            <p className="aw-lead">
              Whether you are hiring or looking for your next contract, the process
              is simple — and the money is protected at every step.
            </p>
          </div>

          <div className="aw-flows">
            <article className="aw-flow aw-flow--client">
              <div className="aw-flow__head">
                <span className="aw-flow__icon aw-flow__icon--blue">
                  <Users size={21} aria-hidden="true" />
                </span>
                <div>
                  <h3>For clients</h3>
                  <p>Post, review, hire — with escrow held until you approve.</p>
                </div>
              </div>
              <ol className="aw-steps">
                {HOW_IT_WORKS.clients.map((step) => (
                  <li key={step.title}>
                    <div>
                      <strong>{step.title}</strong>
                      <span>{step.body}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="aw-flow__cta">
                <Link href="/post-job" className="aw-btn aw-btn--blue aw-btn--sm">
                  Post a job
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="aw-flow aw-flow--freelancer">
              <div className="aw-flow__head">
                <span className="aw-flow__icon aw-flow__icon--green">
                  <UserRound size={21} aria-hidden="true" />
                </span>
                <div>
                  <h3>For freelancers</h3>
                  <p>Build a profile, pitch for work and get paid on time.</p>
                </div>
              </div>
              <ol className="aw-steps">
                {HOW_IT_WORKS.freelancers.map((step) => (
                  <li key={step.title}>
                    <div>
                      <strong>{step.title}</strong>
                      <span>{step.body}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="aw-flow__cta">
                <Link href="/auth/signup?role=freelancer" className="aw-btn aw-btn--green aw-btn--sm">
                  Start earning
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="aw-section">
        <div className="aw-wrap">
          <div className="aw-flex aw-between aw-center aw-wrapflex aw-gap-2 aw-mb-3">
            <div className="aw-head" style={{ marginBottom: 0 }}>
              <span className="aw-eyebrow">Featured freelancers</span>
              <h2 className="aw-h2">Talent available this week</h2>
              <p className="aw-lead">
                A snapshot of the people clients are hiring right now. Browse the
                full directory for filters by rate, rating and availability.
              </p>
            </div>
            <Link href="/freelancers" className="aw-btn aw-btn--outline">
              Browse all freelancers
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="aw-fgrid">
            {featured.map((freelancer, index) => (
              <FreelancerCard
                key={freelancer.id}
                freelancer={freelancer}
                priority={index < 2}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="aw-section aw-section--tint">
        <div className="aw-wrap">
          <div className="aw-head aw-head--center">
            <span className="aw-eyebrow">Built for trust</span>
            <h2 className="aw-h2">Your money and your work, protected</h2>
            <p className="aw-lead">
              The marketplace is designed around the realities of doing business in
              East Africa — mobile money, distance, and accountability.
            </p>
          </div>

          <div className="aw-trust">
            {TRUST_POINTS.map((point) => {
              const Icon = TRUST_ICONS[point.icon as keyof typeof TRUST_ICONS] ?? ShieldCheck;
              return (
                <article key={point.title} className="aw-trust__item">
                  <span className="aw-trust__icon">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </article>
              );
            })}
          </div>

          <div className="aw-panel aw-mt-3" style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <span className="aw-trust__icon" style={{ flex: "none" }}>
              <Wallet size={20} aria-hidden="true" />
            </span>
            <div className="aw-grow">
              <h3 style={{ marginBottom: 4 }}>How escrow works on Aaron Works</h3>
              <p className="aw-small" style={{ margin: 0, maxWidth: 820 }}>
                The client funds the project before work starts. Money is held by
                Aaron Works, released milestone by milestone, and refunded in full if
                a dispute is upheld before delivery. Freelancers can withdraw to
                M-Pesa or a Kenyan bank account within two working days.
              </p>
            </div>
            <Link href="/legal/terms" className="aw-btn aw-btn--ghost aw-btn--sm">
              Read the terms
            </Link>
          </div>
        </div>
      </section>

      <section className="aw-stats">
        <div className="aw-wrap">
          <div className="aw-stats__grid">
            {STATS.map((stat) => (
              <div className="aw-stat" key={stat.label}>
                <strong>
                  {stat.value.toLocaleString("en-KE")}
                  <em>{stat.suffix}</em>
                </strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="aw-section">
        <div className="aw-wrap">
          <div className="aw-head aw-head--center">
            <span className="aw-eyebrow">Testimonials</span>
            <h2 className="aw-h2">What East African businesses say</h2>
          </div>

          <div className="aw-tgrid">
            {TESTIMONIALS.map((testimonial) => (
              <article className="aw-testi" key={testimonial.name}>
                <Quote size={24} className="aw-testi__quote" aria-hidden="true" />
                <p>“{testimonial.quote}”</p>
                <div className="aw-testi__person">
                  <span className="aw-initials" aria-hidden="true">
                    {testimonial.initials}
                  </span>
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>
                      {testimonial.role} · {testimonial.location}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="aw-ctaband">
        <div className="aw-wrap">
          <div className="aw-ctaband__inner">
            <div>
              <h2>Hiring in Nairobi, Kampala or Dar? Start today.</h2>
              <p>
                Post a job in four minutes, or talk to our team on WhatsApp before
                you commit. Typical first proposal arrives within two hours.
              </p>
            </div>
            <div className="aw-inline aw-gap-1 aw-wrapflex">
              <Link href="/post-job" className="aw-btn aw-btn--green">
                Post a job
              </Link>
              <a
                href={whatsappLink(BRAND.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="aw-btn aw-btn--outline"
                style={{ borderColor: "rgba(255,255,255,.5)", color: "#fff" }}
              >
                <CheckCircle2 size={15} aria-hidden="true" />
                WhatsApp {BRAND.whatsappDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="aw-section aw-section--tight">
        <div className="aw-wrap" style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <p className="aw-small" style={{ margin: 0 }}>
            Trusted by teams in Nairobi, Mombasa, Kisumu, Nakuru, Kampala and Dar es
            Salaam. Average project value in {new Date().getFullYear()}:{" "}
            <strong>{formatKES(96000)}</strong>.
          </p>
          <div className="aw-inline aw-gap-2 aw-wrapflex">
            <Link href="/jobs" className="aw-link aw-small">
              Browse open jobs
            </Link>
            <Link href="/freelancers" className="aw-link aw-small">
              Meet the freelancers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
