"use client";

import Link from "next/link";
import { Package, ClipboardList } from "lucide-react"; // modern icons
import { FaArrowLeft } from "react-icons/fa";

const cardClass =
  "bg-white dark:bg-[#1E1E1E] px-8 py-6 rounded-2xl shadow-md text-center font-semibold text-gray-800 dark:text-white hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2A2A2A] hover:scale-105 hover:shadow-xl transition-all duration-200 flex flex-col items-center gap-3";

export default function Customer() {
  return (
    <div className="p-6 flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] m-auto max-w-5xl">

           
      {/* Page Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-10 text-gray-800 dark:text-white">
        Medicine Master
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <Link href="medicine/instock">
          <div className={cardClass}>
            <Package className="h-8 w-8 text-blue-500" />
            <span className="text-lg">In Stock</span>
          </div>
        </Link>

        <Link href="medicine/list">
          <div className={cardClass}>
            <ClipboardList className="h-8 w-8 text-green-500" />
            <span className="text-lg">List</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
