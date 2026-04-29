import McpDemoLog from "@/components/McpDemoLog";

export const metadata = { title: "MCP Demo · Person App" };

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
