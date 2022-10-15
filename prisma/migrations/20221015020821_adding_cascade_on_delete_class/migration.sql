-- DropForeignKey
ALTER TABLE "Discipline" DROP CONSTRAINT "Discipline_classId_fkey";

-- AddForeignKey
ALTER TABLE "Discipline" ADD CONSTRAINT "Discipline_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
