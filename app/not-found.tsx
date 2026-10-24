import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-title">This page isn&apos;t here</h1>
        <p className="page-lede">The role may have been removed, or the link is mistyped.</p>
        <p style={{ marginTop: "1.5rem" }}>
          <Link href="/jobs" className="btn btn-primary">
            Browse open roles
          </Link>
        </p>
      </div>
    </div>
  );
}
