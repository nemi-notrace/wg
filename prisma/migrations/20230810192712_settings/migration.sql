-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "FIRST_USER_INVITE_CODE_USED" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
