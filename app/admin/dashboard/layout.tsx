"use client"

import Header from "@/components/header/page";
import { ThemeProvider } from "next-themes";
import { SideBarAdmin } from "@/components/sideBarAdmin/page";
import { DataProvider } from "@/app/context/adminDataStore";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DataProvider>
          <div className="pt-16 flex h-[calc(100vh-64px)]">
            <SideBarAdmin/>
            <div className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-[#141414] flex items-center px-4 z-50 shadow">
              <button
                className="md:hidden text-xl text-gray-700 dark:text-gray-200 mr-4"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <FaBars />
              </button>
              <Header />
            </div>
            <main className="bg-gray-50 dark:bg-[#141414]  md:pl-52 pl-0 w-full  h-[calc(100vh-64px)] min-w-[450px]">
              {children}
            </main>
          </div>
      </DataProvider>        
      </body>
    </html>
  );
}
