import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sample = [
  {
    firstName: "Jose",
    lastName: "Rizal",
    email: "jose.rizal@example.ph",
    age: 35,
    city: "Calamba",
    country: "Philippines",
    bio: "National hero, writer of Noli Me Tangere and El Filibusterismo.",
  },
  {
    firstName: "Andres",
    lastName: "Bonifacio",
    email: "andres.bonifacio@example.ph",
    age: 33,
    city: "Tondo, Manila",
    country: "Philippines",
    bio: "Father of the Philippine Revolution and founder of the Katipunan.",
  },
  {
    firstName: "Emilio",
    lastName: "Aguinaldo",
    email: "emilio.aguinaldo@example.ph",
    age: 94,
    city: "Kawit, Cavite",
    country: "Philippines",
    bio: "First President of the Philippines.",
  },
  {
    firstName: "Apolinario",
    lastName: "Mabini",
    email: "apolinario.mabini@example.ph",
    age: 38,
    city: "Tanauan, Batangas",
    country: "Philippines",
    bio: "Sublime Paralytic and Brains of the Revolution.",
  },
  {
    firstName: "Gabriela",
    lastName: "Silang",
    email: "gabriela.silang@example.ph",
    age: 32,
    city: "Santa, Ilocos Sur",
    country: "Philippines",
    bio: "Filipina revolutionary leader who led Ilocano forces against Spain.",
  },
  {
    firstName: "Melchora",
    lastName: "Aquino",
    email: "melchora.aquino@example.ph",
    age: 107,
    city: "Caloocan",
    country: "Philippines",
    bio: "Tandang Sora, Mother of the Philippine Revolution.",
  },
  {
    firstName: "Lapu",
    lastName: "Lapu",
    email: "lapu.lapu@example.ph",
    age: 50,
    city: "Mactan, Cebu",
    country: "Philippines",
    bio: "Datu of Mactan, first Filipino to resist Spanish colonization.",
  },
  {
    firstName: "Manuel",
    lastName: "Quezon",
    email: "manuel.quezon@example.ph",
    age: 65,
    city: "Baler, Aurora",
    country: "Philippines",
    bio: "Second President of the Philippines and Father of the National Language.",
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
