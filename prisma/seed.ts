import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JOBS = [
  {
    title: "Software Engineer",
    department: "Engineering",
    location: "Remote",
    description:
      "Build and maintain the Talentifyx platform with Next.js, TypeScript and Prisma.\n\nYou'll ship features end to end, from database schema to polished UI, and help shape how the team works.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Bengaluru",
    description:
      "Own the experience for job seekers and recruiters, from research and flows to high-fidelity designs.\n\nYou're comfortable sharing early work and turning feedback into better decisions.",
  },
  {
    title: "Recruiter",
    department: "People",
    location: "Mumbai",
    description:
      "Source and screen candidates for open roles, run interview loops, and keep candidates informed at every step.",
  },
  {
    title: "Customer Success Manager",
    department: "Operations",
    location: "Goa",
    description:
      "Help hiring teams get set up, answer questions, and turn their feedback into product improvements.",
  },
];

const APPLICANTS = [
  { name: "Aisha Khan", email: "aisha@example.com", job: 0, status: "interview" },
  { name: "Rohan Mehta", email: "rohan@example.com", job: 0, status: "screening" },
  { name: "Priya Nair", email: "priya@example.com", job: 0, status: "submitted" },
  { name: "Lena Silva", email: "lena@example.com", job: 1, status: "offer" },
  { name: "Arjun Rao", email: "arjun@example.com", job: 1, status: "rejected" },
  { name: "Tomi Okafor", email: "tomi@example.com", job: 2, status: "hired" },
  { name: "Meera Iyer", email: "meera@example.com", job: 2, status: "submitted" },
  { name: "Kabir Shah", email: "kabir@example.com", job: 3, status: "screening" },
];

async function main() {
  const existingJobs = await prisma.job.count();
  if (existingJobs > 0) {
    console.log("Database already has jobs, skipping seed.");
    return;
  }

  const jobs: any[] = [];
  for (const job of JOBS) {
    jobs.push(await prisma.job.create({ data: job }));
  }

  await prisma.application.createMany({
    data: APPLICANTS.map((applicant) => ({
      name: applicant.name,
      email: applicant.email,
      status: applicant.status,
      jobId: jobs[applicant.job].id,
    })),
  });

  console.log(`Seeded ${jobs.length} jobs and ${APPLICANTS.length} applications.`);
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
