/*
  Warnings:

  - Made the column `addressId` on table `School` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "School" ALTER COLUMN "addressId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
