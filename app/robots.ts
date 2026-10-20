import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/seed";

export default function robots(): MetadataRoute.Robots {
  const base = BRAND.siteUrl.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/messages",
          "/auth/",
          "/api/",
          "/template/",
          "/500",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
