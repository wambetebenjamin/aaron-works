import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { filterFreelancers } from "@/lib/filters";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const store = await getStore();

  const results = filterFreelancers(store.freelancers, {
    category: searchParams.get("category") ?? undefined,
    rating: searchParams.get("rating") ?? undefined,
    minRate: searchParams.get("minRate") ?? searchParams.get("min_rate") ?? undefined,
    maxRate: searchParams.get("maxRate") ?? searchParams.get("max_rate") ?? undefined,
    availability: searchParams.get("availability") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  });

  return NextResponse.json({
    count: results.length,
    freelancers: results,
  });
}
