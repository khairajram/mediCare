"use client";

import { useState, useEffect, useMemo, ReactNode } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useData } from "@/app/context/adminDataStore";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { users } = useData();

  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        if (!q.trim()) {
          setResults([]);
          return;
        }

        setLoading(true);

        const filtered = users.filter(
          (u) =>
            u.phoneNo.toLowerCase().includes(q.toLowerCase()) ||
            u.name.toLowerCase().includes(q.toLowerCase())
        );

        setResults(filtered);
        setLoading(false);
      }, 300),
    [users]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-md text-gray-800 dark:text-white w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Search Customer</h2>
          <Link href="/admin/dashboard/customers">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              ← Back
            </button>
          </Link>
        </div>

        <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full focus-within:ring-2 focus-within:ring-blue-200 dark:bg-[#1e1e1e]">
          <FaSearch className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search Customer"
            aria-label="Search Customer"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 text-black dark:text-white"
          />
        </div>

        <div className="mt-6 max-h-96 overflow-y-auto space-y-4 pr-2">
          {loading && (
            <div className="text-gray-500 text-sm items-center justify-center">
              Searching...
            </div>
          )}

          {!loading && results.length === 0 && query.trim() && (
            <div className="flex flex-col items-center">
              <div>No user found</div>
              <Link href={`/admin/dashboard/customers/add?phone=${query}`}>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  + Add
                </button>
              </Link>
            </div>
          )}

          {!loading &&
            results.map((user) => (
              <UserInfo
                id={user.id}
                key={user.id}
                name={user.name}
                phoneNo={user.phoneNo}
                profilePhoto={<FaUser />}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

type UserSchema = {
  id: string | undefined;
  name: string;
  phoneNo: string;
  profilePhoto: ReactNode;
};

function UserInfo({ id, name, phoneNo, profilePhoto }: UserSchema) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm hover:shadow-md duration-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors ">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-lg">
          {profilePhoto}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">
            {name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {phoneNo}
          </span>
        </div>
      </div>

      <Link href={`/admin/dashboard/customers/${id}`}>
        <button className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View
        </button>
      </Link>
    </div>
  );
}
