"use client";

import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { getRecaptchaToken, isRecaptchaConfigured } from "@/lib/recaptcha-client";

export default function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setNote(null);
    const token = await getRecaptchaToken("contact");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, recaptchaToken: token }),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        setNote(data.error ?? "Could not send your message.");
        return;
      }
      setStatus("sent");
      setNote(data.note ?? "Message received. Our Nairobi team will reply within one working day.");
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setNote("Network error. Please try again.");
    }
  };

  const update = (key: keyof typeof values) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValues((current) => ({ ...current, [key]: event.target.value }));

  return (
    <form className="aw-form" onSubmit={submit}>
      {note ? (
        <div
          className={`aw-alert ${status === "sent" ? "aw-alert--success" : "aw-alert--error"}`}
          role="status"
        >
          {note}
        </div>
      ) : null}

      <div className="aw-form__grid">
        <div className="aw-field">
          <label htmlFor="contact-name">Your name</label>
          <input id="contact-name" className="aw-input" value={values.name} onChange={update("name")} required />
        </div>
        <div className="aw-field">
          <label htmlFor="contact-email">Email address</label>
          <input id="contact-email" type="email" className="aw-input" value={values.email} onChange={update("email")} required />
        </div>
        <div className="aw-field aw-field--full">
          <label htmlFor="contact-subject">Subject</label>
          <input id="contact-subject" className="aw-input" value={values.subject} onChange={update("subject")} required />
        </div>
        <div className="aw-field aw-field--full">
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" className="aw-textarea" value={values.message} onChange={update("message")} required />
        </div>
      </div>

      <div className="aw-note aw-mt-2">
        <ShieldCheck size={15} aria-hidden="true" />
        <span>
          Protected by Google reCAPTCHA v3 (invisible) and delivered to our Nairobi
          support inbox via nodemailer
          {isRecaptchaConfigured() ? "" : " (verification is skipped locally until keys are set)"}.
        </span>
      </div>

      <button
        type="submit"
        className="aw-btn aw-btn--green"
        disabled={status === "sending"}
        style={{ marginTop: 12 }}
      >
        <Mail size={15} aria-hidden="true" />
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
