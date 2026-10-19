import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  token: z.string().min(1),
  action: z.string().min(1).max(80).optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "A reCAPTCHA token is required.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const result = await verifyRecaptcha(parsed.data.token, parsed.data.action);

  return NextResponse.json(
    {
      success: result.success,
      score: result.score,
      action: result.action,
      skipped: result.skipped,
      reason: result.reason ?? null,
      provider: "google-recaptcha-v3",
    },
    { status: result.success ? 200 : 403 },
  );
}
