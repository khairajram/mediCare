/*
  Warnings:

  - You are about to drop the column `form` on the `Medicine` table. All the data in the column will be lost.
  - Added the required column `dose` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "MedicineForm" ADD VALUE 'LIQUID';

-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "form",
ADD COLUMN     "dose" TEXT NOT NULL,
ADD COLUMN     "type" "MedicineForm" NOT NULL;
