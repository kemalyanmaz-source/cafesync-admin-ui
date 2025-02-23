import "../../styles/globals.css"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ClientRoot from "./ClientRoot";
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    return (
        <>
            <ClientRoot children={children} session={session}/>
        </>
    );
}