// "use client";

// import { useParams } from "next/navigation";
// import { useState, useEffect, FormEvent } from "react";
// import { FaArrowLeft, FaPaw, FaPills } from "react-icons/fa";
// import Link from "next/link";
// import { Medicine, useData } from "@/app/context/adminDataStore"; 

// type Pet = {
//   id: string;
//   name: string;
//   species: string;
//   breed?: string;
//   gender?: string;
//   dob?: string;
// };

// type MedicineRecord = {
//   id: string;
//   medicineName: string;
//   dosage: string;
//   dateGiven: string;
//   nextDoseDue?: string;
//   notes?: string;
// };

// export default function PetMedicineProfile() {
//   const params = useParams();
//   const petId = params.petProfile as string;
//   const userId = params.custProfile as string;

//   const [pet, setPet] = useState<Pet | null>(null);
//   const [medicines, setMedicines] = useState<MedicineRecord[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     medicineName: "",
//     dosage: "",
//     dateGiven: new Date().toISOString().split("T")[0], 
//     nextDoseDue: "",
//     notes: "",
//   });
//   const [formError, setFormError] = useState("");
//   const [formLoading, setFormLoading] = useState(false);

//   const { medicines : allMedicines } = useData(); 

//   useEffect(() => {
//     const fetchPetAndMedicines = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await fetch(`/api/medicine?id=${petId}`);
//         if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
//         const data = await res.json();

//         setPet(data.pet);
//         setMedicines(data.medicines || []);
//       } catch (err: any) {
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (petId) fetchPetAndMedicines();
//   }, [petId]);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   }

//   async function handleSubmit(e: FormEvent) {
//     e.preventDefault();
//     setFormError("");
//     setFormLoading(true);

//     if (!formData.medicineName || !formData.dateGiven) {
//       setFormError("Please fill in required fields (medicine name, date given).");
//       setFormLoading(false);
//       return;
//     }

//     // Auto-fill dosage from selected medicine if exists
//     const selectedMedicine = allMedicines.find(
//       med => med.name.toLowerCase() === formData.medicineName.toLowerCase()
//     );
//     const dosageToSend = selectedMedicine?.dose || formData.dosage;

//     try {
//       const res = await fetch("/api/medicine", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           petId,
//           medicineName: formData.medicineName,
//           dosage: dosageToSend,
//           dateGiven: new Date(formData.dateGiven).toISOString(),
//           nextDoseDue:
//             selectedMedicine?.type === "INJECTION" && formData.nextDoseDue
//               ? new Date(formData.nextDoseDue).toISOString()
//               : undefined,
//           notes: formData.notes || undefined,
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         setFormError(result.message || "Failed to add medicine.");
//       } else {
//         setMedicines(prev => [
//           ...prev,
//           {
//             id: result.created?.id || crypto.randomUUID(),
//             medicineName: formData.medicineName,
//             dosage: dosageToSend,
//             dateGiven: formData.dateGiven,
//             nextDoseDue: formData.nextDoseDue,
//             notes: formData.notes,
//           },
//         ]);
//         setShowModal(false);
//         setFormData({
//           medicineName: "",
//           dosage: "",
//           dateGiven: new Date().toISOString().split("T")[0],
//           nextDoseDue: "",
//           notes: "",
//         });
//       }
//     } catch (err: any) {
//       setFormError(err.message || "Internal server error.");
//     } finally {
//       setFormLoading(false);
//     }
//   }

//   const medicineSuggestions = allMedicines.filter((med : Medicine) =>
//     med.name.toLowerCase().includes(formData.medicineName.toLowerCase())
//   ).slice(0,5)


//   return (
//     <div className="flex justify-center items-start h-full w-full p-6 bg-gray-50 dark:bg-[#121212]">
//       <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-md text-gray-800 dark:text-white max-w-4xl w-full">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold flex items-center gap-2">
//             <FaPills className="text-blue-600" /> Pet Profile
//           </h2>
//           <Link href={`/admin/dashboard/customers/${userId}`}>
//             <button className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
//               <FaArrowLeft /> Back
//             </button>
//           </Link>
//         </div>

//           {!loading && !error && pet && (
//             <div className="mb-8 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E1E1E] shadow-sm">
//               <div className="flex items-center gap-4">
//                 <span className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-2xl">
//                   <FaPaw />
//                 </span>
//                 <div className="space-y-1">
//                   <div className="text-lg font-semibold">{pet.name}</div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     <span className="font-medium">{pet.species}</span>
//                     {pet.breed && ` • ${pet.breed}`}
//                   </div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     {pet.gender && <span>{pet.gender} • </span>}
//                     {pet.dob && (
//                       <span>DOB: {new Date(pet.dob).toLocaleDateString()}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//         {loading && (
//           <>
//             <PetCardSkeleton />
//             <div className="space-y-4">
//               {[...Array(3)].map((_, i) => (
//                 <MedicineCardSkeleton key={i} />
//               ))}
//             </div>
//           </>
//         )}

        
//         { !loading && !error && medicines.length === 0 && (
//           <div className="text-center text-gray-500 dark:text-gray-400 mb-6">
//             No medicine records found.
//           </div>
//         )}

//         {/* Medicine List */}
//         {!loading && !error && medicines.length > 0 && (
//           <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 mb-6">
//             {medicines.map(med => <MedicineInfo key={med.id} {...med} />)}
//           </div>
//         )}

//         {/* Add Medicine Button */}
//         <div className="flex justify-center">
//           <button
//             onClick={() => setShowModal(true)}
//             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             Add Medicine
//           </button>
//         </div>

//         {/* Modal */}
//         {showModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md shadow-lg relative">
//               <h3 className="text-lg font-semibold mb-4">Add Medicine Record</h3>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block mb-1 font-medium">Medicine Name <span className="text-red-500">*</span></label>
//                   <input
//                     name="medicineName"
//                     type="text"
//                     value={formData.medicineName}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
//                   />
//                   {medicineSuggestions.length > 0 && (
//                     <ul className="border rounded mt-1 max-h-32 overflow-y-auto bg-white dark:bg-[#2A2A2A]">
//                       {medicineSuggestions.map(med => (
//                         <li
//                           key={med.id}
//                           className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
//                           onClick={() => setFormData(prev => ({
//                             ...prev,
//                             medicineName: med.name,
//                             dosage: med.dose || "",
//                           }))}
//                         >
//                           {med.name} ({med.type})
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>

//                 {/* Dosage removed, auto-filled from medicine */}

//                 <div>
//                   <label className="block mb-1 font-medium">Date Given <span className="text-red-500">*</span></label>
//                   <input
//                     name="dateGiven"
//                     type="date"
//                     value={formData.dateGiven}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
//                   />
//                 </div>

//                 {/* Next Dose only if type is INJECTION */}
//                 {formData.medicineName && allMedicines.find(m => m.name === formData.medicineName)?.type === "INJECTION" && (
//                   <div>
//                     <label className="block mb-1 font-medium">Next Dose Due</label>
//                     <input
//                       name="nextDoseDue"
//                       type="date"
//                       value={formData.nextDoseDue}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                 )}

//                 <div>
//                   <label className="block mb-1 font-medium">Notes</label>
//                   <textarea
//                     name="notes"
//                     rows={3}
//                     value={formData.notes}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white resize-none"
//                   />
//                 </div>

//                 {formError && <div className="text-red-500 text-sm">{formError}</div>}

//                 <div className="flex justify-end gap-3 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
//                     disabled={formLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={formLoading}
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {formLoading ? "Saving..." : "Add Medicine"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function MedicineInfo({ medicineName, dosage, dateGiven, nextDoseDue, notes }: MedicineRecord) {
//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors gap-2">
//       <div className="flex items-center gap-3 text-blue-600">
//         <FaPills className="text-xl" />
//         <div>
//           <div className="font-medium">{medicineName}</div>
//           <div className="text-sm text-gray-500 dark:text-gray-400">{dosage}</div>
//         </div>
//       </div>
//       <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0 text-right">
//         <div>Date Given: {new Date(dateGiven).toLocaleDateString()}</div>
//         {nextDoseDue && <div>Next Dose Due: {new Date(nextDoseDue).toLocaleDateString()}</div>}
//         {notes && <div>Notes: {notes}</div>}
//       </div>
//     </div>
//   );
// }


// function Skeleton({ className }: { className?: string }) {
//   return (
//     <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
//   );
// }


// function PetCardSkeleton() {
//   return (
//     <div className="mb-8 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E1E1E] shadow-sm animate-pulse">
//       <div className="flex items-center gap-4">
//         <Skeleton className="w-12 h-12 rounded-full" />
//         <div className="flex flex-col gap-2 w-full">
//           <Skeleton className="h-5 w-32" />
//           <Skeleton className="h-4 w-24" />
//           <Skeleton className="h-4 w-40" />
//         </div>
//       </div>
//     </div>
//   );
// }


// function MedicineCardSkeleton() {
//   return (
//     <div className="flex justify-between items-center px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
//       <div className="flex items-center gap-3">
//         <Skeleton className="w-6 h-6 rounded-full" />
//         <div className="flex flex-col gap-2">
//           <Skeleton className="h-4 w-24" />
//           <Skeleton className="h-3 w-16" />
//         </div>
//       </div>
//       <div className="flex flex-col gap-2 items-end">
//         <Skeleton className="h-3 w-28" />
//         <Skeleton className="h-3 w-20" />
//       </div>
//     </div>
//   );
// }




"use client";

import { Medicine, useData } from "@/app/context/adminDataStore";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPaw } from "react-icons/fa";

// ✅ Utils
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function calculateAge(dob: string) {
  const birth = new Date(dob);
  const diff = Date.now() - birth.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

export default function PetDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pet, setPet] = useState<any>(null);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const params = useParams();
  const petId = params.petProfile as string;

  // ✅ Fetch Pet + Medicines
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/medicine?id=${petId}`,{
          method : "GET"
        });
        if (!res.ok) throw new Error("Failed to load pet data");
        const data = await res.json();
        setPet(data.pet);
        setMedicines(data.medicines);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [petId]);

  // ✅ Skeleton Loader
  const Skeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {loading && <Skeleton />}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300">
          ❌ {error}
          <button className="ml-4" onClick={() => location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && pet && (
        <PetCard pet={pet} formatDate={formatDate} calculateAge={calculateAge} />
      )}

      {!loading && !error && medicines && (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 mb-6">
          {medicines.map((med) => (
            <MedicineInfo key={med.id} med={med} formatDate={formatDate} />
          ))}
        </div>
      )}

      {!loading && !error && !medicines && (
        <div className="flex flex-col items-center text-center p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
          <span className="text-4xl mb-2">🐾</span>
          <p className="text-gray-600 dark:text-gray-400">
            No medicine records yet
          </p>
          <button className="mt-3 text-gray-600 dark:text-gray-400" onClick={() => setOpenModal(true)}>
            ➕ Add First Medicine
          </button>
        </div>
      )}

      {openModal && (
        <AddMedicineModal
          onClose={() => setOpenModal(false)}
          onSave={(newMed : any) => setMedicines((prev) => [...prev, newMed])}
        />
      )}
    </div>
  );
}


function PetCard({ pet, formatDate, calculateAge }: any) {
  return (
    <div className="mb-8 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-[#1E1E1E] dark:to-[#2A2A2A] shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-2xl">
          <FaPaw />
        </span>
        <div className="space-y-1">
          <div className="text-lg font-semibold">{pet.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{pet.species}</span>
            {pet.breed && ` • ${pet.breed}`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pet.gender && <span>{pet.gender} • </span>}
            {pet.dob && (
              <span>
                DOB: {formatDate(pet.dob)} ({calculateAge(pet.dob)} yrs old)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



function MedicineInfo({ med, formatDate }: any) {
  const typeIcon = med.medicineName.toLowerCase().includes("injection")
    ? "💉"
    : "💊";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all bg-white dark:bg-[#2A2A2A]">
      <div className="flex items-center gap-3 text-blue-600">
        <span className="text-xl">{typeIcon}</span>
        <div>
          <div className="font-medium">{med.medicineName}</div>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {med.dosage}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0 text-right space-y-1">
        <div>📅 {formatDate(med.dateGiven)}</div>
        {med.nextDoseDue && (
          <div>⏭ Next: {formatDate(med.nextDoseDue)}</div>
        )}
        {med.notes && <div className="italic">“{med.notes}”</div>}
      </div>
    </div>
  );
}





// function AddMedicineModal({ onClose, onSave }: any) {
//   const [form, setForm] = useState({
//     petId : "",
//     medicineId : "",
//     dosage: "",
//     dateGiven: "",
//     nextDoseDue: null,
//     notes: "",
//   });

//   const { medicines : allMedicines } = useData(); 

//   function handleSubmit(e: any) {
//     e.preventDefault();
    
//     onSave({ id: Date.now(), ...form });
//     onClose();
//   }


//   const medicineSuggestions = allMedicines.filter((med : Medicine) =>
//     med.name.toLowerCase().includes(formData.medicineName.toLowerCase())
//   ).slice(0,5)

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md shadow-lg space-y-4"
//       >
//         <h2 className="text-lg font-semibold">➕ Add Medicine</h2>

//         <input
//           required
//           placeholder="medicineId"
//           value={form.medicineId}
//           onChange={(e) => setForm({ ...form, medicineId: e.target.value })}
//           className="w-full p-2 border rounded-lg"
//         />

//         {medicineSuggestions.length > 0 && (
//           <ul className="border rounded mt-1 max-h-32 overflow-y-auto bg-white dark:bg-[#2A2A2A]">
//             {medicineSuggestions.map(med => (
//               <li
//                 key={med.id}
//                 className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
//                 onClick={() => setFormData(prev => ({
//                   ...prev,
//                   medicineName: med.name,
//                   dosage: med.dose || "",
//                 }))}
//               >
//                 {med.name} ({med.type})
//               </li>
//             ))}
//           </ul>
//         )}

//         <input
//           required
//           placeholder="Dosage"
//           value={form.dosage}
//           onChange={(e) => setForm({ ...form, dosage: e.target.value })}
//           className="w-full p-2 border rounded-lg"
//         />

//         <input
//           type="date"
//           required
//           value={form.dateGiven}
//           onChange={(e) => setForm({ ...form, dateGiven: e.target.value })}
//           className="w-full p-2 border rounded-lg"
//         />

//         <input
//           type="date"
//           value={form.nextDoseDue}
//           onChange={(e) => setForm({ ...form, nextDoseDue: e.target.value })}
//           className="w-full p-2 border rounded-lg"
//         />

//         <textarea
//           placeholder="Notes"
//           value={form.notes}
//           onChange={(e) => setForm({ ...form, notes: e.target.value })}
//           className="w-full p-2 border rounded-lg"
//         />

//         <div className="flex justify-end gap-2">
//           <button   onClick={onClose}>
//             Cancel
//           </button>
//           <button type="submit">Save</button>
//         </div>
//       </form>
//     </div>
//   );
// }



function AddMedicineModal({ onClose, onSave }: any) {
  const [form, setForm] = useState({
    petId: "",
    medicine : {
      medicineName : "",
      medicineId : ""
    },
    dosage: "",
    dateGiven: "",
    nextDoseDue: null,
    notes: "",
  });

  const { medicines: allMedicines } = useData();

  const medicineSuggestions = 
    form.medicine.medicineName.trim().length > 0
      ? allMedicines
          .filter((med: Medicine) =>
            med.name.toLowerCase().startsWith(form.medicine.medicineName.toLowerCase())
          )
          .slice(0, 5)
      : [];

      console.log(allMedicines);
    

  function handleSubmit(e: any) {
    e.preventDefault();
    onSave({ id: Date.now(), ...form });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-600 dark:text-gray-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 w-full max-w-md shadow-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">➕ Add Medicine</h2>

        <div className="relative">
          <input
            required
            placeholder="Medicine"
            value={form.medicine.medicineName}
            onChange={(e) => setForm(prev => ({...prev ,medicine : { ...prev.medicine, medicineName : e.target.value} }))}
            className="w-full p-2 border rounded-lg dark:bg-[#2A2A2A]"
          />

          {medicineSuggestions.length > 0 && (
            <ul className="absolute w-full mt-1 border rounded-lg max-h-40 overflow-y-auto bg-white dark:bg-[#2A2A2A] z-10">
              {medicineSuggestions.map((med) => (
                <li
                  key={med.id}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      medicine : {
                        medicineId : med.id,
                        medicineName : med.name
                      }
                    }))
                  }
                >
                  {med.name} <span className="text-sm text-gray-500">({med.type})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dosage */}
        <input
          required
          placeholder="Dosage"
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
          className="w-full p-2 border rounded-lg dark:bg-[#2A2A2A]"
        />

        {/* Dates */}
        <input
          type="date"
          required
          value={form.dateGiven}
          onChange={(e) => setForm({ ...form, dateGiven: e.target.value })}
          className="w-full p-2 border rounded-lg dark:bg-[#2A2A2A]"
        />

        <input
          type="date"
          value={form.nextDoseDue}
          onChange={(e) => setForm({ ...form, nextDoseDue: e.target.value })}
          className="w-full p-2 border rounded-lg dark:bg-[#2A2A2A]"
        />

        {/* Notes */}
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full p-2 border rounded-lg dark:bg-[#2A2A2A]"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}