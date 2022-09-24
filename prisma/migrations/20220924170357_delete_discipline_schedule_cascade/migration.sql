-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_disciplineSchedulesId_fkey";

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_disciplineSchedulesId_fkey" FOREIGN KEY ("disciplineSchedulesId") REFERENCES "DisciplineSchedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
