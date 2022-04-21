/*
  Warnings:

  - You are about to drop the `_ClassToDiscipline` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `classId` to the `Discipline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'Estudante';

-- DropForeignKey
ALTER TABLE "_ClassToDiscipline" DROP CONSTRAINT "_ClassToDiscipline_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassToDiscipline" DROP CONSTRAINT "_ClassToDiscipline_B_fkey";

-- AlterTable
ALTER TABLE "Discipline" ADD COLUMN     "classId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ClassToDiscipline";

-- AddForeignKey
ALTER TABLE "Discipline" ADD CONSTRAINT "Discipline_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
