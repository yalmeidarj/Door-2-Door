/*
  Warnings:

  - A unique constraint covering the columns `[id,isClockedIn]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ClockIn" AS ENUM ('TRUE', 'FALSE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentShiftId" TEXT,
ADD COLUMN     "isClockedIn" "ClockIn" NOT NULL DEFAULT 'FALSE';

-- CreateIndex
CREATE UNIQUE INDEX "User_id_isClockedIn_key" ON "User"("id", "isClockedIn");
