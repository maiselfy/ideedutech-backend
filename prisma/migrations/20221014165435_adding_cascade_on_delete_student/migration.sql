-- DropForeignKey
ALTER TABLE "EvaluativeDelivery" DROP CONSTRAINT "EvaluativeDelivery_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Gradebook" DROP CONSTRAINT "Gradebook_studentId_fkey";

-- DropForeignKey
ALTER TABLE "LackOfClass" DROP CONSTRAINT "LackOfClass_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ReportAverage" DROP CONSTRAINT "ReportAverage_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ReportCard" DROP CONSTRAINT "ReportCard_studentId_fkey";

-- AddForeignKey
ALTER TABLE "EvaluativeDelivery" ADD CONSTRAINT "EvaluativeDelivery_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gradebook" ADD CONSTRAINT "Gradebook_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportAverage" ADD CONSTRAINT "ReportAverage_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LackOfClass" ADD CONSTRAINT "LackOfClass_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
