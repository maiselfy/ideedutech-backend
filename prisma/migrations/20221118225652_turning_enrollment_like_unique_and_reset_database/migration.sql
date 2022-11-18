/*
  Warnings:

  - A unique constraint covering the columns `[enrollment]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "WaitList_value_key";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "labelAddress" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_enrollment_key" ON "Student"("enrollment");
