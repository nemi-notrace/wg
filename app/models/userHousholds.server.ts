import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function userHasHousehold(userId: string): Promise<boolean> {
  const userHouseholds = await prisma.userHousehold.findMany({
    where: {
      userId: userId,
    },
  });

  return userHouseholds.length > 0;
}

