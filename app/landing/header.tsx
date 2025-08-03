import { ThemeToggle } from "../theme-toggle";

export default function Header(){
  return (
      <header className="bg-white text-gray-800 dark:bg-[#121212] dark:text-white border-b border-gray-200 dark:border-gray-700 h-12 p-2">
        <div className="flex justify-between">
          <div>
            MediCare
          </div>
          <div className="flex items-center gap-6 justify-center">
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <a href="#features" className="hover:text-primary transition">Features</a>
              <a href="#about" className="hover:text-primary transition">About</a>
              <a href="#contact" className="hover:text-primary transition">Contact</a>
            </nav>
            <ThemeToggle />
          </div>

          <div>
            <button className="bg-secondary text-white hover:bg-secondary/90 px-1.5 rounded-md">signUp</button>
          </div>
          
        </div>
      </header>
  )
}