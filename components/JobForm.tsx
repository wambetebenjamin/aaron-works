"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Paperclip, ShieldCheck, UploadCloud } from "lucide-react";
import { CATEGORIES } from "@/lib/seed";
import { getRecaptchaToken, isRecaptchaConfigured } from "@/lib/recaptcha-client";

type Fields = {
  title: string;
  description: string;
  category: string;
  skills: string;
  budgetType: "fixed" | "hourly";
  budgetMin: number;
  budgetMax: number;
  deadline: string;
};

export default function JobForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    defaultValues: {
      category: CATEGORIES[0].name,
      budgetType: "fixed",
      budgetMin: 50000,
      budgetMax: 120000,
    },
  });
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const budgetType = watch("budgetType");

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    setUploading(true);
    setUploadNote(null);
    const uploaded: { name: string; url: string }[] = [];

    for (const file of selected) {
      const body = new FormData();
      body.append("file", file);
      try {
        const response = await fetch("/api/upload", { method: "POST", body });
        const data = await response.json();
        if (!response.ok) {
          setUploadNote(data.error ?? "Upload failed.");
          continue;
        }
        uploaded.push({ name: data.name, url: data.url });
      } catch {
        setUploadNote("Upload failed. Check your connection.");
      }
    }

    setFiles((current) => [...current, ...uploaded].slice(0, 5));
    setUploading(false);
    event.target.value = "";
  };

  const onSubmit = async (values: Fields) => {
    setServerError(null);
    const skills = values.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      setServerError("Add at least one skill, separated by commas.");
      return;
    }
    if (Number(values.budgetMax) < Number(values.budgetMin)) {
      setServerError("Maximum budget must be greater than the minimum.");
      return;
    }

    const token = await getRecaptchaToken("post_job");

    try {
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          category: values.category,
          skills,
          budgetType: values.budgetType,
          budgetMin: Number(values.budgetMin),
          budgetMax: Number(values.budgetMax),
          deadline: values.deadline,
          attachments: files.map((f) => f.url),
          recaptchaToken: token,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setServerError(data.error ?? "Could not post the job.");
        return;
      }
      router.push(`/jobs/${data.job.id}`);
      router.refresh();
    } catch {
      setServerError("Network error. Please try again.");
    }
  };

  return (
    <form className="aw-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError ? (
        <div className="aw-alert aw-alert--error" role="alert">
          {serverError}
        </div>
      ) : null}

      <div className="aw-form__grid">
        <div className="aw-field aw-field--full">
          <label htmlFor="job-title">Job title</label>
          <input
            id="job-title"
            className="aw-input"
            placeholder="e.g. Build a Next.js storefront for a Nairobi fashion label"
            {...register("title", {
              required: "Add a job title.",
              minLength: { value: 8, message: "Use at least 8 characters." },
            })}
          />
          {errors.title ? <p className="aw-error">{errors.title.message}</p> : null}
        </div>

        <div className="aw-field aw-field--full">
          <label htmlFor="job-description">Description</label>
          <textarea
            id="job-description"
            className="aw-textarea"
            style={{ minHeight: 170 }}
            placeholder="Describe the deliverables, context, timeline and anything the freelancer should know. Separate paragraphs with a blank line."
            {...register("description", {
              required: "Describe the work.",
              minLength: { value: 40, message: "Write at least 40 characters." },
            })}
          />
          {errors.description ? (
            <p className="aw-error">{errors.description.message}</p>
          ) : null}
        </div>

        <div className="aw-field">
          <label htmlFor="job-category">Category</label>
          <select id="job-category" className="aw-select" {...register("category")}>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="aw-field">
          <label htmlFor="job-skills">Skills required</label>
          <input
            id="job-skills"
            className="aw-input"
            placeholder="Next.js, React, M-Pesa"
            {...register("skills", { required: "Add at least one skill." })}
          />
          {errors.skills ? <p className="aw-error">{errors.skills.message}</p> : null}
          <p className="aw-hint">Separate skills with commas. Maximum 12.</p>
        </div>

        <div className="aw-field">
          <label htmlFor="job-budget-type">Budget type</label>
          <select
            id="job-budget-type"
            className="aw-select"
            {...register("budgetType")}
          >
            <option value="fixed">Fixed price</option>
            <option value="hourly">Hourly rate</option>
          </select>
        </div>

        <div className="aw-field">
          <label htmlFor="job-deadline">Deadline</label>
          <input
            id="job-deadline"
            type="date"
            className="aw-input"
            {...register("deadline", { required: "Set a deadline." })}
          />
          {errors.deadline ? (
            <p className="aw-error">{errors.deadline.message}</p>
          ) : null}
        </div>

        <div className="aw-field">
          <label htmlFor="job-min">
            {budgetType === "hourly" ? "Minimum rate (KES/hr)" : "Minimum budget (KES)"}
          </label>
          <input
            id="job-min"
            type="number"
            min={1}
            step={500}
            className="aw-input"
            {...register("budgetMin", {
              required: "Add a minimum budget.",
              valueAsNumber: true,
            })}
          />
        </div>

        <div className="aw-field">
          <label htmlFor="job-max">
            {budgetType === "hourly" ? "Maximum rate (KES/hr)" : "Maximum budget (KES)"}
          </label>
          <input
            id="job-max"
            type="number"
            min={1}
            step={500}
            className="aw-input"
            {...register("budgetMax", {
              required: "Add a maximum budget.",
              valueAsNumber: true,
            })}
          />
        </div>

        <div className="aw-field aw-field--full">
          <label htmlFor="job-files">Attachments (optional)</label>
          <label
            htmlFor="job-files"
            className="aw-input"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              color: "#6f7a73",
              height: "auto",
              minHeight: 46,
            }}
          >
            <UploadCloud size={16} aria-hidden="true" />
            {uploading ? "Uploading…" : "Add briefs, specs or references (PDF, DOCX, ZIP, images · max 8 MB each)"}
          </label>
          <input
            id="job-files"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.zip,.txt,image/*"
            onChange={handleFiles}
            style={{ display: "none" }}
          />
          {uploadNote ? <p className="aw-hint">{uploadNote}</p> : null}
          {files.length ? (
            <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0" }}>
              {files.map((file) => (
                <li key={file.url} className="aw-small aw-inline" style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <Paperclip size={12} aria-hidden="true" />
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="aw-link">
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="aw-hint">
            Files are uploaded to Vercel Blob when BLOB_READ_WRITE_TOKEN is
            configured. You can post without attachments.
          </p>
        </div>
      </div>

      <div className="aw-note aw-mt-2">
        <ShieldCheck size={15} aria-hidden="true" />
        <span>
          Every submission is checked with Google reCAPTCHA v3 (invisible)
          {isRecaptchaConfigured() ? "" : " — skipped locally until RECAPTCHA keys are set"}.
          Jobs are reviewed against the Aaron Works posting policy.
        </span>
      </div>

      <button
        type="submit"
        className="aw-btn aw-btn--green aw-btn--block aw-mt-2"
        disabled={isSubmitting || uploading}
      >
        {isSubmitting ? "Publishing your job…" : "Publish job"}
      </button>
    </form>
  );
}
