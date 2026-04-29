# Person App — MCP-Enabled CRUD

A production-ready full-stack **Person Management App** with both a web UI **and** an integrated **Model Context Protocol (MCP) server**, so AI agents (e.g. Claude Desktop) can read and modify the same PostgreSQL database the website uses.

> Live web UI + REST API + Prisma + Postgres + MCP server, all in one Next.js project, deployable to Vercel.

- **Live app:** <https://person-appby-ceto.vercel.app>
- **Source:** <https://github.com/ceto-31/PersonAppbyCeto>

---

## Features

- **Web CRUD dashboard** — create, read, update, delete `Person` records.
- **REST API** via Next.js Route Handlers (`/api/persons`).
- **MCP server** (stdio) exposing 4 tools to AI agents:
  - `get_all_people`
  - `create_person`
  - `update_person`
  - `delete_person`
- **Live reflect** — the dashboard polls every 4 s, so MCP-driven changes appear without a manual refresh.
- **Audit log** — every MCP tool call is recorded in an `McpEvent` table and surfaced on the `/mcp-demo` page.
- **Documentation pages** built into the app: `/about`, `/database`, `/mcp-setup`, `/mcp-demo`, `/github`.
- **Error handling** — duplicate-email returns `409`, missing record returns `404`, validation returns `400`.
- **Dark / light theme** with semantic tokens, no FOUC.

---

## Tech stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Framework      | Next.js 16 (App Router) + React 19    |
| Language       | TypeScript                            |
| Styling        | Tailwind CSS v4 (semantic tokens)     |
| ORM            | Prisma 6                              |
| Database       | PostgreSQL (Neon / Vercel / Supabase) |
| AI Integration | `@modelcontextprotocol/sdk` (stdio)   |
| Hosting        | Vercel                                |

---

## Database schema (Prisma)

```prisma
model Person {
  id        String   @id @default(cuid())
  firstName String
  lastName  String
  email     String   @unique
  role      String?
  age       Int?
  city      String?
  country   String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model McpEvent {
  id        String   @id @default(cuid())
  tool      String
  payload   Json?
  result    String
  createdAt DateTime @default(now())
  @@index([createdAt])
}
```

> The spec asks for `name` + `role`; this app keeps `firstName` / `lastName` as a richer (and unambiguous) representation of "name", and adds `role` as required.

---

## Getting started (local)

```bash
git clone https://github.com/ceto-31/PersonAppbyCeto.git
cd PersonAppbyCeto
npm install
cp .env.example .env             # then fill in DATABASE_URL
npx prisma migrate deploy
npm run db:seed
npm run dev                      # web app on http://localhost:3000
```

To run the MCP server locally (for testing without Claude Desktop):

```bash
npm run mcp:dev
```

The server speaks JSON-RPC on **stdio** — it has no HTTP port. Use it via Claude Desktop or any MCP client.

---

## Connecting Claude Desktop

Add this to your `claude_desktop_config.json`:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
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
}
```

> **DATABASE_URL** must point to the same Postgres the deployed web app uses, so changes made by Claude appear instantly in the production dashboard. Hosted Postgres (Neon, Vercel Postgres, Supabase, Railway) all work; the example above is the Neon shape.
>
> A helper script is included &mdash; run `node scripts/install-mcp-config.js` to merge the entry into your existing config using `DATABASE_URL` from `.env`.

Restart Claude Desktop. The `person-app` server will appear with the four CRUD tools. Step-by-step instructions are also in the app at **`/mcp-setup`**.

---

## Live demo with Claude Desktop

The screenshots below show all four MCP tools driving the same Postgres the web UI uses. Every call also lands in the live event log at [`/mcp-demo`](https://person-appby-ceto.vercel.app/mcp-demo).

### 1. Read &mdash; `get_all_people`

![Claude listing all people via person-app](public/mcp-demo/01-read.png)

### 2. Create &mdash; `create_person`

![Claude creating Rodwin Vic via person-app](public/mcp-demo/02-create.png)

### 3. Update &mdash; `update_person`

![Claude updating Rodwin Vic’s role](public/mcp-demo/03-update.png)

### 4. Delete &mdash; `delete_person`

![Claude deleting four records via person-app](public/mcp-demo/04-delete.png)

---

## Architecture

```
┌──────────────┐    JSON-RPC / stdio   ┌─────────────────────┐
│ Claude       │  ───────────────────▶ │ person-app MCP      │
│ Desktop      │  ◀─────────────────── │ server (Node)       │
└──────────────┘    tool results       └────────┬────────────┘
                                                │ Prisma Client
                                                ▼
                                       ┌─────────────────────┐
                                       │ PostgreSQL          │
                                       │  Person, McpEvent   │
                                       └────────┬────────────┘
                                                │
                                                ▼
   Browser ──polls /api/persons──▶      ┌─────────────────────┐
   (4s loop)        + /api/mcp-events   │ Next.js API routes  │
                                        │ (App Router)        │
                                        └─────────────────────┘
```

The MCP server reuses the same Prisma data layer as the web API, so a single `DATABASE_URL` powers both surfaces and writes from either side are immediately visible to the other.

---

## REST API

| Method | Path                | Body                                       | Status              |
| ------ | ------------------- | ------------------------------------------ | ------------------- |
| GET    | `/api/persons`      | —                                          | `200`               |
| POST   | `/api/persons`      | `{ firstName, lastName, email, role?, … }` | `201`, `400`, `409` |
| GET    | `/api/persons/[id]` | —                                          | `200`, `404`        |
| PUT    | `/api/persons/[id]` | partial Person                             | `200`, `404`, `409` |
| DELETE | `/api/persons/[id]` | —                                          | `200`, `404`        |
| GET    | `/api/mcp-events`   | `?limit=50`                                | `200`               |

---

## Pages

| Route        | Purpose                                               |
| ------------ | ----------------------------------------------------- |
| `/`          | Person CRUD dashboard                                 |
| `/about`     | Architecture overview (web **and** MCP/agent flow)    |
| `/database`  | Prisma schema + field reference                       |
| `/mcp-setup` | Step-by-step Claude Desktop setup with config snippet |
| `/mcp-demo`  | Live event log proving the MCP server is active       |
| `/github`    | Link to the source repository                         |

---

## Scripts

| Script               | Purpose                               |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Local Next.js dev server              |
| `npm run build`      | `prisma generate` + `next build`      |
| `npm start`          | Production server                     |
| `npm run db:migrate` | `prisma migrate dev`                  |
| `npm run db:deploy`  | `prisma migrate deploy` (CI / Vercel) |
| `npm run db:seed`    | Insert sample people                  |
| `npm run mcp:dev`    | Run the MCP stdio server (tsx)        |

---

## Deployment (Vercel)

1. Import the repo in Vercel.
2. Set `DATABASE_URL` in **Project Settings → Environment Variables**.
3. Deploy. The build runs `prisma generate` automatically (`npm run build`).
4. After the first deploy, run the migration once:
   ```bash
   npx prisma migrate deploy
   ```
   (Or add it to the build command: `prisma migrate deploy && prisma generate && next build`.)

The MCP server is **not** deployed to Vercel — it is a local stdio process that Claude Desktop spawns on the user's machine. It connects to the same hosted Postgres, so writes still flow into the production database.

---

## Repository

Source: <https://github.com/ceto-31/PersonAppbyCeto>
