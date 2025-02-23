"use client"
import { useSession } from "next-auth/react";
import "../styles/globals.css"
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
export default function InnerLayout({ children }: { children: React.ReactNode }) {

    const { data: session, status } = useSession();

    return (
        <>
            {
                session ?
                <div className="flex">
                    <Sidebar />
                    <div className="flex flex-col w-[calc(100%-16rem)]">
                        <Navbar />
                        <main className="mt-16 p-6">{children}</main>
                    </div>
                </div>
                :
                <div>{children}</div>
            }
        </>
    );
}