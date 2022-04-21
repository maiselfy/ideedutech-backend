/*
  Warnings:

  - You are about to drop the column `teatcherId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `ParentsOnStudent` table. All the data in the column will be lost.
  - The primary key for the `TeachersOnSchool` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `teatcherId` on the `TeachersOnSchool` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `TeachersOnSchool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TeachersOnSchool" DROP CONSTRAINT "TeachersOnSchool_teatcherId_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "teatcherId",
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Manager" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ParentsOnStudent" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TeachersOnSchool" DROP CONSTRAINT "TeachersOnSchool_pkey",
DROP COLUMN "teatcherId",
ADD COLUMN     "teacherId" TEXT NOT NULL,
ADD CONSTRAINT "TeachersOnSchool_pkey" PRIMARY KEY ("teacherId", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_userId_key" ON "Manager"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachersOnSchool" ADD CONSTRAINT "TeachersOnSchool_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
