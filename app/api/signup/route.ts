import { NextResponse } from "next/server";
import { createUser } from "@/lib/db";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { signupSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, "signup");
  if (!captcha.success) {
    return NextResponse.json(
      { error: "reCAPTCHA verification failed. Please try again.", captcha },
      { status: 403 },
    );
  }

  const result = await createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
    role: parsed.data.role,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(
    {
      ok: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      message: "Account created. You can sign in now.",
    },
    { status: 201 },
  );
}
