import Link from "next/link";
import { postedAgo, plural } from "@/lib/format";
import { ArrowRightIcon, ClockIcon, PinIcon, TeamIcon } from "./icons";

type JobRowProps = {
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
    createdAt: Date;
    _count: { applications: number };
  };
};

export function JobRow({ job }: JobRowProps) {
  return (
    <li className="job-row">
      <Link href={`/jobs/${job.id}`} className="job-row-link">
        <div>
          <div className="job-row-title">{job.title}</div>
          <div className="job-row-meta">
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
        </div>
        <div className="job-row-side">
          <span className="job-row-count">{plural(job._count.applications, "applicant")}</span>
          <ArrowRightIcon className="job-row-arrow" />
        </div>
      </Link>
    </li>
  );
}
