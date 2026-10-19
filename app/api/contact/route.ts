import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { saveContactMessage } from "@/lib/db";
import { contactSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, "contact");
  if (!captcha.success) {
    return NextResponse.json(
      { error: "reCAPTCHA verification failed. Please try again.", captcha },
      { status: 403 },
    );
  }

  await saveContactMessage({
    id: `contact-${Date.now()}`,
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    createdAt: new Date().toISOString(),
    captchaScore: captcha.score,
  });

  const configured = Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM,
  );

  if (!configured) {
    return NextResponse.json({
      ok: true,
      delivered: false,
      note: "Message received. SMTP is not configured in this environment, so it has been stored for the support team.",
      captcha,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM,
      replyTo: parsed.data.email,
      subject: `[Aaron Works] ${parsed.data.subject}`,
      text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}\n\nreCAPTCHA score: ${captcha.score ?? "not configured"}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(parsed.data.name)}<br/>
<strong>Email:</strong> ${escapeHtml(parsed.data.email)}<br/>
<strong>reCAPTCHA score:</strong> ${captcha.score ?? "not configured"}</p>
<p style="white-space:pre-wrap">${escapeHtml(parsed.data.message)}</p>`,
    });

    return NextResponse.json({ ok: true, delivered: true, captcha });
  } catch (error) {
    return NextResponse.json(
      {
        ok: true,
        delivered: false,
        note: "Message stored, but the email could not be sent right now. Our Nairobi team will follow up.",
        error: error instanceof Error ? error.message : "SMTP error",
        captcha,
      },
      { status: 202 },
    );
  }
}
