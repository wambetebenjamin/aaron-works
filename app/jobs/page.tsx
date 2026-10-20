import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import FilterBar from "@/components/FilterBar";
import JobCard from "@/components/JobCard";
import { getStore } from "@/lib/db";
import { filterJobs } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Browse freelance jobs",
  description:
    "Open freelance jobs across East Africa. Filter by category, fixed or hourly budget and posting date. Apply with one proposal on Aaron Works.",
  alternates: { canonical: "/jobs" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const value = (input: string | string[] | undefined) =>
  Array.isArray(input) ? input[0] : input;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const store = await getStore();

  const filtered = filterJobs(store.jobs, {
    category: value(params.category),
    budgetType: value(params.budgetType),
    posted: value(params.posted),
    q: value(params.q),
  });

  const sort = value(params.sort) ?? "recent";
  const jobs = [...filtered].sort((a, b) => {
    if (sort === "proposals") return a.proposalCount - b.proposalCount;
    if (sort === "budget") return b.budgetMax - a.budgetMax;
    return a.postedDaysAgo - b.postedDaysAgo;
  });

  return (
    <>
      <section className="aw-pagehead">
        <div className="aw-wrap">
          <nav className="aw-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Jobs</span>
          </nav>
          <h1>Jobs board</h1>
          <p>
            Real briefs from East African businesses, with budgets in KES and
            escrow funded before work starts. New jobs are posted daily.
          </p>
        </div>
      </section>

      <section className="aw-section aw-section--tight">
        <div className="aw-wrap">
          <FilterBar mode="jobs" />

          <div className="aw-results">
            <span>
              <strong>{jobs.length}</strong> open job{jobs.length === 1 ? "" : "s"}
            </span>
            <span>
              <Link href="/post-job" className="aw-link">
                Have work? Post a job →
              </Link>
            </span>
          </div>

          {jobs.length ? (
            <div className="aw-jobs">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="aw-empty">
              <SearchX size={30} aria-hidden="true" />
              <h3>No jobs match those filters</h3>
              <p>Try another category or widen the posting date.</p>
              <Link href="/jobs" className="aw-btn aw-btn--green aw-btn--sm">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
