-- DropForeignKey
ALTER TABLE "WaitList" DROP CONSTRAINT "WaitList_schoolId_fkey";

-- AddForeignKey
ALTER TABLE "WaitList" ADD CONSTRAINT "WaitList_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
