import type { CSSProperties } from "react";

export const STATUSES = [
  { value: "submitted", label: "Applied" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
] as const;

export type Status = (typeof STATUSES)[number]["value"];

export function isStatus(value: string): value is Status {
  return STATUSES.some((status) => status.value === value);
}

export function statusLabel(value: string) {
  return STATUSES.find((status) => status.value === value)?.label ?? value;
}

/** CSS custom property that colours a badge, select or chart segment. */
export function stageVar(value: string) {
  return { "--stage": `var(--stage-${isStatus(value) ? value : "submitted"})` } as CSSProperties;
}
