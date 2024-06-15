-- DropForeignKey
ALTER TABLE "HouseEditLog" DROP CONSTRAINT "HouseEditLog_shiftLoggerId_fkey";

-- DropIndex
DROP INDEX "HouseEditLog_shiftLoggerId_idx";
