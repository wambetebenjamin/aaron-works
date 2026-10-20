import Link from "next/link";
import { ArrowUpRight, Clock, Users } from "lucide-react";
import type { Job } from "@/lib/types";
import { formatBudget } from "@/lib/utils";

export default function JobCard({ job }: { job: Job }) {
  const posted =
    job.postedDaysAgo === 0
      ? "Today"
      : job.postedDaysAgo === 1
        ? "Yesterday"
        : `${job.postedDaysAgo} days ago`;

  return (
    <article className="aw-job">
      <div>
        <div className="aw-inline aw-gap-1 aw-wrapflex aw-mb-2" style={{ marginBottom: 6 }}>
          <span className="aw-pill aw-pill--blue">{job.category}</span>
          <span className="aw-pill">{job.budgetType === "hourly" ? "Hourly" : "Fixed price"}</span>
          {job.status === "open" ? (
            <span className="aw-pill aw-pill--green">Open</span>
          ) : null}
        </div>
        <h3>
          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
        </h3>
        <div className="aw-job__meta">
          <span>
            <Clock size={12} aria-hidden="true" /> Posted {posted}
          </span>
          <span>
            <Users size={12} aria-hidden="true" /> {job.proposalCount} proposals
          </span>
          <span>{job.client.company} · {job.client.location}</span>
        </div>
      </div>
      <div className="aw-job__side">
        <span className="aw-budget">
          <small>{job.budgetType === "hourly" ? "Rate" : "Budget"}</small>
          {formatBudget(job.budgetMin, job.budgetMax, job.budgetType)}
        </span>
        <Link href={`/jobs/${job.id}`} className="aw-btn aw-btn--outline aw-btn--sm">
          View job
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
