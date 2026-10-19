"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ShieldCheck, Send } from "lucide-react";
import { proposalSchema } from "@/lib/validation";
import { getRecaptchaToken, isRecaptchaConfigured } from "@/lib/recaptcha-client";

type Fields = {
  coverLetter: string;
  rate: number;
  delivery: number;
};

export default function ProposalForm({
  jobId,
  jobTitle,
  suggestedRate,
  signedIn,
  defaultCoverLetter,
  hourly = false,
}: {
  jobId: string;
  jobTitle: string;
  suggestedRate?: number;
  signedIn: boolean;
  defaultCoverLetter?: string;
  hourly?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    defaultValues: {
      coverLetter: defaultCoverLetter ?? "",
      rate: suggestedRate ?? 2000,
      delivery: 14,
    },
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (values: Fields) => {
    setServerError(null);
    const parsed = proposalSchema.safeParse({
      jobId,
      coverLetter: values.coverLetter,
      rate: Number(values.rate),
      delivery: Number(values.delivery),
    });
    if (!parsed.success) {
      setServerError(parsed.error.issues[0]?.message ?? "Please check your proposal.");
      return;
    }

    const token = await getRecaptchaToken("proposal");
    try {
      const response = await fetch("/api/proposals/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, recaptchaToken: token }),
      });
      const data = await response.json();
      if (!response.ok) {
        setServerError(data.error ?? "Could not send your proposal.");
        return;
      }
      setSuccess(true);
    } catch {
      setServerError("Network error. Check your connection and try again.");
    }
  };

  if (!signedIn) {
    return (
      <div className="aw-panel" id="proposal">
        <h2>Submit a proposal</h2>
        <p className="aw-small aw-mb-2">
          Aaron Works requires a signed-in account to protect both clients and
          freelancers. It takes about a minute.
        </p>
        <div className="aw-inline aw-gap-1 aw-wrapflex">
          <Link
            href={`/auth/signin?callbackUrl=${encodeURIComponent(`/jobs/${jobId}#proposal`)}`}
            className="aw-btn aw-btn--blue"
          >
            Sign in to apply
          </Link>
          <Link
            href={`/auth/signup?role=freelancer&callbackUrl=${encodeURIComponent(`/jobs/${jobId}#proposal`)}`}
            className="aw-btn aw-btn--outline"
          >
            Create a freelancer account
          </Link>
        </div>
        <p className="aw-hint aw-mt-2">
          Demo login: freelancer@aaronworks.co.ke · Demo1234!
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="aw-panel" id="proposal">
        <div className="aw-alert aw-alert--success">
          <strong>Proposal sent.</strong> Your proposal for “{jobTitle}” is now
          with the client. You can track it in your freelancer dashboard.
        </div>
        <div className="aw-inline aw-gap-1 aw-mt-2">
          <Link href="/dashboard/freelancer" className="aw-btn aw-btn--blue aw-btn--sm">
            View my proposals
          </Link>
          <Link href="/jobs" className="aw-btn aw-btn--outline aw-btn--sm">
            Browse more jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="aw-panel" id="proposal" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Submit a proposal</h2>
      <p className="aw-small aw-mb-2">
        Clients see your cover letter, rate and estimated delivery. Be specific
        about how you will approach the work.
      </p>

      {serverError ? (
        <div className="aw-alert aw-alert--error" role="alert">
          {serverError}
        </div>
      ) : null}

      <div className="aw-field aw-mb-2">
        <label htmlFor="coverLetter">Cover letter</label>
        <textarea
          id="coverLetter"
          className="aw-textarea"
          placeholder="Introduce yourself, describe your approach, and mention relevant work…"
          {...register("coverLetter", {
            required: "Write a short cover letter.",
            minLength: { value: 60, message: "Write at least 60 characters." },
          })}
        />
        {errors.coverLetter ? (
          <p className="aw-error">{errors.coverLetter.message}</p>
        ) : null}
        <p className="aw-hint">
          Tip: reference the brief and share one comparable project.
        </p>
      </div>

      <div className="aw-form__grid">
        <div className="aw-field">
          <label htmlFor="rate">Proposed rate (KES{hourly ? "/hr" : ""})</label>
          <input
            id="rate"
            type="number"
            min={1}
            step={100}
            className="aw-input"
            {...register("rate", {
              required: "Enter your rate.",
              valueAsNumber: true,
              min: { value: 1, message: "Enter a rate above zero." },
            })}
          />
          {errors.rate ? <p className="aw-error">{errors.rate.message}</p> : null}
          <p className="aw-hint">
            {hourly
              ? "Enter your hourly rate. The client’s range is shown on the job post."
              : "Enter your total price. The client’s budget range is shown on the job post."}
          </p>
        </div>
        <div className="aw-field">
          <label htmlFor="delivery">Estimated delivery (days)</label>
          <input
            id="delivery"
            type="number"
            min={1}
            max={365}
            className="aw-input"
            {...register("delivery", {
              required: "Set a delivery estimate.",
              valueAsNumber: true,
              min: { value: 1, message: "At least one day." },
            })}
          />
          {errors.delivery ? (
            <p className="aw-error">{errors.delivery.message}</p>
          ) : null}
        </div>
      </div>

      <div className="aw-note aw-mt-2">
        <ShieldCheck size={15} aria-hidden="true" />
        <span>
          Protected by Google reCAPTCHA v3 (invisible)
          {isRecaptchaConfigured()
            ? ""
            : " — not configured in this environment, so verification is skipped locally"}
          . Your proposal is stored against your session account.
        </span>
      </div>

      <button
        type="submit"
        className="aw-btn aw-btn--green aw-btn--block"
        disabled={isSubmitting}
      >
        <Send size={15} aria-hidden="true" />
        {isSubmitting ? "Sending proposal…" : "Send proposal"}
      </button>
    </form>
  );
}
