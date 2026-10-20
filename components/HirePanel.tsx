"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import ProposalForm from "./ProposalForm";

export default function HirePanel({
  freelancerName,
  freelancerUsername,
  suggestedRate,
  jobs,
  signedIn,
}: {
  freelancerName: string;
  freelancerUsername: string;
  suggestedRate: number;
  jobs: { id: string; title: string }[];
  signedIn: boolean;
}) {
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");
  const selected = jobs.find((job) => job.id === jobId);

  if (!jobs.length) {
    return (
      <div className="aw-panel" id="hire">
        <h2>Work with {freelancerName.split(" ")[0]}</h2>
        <p className="aw-small">
          There are no open jobs to attach a proposal to right now. Post a job
          first, then invite {freelancerName.split(" ")[0]} directly.
        </p>
        <Link href="/post-job" className="aw-btn aw-btn--green aw-btn--block aw-mt-2">
          Post a job
        </Link>
        <Link href="/messages" className="aw-btn aw-btn--outline aw-btn--block aw-mt-1">
          <MessageSquare size={15} aria-hidden="true" /> Message instead
        </Link>
      </div>
    );
  }

  return (
    <div id="hire">
      <div className="aw-panel aw-mb-2">
        <h2>Hire {freelancerName.split(" ")[0]}</h2>
        <p className="aw-small aw-mb-2">
          Choose the job you want to discuss. Your proposal goes straight to the
          client dashboard with escrow protection.
        </p>
        <div className="aw-field">
          <label htmlFor="hire-job">Job</label>
          <select
            id="hire-job"
            className="aw-select"
            value={jobId}
            onChange={(event) => setJobId(event.target.value)}
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
        <p className="aw-hint aw-mt-1">
          Profile: @{freelancerUsername} · from KES {suggestedRate.toLocaleString("en-KE")}/hr
        </p>
        <Link
          href="/messages"
          className="aw-btn aw-btn--outline aw-btn--block aw-mt-2"
        >
          <MessageSquare size={15} aria-hidden="true" /> Message {freelancerName.split(" ")[0]}
        </Link>
      </div>

      <ProposalForm
        jobId={jobId}
        jobTitle={selected?.title ?? "Direct proposal"}
        suggestedRate={suggestedRate}
        hourly
        signedIn={signedIn}
      />
    </div>
  );
}
