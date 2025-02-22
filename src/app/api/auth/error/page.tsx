// app/page.tsx
"use client";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="p-8">
        <p>You are not signed in</p>
        <a href="/login" className="text-blue-500 hover:underline">
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Welcome, {session.user?.name}!</h1>
      <p>Email: {session.user?.email}</p>
      <p>Access Token: {session.accessToken}</p>
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sign out
      </button>
    </div>
  );
}