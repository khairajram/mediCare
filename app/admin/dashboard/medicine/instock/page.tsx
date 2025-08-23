"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import Link from "next/link";
import { useData } from "@/app/context/adminDataStore";

type Inventory = {
  id: string;
  name: string;
  type: string;
  dose: string;
  quantityInStock: number;
  minimumStockLevel: number;
};

export default function InStockPage() {
  const { refreshMedicine } = useData();
  const inventory : any = useData().medicines;
  const [quantity, setQuantity] = useState<number>();
  const [minStock, setMinStock] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `/api/MedicineRecord/medicineMaster?id=${editId}`
      : "/api/MedicineRecord/medicineMaster";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantityInStock: quantity,
        minimumStockLevel: minStock,
      }),
    });

    if (res.ok) {
      closeModal();
      await refreshMedicine();
    }

    setLoading(false);
  };

  const openEditModal = (med: Inventory) => {
    setEditId(med.id);
    setQuantity(med.quantityInStock);
    setMinStock(med.minimumStockLevel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto dark:text-white text-gray-800 min-h-screen bg-white dark:bg-[#1E1E1E] min-w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">In Stock Medicines</h1>
        <Link href="/admin/dashboard/medicine">
          <Button variant="outline" className="flex items-center gap-2">
            <FaArrowLeft /> Back
          </Button>
        </Link>
      </div>

      {/* Table inside card */}
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableCaption>
              A list of all medicines currently in stock.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dose</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Min. Stock</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 dark:text-gray-400"
                  >
                    No medicines in stock
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((item : any) => (
                  <TableRow
                    key={item.id}
                    className={
                      item.quantityInStock < item.minimumStockLevel
                        ? "bg-red-50 dark:bg-red-900/10"
                        : ""
                    }
                  >
                    <TableCell className="font-medium">
                      {item.name}{" "}
                      {item.quantityInStock < item.minimumStockLevel && (
                        <Badge variant="destructive" className="ml-2 border-dotted bottom-3 border-sm">
                          Low Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.dose || "-"}</TableCell>
                    <TableCell>{item.quantityInStock}</TableCell>
                    <TableCell>{item.minimumStockLevel}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEditModal(item)}
                        className="flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-[#2D2D2D] p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              {editId ? "Edit Medicine" : "Add Medicine"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Quantity
                </label>
                <input
                  value={quantity}
                  type="number"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  className="w-full border dark:border-gray-600 rounded p-2 bg-transparent"
                  placeholder="Enter current stock amount"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Min. stock
                </label>
                <input
                  value={minStock}
                  type="number"
                  onChange={(e) => setMinStock(Number(e.target.value))}
                  required
                  className="w-full border dark:border-gray-600 rounded p-2 bg-transparent"
                  placeholder="Enter stock amount to trigger alert"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? editId
                      ? "Updating..."
                      : "Adding..."
                    : editId
                    ? "Update"
                    : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
