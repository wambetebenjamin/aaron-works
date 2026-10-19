import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, Users } from "lucide-react";
import FilterBar from "@/components/FilterBar";
import FreelancerCard from "@/components/FreelancerCard";
import { getStore } from "@/lib/db";
import { filterFreelancers } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Find freelancers",
  description:
    "Browse verified East African freelancers by skill category, rating, hourly rate and availability. Hire designers, developers, writers and more on Aaron Works.",
  alternates: { canonical: "/freelancers" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const value = (input: string | string[] | undefined) =>
  Array.isArray(input) ? input[0] : input;

export default async function FreelancersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const store = await getStore();

  const results = filterFreelancers(store.freelancers, {
    category: value(params.category),
    rating: value(params.rating),
    minRate: value(params.minRate),
    maxRate: value(params.maxRate),
    availability: value(params.availability),
    q: value(params.q),
    sort: value(params.sort),
  });

  return (
    <>
      <section className="aw-pagehead">
        <div className="aw-wrap">
          <nav className="aw-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Freelancers</span>
          </nav>
          <h1>Find the right freelancer</h1>
          <p>
            {store.freelancers.length} verified professionals across design, tech,
            writing, video, data and consulting. Filter by category, rating, rate
            and availability — then message or hire directly.
          </p>
        </div>
      </section>

      <section className="aw-section aw-section--tight">
        <div className="aw-wrap">
          <FilterBar mode="freelancers" />

          <div className="aw-results">
            <span>
              <strong>{results.length}</strong> freelancer
              {results.length === 1 ? "" : "s"} match your filters
            </span>
            <span className="aw-inline">
              <Users size={13} aria-hidden="true" /> All profiles verified by Aaron
              Works
            </span>
          </div>

          {results.length ? (
            <div className="aw-fgrid">
              {results.map((freelancer, index) => (
                <FreelancerCard
                  key={freelancer.id}
                  freelancer={freelancer}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="aw-empty">
              <SearchX size={30} aria-hidden="true" />
              <h3>No freelancers match those filters</h3>
              <p>Try widening your rate range or clearing the category filter.</p>
              <Link href="/freelancers" className="aw-btn aw-btn--green aw-btn--sm">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
