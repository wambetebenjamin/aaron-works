import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { filterJobs } from "@/lib/filters";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const store = await getStore();

  const results = filterJobs(store.jobs, {
    category: searchParams.get("category") ?? undefined,
    budgetType:
      searchParams.get("budgetType") ??
      searchParams.get("budget_type") ??
      undefined,
    posted: searchParams.get("posted") ?? searchParams.get("date") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  return NextResponse.json({ count: results.length, jobs: results });
}
