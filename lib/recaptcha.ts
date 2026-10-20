export interface RecaptchaResult {
  success: boolean;
  score: number | null;
  action: string | null;
  skipped: boolean;
  reason?: string;
}

const SITEVERIFY = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

/**
 * Server-side Google reCAPTCHA v3 verification.
 * When RECAPTCHA_SECRET_KEY is not configured the check is reported as
 * skipped (never silently "passed" as if a score existed) and the request is
 * allowed so local previews remain usable. Configure the key in production.
 */
export async function verifyRecaptcha(
  token: string | null | undefined,
  expectedAction?: string,
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return {
      success: true,
      score: null,
      action: expectedAction ?? null,
      skipped: true,
      reason: "RECAPTCHA_SECRET_KEY is not configured",
    };
  }

  if (!token) {
    return {
      success: false,
      score: null,
      action: expectedAction ?? null,
      skipped: false,
      reason: "Missing reCAPTCHA token",
    };
  }

  try {
    const response = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        score: null,
        action: null,
        skipped: false,
        reason: `reCAPTCHA verification failed with HTTP ${response.status}`,
      };
    }

    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    const score = typeof data.score === "number" ? data.score : null;
    const actionMatches = !expectedAction || !data.action || data.action === expectedAction;

    return {
      success: Boolean(data.success) && actionMatches && (score === null || score >= MIN_SCORE),
      score,
      action: data.action ?? null,
      skipped: false,
      reason: data.success
        ? actionMatches
          ? undefined
          : `Action mismatch (expected ${expectedAction}, got ${data.action})`
        : (data["error-codes"] || []).join(", ") || "Verification rejected",
    };
  } catch (error) {
    return {
      success: false,
      score: null,
      action: null,
      skipped: false,
      reason: error instanceof Error ? error.message : "Verification error",
    };
  }
}
