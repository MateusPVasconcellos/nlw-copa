import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const user = await prisma.user.create({
    data: {
      name: "Jhon Doe",
      email: "jhondoe@email.com",
      avatarUrl: "https://github.com/diego3g.png",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "Exemple pool",
      code: "BOL123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-02T13:50:27.512Z",
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "BR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-02T15:50:27.512Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",

      guesses: {
        create: {
          firstTeamPoints: 4,
          secondTeamPoints: 2,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

seed();
