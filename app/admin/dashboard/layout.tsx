import Header from "@/components/header/page";
import { ThemeProvider } from "next-themes";
import { SideBarAdmin } from "@/components/sideBarAdmin/page";
import { DataProvider } from "@/app/context/adminDataStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DataProvider>
          <div className="pt-16 flex h-[calc(100vh-64px)]">
            <SideBarAdmin/>
            <main className="bg-gray-50 dark:bg-[#141414]  md:pl-52 pl-0 w-full  h-[calc(100vh-64px)] min-w-[450px]">
              {children}
            </main>
          </div>
      </DataProvider>        
      </body>
    </html>
  );
}
