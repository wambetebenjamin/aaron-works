import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Languages,
  MapPin,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import HirePanel from "@/components/HirePanel";
import RatingDots from "@/components/RatingDots";
import { auth } from "@/lib/auth";
import { getFreelancer, getStore } from "@/lib/db";
import { AVAILABILITY_LABELS, formatDate, formatKES } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const freelancer = await getFreelancer(username);
  if (!freelancer) return { title: "Freelancer not found" };
  return {
    title: `${freelancer.name} — ${freelancer.title}`,
    description: freelancer.bio.slice(0, 155),
    alternates: { canonical: `/freelancers/${freelancer.username}` },
    openGraph: {
      title: `${freelancer.name} on Aaron Works`,
      description: freelancer.bio.slice(0, 155),
      images: [freelancer.avatar],
    },
  };
}

export default async function FreelancerProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const freelancer = await getFreelancer(username);
  if (!freelancer) notFound();

  const store = await getStore();
  const session = await auth();
  const openJobs = store.jobs
    .filter((job) => job.status === "open")
    .slice(0, 5)
    .map((job) => ({ id: job.id, title: job.title }));

  return (
    <>
      <section className="aw-pagehead">
        <div className="aw-wrap">
          <nav className="aw-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/freelancers">Freelancers</Link>
            <span>/</span>
            <span>{freelancer.name}</span>
          </nav>
          <h1>{freelancer.name}</h1>
          <p>
            {freelancer.title} · {freelancer.location} · Member since{" "}
            {freelancer.memberSince}
          </p>
        </div>
      </section>

      <section className="aw-section aw-section--tight">
        <div className="aw-wrap">
          <div className="aw-profile">
            <aside className="aw-profile__card">
              <Image
                src={freelancer.avatar}
                alt={`Portrait of ${freelancer.name}`}
                width={500}
                height={500}
                priority
                sizes="340px"
                className="aw-profile__photo"
              />
              <div className="aw-profile__body">
                <h1>{freelancer.name}</h1>
                <p className="aw-profile__title">{freelancer.title}</p>

                <div className="aw-inline aw-gap-1 aw-wrapflex">
                  <span className="aw-pill aw-pill--green">
                    <i className="aw-dot" aria-hidden="true" />
                    {AVAILABILITY_LABELS[freelancer.availability]}
                  </span>
                  <span className="aw-pill">
                    <MapPin size={11} aria-hidden="true" />
                    {freelancer.location.split(",")[0]}
                  </span>
                </div>

                <div>
                  <span className="aw-rate" style={{ fontSize: 22 }}>
                    {formatKES(freelancer.hourlyRate)}
                    <small>/hr</small>
                  </span>
                  <div className="aw-small aw-inline aw-mt-1">
                    <Clock3 size={12} aria-hidden="true" /> Replies {freelancer.responseTime}
                  </div>
                </div>

                <RatingDots
                  rating={freelancer.rating}
                  reviewCount={freelancer.reviewCount}
                />

                <Link href="#hire" className="aw-btn aw-btn--green aw-btn--block">
                  Hire {freelancer.name.split(" ")[0]}
                </Link>
                <Link
                  href="#hire"
                  className="aw-btn aw-btn--outline aw-btn--block"
                >
                  <MessageSquare size={15} aria-hidden="true" /> Contact about a project
                </Link>

                <ul className="aw-facts" style={{ marginTop: 6 }}>
                  <li>
                    <span>
                      <BriefcaseBusiness size={13} aria-hidden="true" /> Completed jobs
                    </span>
                    <strong>{freelancer.completedJobs}</strong>
                  </li>
                  <li>
                    <span>
                      <ShieldCheck size={13} aria-hidden="true" /> Success rate
                    </span>
                    <strong>{freelancer.successRate}%</strong>
                  </li>
                  <li>
                    <span>
                      <Languages size={13} aria-hidden="true" /> Languages
                    </span>
                    <strong>{freelancer.languages.join(", ")}</strong>
                  </li>
                </ul>

                <p className="aw-small aw-inline" style={{ margin: 0 }}>
                  <BadgeCheck size={13} aria-hidden="true" /> ID & portfolio verified
                </p>
              </div>
            </aside>

            <div>
              <section className="aw-panel">
                <h2>About {freelancer.name.split(" ")[0]}</h2>
                <div className="aw-prose">
                  <p>{freelancer.bio}</p>
                </div>
                <h3>Skills</h3>
                <div className="aw-tags">
                  {freelancer.skills.map((skill) => (
                    <span key={skill} className="aw-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section className="aw-panel">
                <h2>Portfolio</h2>
                <div className="aw-portfolio">
                  {freelancer.portfolio.map((item) => (
                    <figure key={item.id}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={500}
                        height={375}
                        sizes="(max-width: 760px) 100vw, 380px"
                      />
                      <figcaption>
                        <strong>{item.title}</strong>
                        {item.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              <section className="aw-panel">
                <h2>Work history</h2>
                <ul className="aw-history">
                  {freelancer.workHistory.map((item) => (
                    <li key={item.id}>
                      <span className="aw-history__year">{item.year}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <span>
                          {item.client} · {item.outcome}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="aw-panel">
                <div className="aw-flex aw-between aw-center aw-wrapflex aw-gap-2 aw-mb-2">
                  <h2 style={{ margin: 0 }}>Reviews</h2>
                  <div className="aw-ratingsummary">
                    <b>{freelancer.rating.toFixed(1)}</b>
                    <RatingDots rating={freelancer.rating} />
                    <span>{freelancer.reviewCount} reviews</span>
                  </div>
                </div>

                {freelancer.reviews.map((review) => (
                  <article className="aw-review" key={review.id}>
                    <div className="aw-review__head">
                      <div>
                        <strong>{review.author}</strong>
                        <span>
                          {" "}
                          · {review.company} · {review.project}
                        </span>
                      </div>
                      <span>{formatDate(review.date)}</span>
                    </div>
                    <div className="aw-mb-2" style={{ marginBottom: 6 }}>
                      <RatingDots rating={review.rating} size="sm" showValue={false} />
                    </div>
                    <p>{review.body}</p>
                  </article>
                ))}
              </section>

              <HirePanel
                freelancerName={freelancer.name}
                freelancerUsername={freelancer.username}
                suggestedRate={freelancer.hourlyRate}
                jobs={openJobs}
                signedIn={Boolean(session?.user)}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
