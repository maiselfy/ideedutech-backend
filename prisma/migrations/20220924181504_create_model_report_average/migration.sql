-- CreateTable
CREATE TABLE "ReportAverage" (
    "id" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,

    CONSTRAINT "ReportAverage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportAverage" ADD CONSTRAINT "ReportAverage_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportAverage" ADD CONSTRAINT "ReportAverage_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportAverage" ADD CONSTRAINT "ReportAverage_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
