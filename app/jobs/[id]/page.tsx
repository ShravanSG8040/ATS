import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SubmitButton } from "@/components/SubmitButton";
import { ArrowLeftIcon, CheckIcon, ClockIcon, PinIcon, TeamIcon } from "@/components/icons";
import { postedAgo } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ applied?: string; error?: string }>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function submitApplication(formData: FormData) {
  "use server";

  const jobId = String(formData.get("jobId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const resumeUrl = String(formData.get("resumeUrl") ?? "").trim();

  const job = await prisma.job.findUnique({ where: { id: jobId }, select: { id: true } });
  if (!job) notFound();

  if (!name || !EMAIL_PATTERN.test(email)) {
    redirect(`/jobs/${jobId}?error=1`);
  }

  await prisma.application.create({
    data: { jobId, name, email, resumeUrl: resumeUrl || null },
  });

  revalidatePath("/dashboard");
  redirect(`/jobs/${jobId}?applied=1`);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id }, select: { title: true } });
  return { title: job?.title ?? "Role not found" };
}

export default async function JobDetailPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { id } = await params;
  const { applied, error } = await searchParams;

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <div className="container">
      <Link href="/jobs" className="back-link">
        <ArrowLeftIcon />
        All open roles
      </Link>

      <div className="job-detail">
        <article>
          <h1 className="job-detail-title">{job.title}</h1>
          <div className="job-detail-meta">
            <span className="tag">
              <TeamIcon />
              {job.department}
            </span>
            <span className="tag">
              <PinIcon />
              {job.location}
            </span>
            <span className="tag">
              <ClockIcon />
              {postedAgo(job.createdAt)}
            </span>
          </div>
          <div className="job-description">{job.description}</div>
        </article>

        <aside className="apply-card panel" aria-labelledby="apply-title">
          {applied ? (
            <div className="success" role="status">
              <span className="success-icon">
                <CheckIcon />
              </span>
              <h2 id="apply-title">Application sent</h2>
              <p className="muted">
                Thanks for applying to {job.title}. The hiring team will review it and contact you by email.
              </p>
              <Link href="/jobs" className="btn btn-secondary btn-sm">
                Browse more roles
              </Link>
            </div>
          ) : (
            <>
              <h2 id="apply-title">Apply for this role</h2>
              <p className="muted">It takes about a minute. No account needed.</p>
              {error && (
                <p className="notice notice-error" role="alert" style={{ marginTop: "1rem" }}>
                  Enter your full name and a valid email address, then send again.
                </p>
              )}
              <form action={submitApplication} className="form-stack">
                <input type="hidden" name="jobId" value={job.id} />
                <label className="field">
                  <span className="field-label">Full name</span>
                  <input className="input" name="name" autoComplete="name" required />
                </label>
                <label className="field">
                  <span className="field-label">Email</span>
                  <input className="input" name="email" type="email" autoComplete="email" required />
                </label>
                <label className="field">
                  <span className="field-label">Résumé link</span>
                  <input className="input" name="resumeUrl" type="url" placeholder="https://" />
                  <span className="field-hint">Optional. A Google Drive, Dropbox or portfolio link works.</span>
                </label>
                <SubmitButton pendingLabel="Sending…">Send application</SubmitButton>
              </form>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
