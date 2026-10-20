import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import ProposalForm from "@/components/ProposalForm";
import { auth } from "@/lib/auth";
import { getJob } from "@/lib/db";
import { formatBudget, formatDate, timeAgo } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return { title: "Job not found" };
  return {
    title: job.title,
    description: job.description[0]?.slice(0, 155),
    alternates: { canonical: `/jobs/${job.id}` },
    openGraph: { title: job.title, description: job.description[0]?.slice(0, 155) },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  const session = await auth();
  const budgetGuidance = Math.round((job.budgetMin + job.budgetMax) / 2);

  return (
    <>
      <section className="aw-pagehead">
        <div className="aw-wrap">
          <nav className="aw-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/jobs">Jobs</Link>
            <span>/</span>
            <span>{job.title}</span>
          </nav>
          <div className="aw-inline aw-gap-1 aw-wrapflex aw-mb-2" style={{ marginBottom: 12 }}>
            <span className="aw-pill aw-pill--blue">{job.category}</span>
            <span className="aw-pill">
              {job.budgetType === "hourly" ? "Hourly rate" : "Fixed price"}
            </span>
            <span className="aw-pill aw-pill--green">
              <i className="aw-dot" aria-hidden="true" /> Open
            </span>
          </div>
          <h1>{job.title}</h1>
          <p>
            Posted {timeAgo(new Date(Date.now() - job.postedDaysAgo * 86400000).toISOString())}{" "}
            · {job.proposalCount} proposals · {job.client.company},{" "}
            {job.client.location}
          </p>
        </div>
      </section>

      <section className="aw-section aw-section--tight">
        <div className="aw-wrap">
          <div className="aw-detail">
            <div>
              <article className="aw-panel">
                <h2>Project description</h2>
                <div className="aw-prose">
                  {job.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <h3>Skills required</h3>
                <div className="aw-tags">
                  {job.skills.map((skill) => (
                    <span key={skill} className="aw-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </article>

              <ProposalForm
                jobId={job.id}
                jobTitle={job.title}
                suggestedRate={budgetGuidance}
                hourly={job.budgetType === "hourly"}
                signedIn={Boolean(session?.user)}
              />
            </div>

            <aside className="aw-sidebar">
              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>Job overview</h2>
                <ul className="aw-facts">
                  <li>
                    <span>
                      <Wallet size={13} aria-hidden="true" /> Budget
                    </span>
                    <strong>{formatBudget(job.budgetMin, job.budgetMax, job.budgetType)}</strong>
                  </li>
                  <li>
                    <span>
                      <CalendarDays size={13} aria-hidden="true" /> Deadline
                    </span>
                    <strong>{formatDate(job.deadline)}</strong>
                  </li>
                  <li>
                    <span>
                      <Clock3 size={13} aria-hidden="true" /> Posted
                    </span>
                    <strong>{job.postedDaysAgo === 0 ? "Today" : `${job.postedDaysAgo} days ago`}</strong>
                  </li>
                  <li>
                    <span>
                      <Users size={13} aria-hidden="true" /> Proposals
                    </span>
                    <strong>{job.proposalCount}</strong>
                  </li>
                  <li>
                    <span>
                      <ShieldCheck size={13} aria-hidden="true" /> Payment
                    </span>
                    <strong>Escrow protected</strong>
                  </li>
                </ul>
                <Link href="#proposal" className="aw-btn aw-btn--green aw-btn--block aw-mt-2">
                  Submit a proposal
                </Link>
              </div>

              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>About the client</h2>
                <div className="aw-clientrow">
                  <span className="aw-initials" aria-hidden="true">
                    {job.client.company
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <strong>{job.client.company}</strong>
                    <span>{job.client.name}</span>
                  </div>
                </div>
                <ul className="aw-facts">
                  <li>
                    <span>
                      <MapPin size={13} aria-hidden="true" /> Location
                    </span>
                    <strong>{job.client.location}</strong>
                  </li>
                  <li>
                    <span>
                      <BadgeCheck size={13} aria-hidden="true" /> Verified
                    </span>
                    <strong>{job.client.verified ? "Yes" : "Pending"}</strong>
                  </li>
                  <li>
                    <span>Member since</span>
                    <strong>{job.client.memberSince}</strong>
                  </li>
                  <li>
                    <span>Jobs posted</span>
                    <strong>{job.client.jobsPosted}</strong>
                  </li>
                </ul>
              </div>

              <div className="aw-panel">
                <h3>Not the right fit?</h3>
                <p className="aw-small">
                  Browse similar work or set up a profile so clients can find you
                  first.
                </p>
                <Link href="/jobs" className="aw-btn aw-btn--outline aw-btn--block">
                  Back to jobs
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
