/*
  Warnings:

  - You are about to drop the column `userProviderUserId` on the `ShiftLogger` table. All the data in the column will be lost.
  - You are about to drop the column `workerId` on the `ShiftLogger` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[agentId,locationId]` on the table `ShiftLogger` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShiftLogger_workerId_locationId_key";

-- AlterTable
ALTER TABLE "ShiftLogger" DROP COLUMN "userProviderUserId",
DROP COLUMN "workerId";

-- CreateIndex
CREATE UNIQUE INDEX "ShiftLogger_agentId_locationId_key" ON "ShiftLogger"("agentId", "locationId");
