"use client";

import { Medicine, useData } from "@/app/context/adminDataStore";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaPaw } from "react-icons/fa";
import { string } from "zod";

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

  const router = useRouter();

  const params = useParams();
  const petId = params.petProfile as string;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/medicine/${petId}`,{
          method : "GET"
        });
        if (!res.ok) throw new Error("Failed to load pet data");
        const data = await res.json();
        setPet(data.pet);
        setMedicines(data.pet.medicines);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [petId]);

  const Skeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  );

 

  return (
    <div className="max-w-2xl mx-auto pt-6 h-full max-h-fit">
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
        <div>
            <PetCard pet={pet} formatDate={formatDate} calculateAge={calculateAge} />
        </div>
        
      )}

      {!loading && !error && medicines.length > 0 && (
        <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-2 mb-6">
          {medicines.map((med) => (
            <MedicineInfo key={med.id} med={med} formatDate={formatDate} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col items-center text-center p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
          { medicines.length === 0 && <div>
            <span className="text-4xl mb-2">🐾</span>
            <p className="text-gray-600 dark:text-gray-400">
              No medicine records yet
            </p>
          </div>
          }      
          
          <button className="mt-3 text-gray-600 dark:text-gray-400" onClick={() => setOpenModal(true)}>
            ➕ Add Medicine
          </button>
        </div>
      )}

      {openModal && (
        <AddMedicineModal
          onClose={() => setOpenModal(false)}
          onSave={(newMed : any) => {
             setMedicines((prev) => [...prev, newMed]);
             setOpenModal(false)            
            }} 
          petId={petId}
        />
      )}
    </div>
  );
}


function PetCard({ pet, formatDate, calculateAge }: any) {
  const router = useRouter();
  return (
    <div className="mb-8 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-[#1E1E1E] dark:to-[#2A2A2A] shadow-sm flex justify-between">
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
      <div>
        <button onClick={
            () => router.back()
          } className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            <FaArrowLeft /> Back
        </button>
      </div>
      
    </div>
  );
}



function MedicineInfo({ med, formatDate }: any) {
    const type = med?.Medicine?.type || "";
    const typeIcon = type.toLowerCase().includes("injection") ? "💉" : "💊";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all bg-white dark:bg-[#2A2A2A]">
      <div className="flex items-center gap-3 text-blue-600">
        <span className="text-xl">{typeIcon}</span>
        <div>
          <div className="font-medium">{med?.Medicine?.name}</div>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {med?.Medicine?.dose}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0 text-right space-y-1">
        <div>📅 {formatDate(med?.dateGiven)}</div>
        {med.nextDoseDue && med?.isDoseDate && (
          <div>⏭ Next: {formatDate(med?.nextDoseDue)}</div>
        )}
        {med.notes && <div className="italic">“{med?.notes}”</div>}
      </div>
    </div>
  );
}


type MedicineForm = {
  petId: string;
  medicine: {
    medicineName: string;
    medicineId: string;
    type: string;
    dose: string | null; 
  };
  dateGiven: string;
  nextDoseDue: string | null ;  
  notes: string;
};

function AddMedicineModal({ onClose, onSave, petId }: any) {
  const [form, setForm] = useState<MedicineForm>({
    petId: petId,
    medicine : {
      medicineName : "",
      medicineId : "",
      type : "",
      dose : null 
    },
    dateGiven: "",
    nextDoseDue: null,
    notes: "",
  });
  const [ medicineSuggestions, setMedicineSuggestions ] = useState<Medicine[]>([])

  const { medicines: allMedicines } = useData();

  function mediSuggestions(value : string){
    const data = value.trim().length > 0
      ? allMedicines
          .filter((med: Medicine) =>
            med.name.toLowerCase().startsWith(value.toLowerCase())
          )
          .slice(0, 5)
      : [];
    
    setMedicineSuggestions(data);
  } 
    

    

   async function handleSubmit(e: any) {
    e.preventDefault();
    try{

      const data = {
        petId :        form.petId,
        medicineId :   form.medicine.medicineId,
        dateGiven :   form.dateGiven,
        nextDoseDue: form.nextDoseDue,
        notes    :    form.notes,
        isDoseDate : form.medicine.type === "INJECTION" ? true : false
      }

      const res = await fetch("/api/medicine",{
        method : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data) 
      })


      const json = await res.json()

      if (!res.ok) {
        console.error("Error saving medicine:",json.error);
        return;
      }

      onSave(json.res);
    }catch(err){
      console.error(err);
    }
    

  }

  function formatDateForInput(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getFutureDate({ days = 0, months = 0 }: { days?: number; months?: number }) {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    date.setDate(date.getDate() + days);
    return date;
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-600 dark:text-gray-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 w-full max-w-md shadow-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">➕ Add Medicine</h2>

        <div className="relative">
          <label className="block text-sm font-medium">Medicine</label>
          <input
            required
            placeholder="Medicine"
            value={form.medicine.medicineName}
            onChange={(e) => { 
              const value = e.target.value;
              setForm(prev => ({...prev ,medicine : { ...prev.medicine, medicineName : value } }));
              mediSuggestions(value);
            }}
            className="w-full p-2 border rounded-lg dark:bg-[#2A2A2A]"
          />

          {medicineSuggestions.length > 0 && (
            <ul className="absolute w-full mt-1 border rounded-lg max-h-40 overflow-y-auto bg-white dark:bg-[#2A2A2A] z-10">
              {medicineSuggestions.map((med) => (
                <li
                  key={med.id}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      medicine : {
                        medicineId : med.id,
                        medicineName : med.name,
                        type : med.type,
                        dose : med.dose ?? null
                      }
                    }));
                    setMedicineSuggestions([])
                  }}
                >
                  {med.name} <span className="text-sm text-gray-500">({med.type})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        
        {form.medicine.dose && 
          <div>
            <label className="block text-sm font-medium">Dosage</label>
            <input
              required
              placeholder="Dosage"
              value={form.medicine.dose}
              onChange={(e) => setForm(prev => ({...prev ,medicine : { ...prev.medicine, dose : e.target.value} }))}
              className="w-full p-2 border rounded-lg dark:bg-[#2A2A2A]"
            />
          </div>
        }

        <div>
          <label className="block text-sm font-medium">Given Date</label>
          <input
            type="date"
            required
            value={form.dateGiven}
            onChange={(e) => setForm({ ...form, dateGiven: e.target.value })}
            className="w-full p-2 border rounded-lg dark:bg-[#2A2A2A]"
          />
        </div>

        {form.medicine.type === "INJECTION" && 
          <div>
            <label className="block text-sm font-medium">Next Dose Due</label>
            
            <div className="flex gap-2">
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setForm((prev) => ({ ...prev, nextDoseDue: null }));
                  } else {
                    setForm((prev) => ({ ...prev, nextDoseDue: value }));
                  }
                }}
                className="p-2 border rounded-lg dark:bg-[#2A2A2A]"
                defaultValue=""
              >
                <option value="">Select preset</option>
                <option value={formatDateForInput(getFutureDate({ days: 15 }))}>+15 days</option>
                <option value={formatDateForInput(getFutureDate({ months: 1 }))}>+1 month</option>
                <option value={formatDateForInput(getFutureDate({ months: 2 }))}>+2 months</option>
                <option value={formatDateForInput(getFutureDate({ months: 3 }))}>+3 months</option>
              </select>

              <input
                type="date"
                value={form.nextDoseDue ?? ""}
                onChange={(e) => setForm({ ...form, nextDoseDue: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-[#2A2A2A]"
              />
            </div>
          </div>

        }

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full p-2 border rounded-lg dark:bg-[#2A2A2A]"
        />

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