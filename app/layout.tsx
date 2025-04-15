import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: "CSR AMP Portal",
  description: "NSR AMP Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800" suppressHydrationWarning={true}> 
        <Navbar />
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
