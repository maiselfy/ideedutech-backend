-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_periodId_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "periodId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE SET NULL ON UPDATE CASCADE;
