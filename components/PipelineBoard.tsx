import type { CSSProperties } from "react";

const COLUMNS = [
  { label: "Applied", stage: "submitted" },
  { label: "Screening", stage: "screening" },
  { label: "Interview", stage: "interview" },
  { label: "Hired", stage: "hired" },
];

/* Illustrative candidates for the hero animation (not real data). */
const CANDIDATES = [
  { initials: "AK", name: "Aisha K.", role: "Designer", color: "#4b3fd6", row: "4%", delay: "0s", col: 3 },
  { initials: "RM", name: "Rohan M.", role: "Engineer", color: "#d99413", row: "24%", delay: "-3s", col: 2 },
  { initials: "LS", name: "Lena S.", role: "Analyst", color: "#d4475f", row: "44%", delay: "-6s", col: 1, rejected: true },
  { initials: "TO", name: "Tomi O.", role: "Recruiter", color: "#1f9d6e", row: "64%", delay: "-9s", col: 0 },
  { initials: "PN", name: "Priya N.", role: "QA lead", color: "#2e86de", row: "82%", delay: "-1.5s", col: 1 },
];

/**
 * The hero's one orchestrated animation: candidates advance through the
 * hiring stages on a loop. With reduced motion, they sit still in different columns.
 */
export function PipelineBoard() {
  return (
    <div className="board reveal" style={{ "--d": "0.15s" } as CSSProperties} aria-hidden="true">
      <div className="board-cols">
        {COLUMNS.map((column) => (
          <div
            key={column.label}
            className="board-col"
            style={{ "--stage": `var(--stage-${column.stage})` } as CSSProperties}
          >
            {column.label}
          </div>
        ))}
      </div>
      <div className="board-lanes">
        {CANDIDATES.map((candidate) => (
          <div
            key={candidate.initials}
            className={`chip${candidate.rejected ? " chip-rejected" : ""}`}
            style={
              {
                "--row": candidate.row,
                "--delay": candidate.delay,
                "--avatar": candidate.color,
                "--static-col": candidate.col,
              } as CSSProperties
            }
          >
            <span className="chip-avatar">{candidate.initials}</span>
            <span className="chip-text">
              <span className="chip-name">{candidate.name}</span>
              <span className="chip-role">{candidate.role}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
