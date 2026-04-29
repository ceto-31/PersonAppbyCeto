import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const limitParam = req.nextUrl.searchParams.get("limit");
  const take = Math.min(Math.max(Number(limitParam) || 50, 1), 200);

  const events = await prisma.mcpEvent.findMany({
    orderBy: { createdAt: "desc" },
    take,
  });
  return NextResponse.json(events);
}
