/*
  Warnings:

  - You are about to drop the column `disciplineId` on the `ClassSchedule` table. All the data in the column will be lost.
  - Added the required column `classId` to the `ClassSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClassSchedule" DROP COLUMN "disciplineId",
ADD COLUMN     "classId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ClassSchedule" ADD CONSTRAINT "ClassSchedule_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
