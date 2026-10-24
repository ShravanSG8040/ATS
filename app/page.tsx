import type { CSSProperties } from "react";
import Link from "next/link";
import { JobRow } from "@/components/JobRow";
import { PipelineBoard } from "@/components/PipelineBoard";
import { plural } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [jobs, jobCount, departments] = await Promise.all([
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
      take: 4,
    }),
    prisma.job.count(),
    prisma.job.findMany({ distinct: ["department"], select: { department: true } }),
  ]);

  return (
    <>
      <div className="container">
        <section className="hero">
          <div>
            <h1 className="hero-title reveal">Hiring, in plain sight.</h1>
            <p className="hero-lede reveal" style={{ "--d": "0.08s" } as CSSProperties}>
              Talentifyx keeps every opening and every applicant in one place. Find your next role and apply in
              minutes, or follow each candidate from application to offer.
            </p>
            <div className="hero-actions reveal" style={{ "--d": "0.16s" } as CSSProperties}>
              <Link href="/jobs" className="btn btn-primary">
                Browse open roles
              </Link>
              <Link href="/dashboard" className="btn btn-secondary">
                Open recruiter dashboard
              </Link>
            </div>
            {jobCount > 0 && (
              <p className="hero-stat reveal" style={{ "--d": "0.24s" } as CSSProperties}>
                <strong>{plural(jobCount, "open role")}</strong> across{" "}
                <strong>{plural(departments.length, "team")}</strong> right now.
              </p>
            )}
          </div>
          <PipelineBoard />
        </section>
      </div>

      <div className="container">
        <section className="section" aria-labelledby="paths-title">
          <h2 id="paths-title" className="visually-hidden">
            Choose your path
          </h2>
          <div className="paths">
            <div className="path path-seeker">
              <h3 className="path-title">Looking for a job</h3>
              <p className="path-text">
                Search openings by title, team or location, read the full role, and send your application without
                creating an account.
              </p>
              <ul className="path-list">
                <li>Filter roles by team and location</li>
                <li>Apply with your name, email and a link to your résumé</li>
              </ul>
              <Link href="/jobs" className="btn btn-primary">
                Find a role
              </Link>
            </div>
            <div className="path path-recruiter">
              <h3 className="path-title">Hiring for your team</h3>
              <p className="path-text">
                Post a role in under a minute, see where every applicant stands, and move them through screening,
                interviews and offers.
              </p>
              <ul className="path-list">
                <li>Pipeline overview across all roles</li>
                <li>Change an applicant&apos;s stage straight from the list</li>
              </ul>
              <Link href="/dashboard" className="btn btn-primary">
                Go to dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="latest-title">
          <div className="section-head">
            <h2 id="latest-title" className="section-title">
              Latest openings
            </h2>
            {jobCount > jobs.length && (
              <Link href="/jobs" className="btn btn-ghost btn-sm">
                See all {jobCount} roles
              </Link>
            )}
          </div>
          {jobs.length === 0 ? (
            <div className="empty-state">
              <h3>No roles are open yet</h3>
              <p className="muted">Recruiters can post the first one from the dashboard.</p>
              <Link href="/dashboard/jobs/new" className="btn btn-secondary btn-sm">
                Post a job
              </Link>
            </div>
          ) : (
            <ul className="job-rows">
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
