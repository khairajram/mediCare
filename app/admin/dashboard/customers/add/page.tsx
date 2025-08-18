"use client";

export const dynamic = "force-dynamic";

import { useData } from "@/app/context/adminDataStore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddCustomerPage() {
  const searchParams = useSearchParams();
  const phoneFromQuery = searchParams.get("phone") || "";

  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { refreshUsers } = useData();

  useEffect(() => {
    if (phoneFromQuery) {
      setPhoneNo(phoneFromQuery);
    }
  }, [phoneFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phoneNo || !address) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNo, address }),
      });

      if (res.status === 409) {
        setMessage("⚠️ User already exists.");
      } else {
        const data = await res.json();
        if (res.ok) {
          setMessage("✅ Customer added successfully!");
          setName("");
          setPhoneNo("");
          setAddress("");
          refreshUsers();
        } else {
          setMessage(`❌ ${data.message || "Something went wrong"}`);
        }
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
          <h1 className="text-xl font-bold">Add Customer</h1>
          <Link href={"/admin/dashboard/customers"}>
            <span className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm transition-colors">
              ← Back
            </span>
          </Link>
        </div>

        {message && (
          <p
            className={`mb-3 text-sm text-center ${
              message.startsWith("✅")
                ? "text-green-600 dark:text-green-400"
                : message.startsWith("⚠️")
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input
              id="name"
              type="text"
              aria-label="Customer Name"
              autoFocus
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNo" className="block text-sm font-medium">Phone No</label>
            <input
              id="phoneNo"
              type="tel"
              aria-label="Phone Number"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium">Address</label>
            <input
              id="address"
              type="text"
              aria-label="Customer Address"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
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
