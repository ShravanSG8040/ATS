"use client";

import { deleteJob } from "@/app/dashboard/actions";

/** Removing a role also removes its applications, so ask first. */
export function DeleteJobButton({ jobId, title, applicants }: { jobId: string; title: string; applicants: number }) {
  return (
    <form
      action={deleteJob}
      onSubmit={(event) => {
        const extra = applicants > 0 ? ` Its ${applicants} application${applicants === 1 ? "" : "s"} will be removed too.` : "";
        if (!window.confirm(`Remove "${title}"?${extra}`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="jobId" value={jobId} />
      <button type="submit" className="btn btn-ghost btn-sm">
        Remove
      </button>
    </form>
  );
}
