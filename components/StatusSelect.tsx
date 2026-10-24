"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updateStatus } from "@/app/dashboard/actions";
import { STATUSES, stageVar } from "@/lib/statuses";

function Saving() {
  const { pending } = useFormStatus();
  return (
    <span className="status-saving" aria-live="polite">
      {pending ? "Saving…" : ""}
    </span>
  );
}

/** Changing the select saves the new stage immediately. */
export function StatusSelect({ applicationId, status, name }: { applicationId: string; status: string; name: string }) {
  const [value, setValue] = useState(status);

  return (
    <form action={updateStatus} className="status-form">
      <input type="hidden" name="applicationId" value={applicationId} />
      <select
        name="status"
        className="status-select"
        style={stageVar(value)}
        value={value}
        aria-label={`Stage for ${name}`}
        onChange={(event) => {
          setValue(event.target.value);
          event.currentTarget.form?.requestSubmit();
        }}
      >
        {STATUSES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="btn btn-secondary btn-sm">
          Save
        </button>
      </noscript>
      <Saving />
    </form>
  );
}
