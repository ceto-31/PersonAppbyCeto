import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const person = await prisma.person.findUnique({ where: { id } });
  if (!person) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(person);
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { firstName, lastName, email, age, city, country, bio } = body ?? {};

    const updated = await prisma.person.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        age: age ? Number(age) : null,
        city: city || null,
        country: country || null,
        bio: bio || null,
      },
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.person.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
