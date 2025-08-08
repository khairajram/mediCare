"use client"

import { useState, ReactNode, useEffect, useMemo } from "react";
import { FaPlus, FaSearch, FaUser } from "react-icons/fa";
import debounce from "lodash.debounce";

const cardClass =
  "bg-white dark:bg-[#1E1E1E] px-10 py-6 rounded-xl shadow-md text-center font-semibold text-gray-800 dark:text-white hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-[#363333] hover:scale-105 hover:shadow-lg transition-transform";

export default function Customer() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="h-full w-full p-4 flex justify-center items-center min-h-[calc(100vh-4rem)]">
      {/* Main Options Grid */}
      {!isSearchOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl w-full">
          <div className={cardClass} onClick={() => setIsSearchOpen(true)}>
            Search Customer
          </div>
          <div className={cardClass}>All Customers</div>
          <div className={cardClass}>Send Reminder</div>
          <div className={cardClass}>Add Customer</div>
          <div className={cardClass}>Customer Support</div>
          <div className={cardClass}>Feedback & Ratings</div>
        </div>
      )}

      {/* Search Section */}
      {isSearchOpen && (
        <div className="w-full max-w-xl">
          <SearchUsers onBack={() => setIsSearchOpen(false)} />
        </div>
      )}
    </div>
  );
}

function SearchUsers({ onBack }: { onBack: () => void }) {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  
  const debouncedSearch = useMemo(() => {
    return debounce(async (q: string) => {
      if (!q.trim()) return;

      try {
        const res = await fetch(`http://localhost:3000/api/user/search?phone=${q}`);
        const data = await res.json();
        setResults(data.user);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 100); 
  }, []);

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  return (
    <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-md text-gray-800 dark:text-white transition-transform">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Search Customer</h2>
        <button
          onClick={onBack}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back
        </button>
      </div>

      <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full focus-within:ring-2 focus-within:ring-blue-200 dark:bg-[#1e1e1e]">
        <FaSearch className="text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search Customer"
          aria-label="Search Customer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 text-black dark:text-white"
        />
      </div>

      <div className="mt-6 max-h-96 overflow-y-auto space-y-4 pr-2">
        {results.length === 0 && <div className="items-center flex flex-col justify-center">
            <div>no user found</div>
            <div className="">
              <button
                onClick={onBack}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Add
              </button>
            </div>
          </div>}
        {results.length !== 0 && results.map((user: any, idx: number) => (
          <UserInfo
            key={idx}
            name={user.name}
            phoneNo={user.phoneNo}
            profilePhoto={<FaUser />}
          />
        ))}
      </div>

    </div>
  );
}

type userSchema = {
  name: string;
  phoneNo: string;
  profilePhoto: ReactNode;
};

function UserInfo({ name, phoneNo, profilePhoto }: userSchema) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 dark:border-gray-600">
      <div className="flex items-center gap-2">
        <span className="text-lg">{profilePhoto}</span>
        <span>{name}</span>
      </div>
      <div>{phoneNo}</div>
    </div>
  );
}
