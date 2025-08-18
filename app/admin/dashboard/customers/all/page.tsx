"use client";

import { ReactNode } from "react";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useData, User } from "@/app/context/adminDataStore";

export default function CustomersList() {
  const { users } = useData();

  return (
    <div className="flex justify-center items-center h-full w-full p-6">
      <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-md text-gray-800 dark:text-white w-[800px]">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">All Customers</h2>
          <Link href="/admin/dashboard/customers">
            <button className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <FaArrowLeft /> Back
            </button>
          </Link>
        </div>

        {users.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No customers found.
          </div>
        ) : (
          <div className="mt-4 max-h-[500px] overflow-y-auto space-y-3 pr-2">
            {users.map((user: User) => (
              <Link key={user.id} href={`${user.id}`} className="m-1">
                <UserInfo
                  name={user.name}
                  phoneNo={user.phoneNo}
                  profilePhoto={<FaUser />}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type UserSchema = {
  name: string;
  phoneNo: string;
  profilePhoto: ReactNode;
};

function UserInfo({ name, phoneNo, profilePhoto }: UserSchema) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-lg bg-gray-100 dark:bg-[#2A2A2A] p-2 rounded-full">
          {profilePhoto}
        </span>
        <span className="font-medium">{name}</span>
      </div>
      <div className="text-gray-600 dark:text-gray-400">{phoneNo}</div>
    </div>
  );
}
