export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className="bg-gray-50 dark:bg-[#141414]  h-[calc(100vh-64px)] min-w-[450px] pt-16">
          {children}
        </main>       
      </body>
    </html>
  );
}
