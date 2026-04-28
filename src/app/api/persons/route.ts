import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const people = await prisma.person.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(people);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, age, city, country, bio } = body ?? {};

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "firstName, lastName and email are required" },
        { status: 400 }
      );
    }

    const person = await prisma.person.create({
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
    return NextResponse.json(person, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
