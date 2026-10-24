import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { login } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { isAdmin, isPasswordConfigured, isUsingDevPassword } from "@/lib/auth";

export const metadata: Metadata = { title: "Recruiter sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/dashboard");
  const { error } = await searchParams;
  const configured = isPasswordConfigured();

  return (
    <div className="container login-wrap">
      <div className="login-card panel">
        <h1>Recruiter sign in</h1>
        <p className="muted" style={{ marginTop: "0.5rem" }}>
          Enter the team password to manage roles and applicants.
        </p>

        {!configured ? (
          <p className="notice notice-error" role="alert" style={{ marginTop: "1.5rem" }}>
            The dashboard is locked. Set ADMIN_PASSWORD in the server environment, then restart the app.
          </p>
        ) : (
          <form action={login} className="form-stack">
            {error && (
              <p className="notice notice-error" role="alert">
                That password didn&apos;t match. Check it and try again.
              </p>
            )}
            <label className="field">
              <span className="field-label">Password</span>
              <input className="input" type="password" name="password" autoComplete="current-password" required autoFocus />
              {isUsingDevPassword() && (
                <span className="field-hint">Development mode: the password is &quot;admin&quot; until you set ADMIN_PASSWORD.</span>
              )}
            </label>
            <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}
