import Link from "next/link";

export const metadata = { title: "GitHub · Person App" };

const REPO_URL = "https://github.com/ceto-31/PersonAppbyCeto";

export default function GithubPage() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-14 h-14 mx-auto text-fg"
        >
          <path d="M12 .5C5.73.5.78 5.45.78 11.72c0 4.93 3.2 9.11 7.64 10.59.56.1.76-.24.76-.54v-2c-3.11.68-3.77-1.33-3.77-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.94.1-.73.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.16-3.01-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15.89-.25 1.85-.37 2.8-.37s1.91.13 2.8.37c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.01 0 4.29-2.61 5.24-5.1 5.51.4.34.76 1.02.76 2.06v3.05c0 .3.2.65.77.54 4.43-1.48 7.63-5.66 7.63-10.59C23.22 5.45 18.27.5 12 .5z" />
        </svg>
        <h1 className="text-3xl font-bold text-fg mt-4">Source Code</h1>
        <p className="text-fg-muted mt-2">
          The complete source for this Person App lives on GitHub. Browse the
          code, history, and Prisma schema.
        </p>

        <Link
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 bg-primary hover:bg-primary-hover text-primary-fg px-5 py-3 rounded-md text-sm font-medium transition"
        >
          Open Repository on GitHub
          <span aria-hidden>↗</span>
        </Link>

        <p className="text-xs text-fg-subtle mt-6 break-all">
          <code>{REPO_URL}</code>
        </p>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3 text-left">
        <Stat label="Framework" value="Next.js 16" />
        <Stat label="ORM" value="Prisma" />
        <Stat label="Database" value="PostgreSQL" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="text-xs uppercase tracking-wide text-fg-subtle">
        {label}
      </div>
      <div className="text-sm font-semibold text-fg mt-1">{value}</div>
    </div>
  );
}
