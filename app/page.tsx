import { getServerSession } from "next-auth";
import { ThemeToggle } from "./theme-toggle";


export default async function Home() {
  const session = await getServerSession();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white transition-all duration-300">
      hii there 
      <ThemeToggle></ThemeToggle>
    </div>
  );
}
