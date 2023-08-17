-- CreateTable
CREATE TABLE "UserStay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "weeks" INTEGER NOT NULL,

    CONSTRAINT "UserStay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStay_userId_householdId_startDate_key" ON "UserStay"("userId", "householdId", "startDate");

-- AddForeignKey
ALTER TABLE "UserStay" ADD CONSTRAINT "UserStay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStay" ADD CONSTRAINT "UserStay_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
