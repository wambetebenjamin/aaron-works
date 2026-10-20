import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Handshake,
  Plus,
  Users,
  Wallet,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { formatDate, formatKES } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Client dashboard",
  robots: { index: false, follow: false },
  description: "Manage your jobs, proposals, hired freelancers and escrow payments.",
};

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard%2Fclient");
  }

  const store = await getStore();
  const name = session.user.name ?? "";
  const myJobs = store.jobs.filter((job) => job.client.name === name);
  const jobIds = myJobs.map((job) => job.id);
  const proposals = store.proposals.filter((proposal) => jobIds.includes(proposal.jobId));
  const contracts = store.contracts.filter(
    (contract) => contract.clientName === name,
  );
  const payments = store.payments.filter((payment) => payment.clientName === name);
  const escrow = contracts
    .filter((contract) => contract.status === "active")
    .reduce((total, contract) => total + contract.amount * (1 - contract.progress / 100), 0);

  return (
    <>
      <section className="aw-pagehead">
        <div className="aw-wrap">
          <div className="aw-flex aw-between aw-center aw-wrapflex aw-gap-2">
            <div>
              <nav className="aw-crumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <span>Dashboard</span>
              </nav>
              <h1 style={{ marginBottom: 4 }}>Karibu, {name.split(" ")[0]}</h1>
              <p>Here is what is happening across your hiring pipeline.</p>
            </div>
            <Link href="/post-job" className="aw-btn aw-btn--green">
              <Plus size={15} aria-hidden="true" /> Post a job
            </Link>
          </div>
        </div>
      </section>

      <section className="aw-section aw-section--tight">
        <div className="aw-wrap">
          <div className="aw-kpis">
            <div className="aw-kpi aw-kpi--accent">
              <span>
                <BriefcaseBusiness size={13} aria-hidden="true" /> Active jobs
              </span>
              <strong>{myJobs.length}</strong>
              <small>{proposals.length} proposals received</small>
            </div>
            <div className="aw-kpi">
              <span>
                <Users size={13} aria-hidden="true" /> Proposals
              </span>
              <strong>{proposals.length}</strong>
              <small>
                {proposals.filter((p) => p.status === "pending").length} awaiting review
              </small>
            </div>
            <div className="aw-kpi">
              <span>
                <Handshake size={13} aria-hidden="true" /> Hired freelancers
              </span>
              <strong>{contracts.length}</strong>
              <small>{contracts.filter((c) => c.status === "active").length} active contracts</small>
            </div>
            <div className="aw-kpi">
              <span>
                <Wallet size={13} aria-hidden="true" /> Escrow balance
              </span>
              <strong>{formatKES(Math.round(escrow), true)}</strong>
              <small>Released on milestone approval</small>
            </div>
          </div>

          <div className="aw-dashgrid">
            <div className="aw-panel">
              <div className="aw-flex aw-between aw-center aw-mb-2">
                <h2 style={{ margin: 0 }}>Active jobs</h2>
                <Link href="/jobs" className="aw-small aw-link">
                  View board
                </Link>
              </div>

              {myJobs.length ? (
                <div className="aw-jobs">
                  {myJobs.map((job) => {
                    const jobProposals = proposals.filter((p) => p.jobId === job.id);
                    return (
                      <div key={job.id} className="aw-listrow">
                        <div>
                          <strong>{job.title}</strong>
                          <span>
                            {job.category} · Posted {job.postedDaysAgo === 0 ? "today" : `${job.postedDaysAgo} days ago`} ·{" "}
                            {jobProposals.length} proposals
                          </span>
                        </div>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="aw-btn aw-btn--outline aw-btn--sm"
                        >
                          Manage <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="aw-empty" style={{ padding: "40px 20px" }}>
                  <BriefcaseBusiness size={26} aria-hidden="true" />
                  <h3>No jobs yet</h3>
                  <p>Post your first brief and proposals will start arriving today.</p>
                  <Link href="/post-job" className="aw-btn aw-btn--green aw-btn--sm">
                    Post a job
                  </Link>
                </div>
              )}

              <h2 style={{ marginTop: 30 }}>Proposals received</h2>
              {proposals.length ? (
                <div style={{ overflowX: "auto" }}>
                  <table className="aw-table">
                    <thead>
                      <tr>
                        <th>Freelancer</th>
                        <th>Job</th>
                        <th>Rate</th>
                        <th>Delivery</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposals.map((proposal) => (
                        <tr key={proposal.id}>
                          <td>
                            <strong>{proposal.freelancerName}</strong>
                          </td>
                          <td>{proposal.jobTitle}</td>
                          <td>{formatKES(proposal.rate)}</td>
                          <td>{proposal.deliveryDays} days</td>
                          <td>
                            <span
                              className={`aw-pill ${
                                proposal.status === "hired"
                                  ? "aw-pill--green"
                                  : proposal.status === "shortlisted"
                                    ? "aw-pill--amber"
                                    : ""
                              }`}
                            >
                              {proposal.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="aw-small">No proposals yet. New ones will appear here.</p>
              )}
            </div>

            <div>
              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>Hired freelancers</h2>
                {contracts.length ? (
                  contracts.map((contract) => (
                    <div key={contract.id} className="aw-listrow">
                      <div>
                        <strong>{contract.freelancerName}</strong>
                        <span>{contract.jobTitle}</span>
                        <div className="aw-progress">
                          <span style={{ width: `${contract.progress}%` }} />
                        </div>
                      </div>
                      <span className="aw-pill aw-pill--green">{contract.progress}%</span>
                    </div>
                  ))
                ) : (
                  <p className="aw-small">
                    No active hires yet. Shortlist a proposal to get started.
                  </p>
                )}
              </div>

              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>Payment history</h2>
                {payments.length ? (
                  <div style={{ overflowX: "auto" }}>
                    <table className="aw-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id}>
                            <td>{formatDate(payment.date)}</td>
                            <td>{payment.description}</td>
                            <td>{formatKES(payment.amount)}</td>
                            <td>
                              <span
                                className={`aw-pill ${
                                  payment.status === "paid"
                                    ? "aw-pill--green"
                                    : payment.status === "in escrow"
                                      ? "aw-pill--amber"
                                      : ""
                                }`}
                              >
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="aw-small">No payments yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
