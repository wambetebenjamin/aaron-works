import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createJob, findUserById } from "@/lib/db";
import { jobCreateSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to post a job." },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = jobCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;
  if (data.budgetMax < data.budgetMin) {
    return NextResponse.json(
      { error: "Maximum budget must be greater than or equal to the minimum." },
      { status: 422 },
    );
  }

  const user = await findUserById(session.user.id);
  const now = Date.now();

  const job: Job = {
    id: `job-${now}`,
    slug: slugify(data.title).slice(0, 80) || `job-${now}`,
    title: data.title,
    category: data.category,
    description: data.description
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean),
    skills: data.skills,
    budgetType: data.budgetType,
    budgetMin: data.budgetMin,
    budgetMax: data.budgetMax,
    currency: "KES",
    deadline: data.deadline,
    postedDaysAgo: 0,
    proposalCount: 0,
    client: {
      id: user?.id ?? session.user.id,
      name: user?.name ?? session.user.name ?? "Aaron Works client",
      company: "Independent client",
      memberSince: user ? new Date(user.createdAt).getFullYear().toString() : new Date().getFullYear().toString(),
      jobsPosted: 1,
      location: "Nairobi, Kenya",
      verified: true,
    },
    status: "open",
    attachments: data.attachments,
  };

  await createJob(job);

  return NextResponse.json(
    { ok: true, job, message: "Your job is live on the board." },
    { status: 201 },
  );
}
