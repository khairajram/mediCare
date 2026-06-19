"use client"
import Link from "next/link";
import { FaBell, FaSearch } from "react-icons/fa";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/app/theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import UserMenu from "./userMenu";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [data,setData] = useState<any[]>([])
  
  // Hide global header on landing page, login, signup, and admin login
  const isLandingOrAuth = pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/admin/login";

  useEffect(() => {
    if (isLandingOrAuth) return;

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

  if (isLandingOrAuth) return null;


  return (
    <div className="min-w-full w-screen fixed h-16 flex items-center top-0 left-0 z-50 bg-white/75 dark:bg-[#0a0a0a]/75 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors shadow-sm">
      <div className="flex justify-between items-center w-full px-4 dark:text-white">
        
        
        <Link href={"/"}>
          <h1 className="text-xl md:text-3xl font-bold text-[#67a0eb] cursor-pointer">
            Karni Medical
          </h1>
        </Link>

        
        <div className="flex items-center gap-4 text-xl text-black dark:text-white mr-4">
          <div className="hover:text-blue-600 transition duration-200 flex items-center justify-center w-8 h-8">
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

