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
            <main className="bg-gray-50 dark:bg-[#141414] pl-0 m-4  md:pl-52  w-full  h-[calc(100vh-64px)] min-w-[450px]">
              {children}
            </main>
          </div>
      </DataProvider>        
      </body>
    </html>
  );
}
