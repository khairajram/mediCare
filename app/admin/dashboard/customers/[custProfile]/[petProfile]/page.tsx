"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { FaArrowLeft, FaPills } from "react-icons/fa";
import Link from "next/link";
import { Medicine, useData } from "@/app/context/adminDataStore"; 

type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  gender?: string;
  dob?: string;
};

type MedicineRecord = {
  id: string;
  medicineName: string;
  dosage: string;
  dateGiven: string;
  nextDoseDue?: string;
  notes?: string;
};

export default function PetMedicineProfile() {
  const params = useParams();
  const petId = params.petProfile as string;
  const userId = params.custProfile as string;

  const [pet, setPet] = useState<Pet | null>(null);
  const [medicines, setMedicines] = useState<MedicineRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    medicineName: "",
    dosage: "",
    dateGiven: new Date().toISOString().split("T")[0], 
    nextDoseDue: "",
    notes: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const { medicines : allMedicines } = useData(); 

  useEffect(() => {
    const fetchPetAndMedicines = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/medicine?id=${petId}`);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();

        setPet(data.pet);
        setMedicines(data.medicines || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (petId) fetchPetAndMedicines();
  }, [petId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    if (!formData.medicineName || !formData.dateGiven) {
      setFormError("Please fill in required fields (medicine name, date given).");
      setFormLoading(false);
      return;
    }

    // Auto-fill dosage from selected medicine if exists
    const selectedMedicine = allMedicines.find(
      med => med.name.toLowerCase() === formData.medicineName.toLowerCase()
    );
    const dosageToSend = selectedMedicine?.dose || formData.dosage;

    try {
      const res = await fetch("/api/medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId,
          medicineName: formData.medicineName,
          dosage: dosageToSend,
          dateGiven: new Date(formData.dateGiven).toISOString(),
          nextDoseDue:
            selectedMedicine?.type === "INJECTION" && formData.nextDoseDue
              ? new Date(formData.nextDoseDue).toISOString()
              : undefined,
          notes: formData.notes || undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setFormError(result.message || "Failed to add medicine.");
      } else {
        setMedicines(prev => [
          ...prev,
          {
            id: result.created?.id || crypto.randomUUID(),
            medicineName: formData.medicineName,
            dosage: dosageToSend,
            dateGiven: formData.dateGiven,
            nextDoseDue: formData.nextDoseDue,
            notes: formData.notes,
          },
        ]);
        setShowModal(false);
        setFormData({
          medicineName: "",
          dosage: "",
          dateGiven: new Date().toISOString().split("T")[0],
          nextDoseDue: "",
          notes: "",
        });
      }
    } catch (err: any) {
      setFormError(err.message || "Internal server error.");
    } finally {
      setFormLoading(false);
    }
  }

  const medicineSuggestions = allMedicines.filter((med : Medicine) =>
    med.name.toLowerCase().includes(formData.medicineName.toLowerCase())
  ).slice(0,5)


  return (
    <div className="flex justify-center items-start h-full w-full p-6 bg-gray-50 dark:bg-[#121212]">
      <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-md text-gray-800 dark:text-white max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaPills className="text-blue-600" /> Pet Profile
          </h2>
          <Link href={`/admin/dashboard/customers/${userId}`}>
            <button className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <FaArrowLeft /> Back
            </button>
          </Link>
        </div>

        {/* Pet Info */}
        {!loading && !error && pet && (
          <div className="mb-8 border-b border-gray-300 dark:border-gray-700 pb-6">
            <div className="flex flex-wrap gap-4 text-gray-700 dark:text-gray-300">
              <div><strong>Name:</strong> {pet.name}</div>
              <div><strong>Species:</strong> {pet.species}</div>
              {pet.breed && <div><strong>Breed:</strong> {pet.breed}</div>}
              {pet.gender && <div><strong>Gender:</strong> {pet.gender}</div>}
              {pet.dob && <div><strong>DOB:</strong> {new Date(pet.dob).toLocaleDateString()}</div>}
            </div>
          </div>
        )}

        { !loading && !error && medicines.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mb-6">
            No medicine records found.
          </div>
        )}

        {/* Medicine List */}
        {!loading && !error && medicines.length > 0 && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 mb-6">
            {medicines.map(med => <MedicineInfo key={med.id} {...med} />)}
          </div>
        )}

        {/* Add Medicine Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Medicine
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md shadow-lg relative">
              <h3 className="text-lg font-semibold mb-4">Add Medicine Record</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Medicine Name <span className="text-red-500">*</span></label>
                  <input
                    name="medicineName"
                    type="text"
                    value={formData.medicineName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
                  />
                  {medicineSuggestions.length > 0 && (
                    <ul className="border rounded mt-1 max-h-32 overflow-y-auto bg-white dark:bg-[#2A2A2A]">
                      {medicineSuggestions.map(med => (
                        <li
                          key={med.id}
                          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            medicineName: med.name,
                            dosage: med.dose || "",
                          }))}
                        >
                          {med.name} ({med.type})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Dosage removed, auto-filled from medicine */}

                <div>
                  <label className="block mb-1 font-medium">Date Given <span className="text-red-500">*</span></label>
                  <input
                    name="dateGiven"
                    type="date"
                    value={formData.dateGiven}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Next Dose only if type is INJECTION */}
                {formData.medicineName && allMedicines.find(m => m.name === formData.medicineName)?.type === "INJECTION" && (
                  <div>
                    <label className="block mb-1 font-medium">Next Dose Due</label>
                    <input
                      name="nextDoseDue"
                      type="date"
                      value={formData.nextDoseDue}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block mb-1 font-medium">Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white resize-none"
                  />
                </div>

                {formError && <div className="text-red-500 text-sm">{formError}</div>}

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {formLoading ? "Saving..." : "Add Medicine"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MedicineInfo({ medicineName, dosage, dateGiven, nextDoseDue, notes }: MedicineRecord) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors gap-2">
      <div className="flex items-center gap-3 text-blue-600">
        <FaPills className="text-xl" />
        <div>
          <div className="font-medium">{medicineName}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{dosage}</div>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0 text-right">
        <div>Date Given: {new Date(dateGiven).toLocaleDateString()}</div>
        {nextDoseDue && <div>Next Dose Due: {new Date(nextDoseDue).toLocaleDateString()}</div>}
        {notes && <div>Notes: {notes}</div>}
      </div>
    </div>
  );
}

