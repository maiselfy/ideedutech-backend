-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "DisciplineSchedules" DROP CONSTRAINT "DisciplineSchedules_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "Gradebook" DROP CONSTRAINT "Gradebook_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "HomeWork" DROP CONSTRAINT "HomeWork_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "ReportAverage" DROP CONSTRAINT "ReportAverage_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_disciplineId_fkey";

-- AddForeignKey
ALTER TABLE "HomeWork" ADD CONSTRAINT "HomeWork_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gradebook" ADD CONSTRAINT "Gradebook_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportAverage" ADD CONSTRAINT "ReportAverage_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisciplineSchedules" ADD CONSTRAINT "DisciplineSchedules_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
