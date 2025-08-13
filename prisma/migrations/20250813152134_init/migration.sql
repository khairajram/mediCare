/*
  Warnings:

  - Added the required column `medicineId` to the `MedicineRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MedicineForm" AS ENUM ('TABLET', 'SYRUP', 'INJECTION', 'TOPICAL', 'POWDER');

-- AlterTable
ALTER TABLE "MedicineRecord" ADD COLUMN     "medicineId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "form" "MedicineForm" NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicineRecord" ADD CONSTRAINT "MedicineRecord_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
