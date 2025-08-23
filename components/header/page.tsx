"use client"
import Link from "next/link";
import { FaBell, FaSearch } from "react-icons/fa";

import { ThemeToggle } from "@/app/theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import UserMenu from "./userMenu";
import { useEffect, useState } from "react";

export default function Header() {
  const [data,setData] = useState<any[]>([])
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        setData(json.user ?? []);
      } catch (err) {
        console.error(err);
        setData([]); 
      }
    };

    fetchData();
  }, []);

   


  return (
    <div className="min-w-full w-screen fixed h-16 flex items-center top-0 left-0 z-50 bg-white border-b-4 border-[#E0E0E0] dark:bg-[#121212] dark:border-gray-700">
      <div className="flex justify-between items-center w-full px-4 dark:text-white">
        
        
        <Link href={"/"}>
          <h1 className="text-xl md:text-3xl font-bold text-[#67a0eb] cursor-pointer">
            Karni Medical
          </h1>
        </Link>

        
        <div className="flex items-center gap-4 text-xl text-black dark:text-white mr-4">
          <div className="pb-16 pt-1 hover:text-blue-600 transition h-16 duration-200">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          {data.length !== 0 && (
          <Popover>
            <PopoverTrigger>
              <div className="relative cursor-pointer">
                <FaBell className="h-6 w-6  hover:text-blue-600 transition-colors duration-200" />
                {/* Optional: small red dot for unread notifications */}
                {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-pulse" /> */}
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-4 bg-white dark:bg-[#141313] shadow-lg rounded-lg border border-gray-200 mr-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notifications</h4>
              <div className="text-gray-500 text-sm">
                No notifications
              </div>
            </PopoverContent>
          </Popover>
          )}

          {/* User */}
          {data.length !== 0 && <UserMenu user={data} />}
        </div>
      </div>
    </div>
  );
}

