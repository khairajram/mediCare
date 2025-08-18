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
        <ThemeProvider attribute="class" enableSystem defaultTheme="system"  >
            <Header/>
            <DataProvider>
              <div className="pt-16 flex h-[calc(100vh-64px)]">
                <SideBarAdmin/>
                <main className="bg-gray-50 dark:bg-[#181818] w-full h-full">
                  {children}
                </main>
              </div>
          </DataProvider>
        </ThemeProvider>        
      </body>
    </html>
  );
}
