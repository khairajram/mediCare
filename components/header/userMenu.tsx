"use client";

import { FaUserCircle } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";

export default function UserMenu({ user }: { user: any }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" }); 
    window.location.reload();
    router.push("/");
  }

  return (
     <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <FaUserCircle className="h-7 w-8  hover:text-blue-600 transition-colors duration-200" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4 bg-white dark:bg-[#141313] rounded-lg shadow-lg border border-gray-200 mr-4">
        <div className="flex flex-col space-y-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-200">{user.phoneNo}</p>
            <p className="text-sm text-gray-500 dark:text-gray-200">{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
