/*
  Warnings:

  - The `isClockedIn` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isClockedIn",
ADD COLUMN     "isClockedIn" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "IsClockedIn";

-- CreateIndex
CREATE UNIQUE INDEX "User_id_isClockedIn_key" ON "User"("id", "isClockedIn");
