import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function createJob(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !department || !location || !description) {
    return;
  }

  await prisma.job.create({
    data: { title, department, location, description },
  });

  revalidatePath("/");
}

async function submitApplication(formData: FormData) {
  "use server";

  const jobId = String(formData.get("jobId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const resumeUrl = String(formData.get("resumeUrl") ?? "").trim();

  if (!jobId || !name || !email) {
    return;
  }

  await prisma.application.create({
    data: {
      jobId,
      name,
      email,
      resumeUrl: resumeUrl || null,
    },
  });

  revalidatePath("/");
}

export default async function HomePage() {
  const [jobs, applications] = await Promise.all([
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    }),
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      include: { job: true },
      take: 10,
    }),
  ]);

  return (
    <main>
      <header>
        <h1>ATS</h1>
        <p>Applicant Tracking System for posting jobs and reviewing applications.</p>
      </header>

      <section>
        <h2>Open Positions</h2>
        <div className="job-list">
          {jobs.length === 0 ? (
            <p className="empty">No jobs posted yet.</p>
          ) : (
            jobs.map((job) => (
              <article className="job-card" key={job.id}>
                <h3>{job.title}</h3>
                <p className="meta">
                  {job.department} · {job.location} · {job._count.applications} application
                  {job._count.applications === 1 ? "" : "s"}
                </p>
                <p>{job.description}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section>
        <h2>Post a Job</h2>
        <form action={createJob}>
          <label>
            Title
            <input name="title" required />
          </label>
          <label>
            Department
            <input name="department" required />
          </label>
          <label>
            Location
            <input name="location" required />
          </label>
          <label>
            Description
            <textarea name="description" rows={3} required />
          </label>
          <button type="submit">Create Job</button>
        </form>
      </section>

      <section>
        <h2>Submit Application</h2>
        <form action={submitApplication}>
          <label>
            Job
            <select name="jobId" required defaultValue="">
              <option value="" disabled>
                Select a job
              </option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Resume URL
            <input name="resumeUrl" type="url" placeholder="https://example.com/resume.pdf" />
          </label>
          <button type="submit">Submit Application</button>
        </form>
      </section>

      <section>
        <h2>Recent Applications</h2>
        <div className="application-list">
          {applications.length === 0 ? (
            <p className="empty">No applications submitted yet.</p>
          ) : (
            applications.map((application) => (
              <div className="application-item" key={application.id}>
                <div>
                  <strong>{application.name}</strong>
                  <div className="meta">
                    {application.email} · applied to {application.job.title}
                  </div>
                </div>
                <span className="status">{application.status}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
