"use client";
import { useData } from "@/app/context/adminDataStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

type Medicine = {
  id: string;
  name: string;
  dose: string;
  type: string;
};

export default function MedicineMaster() {
  const { refreshMedicine } = useData();
  const [medicines, setMedicines] = useState<any[]>(useData().medicines);
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [type, setType] = useState("TABLET");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const types = ["TABLET", "SYRUP", "INJECTION", "TOPICAL", "POWDER", "LIQUID"];

  // Fetch medicines
  const fetchMedicines = async () => {
    const res = await fetch("/api/MedicineRecord/medicineMaster");
    const data = await res.json();
    setMedicines(data.medicines || []);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);


  // Add or update medicine
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
      body: JSON.stringify({ name, dose, type }),
    });

    if (res.ok) {
      fetchMedicines();
      closeModal();
      refreshMedicine();
    }

    setLoading(false);
  };

  const openEditModal = (med: Medicine) => {
    setEditId(med.id);
    setName(med.name);
    setDose(med.dose);
    setType(med.type);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditId(null);
    setName("");
    setDose("");
    setType("TABLET");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  return (
    <div className="min-h-screen p-6 dark:text-white text-gray-800 bg-white dark:bg-[#1E1E1E]">
      <div className="w-full mb-6 flex justify-end">
        <Link href="/admin/dashboard/medicine">
          <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            <FaArrowLeft className="h-4 w-4" /> Back
          </button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">

      

        <h1 className="text-2xl font-bold">Medicine Master</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Add Medicine
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Dose</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No medicines found.
                </td>
              </tr>
            ) : (
              medicines.map((med) => (
                <tr
                  key={med.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <td className="p-3">{med.name}</td>
                  <td className="p-3">{med.dose}</td>
                  <td className="p-3">{med.type}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openEditModal(med)}
                      className="bg-yellow-400 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      <FaEdit></FaEdit>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-[#2D2D2D] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editId ? "Edit Medicine" : "Add Medicine"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border dark:border-gray-600 rounded p-2 bg-transparent"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Dose</label>
                <input
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  required
                  className="w-full border dark:border-gray-600 rounded p-2 bg-transparent"
                  placeholder="e.g. 5mg, 10ml"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border dark:border-gray-600 rounded p-2 "
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border dark:border-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading
                    ? editId
                      ? "Updating..."
                      : "Adding..."
                    : editId
                    ? "Update"
                    : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
