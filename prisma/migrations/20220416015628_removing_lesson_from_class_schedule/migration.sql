/*
  Warnings:

  - You are about to drop the `_ClassScheduleToLesson` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClassScheduleToLesson" DROP CONSTRAINT "_ClassScheduleToLesson_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassScheduleToLesson" DROP CONSTRAINT "_ClassScheduleToLesson_B_fkey";

-- DropTable
DROP TABLE "_ClassScheduleToLesson";
