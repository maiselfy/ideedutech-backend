-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_schooldId_fkey";

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_schooldId_fkey" FOREIGN KEY ("schooldId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
