import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sample = [
  {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    age: 36,
    city: "London",
    country: "UK",
    bio: "Mathematician and the first computer programmer.",
  },
  {
    firstName: "Alan",
    lastName: "Turing",
    email: "alan@example.com",
    age: 41,
    city: "Maida Vale",
    country: "UK",
    bio: "Founder of theoretical computer science and AI.",
  },
  {
    firstName: "Grace",
    lastName: "Hopper",
    email: "grace@example.com",
    age: 85,
    city: "New York",
    country: "USA",
    bio: "Pioneer of programming languages and compilers.",
  },
  {
    firstName: "Linus",
    lastName: "Torvalds",
    email: "linus@example.com",
    age: 55,
    city: "Portland",
    country: "USA",
    bio: "Creator of the Linux kernel and Git.",
  },
  {
    firstName: "Margaret",
    lastName: "Hamilton",
    email: "margaret@example.com",
    age: 87,
    city: "Cambridge",
    country: "USA",
    bio: "Led Apollo onboard flight software development.",
  },
];

async function main() {
  for (const p of sample) {
    await prisma.person.upsert({
      where: { email: p.email },
      update: {},
      create: p,
    });
  }
  console.log(`Seeded ${sample.length} people.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
