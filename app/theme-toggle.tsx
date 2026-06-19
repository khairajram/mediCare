"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle(){
  const {theme,setTheme} = useTheme();


  return (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <button 
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="w-full h-full relative flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <FaSun className="absolute w-5 h-5 transition-transform duration-300 rotate-0 scale-100 dark:rotate-90 dark:scale-0 text-amber-500" />
        <FaMoon className="absolute w-5 h-5 transition-transform duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-blue-400" />
      </button>
    </div>
  );
}