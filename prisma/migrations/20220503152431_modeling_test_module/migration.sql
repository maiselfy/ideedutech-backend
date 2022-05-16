-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "disciplineId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
