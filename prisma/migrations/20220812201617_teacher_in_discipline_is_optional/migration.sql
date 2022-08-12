-- DropForeignKey
ALTER TABLE "Discipline" DROP CONSTRAINT "Discipline_teacherId_fkey";

-- AlterTable
ALTER TABLE "Discipline" ALTER COLUMN "teacherId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Discipline" ADD CONSTRAINT "Discipline_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
