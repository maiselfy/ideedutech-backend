/*
  Warnings:

  - You are about to drop the column `disciplineSchedulesId` on the `Period` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_disciplineSchedulesId_fkey";

-- AlterTable
ALTER TABLE "Period" DROP COLUMN "disciplineSchedulesId";
