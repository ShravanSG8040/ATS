import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingJobs = await prisma.job.count();
  if (existingJobs > 0) {
    return;
  }

  await prisma.job.createMany({
    data: [
      {
        title: "Software Engineer",
        department: "Engineering",
        location: "Remote",
        description: "Build and maintain the ATS platform.",
      },
      {
        title: "Recruiter",
        department: "People",
        location: "New York, NY",
        description: "Source and screen candidates for open roles.",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
