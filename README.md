# Talentifyx

Applicant tracking system built with Next.js, Prisma and SQLite.

- **Job seekers** browse open roles, search and filter them, and apply without an account.
- **Recruiters** sign in with a team password to post jobs, see the hiring pipeline, and move applicants through stages (Applied → Screening → Interview → Offer → Hired, or Rejected).
- Light and dark themes, following the system setting until you pick one.

## Development

```bash
npm ci
cp .env.example .env      # then set ADMIN_PASSWORD
npx prisma db push
npm run db:seed           # sample jobs and applicants
npm run dev
```

Open http://localhost:3000.

The recruiter dashboard is at `/dashboard`. In development, the password is `admin` until you set `ADMIN_PASSWORD`. In production the dashboard stays locked until it is set.

## Pages

| Path | What it is |
| --- | --- |
| `/` | Landing page with paths for job seekers and recruiters |
| `/jobs` | All open roles, with search and team/location filters |
| `/jobs/[id]` | Role details and application form |
| `/login` | Recruiter sign in |
| `/dashboard` | Stats, pipeline, applicants (with stage changes) and roles |
| `/dashboard/jobs/new` | Post a job |
| `/api/health` | Health check with job and application counts |

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Create a production build
- `npm run lint` - Run ESLint
- `npm run db:push` - Apply Prisma schema to the local database
- `npm run db:seed` - Seed sample jobs and applicants (only runs on an empty database)
