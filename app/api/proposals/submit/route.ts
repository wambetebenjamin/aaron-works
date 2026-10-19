import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createProposal, getFreelancer, getJob } from "@/lib/db";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { proposalSchema } from "@/lib/validation";
import type { Proposal } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Sign in to submit a proposal.", signInRequired: true },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = proposalSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, "proposal");
  if (!captcha.success) {
    return NextResponse.json(
      { error: "reCAPTCHA verification failed. Please try again.", captcha },
      { status: 403 },
    );
  }

  const job = await getJob(parsed.data.jobId);
  if (!job) {
    return NextResponse.json({ error: "That job no longer exists." }, { status: 404 });
  }

  const freelancer =
    (session.user.username && (await getFreelancer(session.user.username))) || null;

  const proposal: Proposal = {
    id: `prop-${Date.now()}`,
    jobId: job.id,
    jobTitle: job.title,
    freelancerId: freelancer?.id ?? session.user.id,
    freelancerName: freelancer?.name ?? session.user.name ?? "Freelancer",
    freelancerUsername: freelancer?.username ?? session.user.username ?? "freelancer",
    freelancerAvatar:
      freelancer?.avatar ?? session.user.image ?? "/images/freelancers/amina-hassan.jpg",
    clientId: job.client.id,
    coverLetter: parsed.data.coverLetter,
    rate: parsed.data.rate,
    deliveryDays: parsed.data.delivery,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  await createProposal(proposal);

  return NextResponse.json(
    {
      ok: true,
      proposal,
      captcha,
      message: "Proposal sent. The client typically replies within two days.",
    },
    { status: 201 },
  );
}
