-- CreateEnum
CREATE TYPE "SchoolTerm" AS ENUM ('Bimestre', 'Trimestre', 'Semestre');

-- CreateTable
CREATE TABLE "Gradebook" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "numberOfTerm" INTEGER NOT NULL,
    "schoolTerm" TEXT NOT NULL,
    "mean" DOUBLE PRECISION NOT NULL,
    "approved" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gradebook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gradebook" ADD CONSTRAINT "Gradebook_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gradebook" ADD CONSTRAINT "Gradebook_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
