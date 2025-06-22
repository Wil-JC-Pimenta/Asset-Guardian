-- AlterTable
ALTER TABLE "Asset" 
ADD COLUMN IF NOT EXISTS "mtbf" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "mttr" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "oee" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "availability" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "performance" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "quality" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "FMEARecord" 
DROP COLUMN IF EXISTS "action",
DROP COLUMN IF EXISTS "cause",
DROP COLUMN IF EXISTS "effect",
ADD COLUMN IF NOT EXISTS "potentialEffect" TEXT NOT NULL DEFAULT 'Efeito não especificado',
ADD COLUMN IF NOT EXISTS "recommendedAction" TEXT NOT NULL DEFAULT 'Ação não especificada',
ADD COLUMN IF NOT EXISTS "responsible" TEXT NOT NULL DEFAULT 'Responsável não especificado';

-- Drop existing table if exists
DROP TABLE IF EXISTS "Report" CASCADE;

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attachments" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
