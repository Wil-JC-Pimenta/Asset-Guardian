/*
  Warnings:

  - You are about to drop the column `action` on the `FMEARecord` table. All the data in the column will be lost.
  - You are about to drop the column `cause` on the `FMEARecord` table. All the data in the column will be lost.
  - You are about to drop the column `effect` on the `FMEARecord` table. All the data in the column will be lost.
  - Added the required column `potentialEffect` to the `FMEARecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendedAction` to the `FMEARecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsible` to the `FMEARecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FMEARecord_assetId_idx";

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "availability" DOUBLE PRECISION,
ADD COLUMN     "mtbf" DOUBLE PRECISION,
ADD COLUMN     "mttr" DOUBLE PRECISION,
ADD COLUMN     "oee" DOUBLE PRECISION,
ADD COLUMN     "performance" DOUBLE PRECISION,
ADD COLUMN     "quality" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "FMEARecord" DROP COLUMN "action",
DROP COLUMN "cause",
DROP COLUMN "effect",
ADD COLUMN     "potentialEffect" TEXT NOT NULL DEFAULT 'Efeito não especificado',
ADD COLUMN     "recommendedAction" TEXT NOT NULL DEFAULT 'Ação não especificada',
ADD COLUMN     "responsible" TEXT NOT NULL DEFAULT 'Responsável não especificado';

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
