-- AlterTable
ALTER TABLE "LackOfClass" ADD COLUMN     "lessonDate" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "classDate" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "mood";
