"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, ReactNode, FormEvent, useId } from "react";
import { FaPaw, FaArrowLeft, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  gender?: string;
  dob?: string;
};

type User = {
  id: string;
  name: string;
  phoneNo: string;
};

export default function CustomerProfile() {
  const params = useParams();
  const id = params.custProfile as string;

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    dob: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchUserAndPets = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/pet?userId=${id}`);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();

        setUser(data.user);
        setPets(data.pets || []);
        console.log(data.pet);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUserAndPets();
  }, [id]);

  // Handle form input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // Handle form submit to add pet
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    // Basic validation
    if (!formData.name || !formData.species || !formData.gender) {
      setFormError("Please fill in all required fields (name, species, gender).");
      setFormLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          name: formData.name,
          species: formData.species,
          breed: formData.breed || undefined,
          gender: formData.gender,
          dob: formData.dob ? new Date(formData.dob).toISOString() : undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setFormError(result.message || "Failed to add pet.");
      } else {
        // Refresh pets list
        setPets(prev => [...prev, {
          id: result.created?.id || crypto.randomUUID(),
          name: formData.name,
          species: formData.species,
          breed: formData.breed,
          gender: formData.gender,
          dob: formData.dob,
        }]);
        // Reset form and close modal
        setFormData({ name: "", species: "", breed: "", gender: "", dob: "" });
        setShowModal(false);
      }
    } catch (err: any) {
      setFormError(err.message || "Internal server error.");
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen w-full p-6 bg-gray-50 dark:bg-[#121212]">
      <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-md text-gray-800 dark:text-white max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Customer Profile</h2>
            <button onClick={
              () => router.back()
            } className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <FaArrowLeft /> Back
            </button>
        </div>

        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400 mb-6">
            Loading user and pets...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 mb-6">{error}</div>
        )}

        {!loading && !error && user && (
          <div className="mb-8 border-b border-gray-300 dark:border-gray-700 pb-6">
            <div className="flex items-center gap-4">
              <FaUser className="text-4xl text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{user.phoneNo}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && pets.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No pets found for this user.
          </div>
        )}

        {!loading && !error && pets.length > 0 && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 mb-6">
            {pets.map((pet) => (
              <PetInfo
                id ={pet.id}
                userId = {user?.id}
                key={pet.id}
                name={pet.name}
                species={pet.species}
                breed={pet.breed || ""}
                gender={pet.gender || ""}
                dob={pet.dob}
              />
            ))}
          </div>
        )}

        {/* Add Pet Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Pet
          </button>
        </div>

        {/* Modal Popup */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md shadow-lg relative">
              <h3 className="text-lg font-semibold mb-4">Add New Pet</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium" htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="species">
                    Species <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="species"
                    name="species"
                    type="text"
                    value={formData.species}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="breed">
                    Breed
                  </label>
                  <input
                    id="breed"
                    name="breed"
                    type="text"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="dob">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded dark:bg-[#2A2A2A] dark:border-gray-600 dark:text-white"
                  />
                </div>

                {formError && (
                  <div className="text-red-500 text-sm">{formError}</div>
                )}

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormError("");
                      setFormData({ name: "", species: "", breed: "", gender: "", dob: "" });
                    }}
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
                    {formLoading ? "Saving..." : "Add Pet"}
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

type PetInfoProps = {
  id : string;
  userId : string | undefined;
  name: string;
  species: string;
  breed?: string;
  gender?: string;
  dob?: string;
};

function PetInfo({ userId , id ,name, species, breed, gender, dob }: PetInfoProps) {
  return (
    <Link href={`/admin/dashboard/customers/${userId}/${id}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors mb-2">
        <div className="flex items-center gap-3">
          <span className="text-lg bg-gray-100 dark:bg-[#2A2A2A] p-2 rounded-full text-blue-600">
            <FaPaw />
          </span>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">
              {species} {breed ? `• ${breed}` : ""}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
          {gender} {dob ? `• DOB: ${dob}` : ""}
        </div>
      </div>
    </Link>
    
  );
}

