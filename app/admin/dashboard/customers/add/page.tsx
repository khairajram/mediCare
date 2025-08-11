"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddCustomerPage() {
  const searchParams = useSearchParams();
  const phoneFromQuery = searchParams.get("phone") || "";

  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

   useEffect(() => {
    if (phoneFromQuery) {
      setPhoneNo(phoneFromQuery);
    }
  }, [phoneFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNo }),
      });

      if (res.status === 409) {
        setMessage("⚠️ User already exists.");
      } else if (res.ok) {
        setMessage("✅ Customer added successfully!");
        setName("");
        setPhoneNo("");
      } else {
        setMessage("❌ Something went wrong.");
      }
    } catch (error) {
      setMessage("❌ Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-[#121212] dark:text-white text-gray-800">
      <div className="p-6 max-w-md w-full bg-white dark:bg-[#1E1E1E] rounded-lg shadow-md">

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold ">Add Customer</h1>
          <Link href={'/admin/dashboard/customers'}>
            <span
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm transition-colors">
            ← Back
            </span>
          </Link>
        </div>


        {message && <p className="mb-3 text-sm text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone No</label>
            <input
              type="tel"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
          >
            {loading ? "Adding..." : "Add Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}
