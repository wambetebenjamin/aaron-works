import { NextResponse } from "next/server";
import { getJob } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return NextResponse.json({ error: "Job not found", id }, { status: 404 });
  }

  return NextResponse.json({ job });
}
