/*
  Warnings:

  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeUser" AS ENUM ('Administrador', 'Gestor', 'Professor', 'Estudante', 'Outros');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "TypeUser" NOT NULL;
