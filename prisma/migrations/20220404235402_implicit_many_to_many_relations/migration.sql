/*
  Warnings:

  - You are about to drop the `ManagersOnSchool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParentsOnStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchedulesOnLesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeachersOnSchool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ManagersOnSchool" DROP CONSTRAINT "ManagersOnSchool_managerId_fkey";

-- DropForeignKey
ALTER TABLE "ManagersOnSchool" DROP CONSTRAINT "ManagersOnSchool_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "ParentsOnStudent" DROP CONSTRAINT "ParentsOnStudent_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ParentsOnStudent" DROP CONSTRAINT "ParentsOnStudent_studentId_fkey";

-- DropForeignKey
ALTER TABLE "SchedulesOnLesson" DROP CONSTRAINT "SchedulesOnLesson_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "SchedulesOnLesson" DROP CONSTRAINT "SchedulesOnLesson_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "TeachersOnSchool" DROP CONSTRAINT "TeachersOnSchool_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "TeachersOnSchool" DROP CONSTRAINT "TeachersOnSchool_teacherId_fkey";

-- DropTable
DROP TABLE "ManagersOnSchool";

-- DropTable
DROP TABLE "ParentsOnStudent";

-- DropTable
DROP TABLE "SchedulesOnLesson";

-- DropTable
DROP TABLE "TeachersOnSchool";

-- CreateTable
CREATE TABLE "_ManagerToSchool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ParentToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SchoolToTeacher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClassScheduleToLesson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ManagerToSchool_AB_unique" ON "_ManagerToSchool"("A", "B");

-- CreateIndex
CREATE INDEX "_ManagerToSchool_B_index" ON "_ManagerToSchool"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ParentToStudent_AB_unique" ON "_ParentToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ParentToStudent_B_index" ON "_ParentToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SchoolToTeacher_AB_unique" ON "_SchoolToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_SchoolToTeacher_B_index" ON "_SchoolToTeacher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassScheduleToLesson_AB_unique" ON "_ClassScheduleToLesson"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassScheduleToLesson_B_index" ON "_ClassScheduleToLesson"("B");

-- AddForeignKey
ALTER TABLE "_ManagerToSchool" ADD FOREIGN KEY ("A") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManagerToSchool" ADD FOREIGN KEY ("B") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentToStudent" ADD FOREIGN KEY ("A") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParentToStudent" ADD FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchoolToTeacher" ADD FOREIGN KEY ("A") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchoolToTeacher" ADD FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassScheduleToLesson" ADD FOREIGN KEY ("A") REFERENCES "ClassSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassScheduleToLesson" ADD FOREIGN KEY ("B") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
