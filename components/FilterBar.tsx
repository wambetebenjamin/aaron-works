"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES } from "@/lib/seed";

type Mode = "freelancers" | "jobs";

export default function FilterBar({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    startTransition(() => {
      router.push(query ? `?${query}` : "?", { scroll: false });
    });
  };

  const onSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    update("q", q.trim());
  };

  const reset = () => {
    setQ("");
    startTransition(() => router.push("?", { scroll: false }));
  };

  const hasFilters = Array.from(params.keys()).length > 0;

  // The rate preset writes minRate/maxRate, so derive the selected option back
  // from those params (keeps the dropdown in sync after navigation).
  const minRate = params.get("minRate");
  const maxRate = params.get("maxRate");
  const rateValue =
    minRate === "1500" && maxRate === "2500"
      ? "1500-2500"
      : minRate === "2500" && maxRate === "3500"
        ? "2500-3500"
        : maxRate === "1500"
          ? "under-1500"
          : minRate === "3500"
            ? "3500-plus"
            : "all";

  return (
    <form
      className={`aw-filters${mode === "jobs" ? " aw-filters--jobs" : ""}`}
      onSubmit={onSearchSubmit}
      role="search"
      aria-label={mode === "freelancers" ? "Filter freelancers" : "Filter jobs"}
    >
      <div className="aw-field" style={{ gridColumn: "span 1" }}>
        <label htmlFor="filter-q">Search</label>
        <div style={{ position: "relative" }}>
          <Search
            size={15}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8d978f",
            }}
          />
          <input
            id="filter-q"
            className="aw-input"
            style={{ paddingLeft: 34 }}
            placeholder={
              mode === "freelancers" ? "Name, skill or title" : "Title, skill or client"
            }
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />
        </div>
      </div>

      <div className="aw-field">
        <label htmlFor="filter-category">Category</label>
        <select
          id="filter-category"
          className="aw-select"
          value={params.get("category") ?? "all"}
          onChange={(event) => update("category", event.target.value)}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {mode === "freelancers" ? (
        <>
          <div className="aw-field">
            <label htmlFor="filter-rating">Minimum rating</label>
            <select
              id="filter-rating"
              className="aw-select"
              value={params.get("rating") ?? "all"}
              onChange={(event) => update("rating", event.target.value)}
            >
              <option value="all">Any rating</option>
              <option value="4">4.0 and up</option>
              <option value="4.5">4.5 and up</option>
              <option value="4.8">4.8 and up</option>
            </select>
          </div>
          <div className="aw-field">
            <label htmlFor="filter-rate">Hourly rate (KES)</label>
            <select
              id="filter-rate"
              className="aw-select"
              value={rateValue}
              onChange={(event) => {
                const value = event.target.value;
                const next = new URLSearchParams(params.toString());
                next.delete("minRate");
                next.delete("maxRate");
                if (value === "under-1500") next.set("maxRate", "1500");
                if (value === "1500-2500") {
                  next.set("minRate", "1500");
                  next.set("maxRate", "2500");
                }
                if (value === "2500-3500") {
                  next.set("minRate", "2500");
                  next.set("maxRate", "3500");
                }
                if (value === "3500-plus") next.set("minRate", "3500");
                const query = next.toString();
                startTransition(() =>
                  router.push(query ? `?${query}` : "?", { scroll: false }),
                );
              }}
            >
              <option value="all">Any rate</option>
              <option value="under-1500">Under 1,500</option>
              <option value="1500-2500">1,500 – 2,500</option>
              <option value="2500-3500">2,500 – 3,500</option>
              <option value="3500-plus">3,500 and up</option>
            </select>
          </div>
          <div className="aw-field">
            <label htmlFor="filter-availability">Availability</label>
            <select
              id="filter-availability"
              className="aw-select"
              value={params.get("availability") ?? "all"}
              onChange={(event) => update("availability", event.target.value)}
            >
              <option value="all">Any availability</option>
              <option value="available">Available now</option>
              <option value="limited">Limited availability</option>
              <option value="busy">Fully booked</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="aw-field">
            <label htmlFor="filter-budget">Budget type</label>
            <select
              id="filter-budget"
              className="aw-select"
              value={params.get("budgetType") ?? "all"}
              onChange={(event) => update("budgetType", event.target.value)}
            >
              <option value="all">Fixed or hourly</option>
              <option value="fixed">Fixed price</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
          <div className="aw-field">
            <label htmlFor="filter-posted">Posted</label>
            <select
              id="filter-posted"
              className="aw-select"
              value={params.get("posted") ?? "any"}
              onChange={(event) => update("posted", event.target.value)}
            >
              <option value="any">Any time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
          <div className="aw-field">
            <label htmlFor="filter-sort">Sort</label>
            <select
              id="filter-sort"
              className="aw-select"
              value={params.get("sort") ?? "recent"}
              onChange={(event) => update("sort", event.target.value)}
            >
              <option value="recent">Newest first</option>
              <option value="proposals">Fewest proposals</option>
              <option value="budget">Highest budget</option>
            </select>
          </div>
        </>
      )}

      <div
        className="aw-field aw-field--full"
        style={{
          gridColumn: "1 / -1",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span className="aw-small aw-inline">
          <SlidersHorizontal size={13} aria-hidden="true" />
          {isPending ? "Updating results…" : "Filters apply instantly"}
        </span>
        <div className="aw-inline aw-gap-1">
          {hasFilters ? (
            <button type="button" className="aw-btn aw-btn--outline aw-btn--sm" onClick={reset}>
              <X size={13} aria-hidden="true" /> Clear all
            </button>
          ) : null}
          <button type="submit" className="aw-btn aw-btn--blue aw-btn--sm">
            <Search size={13} aria-hidden="true" /> Search
          </button>
        </div>
      </div>
    </form>
  );
}
