import type { MetadataRoute } from "next";
import { getStore } from "@/lib/db";
import { BRAND } from "@/lib/seed";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const store = await getStore();
  const base = BRAND.siteUrl.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/freelancers",
    "/jobs",
    "/post-job",
    "/contact",
    "/auth/signin",
    "/auth/signup",
    "/legal/privacy-policy",
    "/legal/terms",
    "/legal/cookie-policy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : 0.7,
  }));

  const freelancerRoutes = store.freelancers.map((freelancer) => ({
    url: `${base}/freelancers/${freelancer.username}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const jobRoutes = store.jobs.map((job) => ({
    url: `${base}/jobs/${job.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...freelancerRoutes, ...jobRoutes];
}
