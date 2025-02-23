"use client"

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function EditUserPage() {
  // 1) Retrieve the ID from the URL
  const { id } = useParams();  
  const router = useRouter();

  // 2) Example state for user (In real app, you'd fetch user data from an API)
  //    For demo, let's just store it here:
  const [user, setUser] = useState({
    id,
    name: "",
    email: "",
    role: "",
  });

  // 3) Save changes handler
  const handleSave = () => {
    console.log("Saving user:", user);
    // In reality, you'd send the updated user to your API
    // Then navigate back or to a success page:
    router.push("/users");
  };

  return (
    <div className="min-h-screen w-full bg-white flex justify-center items-center">
      <div className="w-full max-w-3xl p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Editing User #1</h1>
        
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input className="border border-gray-300 rounded p-2 w-full" />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input className="border border-gray-300 rounded p-2 w-full" />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Role</label>
          <input className="border border-gray-300 rounded p-2 w-full" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
      </div>
      </div>
    </div>
  );
}
