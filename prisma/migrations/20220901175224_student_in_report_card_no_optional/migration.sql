/*
  Warnings:

  - Made the column `studentId` on table `ReportCard` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ReportCard" DROP CONSTRAINT "ReportCard_studentId_fkey";

-- AlterTable
ALTER TABLE "ReportCard" ALTER COLUMN "studentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
