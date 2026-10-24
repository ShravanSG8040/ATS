"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isStatus } from "@/lib/statuses";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const ok = await signIn(password);
  redirect(ok ? "/dashboard" : "/login?error=1");
}

export async function logout() {
  await signOut();
  redirect("/");
}

export async function updateStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("applicationId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !isStatus(status)) return;

  await prisma.application.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard");
}

export async function createJob(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !department || !location || !description) {
    redirect("/dashboard/jobs/new?error=1");
  }

  const job = await prisma.job.create({
    data: { title, department, location, description },
  });

  revalidatePath("/");
  revalidatePath("/jobs");
  redirect(`/dashboard?posted=${job.id}`);
}

export async function deleteJob(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("jobId") ?? "");
  if (!id) return;

  await prisma.job.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/dashboard");
}
