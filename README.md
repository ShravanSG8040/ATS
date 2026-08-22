# ATS

Applicant Tracking System built with Next.js, Prisma, and SQLite.

## Development

```bash
npm ci
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000 to manage jobs and applications.

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Create a production build
- `npm run lint` - Run ESLint
- `npm run db:push` - Apply Prisma schema to the local database
- `npm run db:seed` - Seed sample jobs
