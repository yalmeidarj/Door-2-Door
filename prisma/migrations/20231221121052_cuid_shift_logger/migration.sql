/*
  Warnings:

  - The primary key for the `ShiftLogger` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[agentId]` on the table `ShiftLogger` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ShiftLogger" DROP CONSTRAINT "ShiftLogger_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ShiftLogger_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ShiftLogger_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "ShiftLogger_agentId_key" ON "ShiftLogger"("agentId");
