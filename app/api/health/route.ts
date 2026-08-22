import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const jobCount = await prisma.job.count();
  const applicationCount = await prisma.application.count();

  return NextResponse.json({
    status: "ok",
    jobCount,
    applicationCount,
  });
}
