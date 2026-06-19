"use client"

import { SideBarAdmin } from "@/components/sideBarAdmin/page";
import { DataProvider } from "@/app/context/adminDataStore";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataProvider>
      <div className="pt-16 flex h-[calc(100vh-64px)]">
        <SideBarAdmin />
        <div className="pl-0 m-4 md:pl-72 w-full h-[calc(100vh-64px)] min-w-[450px] overflow-y-auto">
          {children}
        </div>
      </div>
    </DataProvider>
  );
}
