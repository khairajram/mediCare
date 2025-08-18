/*
  Warnings:

  - You are about to drop the column `medicineName` on the `MedicineRecord` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MedicineRecord" DROP CONSTRAINT "MedicineRecord_petId_fkey";

-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_userId_fkey";

-- AlterTable
ALTER TABLE "MedicineRecord" DROP COLUMN "medicineName",
ADD COLUMN     "isNextdose" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineRecord" ADD CONSTRAINT "MedicineRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
