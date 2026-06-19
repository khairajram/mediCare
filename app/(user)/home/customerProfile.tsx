"use client";

import { FaPaw, FaUser, FaShoppingBag, FaCalendarAlt, FaEnvelopeOpenText, FaCommentAlt } from "react-icons/fa";
import Link from "next/link";

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  gender?: string | null;
  dob?: Date | string | null;
};

export type User = {
  id?: string;
  name?: string;
  phoneNo?: string;
  email?: string;
  address?: string;
};

export function CustomerProfile({ user, pets }: { user: User; pets: Pet[] }) {
  return (
    <div className="flex flex-col justify-start items-center min-h-screen w-full p-4 sm:p-6 bg-transparent transition-colors">
      <div className="max-w-5xl w-full space-y-8">
        
        {/* Banner with Greeting */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-120px] left-[-40px] w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl" />
          <div className="relative z-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              🐾 Welcome Back
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none">
              Hello, {user.name}!
            </h2>
            <p className="text-blue-100 text-sm sm:text-base max-w-md leading-relaxed">
              Manage your pet profiles, schedule appointments, order medical refills, and check treatment records.
            </p>
          </div>
        </div>

        {/* Quick Access Menu Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/home/orders">
            <div className="p-5 rounded-2xl glass-card neon-border-blue text-center flex flex-col items-center justify-center gap-3 cursor-pointer group">
              <div className="p-3.5 bg-blue-100/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full text-xl group-hover:scale-110 transition-transform duration-300">
                <FaShoppingBag />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wide">Order Medicines</span>
            </div>
          </Link>

          <Link href="/home/appointments">
            <div className="p-5 rounded-2xl glass-card neon-border-purple text-center flex flex-col items-center justify-center gap-3 cursor-pointer group">
              <div className="p-3.5 bg-purple-100/50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-full text-xl group-hover:scale-110 transition-transform duration-300">
                <FaCalendarAlt />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wide">Book Appointment</span>
            </div>
          </Link>

          <Link href="/home/support">
            <div className="p-5 rounded-2xl glass-card neon-border-emerald text-center flex flex-col items-center justify-center gap-3 cursor-pointer group">
              <div className="p-3.5 bg-green-100/50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-full text-xl group-hover:scale-110 transition-transform duration-300">
                <FaEnvelopeOpenText />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wide">Get Support</span>
            </div>
          </Link>

          <Link href="/home/feedback">
            <div className="p-5 rounded-2xl glass-card neon-border-blue text-center flex flex-col items-center justify-center gap-3 cursor-pointer group">
              <div className="p-3.5 bg-indigo-100/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xl group-hover:scale-110 transition-transform duration-300">
                <FaCommentAlt />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wide">Leave Feedback</span>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* User Profile Card */}
          <div className="md:col-span-1">
            <div className="glass-panel p-6 rounded-3xl border dark:border-slate-800/40 shadow-xl space-y-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Profile</h3>
              <div className="flex items-center gap-3 border-b dark:border-slate-800/40 pb-4">
                <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800/50 text-blue-500 text-xl">
                  <FaUser />
                </div>
                <div>
                  <h4 className="font-extrabold text-base tracking-tight">{user.name}</h4>
                  <p className="text-xs text-gray-500 font-semibold">{user.phoneNo}</p>
                </div>
              </div>

              {user.email && (
                <div className="text-xs">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider block">Email Address</span>
                  <span className="text-gray-700 dark:text-gray-300 font-bold block mt-1">{user.email}</span>
                </div>
              )}

              {user.address && (
                <div className="text-xs pt-1">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider block">Registered Address</span>
                  <span className="text-gray-700 dark:text-gray-300 font-bold block mt-1 leading-relaxed">{user.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pets List Panel */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-extrabold flex items-center gap-2 tracking-tight">
              <span>🐾</span> Registered Pet Profiles
            </h3>

            {pets.length === 0 ? (
              <div className="text-center py-12 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 text-gray-400 text-sm">
                No pets registered to your profile. Please contact the Medical Admin to add your pets.
              </div>
            ) : (
              <div className="space-y-3">
                {pets.map((pet) => (
                  <PetInfo
                    id={pet.id}
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

      </div>
    </div>
  );
}

type PetInfoProps = {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  gender?: string | null;
  dob?: Date | string | null;
};

function PetInfo({ id, name, species, breed, gender, dob }: PetInfoProps) {
  const DOB = dob ? new Date(dob).toLocaleDateString("en-GB") : "";

  return (
    <Link href={`/home/${id}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm glass-card cursor-pointer">
        <div className="flex items-center gap-4">
          <span className="text-xl bg-blue-50 dark:bg-blue-950/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
            <FaPaw />
          </span>
          <div>
            <div className="font-bold text-base text-gray-900 dark:text-white">{name}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {species} {breed ? `• ${breed}` : ""}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 sm:mt-0 font-medium">
          {gender} {dob ? `• DOB: ${DOB}` : ""}
        </div>
      </div>
    </Link>
  );
}
