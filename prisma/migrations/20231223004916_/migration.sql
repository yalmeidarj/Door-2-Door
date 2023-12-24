/*
  Warnings:

  - The `isClockedIn` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "IsClockedIn" AS ENUM ('TRUE', 'FALSE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isClockedIn",
ADD COLUMN     "isClockedIn" "IsClockedIn" NOT NULL DEFAULT 'FALSE';

-- DropEnum
DROP TYPE "ClockIn";

-- CreateIndex
CREATE UNIQUE INDEX "User_id_isClockedIn_key" ON "User"("id", "isClockedIn");
