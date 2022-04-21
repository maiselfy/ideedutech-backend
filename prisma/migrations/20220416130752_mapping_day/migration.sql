/*
  Warnings:

  - Changed the type of `day` on the `ClassSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "_Day" AS ENUM ('Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Domingo');

-- AlterTable
ALTER TABLE "ClassSchedule" DROP COLUMN "day",
ADD COLUMN     "day" "_Day" NOT NULL;

-- DropEnum
DROP TYPE "Day";
