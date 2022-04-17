/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the `ClassSchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Day" AS ENUM ('Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo');

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "ClassSchedule" DROP CONSTRAINT "ClassSchedule_classId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "teacherId";

-- DropTable
DROP TABLE "ClassSchedule";

-- DropEnum
DROP TYPE "_Day";

-- CreateTable
CREATE TABLE "DisciplineSchedules" (
    "id" TEXT NOT NULL,
    "day" "Day" NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "initialHour" TIMESTAMP(3) NOT NULL,
    "finishHour" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisciplineSchedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DisciplineSchedules" ADD CONSTRAINT "DisciplineSchedules_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
