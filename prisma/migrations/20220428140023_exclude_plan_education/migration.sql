/*
  Warnings:

  - You are about to drop the column `planEducationId` on the `Period` table. All the data in the column will be lost.
  - You are about to drop the `PlanEducation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `disciplineId` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolId` to the `Period` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_planEducationId_fkey";

-- DropForeignKey
ALTER TABLE "PlanEducation" DROP CONSTRAINT "PlanEducation_disciplineId_fkey";

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "disciplineId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Period" DROP COLUMN "planEducationId",
ADD COLUMN     "schoolId" TEXT NOT NULL;

-- DropTable
DROP TABLE "PlanEducation";

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
