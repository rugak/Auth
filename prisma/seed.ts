import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
 
  await prisma.user.createMany({
    data: [
      {
        login: "admin",
        password: "passAdmin",
        roles: ["ROLE_ADMIN", "ROLE_USER"],
        status: "opened",
      },
      {
        login: "normalUser",
        password: "passUser",
        roles: ["ROLE_USER"],
        status: "opened",
      },
    ],
  });


  console.log("DataBase seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
