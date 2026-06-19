export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[calc(100vh-64px)] min-w-[450px] pt-16">
      {children}
    </div>
  );
}
