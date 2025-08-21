"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, ReactNode, FormEvent, useId, use } from "react";
import { FaPaw, FaArrowLeft, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  gender?: string;
  dob: string;
};

export type User = {
  id? : string,
  name? : string,
  phoneNo? : string,
  email? : string
  address? : string
}


export function CustomerProfile({user , pets} : {
  user : any,
  pets : any
}) {

  return (
    <div className="flex justify-center items-start min-h-screen w-full p-6 bg-gray-50 dark:bg-[#121212]">
      <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-md text-gray-800 dark:text-white max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Customer Profile</h2>
        </div>

        { user && (
          <div className="mb-8 border-b border-gray-300 dark:border-gray-700 pb-6">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                <FaUser className="text-4xl text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{user.phoneNo}</p>
                </div>
              </div>

              <div className="text-right">
                <div>Address</div>
                <p className="text-gray-800 dark:text-gray-300">{user.address}</p>
              </div>
            </div>
          </div>
        )}

        {pets.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No pets found for this user.
          </div>
        )}

        { pets.length > 0 && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 mb-6">
            {pets.map((pet : any) => (
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
  dob: string;
};

function PetInfo({ userId , id ,name, species, breed, gender, dob }: PetInfoProps) {
  const DOB = new Date(dob).toLocaleDateString("en-GB")

  return (
    <Link href={`/home/${id}`}>
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
          {gender} {dob ? `• DOB: ${DOB}` : ""}
        </div>
      </div>
    </Link>
    
  );
}

