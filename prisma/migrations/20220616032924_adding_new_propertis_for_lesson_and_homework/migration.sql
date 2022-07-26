-- AlterTable
ALTER TABLE "HomeWork" ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "classDate" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT;
