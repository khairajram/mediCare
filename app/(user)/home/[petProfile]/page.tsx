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
        const res = await fetch(`/api/medicine?id=${petId}`,{
          method : "GET"
        });
        if (!res.ok) throw new Error("Failed to load pet data");
        const data = await res.json();

        const petData = data.medicines.length > 0 ? data.medicines[0].pet : null;
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

      {!loading && !error &&  medicines.length === 0 && (
        <div className="flex flex-col items-center text-center p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <div>
            <span className="text-4xl mb-2">🐾</span>
            <p className="text-gray-600 dark:text-gray-400">
              No medicine records yet
            </p>
          </div>
        </div>)
      }
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
  const typeIcon = med.Medicine.type.toLowerCase().includes("injection")
    ? "💉"
    : "💊";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all bg-white dark:bg-[#2A2A2A]">
      <div className="flex items-center gap-3 text-blue-600">
        <span className="text-xl">{typeIcon}</span>
        <div>
          <div className="font-medium">{med.Medicine.name}</div>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {med.Medicine.dose}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0 text-right space-y-1">
        <div>📅 {formatDate(med.dateGiven)}</div>
        {med.nextDoseDue && med.isDoseDate && (
          <div>⏭ Next: {formatDate(med.nextDoseDue)}</div>
        )}
        {med.notes && <div className="italic">“{med.notes}”</div>}
      </div>
    </div>
  );
}