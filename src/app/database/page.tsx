export const metadata = { title: "Database · Person App" };

const SCHEMA = `model Person {
  id        String   @id @default(cuid())
  firstName String
  lastName  String
  email     String   @unique
  age       Int?
  city      String?
  country   String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;

const FIELDS: Array<{
  name: string;
  type: string;
  notes: string;
}> = [
  { name: "id", type: "String (cuid)", notes: "Primary key, auto-generated" },
  { name: "firstName", type: "String", notes: "Required" },
  { name: "lastName", type: "String", notes: "Required" },
  { name: "email", type: "String", notes: "Required, unique" },
  { name: "age", type: "Int?", notes: "Optional" },
  { name: "city", type: "String?", notes: "Optional" },
  { name: "country", type: "String?", notes: "Optional" },
  { name: "bio", type: "String?", notes: "Optional, longer text" },
  { name: "createdAt", type: "DateTime", notes: "Defaults to now()" },
  { name: "updatedAt", type: "DateTime", notes: "Auto-updated on change" },
];

export default function DatabasePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Database</h1>
      <p className="text-slate-600 mt-2 max-w-2xl">
        This app uses <strong>Prisma ORM</strong> with a hosted{" "}
        <strong>PostgreSQL</strong> database. The schema is the single source
        of truth — Prisma generates a fully typed client used by every API
        route.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Prisma schema
        </h2>
        <pre className="bg-slate-900 text-slate-100 text-xs sm:text-sm rounded-lg p-4 overflow-x-auto">
          {SCHEMA}
        </pre>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Person fields
        </h2>
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Field</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {FIELDS.map((f) => (
                <tr key={f.name} className="border-t border-slate-200">
                  <td className="px-4 py-2 font-mono text-slate-900">
                    {f.name}
                  </td>
                  <td className="px-4 py-2 font-mono text-slate-700">
                    {f.type}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{f.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid sm:grid-cols-2 gap-4">
        <Card
          title="Migrations"
          body="Schema changes are versioned with Prisma Migrate. Run `npx prisma migrate dev --name <change>` locally and `prisma migrate deploy` in production."
        />
        <Card
          title="Connection"
          body="The DATABASE_URL environment variable points at a hosted PostgreSQL instance (Neon / Vercel Postgres / Supabase). It is configured in Vercel project settings."
        />
        <Card
          title="Seeding"
          body="A seed script (`prisma/seed.ts`) inserts sample people so the deployed app always has demo data to display."
        />
        <Card
          title="Type safety"
          body="`prisma generate` creates a typed client. Every API route imports it from `@/lib/prisma`, eliminating runtime field typos."
        />
      </section>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-1">{body}</p>
    </div>
  );
}
