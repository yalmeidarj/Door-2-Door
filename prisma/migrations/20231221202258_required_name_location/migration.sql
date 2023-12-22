/*
  Warnings:

  - A unique constraint covering the columns `[name,id]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_id_key" ON "Location"("name", "id");
