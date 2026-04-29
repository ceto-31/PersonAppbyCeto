"use client";

import { useEffect, useState } from "react";

type McpEvent = {
  id: string;
  tool: string;
  payload: unknown;
  result: string;
  createdAt: string;
};

const TOOL_COLORS: Record<string, string> = {
  get_all_people: "bg-surface-2 text-fg",
  create_person: "bg-primary text-primary-fg",
  update_person: "bg-surface-2 text-accent-fg",
  delete_person: "bg-danger text-danger-fg",
};

export default function McpDemoLog() {
  const [events, setEvents] = useState<McpEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/mcp-events?limit=50", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load events");
        const data = (await res.json()) as McpEvent[];
        if (!cancelled) {
          setEvents(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load");
        }
      }
    }
    load();
    const id = setInterval(() => {
      if (!paused && !document.hidden) load();
    }, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [paused]);

  return (
    <section className="mt-6 bg-surface border border-border rounded-xl p-5 shadow-sm">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-fg">Event Log</h2>
          <p className="text-xs text-fg-subtle mt-0.5">
            {events === null
              ? "Loading…"
              : `${events.length} recent event${events.length === 1 ? "" : "s"}`}
            {paused && " · paused"}
          </p>
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          className="text-xs px-3 py-1.5 rounded border border-border-strong text-fg hover:bg-surface-2"
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </header>

      {error && (
        <p className="text-sm text-danger-soft-fg bg-danger-soft-bg border border-border rounded p-2 mb-3">
          {error}
        </p>
      )}

      {events && events.length === 0 ? (
        <p className="text-sm text-fg-subtle">
          No MCP calls yet. Trigger a tool from Claude Desktop and it will
          appear here within seconds.
        </p>
      ) : (
        <ul className="space-y-2">
          {events?.map((e) => (
            <li
              key={e.id}
              className="border border-border rounded-lg p-3 text-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-block text-xs px-2 py-0.5 rounded font-mono ${
                    TOOL_COLORS[e.tool] ?? "bg-surface-2 text-fg"
                  }`}
                >
                  {e.tool}
                </span>
                <time className="text-xs text-fg-subtle">
                  {new Date(e.createdAt).toLocaleString()}
                </time>
              </div>
              <p className="text-xs text-fg-muted mt-2">{e.result}</p>
              {!!e.payload && Object.keys(e.payload as object).length > 0 ? (
                <pre className="text-xs text-fg-subtle bg-surface-2 border border-border rounded p-2 mt-2 overflow-x-auto">
                  {JSON.stringify(e.payload, null, 2)}
                </pre>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
