/*
  Warnings:

  - You are about to drop the column `dosage` on the `MedicineRecord` table. All the data in the column will be lost.
  - You are about to drop the column `isNextdose` on the `MedicineRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicineRecord" DROP COLUMN "dosage",
DROP COLUMN "isNextdose";
