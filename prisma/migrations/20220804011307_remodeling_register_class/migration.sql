/*
  Warnings:

  - You are about to drop the column `classDate` on the `RegisterClass` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `RegisterClass` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `RegisterClass` table. All the data in the column will be lost.
  - You are about to drop the column `subContent` on the `RegisterClass` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RegisterClass" DROP COLUMN "classDate",
DROP COLUMN "content",
DROP COLUMN "observation",
DROP COLUMN "subContent",
ALTER COLUMN "type" DROP NOT NULL;
