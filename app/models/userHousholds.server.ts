import { PrismaClient } from "@prisma/client";
import { getUser } from "session.server";

const prisma = new PrismaClient();

export async function userHasHousehold(userId: string): Promise<boolean> {
  const userHouseholds = await prisma.userHousehold.findMany({
    where: {
      userId: userId,
    },
  });

  return userHouseholds.length > 0;
}
export async function getUsersByCurrentUser(request: any) {
  const currentUser = getUser(request);
  const userHouseholds = await prisma.userHousehold.findMany({
    where: { userId: currentUser.id },
  });
  const householdIds = userHouseholds.map((uh) => uh.householdId);

  return await prisma.user.findMany({
    where: { households: { some: { householdId: { in: householdIds } } } },
  });
}

export async function getHouseholdsByCurrentUser(request: any) {
  const currentUser = getUser(request);
  const userHouseholds = await prisma.userHousehold.findMany({
    where: { userId: currentUser.id },
  });
  const householdIds = userHouseholds.map((uh) => uh.householdId);

  return await prisma.household.findMany({
    where: { id: { in: householdIds } },
  });
}
