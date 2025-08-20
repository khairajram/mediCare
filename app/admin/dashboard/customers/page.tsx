"use client"

import { FaPlus, FaSearch, FaUser } from "react-icons/fa";
import debounce from "lodash.debounce";
import Search from "./search/page";
import Link from "next/link";

const cardClass =
  "bg-white dark:bg-[#1E1E1E] px-10 py-6 rounded-xl shadow-md text-center font-semibold text-gray-800 dark:text-white hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-[#363333] hover:scale-105 hover:shadow-lg transition-transform";

export default function Customer() {

  return (
    <div className="p-4 flex justify-center items-center min-h-[calc(100vh-4rem)] m-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl w-full">
          <Link href={'/admin/dashboard/customers/search'}>
            <div className={cardClass}>
              Search Customer
            </div>
          </Link>
          <Link href={'/admin/dashboard/customers/all'}>
            <div className={cardClass}>
              All Customers
            </div>
          </Link>
          <Link href={'/admin/dashboard/customers/sendRem'}>
            <div className={cardClass}>
              Send Reminder
            </div>
          </Link>
          <Link href={'/admin/dashboard/customers/add'}>
            <div className={cardClass}>
              Add Customers
            </div>
          </Link>
          <Link href={'/admin/dashboard/customers/support'}>
            <div className={cardClass}>
              Customer Support
            </div>
          </Link>
          <Link href={'/admin/dashboard/customers/feedback'}>
            <div className={cardClass}>
              Feedback & Ratings
            </div>
          </Link>
        </div>
    </div>
  );
}
