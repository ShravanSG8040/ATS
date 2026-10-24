import type { Metadata } from "next";
import Link from "next/link";
import { createJob } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { ArrowLeftIcon } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Post a job" };

export default async function NewJobPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <div className="container">
      <Link href="/dashboard" className="back-link">
        <ArrowLeftIcon />
        Back to dashboard
      </Link>
      <header className="page-head" style={{ paddingTop: "1.5rem" }}>
        <h1 className="page-title">Post a job</h1>
        <p className="page-lede">The role goes live on the Open roles page as soon as you post it.</p>
      </header>

      <form action={createJob} className="post-job panel form-stack">
        {error && (
          <p className="notice notice-error" role="alert">
            Fill in every field to post the job.
          </p>
        )}
        <label className="field">
          <span className="field-label">Job title</span>
          <input className="input" name="title" placeholder="e.g. Frontend engineer" required />
        </label>
        <div className="form-row">
          <label className="field">
            <span className="field-label">Team</span>
            <input className="input" name="department" placeholder="e.g. Engineering" required />
          </label>
          <label className="field">
            <span className="field-label">Location</span>
            <input className="input" name="location" placeholder="e.g. Remote or Pune" required />
          </label>
        </div>
        <label className="field">
          <span className="field-label">Description</span>
          <textarea
            className="input"
            name="description"
            rows={8}
            placeholder="What the person will do, what you're looking for, and anything candidates should know."
            required
          />
          <span className="field-hint">Line breaks are kept, so you can use short paragraphs.</span>
        </label>
        <div>
          <SubmitButton pendingLabel="Posting…">Post job</SubmitButton>
        </div>
      </form>
    </div>
  );
}
