// import { ThemeToggle } from "@/app/theme-toggle";
// import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";


// export default function Header() {
//   return (
//     <div className="w-screen fixed h-16 items-center top-0 left-0 z-50 bg-[#FFFFFF] border-b-4 border-[#E0E0E0] dark:bg-[#121212] dark:border-gray-700">
//       <div className="flex justify-between items-center px-4 py-2 dark:text-white ">
//         <h1 className="text-xl md:text-3xl font-bold text-[#67a0eb] cursor-pointer">
//           MediCare
//         </h1>

//         <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-500 dark:bg-[#1e1e1e]">
//           <FaSearch className="text-gray-500 dark:text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search..."
//             aria-label="Search"
//             className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 text-black dark:text-white"
//         />
//         </div>



//         <div className="hidden md:flex items-center gap-4">
//         <div className="flex items-center justify-center h-8 w-8">
//           <ThemeToggle />
//         </div>
//         <FaBell className="cursor-pointer hover:text-blue-600 transition h-6 w-6" />
//         <FaUserCircle className="cursor-pointer hover:text-blue-600 transition h-6 w-6" />
//       </div>

//       </div>
//     </div>

//   );
// }



import { ThemeToggle } from "@/app/theme-toggle";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

export default function Header() {
  return (
    <div className="w-screen fixed h-16 flex items-center top-0 left-0 z-50 bg-white border-b-4 border-[#E0E0E0] dark:bg-[#121212] dark:border-gray-700">
      <div className="flex justify-between items-center w-full px-4 dark:text-white">

        {/* Logo */}
        <h1 className="text-xl md:text-3xl font-bold text-[#67a0eb] cursor-pointer">
          MediCare
        </h1>

        {/* Search bar */}
        <div className="hidden md:flex flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 h-10 w-64 focus-within:ring-2 focus-within:ring-blue-500 dark:bg-[#1e1e1e]">
          <FaSearch className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 text-black dark:text-white disabled:opacity-50"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-xl text-black dark:text-white">
          <div className="pb-9 hover:text-blue-600 transition">
            <ThemeToggle />
          </div>
          <FaBell className="cursor-pointer hover:text-blue-600 transition h-6 w-6" />
          <FaUserCircle className="cursor-pointer hover:text-blue-600 transition h-6 w-6" />
        </div>

      </div>
    </div>
  );
}
