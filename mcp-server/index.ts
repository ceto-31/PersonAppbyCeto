#!/usr/bin/env node
/**
 * Person App MCP Server
 *
 * Exposes CRUD tools for the Person model over MCP stdio transport so that
 * Claude Desktop (or any MCP-compatible client) can manage people in the
 * same Postgres database the web UI uses.
 *
 * Tools:
 *   - get_all_people
 *   - create_person
 *   - update_person
 *   - delete_person
 *
 * Each call is also recorded in the McpEvent table so /mcp-demo can show
 * a live feed of activity.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

async function logEvent(tool: string, payload: unknown, result: string) {
  try {
    await prisma.mcpEvent.create({
      data: {
        tool,
        payload: payload as Prisma.InputJsonValue,
        result,
      },
    });
  } catch {
    // Audit logging must never break a tool call.
  }
}

function ok(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function err(message: string) {
  return {
    isError: true,
    content: [{ type: "text" as const, text: `Error: ${message}` }],
  };
}

const server = new McpServer(
  { name: "person-app-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.registerTool(
  "get_all_people",
  {
    title: "Get All People",
    description:
      "Return every Person record from the database, newest first.",
    inputSchema: {},
  },
  async () => {
    try {
      const people = await prisma.person.findMany({
        orderBy: { createdAt: "desc" },
      });
      await logEvent("get_all_people", {}, `returned ${people.length} rows`);
      return ok(JSON.stringify(people, null, 2));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      await logEvent("get_all_people", {}, `error: ${msg}`);
      return err(msg);
    }
  }
);

const createSchema = {
  firstName: z.string().min(1).describe("Person's first name"),
  lastName: z.string().min(1).describe("Person's last name"),
  email: z.string().email().describe("Unique email address"),
  role: z.string().optional().describe("Job title or role"),
  age: z.number().int().positive().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional().describe("Free-form biography"),
};

server.registerTool(
  "create_person",
  {
    title: "Create Person",
    description: "Insert a new Person row.",
    inputSchema: createSchema,
  },
  async (input) => {
    try {
      const person = await prisma.person.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          role: input.role ?? null,
          age: input.age ?? null,
          city: input.city ?? null,
          country: input.country ?? null,
          bio: input.bio ?? null,
        },
      });
      await logEvent("create_person", input, `created id=${person.id}`);
      return ok(JSON.stringify(person, null, 2));
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        const msg = "A person with that email already exists";
        await logEvent("create_person", input, `error: ${msg}`);
        return err(msg);
      }
      const msg = e instanceof Error ? e.message : "Unknown error";
      await logEvent("create_person", input, `error: ${msg}`);
      return err(msg);
    }
  }
);

server.registerTool(
  "update_person",
  {
    title: "Update Person",
    description:
      "Update fields of an existing Person by id. Only provided fields change.",
    inputSchema: {
      id: z.string().min(1).describe("Person id (cuid)"),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      role: z.string().nullable().optional(),
      age: z.number().int().positive().nullable().optional(),
      city: z.string().nullable().optional(),
      country: z.string().nullable().optional(),
      bio: z.string().nullable().optional(),
    },
  },
  async (input) => {
    try {
      const { id, ...rest } = input;
      // Strip undefined so Prisma doesn't try to set them.
      const data = Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v !== undefined)
      );
      const updated = await prisma.person.update({ where: { id }, data });
      await logEvent("update_person", input, `updated id=${id}`);
      return ok(JSON.stringify(updated, null, 2));
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        const msg = "Person not found";
        await logEvent("update_person", input, `error: ${msg}`);
        return err(msg);
      }
      const msg = e instanceof Error ? e.message : "Unknown error";
      await logEvent("update_person", input, `error: ${msg}`);
      return err(msg);
    }
  }
);

server.registerTool(
  "delete_person",
  {
    title: "Delete Person",
    description: "Permanently remove a Person by id.",
    inputSchema: {
      id: z.string().min(1).describe("Person id (cuid)"),
    },
  },
  async (input) => {
    try {
      await prisma.person.delete({ where: { id: input.id } });
      await logEvent("delete_person", input, `deleted id=${input.id}`);
      return ok(`Deleted person ${input.id}`);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        const msg = "Person not found";
        await logEvent("delete_person", input, `error: ${msg}`);
        return err(msg);
      }
      const msg = e instanceof Error ? e.message : "Unknown error";
      await logEvent("delete_person", input, `error: ${msg}`);
      return err(msg);
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr is safe; stdout is reserved for the JSON-RPC stream.
  console.error("[person-app-mcp] ready");
}

main().catch((e) => {
  console.error("[person-app-mcp] fatal", e);
  process.exit(1);
});
