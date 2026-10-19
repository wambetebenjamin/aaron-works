import type { Freelancer, Job } from "./types";
import { postedWithinDays } from "./utils";

export interface FreelancerQuery {
  category?: string;
  rating?: string;
  minRate?: string;
  maxRate?: string;
  availability?: string;
  q?: string;
  sort?: string;
}

export function filterFreelancers(list: Freelancer[], query: FreelancerQuery) {
  const category = query.category?.trim();
  const minRating = Number(query.rating || 0);
  const minRate = Number(query.minRate || 0);
  const maxRate = Number(query.maxRate || 0);
  const availability = query.availability?.trim();
  const q = query.q?.trim().toLowerCase();

  const filtered = list.filter((freelancer) => {
    if (category && category !== "all" && freelancer.category !== category) return false;
    if (minRating && freelancer.rating < minRating) return false;
    if (minRate && freelancer.hourlyRate < minRate) return false;
    if (maxRate && freelancer.hourlyRate > maxRate) return false;
    if (availability && availability !== "all" && freelancer.availability !== availability) return false;
    if (q) {
      const haystack = [
        freelancer.name,
        freelancer.title,
        freelancer.category,
        freelancer.location,
        ...freelancer.skills,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  switch (query.sort) {
    case "rate-asc":
      return [...filtered].sort((a, b) => a.hourlyRate - b.hourlyRate);
    case "rate-desc":
      return [...filtered].sort((a, b) => b.hourlyRate - a.hourlyRate);
    case "jobs":
      return [...filtered].sort((a, b) => b.completedJobs - a.completedJobs);
    case "rating":
    default:
      return [...filtered].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  }
}

export interface JobQuery {
  category?: string;
  budgetType?: string;
  posted?: string;
  q?: string;
}

export function filterJobs(list: Job[], query: JobQuery) {
  const category = query.category?.trim();
  const budgetType = query.budgetType?.trim();
  const posted = query.posted?.trim() || "any";
  const q = query.q?.trim().toLowerCase();

  return list.filter((job) => {
    if (category && category !== "all" && job.category !== category) return false;
    if (budgetType && budgetType !== "all" && job.budgetType !== budgetType) return false;
    if (!postedWithinDays(job.postedDaysAgo, posted)) return false;
    if (q) {
      const haystack = [job.title, job.category, job.client.company, ...job.skills]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
