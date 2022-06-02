/*
  Warnings:

  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EvaluationStage" AS ENUM ('Enviada', 'Atrasada', 'Pendente', 'Avaliada', 'Cancelada', 'Outros');

-- AlterEnum
ALTER TYPE "TypeHomeWork" ADD VALUE 'Avaliação';

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_testId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_homeWorkId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_studentId_fkey";

-- AlterTable
ALTER TABLE "HomeWork" ALTER COLUMN "dueDate" DROP NOT NULL,
ALTER COLUMN "isOpen" DROP NOT NULL;

-- DropTable
DROP TABLE "Evaluation";

-- DropTable
DROP TABLE "Submission";

-- DropTable
DROP TABLE "Test";

-- DropEnum
DROP TYPE "StageSubmission";

-- CreateTable
CREATE TABLE "EvaluativeDelivery" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "homeWorkId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "dueDate" TIMESTAMP(3),
    "attachement" TEXT,
    "stage" "EvaluationStage",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluativeDelivery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvaluativeDelivery" ADD CONSTRAINT "EvaluativeDelivery_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluativeDelivery" ADD CONSTRAINT "EvaluativeDelivery_homeWorkId_fkey" FOREIGN KEY ("homeWorkId") REFERENCES "HomeWork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
