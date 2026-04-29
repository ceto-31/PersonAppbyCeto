import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
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
    const { firstName, lastName, email, role, age, city, country, bio } =
      body ?? {};

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
        role: role || null,
        age: age ? Number(age) : null,
        city: city || null,
        country: country || null,
        bio: bio || null,
      },
    });
    return NextResponse.json(person, { status: 201 });
  } catch (err: unknown) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A person with that email already exists" },
        { status: 409 }
      );
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
