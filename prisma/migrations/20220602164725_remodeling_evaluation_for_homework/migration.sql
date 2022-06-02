/*
  Warnings:

  - You are about to drop the column `rating` on the `EvaluativeDelivery` table. All the data in the column will be lost.
  - Added the required column `owner` to the `EvaluativeDelivery` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OwnerAction" AS ENUM ('Professor', 'Estudante');

-- AlterTable
ALTER TABLE "EvaluativeDelivery" DROP COLUMN "rating",
ADD COLUMN     "owner" "OwnerAction" NOT NULL,
ADD COLUMN     "rate" DOUBLE PRECISION;
