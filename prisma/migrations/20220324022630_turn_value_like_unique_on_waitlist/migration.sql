/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `WaitList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WaitList_value_key" ON "WaitList"("value");
