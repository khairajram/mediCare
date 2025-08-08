import Header from "@/components/header/page";
import { ThemeProvider } from "next-themes";
import "../../globals.css";
import { SideBarAdmin } from "@/components/sideBarAdmin/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system"  >
          <div className="pt-16 flex h-[calc(100vh-64px)]">
            <SideBarAdmin/>
            {children}
          </div>
        </ThemeProvider>        
      </body>
    </html>
  );
}
