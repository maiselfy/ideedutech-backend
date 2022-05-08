/*
  Warnings:

  - You are about to drop the column `adminId` on the `School` table. All the data in the column will be lost.
  - You are about to drop the `Parent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ParentToStudent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `topic` to the `Discipline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inep` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_adminId_fkey";

-- DropForeignKey
ALTER TABLE "_ParentToStudent" DROP CONSTRAINT "_ParentToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParentToStudent" DROP CONSTRAINT "_ParentToStudent_B_fkey";

-- AlterTable
ALTER TABLE "Discipline" ADD COLUMN     "topic" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "adminId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "inep" TEXT NOT NULL;

-- DropTable
DROP TABLE "Parent";

-- DropTable
DROP TABLE "_ParentToStudent";
