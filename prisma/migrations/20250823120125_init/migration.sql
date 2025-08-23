-- AlterTable
ALTER TABLE "MedicineRecord" ADD COLUMN     "isCompleted" BOOLEAN,
ADD COLUMN     "reminder" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "quantityInStock" INTEGER NOT NULL,
    "minimumStockLevel" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_medicineId_key" ON "Inventory"("medicineId");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
