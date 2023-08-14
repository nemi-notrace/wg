import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Household functions
export async function createHousehold() {
  return await prisma.household.create({
    data: {},
  });
}

export async function getHouseholdById(id: number) {
  return await prisma.household.findUnique({
    where: { id: id },
  });
}

export async function addUserToHousehold(userId: string, householdId: number) {
  return await prisma.userHousehold.create({
    data: {
      userId: userId,
      householdId: householdId,
    },
  });
}

// Transaction functions
export async function createTransaction(data: any) {
  return await prisma.transaction.create({
    data: data,
  });
}

export async function getTransactionsByHousehold(householdId: number) {
  return await prisma.transaction.findMany({
    where: {
      householdId: householdId,
    },
  });
}

export async function getTransactionsByUser(userId: string) {
  return await prisma.transaction.findMany({
    where: {
      userId: userId,
    },
  });
}

export async function getTransactionsByUserAndHousehold(
  userId: string,
  householdId: number
) {
  return await prisma.transaction.findMany({
    where: {
      userId: { equals: userId },
      householdId: { equals: householdId },
    },
  });
}

// Don't forget to close the Prisma client connection when done
export async function closePrisma() {
  await prisma.$disconnect();
}

export async function getAllHouseholds() {
  return await prisma.household.findMany();
}
