/*
  Warnings:

  - Changed the type of `streetNumber` on the `House` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- Add a temporary column
ALTER TABLE "House" ADD COLUMN "tempStreetNumber" INTEGER;

-- Assuming all values in streetNumber are convertible to integer
-- Copy and convert data from streetNumber to tempStreetNumber
UPDATE "House" SET "tempStreetNumber" = NULLIF(regexp_replace("streetNumber", '\D', '', 'g'), '')::INTEGER;

-- Drop the original streetNumber column
ALTER TABLE "House" DROP COLUMN "streetNumber";

-- Rename the temporary column to streetNumber
ALTER TABLE "House" RENAME COLUMN "tempStreetNumber" TO "streetNumber";
