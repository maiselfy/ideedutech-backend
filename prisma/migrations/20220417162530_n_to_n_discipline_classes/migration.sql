/*
  Warnings:

  - You are about to drop the column `classId` on the `Discipline` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Discipline" DROP CONSTRAINT "Discipline_classId_fkey";

-- AlterTable
ALTER TABLE "Discipline" DROP COLUMN "classId";

-- CreateTable
CREATE TABLE "_ClassToDiscipline" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToDiscipline_AB_unique" ON "_ClassToDiscipline"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToDiscipline_B_index" ON "_ClassToDiscipline"("B");

-- AddForeignKey
ALTER TABLE "_ClassToDiscipline" ADD FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToDiscipline" ADD FOREIGN KEY ("B") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
