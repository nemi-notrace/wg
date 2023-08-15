/*
  Warnings:

  - The primary key for the `Household` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserHousehold` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_householdId_fkey";

-- DropForeignKey
ALTER TABLE "UserHousehold" DROP CONSTRAINT "UserHousehold_householdId_fkey";

-- AlterTable
ALTER TABLE "Household" DROP CONSTRAINT "Household_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Household_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Household_id_seq";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "householdId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserHousehold" DROP CONSTRAINT "UserHousehold_pkey",
ALTER COLUMN "householdId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserHousehold_pkey" PRIMARY KEY ("userId", "householdId");

-- AddForeignKey
ALTER TABLE "UserHousehold" ADD CONSTRAINT "UserHousehold_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
