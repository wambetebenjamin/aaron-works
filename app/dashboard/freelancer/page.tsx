import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  BriefcaseBusiness,
  FileText,
  PencilLine,
  Wallet,
} from "lucide-react";
import EarningsChart from "@/components/EarningsChart";
import { auth } from "@/lib/auth";
import { getFreelancer, getStore } from "@/lib/db";
import { formatDate, formatKES } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Freelancer dashboard",
  robots: { index: false, follow: false },
  description: "Track proposals, contracts, earnings and profile completion.",
};

export const dynamic = "force-dynamic";

export default async function FreelancerDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard%2Ffreelancer");
  }

  const store = await getStore();
  const profile = await getFreelancer(session.user.username ?? "");
  const proposals = store.proposals.filter(
    (proposal) => proposal.freelancerUsername === (session.user.username ?? ""),
  );
  const contracts = store.contracts.filter(
    (contract) => contract.freelancerUsername === (session.user.username ?? ""),
  );
  const activeContracts = contracts.filter((contract) => contract.status === "active");
  const earned = contracts.reduce((total, contract) => total + contract.amount, 0);
  const released = contracts.reduce(
    (total, contract) =>
      total +
      contract.amount *
        (contract.status === "completed" ? 1 : contract.progress / 100),
    0,
  );
  const held = contracts.reduce(
    (total, contract) =>
      total +
      (contract.status === "completed"
        ? 0
        : contract.amount * (1 - contract.progress / 100)),
    0,
  );

  const completionChecks = [
    Boolean(profile?.bio && profile.bio.length > 80),
    (profile?.portfolio.length ?? 0) > 0,
    (profile?.skills.length ?? 0) >= 3,
    Boolean(profile?.hourlyRate),
    Boolean(profile?.avatar),
    proposals.length > 0,
    contracts.length > 0,
  ];
  const completion = profile
    ? Math.round((completionChecks.filter(Boolean).length / completionChecks.length) * 100)
    : 35;

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
              <h1 style={{ marginBottom: 4 }}>
                {session.user.name?.split(" ")[0]}&apos;s workspace
              </h1>
              <p>Proposals, contracts and earnings — all in one place.</p>
            </div>
            <div className="aw-inline aw-gap-1 aw-wrapflex">
              {profile ? (
                <Link
                  href={`/freelancers/${profile.username}`}
                  className="aw-btn aw-btn--outline"
                >
                  View public profile
                </Link>
              ) : null}
              <Link href="/jobs" className="aw-btn aw-btn--green">
                Find work <BriefcaseBusiness size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="aw-section aw-section--tight">
        <div className="aw-wrap">
          <div className="aw-kpis">
            <div className="aw-kpi aw-kpi--accent">
              <span>
                <FileText size={13} aria-hidden="true" /> Active proposals
              </span>
              <strong>{proposals.filter((p) => p.status === "pending").length}</strong>
              <small>{proposals.length} sent in total</small>
            </div>
            <div className="aw-kpi">
              <span>
                <BriefcaseBusiness size={13} aria-hidden="true" /> Active contracts
              </span>
              <strong>{activeContracts.length}</strong>
              <small>{contracts.length} lifetime contracts</small>
            </div>
            <div className="aw-kpi">
              <span>
                <Wallet size={13} aria-hidden="true" /> Earnings
              </span>
              <strong>{formatKES(earned, true)}</strong>
              <small>Across escrow milestones</small>
            </div>
            <div className="aw-kpi">
              <span>
                <BadgeCheck size={13} aria-hidden="true" /> Completed jobs
              </span>
              <strong>{profile?.completedJobs ?? 0}</strong>
              <small>{profile?.rating.toFixed(1) ?? "—"} average rating</small>
            </div>
          </div>

          <div className="aw-dashgrid">
            <div>
              <div className="aw-panel">
                <div className="aw-flex aw-between aw-center aw-mb-2">
                  <h2 style={{ margin: 0 }}>Active proposals</h2>
                  <Link href="/jobs" className="aw-small aw-link">
                    Find more work
                  </Link>
                </div>

                {proposals.length ? (
                  <div style={{ overflowX: "auto" }}>
                    <table className="aw-table">
                      <thead>
                        <tr>
                          <th>Job</th>
                          <th>Rate</th>
                          <th>Delivery</th>
                          <th>Sent</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposals.map((proposal) => (
                          <tr key={proposal.id}>
                            <td>
                              <strong>{proposal.jobTitle}</strong>
                            </td>
                            <td>{formatKES(proposal.rate)}</td>
                            <td>{proposal.deliveryDays} days</td>
                            <td>{formatDate(proposal.createdAt)}</td>
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
                  <div className="aw-empty" style={{ padding: "40px 20px" }}>
                    <FileText size={26} aria-hidden="true" />
                    <h3>No proposals yet</h3>
                    <p>Browse open jobs and send your first pitch today.</p>
                    <Link href="/jobs" className="aw-btn aw-btn--green aw-btn--sm">
                      Browse jobs
                    </Link>
                  </div>
                )}
              </div>

              <div className="aw-panel">
                <h2>Active contracts</h2>
                {contracts.length ? (
                  contracts.map((contract) => (
                    <div key={contract.id} className="aw-listrow">
                      <div style={{ flex: 1 }}>
                        <strong>{contract.jobTitle}</strong>
                        <span>
                          {contract.clientName} · {formatKES(contract.amount)} · started{" "}
                          {formatDate(contract.startedAt)}
                        </span>
                        <div className="aw-progress">
                          <span style={{ width: `${contract.progress}%` }} />
                        </div>
                      </div>
                      <span
                        className={`aw-pill ${
                          contract.status === "active" ? "aw-pill--amber" : "aw-pill--green"
                        }`}
                      >
                        {contract.progress}% · {contract.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="aw-small">
                    No contracts yet. Once a client hires you, milestones appear here.
                  </p>
                )}
              </div>

              <div className="aw-panel">
                <div className="aw-flex aw-between aw-center">
                  <h2 style={{ margin: 0 }}>Earnings summary</h2>
                  <span className="aw-pill aw-pill--green">Last 6 months</span>
                </div>
                <EarningsChart />
                <p className="aw-small" style={{ marginBottom: 0 }}>
                  Figures reflect released milestones and active escrow. Withdrawals
                  to M-Pesa or bank settle within two working days.
                </p>
              </div>
            </div>

            <div>
              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>Profile completion</h2>
                <div className="aw-flex aw-between aw-center">
                  <span className="aw-small">Visibility to clients</span>
                  <strong style={{ color: "#1f1f1f" }}>{completion}%</strong>
                </div>
                <div className="aw-progress">
                  <span style={{ width: `${completion}%` }} />
                </div>
                <ul className="aw-facts aw-mt-2">
                  <li>
                    <span>Portfolio items</span>
                    <strong>{profile?.portfolio.length ?? 0} / 4</strong>
                  </li>
                  <li>
                    <span>Skills listed</span>
                    <strong>{profile?.skills.length ?? 0} / 6</strong>
                  </li>
                  <li>
                    <span>Response time</span>
                    <strong>{profile?.responseTime ?? "Set your SLA"}</strong>
                  </li>
                </ul>
                <Link
                  href={profile ? `/freelancers/${profile.username}` : "/freelancers"}
                  className="aw-btn aw-btn--outline aw-btn--block aw-mt-2"
                >
                  <PencilLine size={14} aria-hidden="true" /> Review profile
                </Link>
              </div>

              <div className="aw-panel">
                <h2 style={{ fontSize: 16 }}>Escrow & payouts</h2>
                <ul className="aw-facts">
                  <li>
                    <span>Released to you</span>
                    <strong>{formatKES(Math.round(released))}</strong>
                  </li>
                  <li>
                    <span>Held in escrow</span>
                    <strong>{formatKES(Math.round(held))}</strong>
                  </li>
                  <li>
                    <span>Payout method</span>
                    <strong>M-Pesa · Bank</strong>
                  </li>
                </ul>
                <p className="aw-hint aw-mt-1">
                  Payouts are processed after the client approves each milestone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
