"use client"
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css"
import InnerLayout from "./inner-layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <InnerLayout>
            {children}
          </InnerLayout>
        </SessionProvider>
      </body>
    </html>
  );
}