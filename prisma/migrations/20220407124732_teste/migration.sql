-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_schoolId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "schoolId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
