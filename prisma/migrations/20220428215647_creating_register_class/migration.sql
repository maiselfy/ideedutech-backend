-- CreateEnum
CREATE TYPE "TypeRegisterClass" AS ENUM ('Plano de Ensino', 'Avulso');

-- CreateTable
CREATE TABLE "RegisterClass" (
    "id" TEXT NOT NULL,
    "classDate" TIMESTAMP(3) NOT NULL,
    "type" "TypeRegisterClass" NOT NULL,
    "content" TEXT,
    "subContent" TEXT,
    "periodId" TEXT,
    "observation" TEXT NOT NULL,
    "disciplineId" TEXT,
    "contentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegisterClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RegisterClass" ADD CONSTRAINT "RegisterClass_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegisterClass" ADD CONSTRAINT "RegisterClass_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegisterClass" ADD CONSTRAINT "RegisterClass_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;
