/*
  Warnings:

  - You are about to drop the column `lessonId` on the `Schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_lessonId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "scheduleId" TEXT;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "lessonId";

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
