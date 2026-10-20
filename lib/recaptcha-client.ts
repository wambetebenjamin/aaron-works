"use client";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

let loader: Promise<void> | null = null;

export function recaptchaSiteKey() {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
}

export function isRecaptchaConfigured() {
  return Boolean(recaptchaSiteKey());
}

export function loadRecaptcha(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha) return Promise.resolve();
  if (loader) return loader;

  const key = recaptchaSiteKey();
  if (!key) return Promise.resolve();

  loader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-aaron-recaptcha="true"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("reCAPTCHA failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
    script.async = true;
    script.defer = true;
    script.dataset.aaronRecaptcha = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("reCAPTCHA failed to load"));
    document.head.appendChild(script);
  });

  return loader;
}

/**
 * Executes Google reCAPTCHA v3 (invisible) for a named action.
 * Returns null when no site key is configured so forms can still be tested
 * locally; the server-side verifier reports `skipped` in that case.
 */
export async function getRecaptchaToken(action: string): Promise<string | null> {
  const key = recaptchaSiteKey();
  if (!key) return null;

  try {
    await loadRecaptcha();
    if (!window.grecaptcha) return null;
    await new Promise<void>((resolve) => {
      window.grecaptcha?.ready(() => resolve());
    });
    const token = await window.grecaptcha.execute(key, { action });
    return token;
  } catch {
    return null;
  }
}
