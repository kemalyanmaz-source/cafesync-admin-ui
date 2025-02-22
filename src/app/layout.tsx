"use client"
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css"
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          <Sidebar />
          <div className="flex flex-col w-[calc(100%-16rem)]">
            <Navbar />
            <main className="mt-16 p-6">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}