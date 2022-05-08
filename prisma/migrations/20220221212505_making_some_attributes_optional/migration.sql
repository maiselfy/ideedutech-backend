/*
  Warnings:

  - You are about to drop the column `parentId` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HomeWork" ALTER COLUMN "attachement" DROP NOT NULL;

-- AlterTable
ALTER TABLE "School" ALTER COLUMN "addressId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "parentId",
ALTER COLUMN "reasonForTransfer" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "attachement" DROP NOT NULL,
ALTER COLUMN "stage" DROP NOT NULL;
