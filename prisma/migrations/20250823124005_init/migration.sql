/*
  Warnings:

  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_medicineId_fkey";

-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "minimumStockLevel" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityInStock" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Inventory";
