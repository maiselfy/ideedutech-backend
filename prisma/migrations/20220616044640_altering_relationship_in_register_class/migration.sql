/*
  Warnings:

  - You are about to drop the column `disciplineId` on the `RegisterClass` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RegisterClass" DROP CONSTRAINT "RegisterClass_disciplineId_fkey";

-- AlterTable
ALTER TABLE "RegisterClass" DROP COLUMN "disciplineId",
ADD COLUMN     "lessonId" TEXT;

-- AddForeignKey
ALTER TABLE "RegisterClass" ADD CONSTRAINT "RegisterClass_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
