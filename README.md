# Person App

Full-stack Person CRUD application built with **Next.js 16**, **Prisma**, **PostgreSQL** and **Tailwind CSS**, deployed to **Vercel**.

## Features

- Full Create / Read / Update / Delete for Person records
- REST API via Next.js Route Handlers (`/api/persons`)
- Prisma ORM with type-safe database access
- PostgreSQL database (Neon / Vercel Postgres / Supabase compatible)
- Responsive UI (mobile + desktop)
- Built-in documentation pages: `/about`, `/database`, `/github`
- Sample seed data

## Getting started

```bash
npm install
cp .env.example .env   # then set DATABASE_URL
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

App runs at http://localhost:3000.

## Scripts

- `npm run dev` – local dev server
- `npm run build` – production build (runs `prisma generate`)
- `npm start` – run production server
- `npm run db:migrate` – apply migrations locally
- `npm run db:seed` – insert sample people

## Deployment

Deployed on Vercel. The `DATABASE_URL` env var is configured in the Vercel project. The build runs `prisma generate` and `prisma migrate deploy` automatically.

## Tech stack

| Layer     | Tech                                |
| --------- | ----------------------------------- |
| Framework | Next.js 16 (App Router) + React 19  |
| Language  | TypeScript                          |
| Styling   | Tailwind CSS v4                     |
| ORM       | Prisma                              |
| Database  | PostgreSQL                          |
| Hosting   | Vercel                              |
