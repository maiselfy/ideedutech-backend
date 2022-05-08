/*
  Warnings:

  - Added the required column `name` to the `Period` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Period" ADD COLUMN     "name" TEXT NOT NULL;
