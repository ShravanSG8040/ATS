import Link from "next/link";

/** Wordmark: three stacked bars that step forward, like candidates moving down a pipeline. */
export function Logo() {
  return (
    <Link href="/" className="wordmark" aria-label="Talentifyx home">
      <svg className="wordmark-mark" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="var(--brand)" />
        <rect x="6" y="7" width="9" height="3.2" rx="1.6" fill="var(--brand-ink)" opacity="0.55" />
        <rect x="9.5" y="12.4" width="9" height="3.2" rx="1.6" fill="var(--brand-ink)" opacity="0.8" />
        <rect x="13" y="17.8" width="9" height="3.2" rx="1.6" fill="var(--brand-ink)" />
      </svg>
      Talentifyx
    </Link>
  );
}
