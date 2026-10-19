import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Tell us your full name").max(80),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(200)
    .regex(/[A-Za-z]/, "Include at least one letter")
    .regex(/[0-9]/, "Include at least one number"),
  role: z.enum(["client", "freelancer"]),
  recaptchaToken: z.string().optional().nullable(),
});

export const jobCreateSchema = z.object({
  title: z.string().min(8, "Give the job a clear title").max(140),
  description: z.string().min(40, "Describe the work in at least 40 characters").max(8000),
  category: z.string().min(2, "Choose a category"),
  skills: z.array(z.string().min(1)).min(1, "Add at least one skill").max(12),
  budgetType: z.enum(["fixed", "hourly"]),
  budgetMin: z.number().int().positive().max(50_000_000),
  budgetMax: z.number().int().positive().max(50_000_000),
  deadline: z.string().min(4, "Set a deadline"),
  attachments: z.array(z.string().url()).max(5).optional().default([]),
  recaptchaToken: z.string().optional().nullable(),
});

export const proposalSchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z.string().min(60, "Write at least 60 characters").max(4000),
  rate: z.number().positive().max(5_000_000),
  delivery: z.number().int().positive().max(365),
  recaptchaToken: z.string().optional().nullable(),
});

export const messageSchema = z.object({
  recipientId: z.string().min(1),
  message: z.string().min(1, "Write a message").max(4000),
  threadId: z.string().optional(),
  jobTitle: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your name").max(80),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Add a subject").max(140),
  message: z.string().min(20, "Add a little more detail").max(4000),
  recaptchaToken: z.string().optional().nullable(),
});

export type JobCreateInput = z.infer<typeof jobCreateSchema>;
export type ProposalInput = z.infer<typeof proposalSchema>;
