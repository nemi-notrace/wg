import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Household functions
export async function createHousehold(name?: string) {
  if (name === undefined) name = "New Household" + Math.random();
  return await prisma.household.create({
    data: { name: name },
  });
}

export async function getHouseholdById(id: string) {
  return await prisma.household.findUnique({
    where: { id: id },
    include: {
      users: true,
    },
  });
}

export async function addUserToHousehold(userId: string, householdId: string) {
  return await prisma.userHousehold.upsert({
    where: { userId_householdId: { userId, householdId } },
    update: {},
    create: {
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

export async function getTransactionsByHousehold(householdId: string) {
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
  householdId: string
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

export async function getAllHousholdsOfUser(userId: string) {
  return await prisma.userHousehold.findMany({
    where: {
      userId: userId,
    },
  });
}

export async function getAllUsersOfHousehold(userId: string) {
  return await prisma.userHousehold.findMany({
    where: {
      householdId: userId,
    },
  });
}
