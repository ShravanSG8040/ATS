import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { JobRow } from "@/components/JobRow";
import { SearchIcon } from "@/components/icons";
import { plural } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Open roles" };

type SearchParams = Promise<{ q?: string; department?: string; location?: string }>;

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const department = params.department ?? "";
  const location = params.location ?? "";

  const where: Prisma.JobWhereInput = {
    ...(q && {
      OR: [{ title: { contains: q } }, { description: { contains: q } }, { department: { contains: q } }],
    }),
    ...(department && { department }),
    ...(location && { location }),
  };

  const [jobs, departments, locations, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    }),
    prisma.job.findMany({ distinct: ["department"], select: { department: true }, orderBy: { department: "asc" } }),
    prisma.job.findMany({ distinct: ["location"], select: { location: true }, orderBy: { location: "asc" } }),
    prisma.job.count(),
  ]);

  const filtered = Boolean(q || department || location);

  return (
    <div className="container">
      <header className="page-head">
        <h1 className="page-title">Open roles</h1>
        <p className="page-lede">
          {total === 0
            ? "There are no openings right now. Check back soon."
            : `${plural(total, "role")} open across ${plural(departments.length, "team")}. Pick one to read the details and apply.`}
        </p>
      </header>

      <form className="filters panel" method="get" role="search">
        <label className="field">
          <span className="field-label">Search</span>
          <span className="search-input">
            <SearchIcon />
            <input className="input" type="search" name="q" defaultValue={q} placeholder="Job title or keyword" />
          </span>
        </label>
        <label className="field">
          <span className="field-label">Team</span>
          <select className="input" name="department" defaultValue={department}>
            <option value="">All teams</option>
            {departments.map(({ department: value }) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Location</span>
          <select className="input" name="location" defaultValue={location}>
            <option value="">Anywhere</option>
            {locations.map(({ location: value }) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <div className="filters-actions">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {filtered && (
            <Link href="/jobs" className="btn btn-ghost">
              Clear
            </Link>
          )}
        </div>
      </form>

      {filtered && (
        <p className="result-count" aria-live="polite">
          {plural(jobs.length, "role")} match your search
        </p>
      )}

      {jobs.length === 0 ? (
        <div className="empty-state">
          <h3>{filtered ? "No roles match those filters" : "No roles are open yet"}</h3>
          <p className="muted">
            {filtered ? "Try a broader keyword or choose a different team or location." : "New openings will appear here."}
          </p>
          {filtered && (
            <Link href="/jobs" className="btn btn-secondary btn-sm">
              Show all roles
            </Link>
          )}
        </div>
      ) : (
        <ul className="job-rows">
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </ul>
      )}
    </div>
  );
}
