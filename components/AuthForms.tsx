"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { signupSchema } from "@/lib/validation";
import { getRecaptchaToken, isRecaptchaConfigured } from "@/lib/recaptcha-client";

function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.3 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-2.8-.4-4.1H24v8.4h12.5c-.3 2.1-1.6 5.2-4.6 7.3l7.6 5.9c4.4-4.1 6.6-10.1 6.6-17.5z" />
      <path fill="#FBBC05" d="M10.4 28.7a14.6 14.6 0 0 1 0-9.4L2.6 13.2A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.6-5.8l-7.6-5.9c-2 1.4-4.7 2.4-8 2.4-6.3 0-11.7-3.8-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function redirectTarget(callbackUrl: string | null, role?: string) {
  if (callbackUrl && callbackUrl.startsWith("/")) return callbackUrl;
  return role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";
}

export function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; password: string }>({
    defaultValues: { email: "", password: "" },
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values: { email: string; password: string }) => {
    setError(null);

    // Invisible reCAPTCHA v3 on sign-in. When the site key is absent this is a
    // no-op and the server reports `skipped`, matching the other forms.
    const token = await getRecaptchaToken("signin");
    if (token) {
      try {
        const check = await fetch("/api/recaptcha/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, action: "signin" }),
        });
        if (!check.ok) {
          setError("Verification failed. Refresh the page and try again.");
          return;
        }
      } catch {
        setError("Could not verify the request. Check your connection and try again.");
        return;
      }
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (result?.error) {
      setError("Those details did not match an account. Check your email and password.");
      return;
    }
    const session = await getSession();
    router.push(redirectTarget(callbackUrl, session?.user?.role));
    router.refresh();
  };

  return (
    <div className="aw-auth__card">
      <span className="aw-eyebrow">Welcome back</span>
      <h1 className="aw-mt-1">Sign in to Aaron Works</h1>
      <p>Track proposals, manage contracts and message clients or freelancers.</p>

      {error ? (
        <div className="aw-alert aw-alert--error" role="alert">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="aw-field aw-mb-2">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="aw-input"
            placeholder="you@company.co.ke"
            {...register("email", {
              required: "Enter your email address.",
              pattern: { value: /.+@.+\..+/, message: "Enter a valid email address." },
            })}
          />
          {errors.email ? <p className="aw-error">{errors.email.message}</p> : null}
        </div>

        <div className="aw-field aw-mb-2">
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="aw-input"
              style={{ paddingRight: 42 }}
              placeholder="Your password"
              {...register("password", {
                required: "Enter your password.",
                minLength: { value: 8, message: "Passwords are at least 8 characters." },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: 0,
                color: "#7c867e",
                cursor: "pointer",
                padding: 4,
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password ? (
            <p className="aw-error">{errors.password.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="aw-btn aw-btn--green aw-btn--block"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="aw-divider">or</div>

      <button
        type="button"
        className="aw-google"
        onClick={() => signIn("google", { callbackUrl: callbackUrl ?? "/" })}
        disabled={!googleEnabled}
        title={googleEnabled ? undefined : "Google sign-in requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"}
      >
        <GoogleMark />
        Continue with Google
      </button>
      {!googleEnabled ? (
        <p className="aw-hint aw-mt-1">
          Google OAuth is ready — add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to
          enable the button.
        </p>
      ) : null}

      <p className="aw-hint aw-mt-2" style={{ background: "#f6f8f0", padding: 10, borderRadius: 3 }}>
        <strong>Demo accounts:</strong> client@aaronworks.co.ke or
        freelancer@aaronworks.co.ke · password Demo1234!
      </p>
      <p className="aw-hint aw-mt-1" style={{ display: "flex", gap: 6 }}>
        <ShieldCheck size={12} aria-hidden="true" style={{ flex: "none", marginTop: 2 }} />
        Sign-in is protected by Google reCAPTCHA v3 (invisible).
      </p>

      <p className="aw-auth__foot">
        New to Aaron Works? <Link href="/auth/signup" className="aw-link">Create a free account</Link>
      </p>
    </div>
  );
}

export function SignUpForm({
  googleEnabled,
  initialRole,
}: {
  googleEnabled: boolean;
  initialRole: "client" | "freelancer";
}) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");
  const [role, setRole] = useState<"client" | "freelancer">(initialRole);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
    email: string;
    password: string;
  }>({ defaultValues: { name: "", email: "", password: "" } });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: { name: string; email: string; password: string }) => {
    setError(null);
    const parsed = signupSchema.safeParse({ ...values, role });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }

    const token = await getRecaptchaToken("signup");
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, recaptchaToken: token }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not create your account.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (signInResult?.error) {
        router.push("/auth/signin");
        return;
      }
      router.push(redirectTarget(callbackUrl, role));
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="aw-auth__card">
      <span className="aw-eyebrow">Join free</span>
      <h1 className="aw-mt-1">Create your Aaron Works account</h1>
      <p>Choose how you want to use the marketplace. You can switch later.</p>

      {error ? (
        <div className="aw-alert aw-alert--error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="aw-roles" role="group" aria-label="Account type">
        <button
          type="button"
          className="aw-role"
          aria-pressed={role === "client"}
          onClick={() => setRole("client")}
        >
          <BriefcaseBusiness size={18} aria-hidden="true" />
          <span>
            <strong>I am a Client</strong>
            <span>I want to hire talent</span>
          </span>
        </button>
        <button
          type="button"
          className="aw-role"
          aria-pressed={role === "freelancer"}
          onClick={() => setRole("freelancer")}
        >
          <UserRound size={18} aria-hidden="true" />
          <span>
            <strong>I am a Freelancer</strong>
            <span>I want to find work</span>
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="aw-field aw-mb-2">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            className="aw-input"
            autoComplete="name"
            placeholder="e.g. Amina Hassan"
            {...register("name", {
              required: "Enter your full name.",
              minLength: { value: 2, message: "Use at least 2 characters." },
            })}
          />
          {errors.name ? <p className="aw-error">{errors.name.message}</p> : null}
        </div>

        <div className="aw-field aw-mb-2">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            className="aw-input"
            autoComplete="email"
            placeholder="you@company.co.ke"
            {...register("email", {
              required: "Enter your email address.",
              pattern: { value: /.+@.+\..+/, message: "Enter a valid email address." },
            })}
          />
          {errors.email ? <p className="aw-error">{errors.email.message}</p> : null}
        </div>

        <div className="aw-field aw-mb-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="aw-input"
            autoComplete="new-password"
            placeholder="At least 8 characters, one number"
            {...register("password", {
              required: "Choose a password.",
              minLength: { value: 8, message: "Use at least 8 characters." },
            })}
          />
          {errors.password ? (
            <p className="aw-error">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="aw-note">
          <ShieldCheck size={15} aria-hidden="true" />
          <span>
            By creating an account you agree to our{" "}
            <Link href="/legal/terms" className="aw-link">terms</Link> and{" "}
            <Link href="/legal/privacy-policy" className="aw-link">privacy policy</Link>.
            Sign-ups are protected by Google reCAPTCHA v3 (invisible)
            {isRecaptchaConfigured() ? "" : " — skipped locally until keys are configured"}.
          </span>
        </div>

        <button
          type="submit"
          className="aw-btn aw-btn--green aw-btn--block"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account…" : `Create ${role} account`}
        </button>
      </form>

      <div className="aw-divider">or</div>

      <button
        type="button"
        className="aw-google"
        onClick={() => signIn("google", { callbackUrl: callbackUrl ?? "/" })}
        disabled={!googleEnabled}
      >
        <GoogleMark />
        Continue with Google
      </button>
      {!googleEnabled ? (
        <p className="aw-hint aw-mt-1">
          Google OAuth will activate once GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
          are set.
        </p>
      ) : null}

      <p className="aw-auth__foot">
        Already have an account?{" "}
        <Link href="/auth/signin" className="aw-link">Sign in</Link>
      </p>

      <p className="aw-hint aw-inline aw-mt-2" style={{ justifyContent: "center" }}>
        <CheckCircle2 size={13} aria-hidden="true" /> Verified profiles · Secure escrow ·
        Kenya-based support
      </p>
    </div>
  );
}
