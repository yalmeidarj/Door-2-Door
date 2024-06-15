-- CreateTable
CREATE TABLE "HouseEditLog" (
    "id" SERIAL NOT NULL,
    "houseId" INTEGER NOT NULL,
    "agentId" TEXT NOT NULL,
    "shiftLoggerId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "lastName" TEXT,
    "type" TEXT,
    "statusAttempt" TEXT,
    "consent" TEXT,
    "email" TEXT,
    "externalNotes" TEXT,
    "internalNotes" TEXT,
    "phone" TEXT,

    CONSTRAINT "HouseEditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HouseEditLog_houseId_idx" ON "HouseEditLog"("houseId");

-- CreateIndex
CREATE INDEX "HouseEditLog_agentId_idx" ON "HouseEditLog"("agentId");

-- CreateIndex
CREATE INDEX "HouseEditLog_shiftLoggerId_idx" ON "HouseEditLog"("shiftLoggerId");

-- CreateIndex
CREATE INDEX "HouseEditLog_timestamp_idx" ON "HouseEditLog"("timestamp");

-- AddForeignKey
ALTER TABLE "HouseEditLog" ADD CONSTRAINT "HouseEditLog_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseEditLog" ADD CONSTRAINT "HouseEditLog_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseEditLog" ADD CONSTRAINT "HouseEditLog_shiftLoggerId_fkey" FOREIGN KEY ("shiftLoggerId") REFERENCES "ShiftLogger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
