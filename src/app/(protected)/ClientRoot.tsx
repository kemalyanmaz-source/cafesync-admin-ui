"use client";

import { SessionProvider, useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Session } from "next-auth";

export default function ClientRoot({
    children,
    session
}: {
    children: React.ReactNode;
    session: Session
}) {

    return (
        <SessionProvider session={session}>
            <div className="flex">
                <Sidebar isUser={true}/>
                <div className="flex flex-col w-[calc(100%-16rem)]">
                    <Navbar/>
                    <main className="mt-16 p-6">{children}</main>
                </div>
            </div>
        </SessionProvider>
    );
}

