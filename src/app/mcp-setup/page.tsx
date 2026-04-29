export const metadata = { title: "MCP Setup · Person App" };

const CONFIG_SNIPPET = `{
  "mcpServers": {
    "person-app": {
      "command": "node",
      "args": [
        "C:/absolute/path/to/person-app/node_modules/tsx/dist/cli.mjs",
        "C:/absolute/path/to/person-app/mcp-server/index.ts"
      ],
      "env": {
        "DATABASE_URL": "postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require&channel_binding=require"
      }
    }
  }
}`;

const MAC_PATH = "~/Library/Application Support/Claude/claude_desktop_config.json";
const WIN_PATH = "%APPDATA%\\Claude\\claude_desktop_config.json";

export default function McpSetupPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="text-3xl font-bold text-fg">MCP Setup</h1>
      <p className="text-fg-muted mt-2">
        Connect Claude Desktop to this app&apos;s MCP server so the assistant
        can read and modify the Person database directly.
      </p>

      <Step n={1} title="Clone & install">
        <pre className="snippet">
{`git clone https://github.com/ceto-31/PersonAppbyCeto.git
cd PersonAppbyCeto
npm install`}
        </pre>
      </Step>

      <Step n={2} title="Configure the database">
        <p className="text-sm text-fg-muted">
          Create a <code>.env</code> file with a PostgreSQL connection string
          (Neon, Vercel Postgres, Supabase, or local Postgres all work):
        </p>
        <pre className="snippet">
{`DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"`}
        </pre>
        <p className="text-sm text-fg-muted mt-3">Then run migrations and seed:</p>
        <pre className="snippet">
{`npx prisma migrate deploy
npm run db:seed`}
        </pre>
      </Step>

      <Step n={3} title="Locate Claude Desktop config">
        <ul className="text-sm text-fg-muted list-disc list-inside space-y-1">
          <li>
            <strong>macOS:</strong> <code>{MAC_PATH}</code>
          </li>
          <li>
            <strong>Windows:</strong> <code>{WIN_PATH}</code>
          </li>
        </ul>
        <p className="text-sm text-fg-muted mt-2">
          Create the file if it does not exist.
        </p>
      </Step>

      <Step n={4} title="Add the server entry">
        <p className="text-sm text-fg-muted">
          Merge the snippet below into your config. Replace the path with the
          absolute path to this repo on your machine, and use your real
          <code> DATABASE_URL</code>.
        </p>
        <pre className="snippet">{CONFIG_SNIPPET}</pre>
      </Step>

      <Step n={5} title="Restart Claude Desktop">
        <p className="text-sm text-fg-muted">
          Fully quit and reopen Claude Desktop. Open the tools menu — you
          should see <code>person-app</code> with these tools:
        </p>
        <ul className="text-sm text-fg-muted list-disc list-inside mt-2 space-y-1">
          <li><code>get_all_people</code></li>
          <li><code>create_person</code></li>
          <li><code>update_person</code></li>
          <li><code>delete_person</code></li>
        </ul>
      </Step>

      <Step n={6} title="Verify">
        <p className="text-sm text-fg-muted">
          Ask Claude: <em>&quot;List everyone in the person database.&quot;</em>{" "}
          Then visit{" "}
          <a className="text-accent-fg underline" href="/mcp-demo">
            /mcp-demo
          </a>{" "}
          — the call appears in the live event log.
        </p>
      </Step>
    </article>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-fg flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-fg text-sm">
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-3 space-y-2 [&_.snippet]:bg-surface-2 [&_.snippet]:text-fg [&_.snippet]:text-xs [&_.snippet]:sm:text-sm [&_.snippet]:rounded-lg [&_.snippet]:p-4 [&_.snippet]:border [&_.snippet]:border-border [&_.snippet]:overflow-x-auto">
        {children}
      </div>
    </section>
  );
}
