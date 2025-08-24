import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes"
import Header from "@/components/header/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karni Medical | Smart Pet Health App",
  description: "Track pet medicines, set reminders, and manage pet health records with Karni Medical — simple, fast, and easy to use.",
  openGraph: {
    title: "Karni Medical | Smart Pet Health App",
    description: "Track pet medicines, set reminders, and manage pet health records with Karni Medical.",
    url: "https://karnimedical.khairaj.tech",
    siteName: "Karni Medical",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Karni Medical app preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karni Medical | Smart Pet Health App",
    description: "Track pet medicines, set reminders, and manage pet health records with Karni Medical.",
    images: ["/social-preview.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" enableSystem defaultTheme="system"  >
          <Header/>
          <main className="bg-gray-500 dark:bg-[#141414]">
              {children}
            </main>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
