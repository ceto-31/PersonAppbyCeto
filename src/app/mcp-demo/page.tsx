import Image from "next/image";
import McpDemoLog from "@/components/McpDemoLog";

export const metadata = { title: "MCP Demo · Person App" };

const SHOTS = [
  {
    src: "/mcp-demo/01-read.png",
    title: "Read",
    tool: "get_all_people",
    caption: "Claude lists everyone currently in the database.",
  },
  {
    src: "/mcp-demo/02-create.png",
    title: "Create",
    tool: "create_person",
    caption: "Claude inserts a new person and gets back the row.",
  },
  {
    src: "/mcp-demo/03-update.png",
    title: "Update",
    tool: "update_person",
    caption: "Claude updates a field on an existing person.",
  },
  {
    src: "/mcp-demo/04-delete.png",
    title: "Delete",
    tool: "delete_person",
    caption: "Claude removes records by id, in parallel.",
  },
];

export default function McpDemoPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-fg">MCP Live Demo</h1>
      <p className="text-fg-muted mt-2 max-w-2xl">
        Every call made by an MCP client (e.g. Claude Desktop) to this
        app&apos;s server is recorded in the <code>McpEvent</code> table.
        This page polls the audit log every 2 seconds so you can watch tool
        calls happen in real time.
      </p>

      <div className="mt-4 grid sm:grid-cols-4 gap-3 text-xs">
        <Tool name="get_all_people" />
        <Tool name="create_person" />
        <Tool name="update_person" />
        <Tool name="delete_person" />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-fg">
          Claude Desktop using all four tools
        </h2>
        <p className="text-sm text-fg-muted mt-1">
          Captured against the same Postgres this site reads from.
        </p>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {SHOTS.map((s) => (
            <figure
              key={s.src}
              className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm"
            >
              <Image
                src={s.src}
                alt={`Claude Desktop calling ${s.tool}`}
                width={1600}
                height={1000}
                className="w-full h-auto"
              />
              <figcaption className="px-4 py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-fg">
                    {s.title}
                  </span>
                  <code className="text-xs text-accent-fg">{s.tool}</code>
                </div>
                <p className="text-xs text-fg-muted mt-1">{s.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <McpDemoLog />
    </div>
  );
}

function Tool({ name }: { name: string }) {
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2">
      <code className="text-fg">{name}</code>
    </div>
  );
}
