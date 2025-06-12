-- CreateTable
CREATE TABLE "FMEARecord" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "failureMode" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "severity" INTEGER NOT NULL,
    "occurrence" INTEGER NOT NULL,
    "detection" INTEGER NOT NULL,
    "rpn" INTEGER NOT NULL,
    "action" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FMEARecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FMEARecord_assetId_idx" ON "FMEARecord"("assetId");

-- AddForeignKey
ALTER TABLE "FMEARecord" ADD CONSTRAINT "FMEARecord_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
