/*
  Warnings:

  - A unique constraint covering the columns `[id,locationId]` on the table `ShiftLogger` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShiftLogger_agentId_key";

-- DropIndex
DROP INDEX "ShiftLogger_agentId_locationId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ShiftLogger_id_locationId_key" ON "ShiftLogger"("id", "locationId");
