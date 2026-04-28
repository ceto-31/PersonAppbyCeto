export const metadata = { title: "About · Person App" };

export default function AboutPage() {
  return (
    <article className="max-w-none">
      <h1 className="text-3xl font-bold text-fg">About this App</h1>
      <p className="text-fg-muted mt-2">
        Person App is a full-stack CRUD application built to demonstrate
        end-to-end web development: a typed React UI, server-side API routes, a
        relational database, and production deployment.
      </p>

      <section className="mt-8 grid sm:grid-cols-2 gap-4">
        <Card title="Frontend">
          <ul className="list-disc list-inside text-sm text-fg-muted space-y-1">
            <li>Next.js 16 (App Router)</li>
            <li>React 19 with TypeScript</li>
            <li>Tailwind CSS v4 + semantic theme tokens</li>
            <li>Light + dark themes (root-class toggle, no FOUC)</li>
          </ul>
        </Card>
        <Card title="Backend">
          <ul className="list-disc list-inside text-sm text-fg-muted space-y-1">
            <li>Next.js Route Handlers (REST API)</li>
            <li>Prisma ORM as data layer</li>
            <li>PostgreSQL database (hosted)</li>
            <li>Server-only DB client singleton</li>
          </ul>
        </Card>
        <Card title="CRUD Endpoints">
          <ul className="list-disc list-inside text-sm text-fg-muted space-y-1">
            <li><code>GET /api/persons</code> — list all</li>
            <li><code>POST /api/persons</code> — create</li>
            <li><code>GET /api/persons/[id]</code> — read one</li>
            <li><code>PUT /api/persons/[id]</code> — update</li>
            <li><code>DELETE /api/persons/[id]</code> — delete</li>
          </ul>
        </Card>
        <Card title="Deployment">
          <ul className="list-disc list-inside text-sm text-fg-muted space-y-1">
            <li>Hosted on Vercel</li>
            <li>Continuous deploys from GitHub</li>
            <li>Environment variables for DB URL</li>
            <li>Prisma generate runs on each build</li>
          </ul>
        </Card>
      </section>

      <h2 className="text-xl font-semibold mt-10 text-fg">Architecture</h2>
      <p className="text-sm text-fg-muted mt-2">
        The browser renders React pages served by Next.js. User actions call
        REST endpoints implemented as Route Handlers under{" "}
        <code>/app/api/persons</code>. Each handler uses a shared Prisma Client
        instance to query the PostgreSQL database. Responses flow back as JSON
        and the UI re-renders.
      </p>
      <pre className="bg-surface-2 text-fg text-xs rounded-lg p-4 mt-3 overflow-x-auto border border-border">
{`Browser  →  Next.js (App Router)  →  /api/persons (Route Handlers)
                                          │
                                          ▼
                                     Prisma Client
                                          │
                                          ▼
                                  PostgreSQL Database`}
      </pre>

      <h2 className="text-xl font-semibold mt-10 text-fg">Theming</h2>
      <p className="text-sm text-fg-muted mt-2">
        Colors are exposed as semantic CSS variables (<code>--color-bg</code>,
        <code>--color-surface</code>, <code>--color-fg</code>,
        <code>--color-primary</code>, …). Themes are activated by adding a
        <code>.theme-&lt;name&gt;</code> class to <code>&lt;html&gt;</code>. An
        inline script in the document head sets the class before first paint,
        eliminating any flash of incorrect colors. New themes are added by
        appending one CSS block — no component changes required. All
        foreground/background pairings meet WCAG AA contrast.
      </p>
    </article>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-fg mb-2">{title}</h3>
      {children}
    </div>
  );
}
