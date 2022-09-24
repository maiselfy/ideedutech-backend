-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_schoolId_fkey";

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
