import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "tfx_session";
const ONE_WEEK = 60 * 60 * 24 * 7;

/**
 * The recruiter password comes from the ADMIN_PASSWORD environment variable.
 * In development it falls back to "admin" so the app works out of the box;
 * in production the dashboard stays locked until ADMIN_PASSWORD is set.
 */
function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (password) return password;
  if (process.env.NODE_ENV !== "production") return "admin";
  return null;
}

export function isUsingDevPassword() {
  return !process.env.ADMIN_PASSWORD?.trim() && process.env.NODE_ENV !== "production";
}

export function isPasswordConfigured() {
  return getAdminPassword() !== null;
}

function sessionToken(password: string) {
  return createHash("sha256").update(`talentifyx-session:${password}`).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function isAdmin() {
  const password = getAdminPassword();
  if (!password) return false;

  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return Boolean(value && safeEqual(value, sessionToken(password)));
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/login");
  }
}

/** Returns true and sets the session cookie when the password is correct. */
export async function signIn(attempt: string) {
  const password = getAdminPassword();
  if (!password || !safeEqual(attempt, password)) return false;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK,
  });
  return true;
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
