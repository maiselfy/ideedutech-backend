-- AlterTable
ALTER TABLE "DisciplineSchedules" ALTER COLUMN "initialHour" SET DATA TYPE TEXT,
ALTER COLUMN "finishHour" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Period" ADD COLUMN     "disciplineSchedulesId" TEXT;

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_disciplineSchedulesId_fkey" FOREIGN KEY ("disciplineSchedulesId") REFERENCES "DisciplineSchedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
