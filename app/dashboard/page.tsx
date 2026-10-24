import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { logout } from "./actions";
import { DeleteJobButton } from "@/components/DeleteJobButton";
import { StatusSelect } from "@/components/StatusSelect";
import { SearchIcon } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import { formatDate, plural } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { STATUSES, isStatus, stageVar } from "@/lib/statuses";

export const metadata: Metadata = { title: "Recruiter dashboard" };

type SearchParams = Promise<{ q?: string; status?: string; job?: string; posted?: string }>;

const ACTIVE_STAGES = ["submitted", "screening", "interview", "offer"];

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const status = params.status && isStatus(params.status) ? params.status : "";
  const jobId = params.job ?? "";

  const where: Prisma.ApplicationWhereInput = {
    ...(q && { OR: [{ name: { contains: q } }, { email: { contains: q } }] }),
    ...(status && { status }),
    ...(jobId && { jobId }),
  };

  const [jobs, statusCounts, applications, postedJob] = await Promise.all([
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    }),
    prisma.application.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { job: { select: { title: true } } },
      take: 100,
    }),
    params.posted ? prisma.job.findUnique({ where: { id: params.posted }, select: { title: true } }) : null,
  ]);

  const countFor = (value: string) => statusCounts.find((row) => row.status === value)?._count._all ?? 0;
  const totalApplicants = statusCounts.reduce((sum, row) => sum + row._count._all, 0);
  const inProgress = ACTIVE_STAGES.reduce((sum, value) => sum + countFor(value), 0);
  const filtered = Boolean(q || status || jobId);

  return (
    <div className="container">
      <header className="dash-head">
        <div>
          <h1 className="page-title">Hiring dashboard</h1>
          <p className="page-lede">
            {totalApplicants === 0
              ? "Applications will show up here as soon as candidates apply."
              : `${plural(inProgress, "applicant")} still in progress across ${plural(jobs.length, "role")}.`}
          </p>
        </div>
        <div className="dash-actions">
          <Link href="/dashboard/jobs/new" className="btn btn-primary">
            Post a job
          </Link>
          <form action={logout}>
            <button type="submit" className="btn btn-ghost">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="dash-grid">
        {postedJob && (
          <p className="notice" role="status">
            Posted “{postedJob.title}”. It&apos;s now live on the Open roles page.
          </p>
        )}

        <section className="stats panel" aria-label="Summary">
          <div className="stat">
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Open roles</div>
          </div>
          <div className="stat">
            <div className="stat-value">{totalApplicants}</div>
            <div className="stat-label">Total applicants</div>
          </div>
          <div className="stat">
            <div className="stat-value">{countFor("interview")}</div>
            <div className="stat-label">In interviews</div>
          </div>
          <div className="stat">
            <div className="stat-value">{countFor("hired")}</div>
            <div className="stat-label">Hired</div>
          </div>
        </section>

        <section className="pipeline panel" aria-labelledby="pipeline-title">
          <div className="pipeline-head">
            <h2 id="pipeline-title">Pipeline</h2>
            <span className="muted">{plural(totalApplicants, "applicant")}</span>
          </div>
          {totalApplicants > 0 && (
            <div className="pipeline-bar" role="img" aria-label="Applicants by stage">
              {STATUSES.filter((stage) => countFor(stage.value) > 0).map((stage, index) => (
                <div
                  key={stage.value}
                  className="pipeline-seg"
                  style={{
                    ...stageVar(stage.value),
                    width: `${(countFor(stage.value) / totalApplicants) * 100}%`,
                    animationDelay: `${index * 0.06}s`,
                  }}
                  title={`${stage.label}: ${countFor(stage.value)}`}
                />
              ))}
            </div>
          )}
          <ul className="pipeline-legend">
            {STATUSES.map((stage) => (
              <li key={stage.value} style={stageVar(stage.value)}>
                <Link href={`/dashboard?status=${stage.value}`} style={{ textDecoration: "none" }}>
                  {stage.label} <strong>{countFor(stage.value)}</strong>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="applicants panel" aria-labelledby="applicants-title">
          <h2 id="applicants-title" className="dash-section-title">
            Applicants
          </h2>

          <form className="applicant-filters" method="get" role="search">
            <label className="field">
              <span className="field-label">Search</span>
              <span className="search-input">
                <SearchIcon />
                <input className="input" type="search" name="q" defaultValue={q} placeholder="Name or email" />
              </span>
            </label>
            <label className="field">
              <span className="field-label">Stage</span>
              <select className="input" name="status" defaultValue={status}>
                <option value="">All stages</option>
                {STATUSES.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Role</span>
              <select className="input" name="job" defaultValue={jobId}>
                <option value="">All roles</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="filters-actions">
              <button type="submit" className="btn btn-secondary">
                Filter
              </button>
              {filtered && (
                <Link href="/dashboard" className="btn btn-ghost">
                  Clear
                </Link>
              )}
            </div>
          </form>

          {applications.length === 0 ? (
            <div className="empty-state">
              <h3>{filtered ? "No applicants match those filters" : "No applications yet"}</h3>
              <p className="muted">
                {filtered
                  ? "Try another stage or role, or clear the filters."
                  : "Share a role link from the Open roles page to start receiving applications."}
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Applicant</th>
                  <th scope="col">Role</th>
                  <th scope="col">Applied</th>
                  <th scope="col">Résumé</th>
                  <th scope="col">Stage</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <div className="applicant-name">{application.name}</div>
                      <a className="applicant-email" href={`mailto:${application.email}`}>
                        {application.email}
                      </a>
                    </td>
                    <td data-label="Role">{application.job.title}</td>
                    <td data-label="Applied">{formatDate(application.createdAt)}</td>
                    <td data-label="Résumé">
                      {application.resumeUrl ? (
                        <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                          Open link
                        </a>
                      ) : (
                        <span className="muted">Not provided</span>
                      )}
                    </td>
                    <td className="status-cell">
                      <StatusSelect
                        applicationId={application.id}
                        status={application.status}
                        name={application.name}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="applicants panel" aria-labelledby="roles-title">
          <div className="pipeline-head">
            <h2 id="roles-title" className="dash-section-title">
              Roles
            </h2>
            <Link href="/dashboard/jobs/new" className="btn btn-ghost btn-sm">
              Post a job
            </Link>
          </div>
          {jobs.length === 0 ? (
            <p className="muted" style={{ marginTop: "1rem" }}>
              No roles yet. Post one to start receiving applications.
            </p>
          ) : (
            <ul className="roles-list">
              {jobs.map((job) => (
                <li key={job.id}>
                  <div>
                    <Link href={`/dashboard?job=${job.id}`}>{job.title}</Link>
                    <div className="muted" style={{ fontSize: "0.92rem" }}>
                      {job.department}, {job.location} · {plural(job._count.applications, "applicant")}
                    </div>
                  </div>
                  <div className="dash-actions">
                    <Link href={`/jobs/${job.id}`} className="btn btn-ghost btn-sm">
                      View posting
                    </Link>
                    <DeleteJobButton jobId={job.id} title={job.title} applicants={job._count.applications} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
