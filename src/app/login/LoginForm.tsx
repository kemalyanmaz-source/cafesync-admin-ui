"use client";

import WaveSpinner from "@/components/ui/WaveSpinner";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/" })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      {
        <div
          className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bg.jpg')" }}
        >
          {/* Dark overlay to make text legible */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          {/* Main content card */}
          <div className="relative z-10 w-full max-w-md px-6 py-8 bg-white shadow-lg rounded-lg">
            {/* Optional logo at the top */}
            <div className="flex justify-center mb-4">
              <svg
                width="300"
                height="80"
                viewBox="0 0 300 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(0, 5)">
                  <path
                    d="M40 60 
           c-10 0 -10 -15 -10 -15
           v-8
           a5 5 0 0 1 5 -5
           h30
           a5 5 0 0 1 5 5
           v8
           s0 15 -10 15
           z"
                    fill="#8B4513"
                  />
                  <path
                    d="M70 40
           c10 0 10 12 0 12
           v-2
           c6 0 6 -8 0 -8
           z"
                    fill="#8B4513"
                  />
                  <path
                    d="M32 18
           c0 -8  12 -8  12 0
           s-12 8  -12 0z
           M44 10
           c0 -8  12 -8  12 0
           s-12 8  -12 0z"
                    stroke="#B8860B"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </g>

                <text
                  x="90"
                  y="50"
                  fill="#3B2F2F"
                  fontFamily="sans-serif"
                  fontSize="28"
                  fontWeight="bold"
                >
                  Cafedenevar
                </text>
              </svg>

            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Welcome to Cafédenevar
            </h1>
            <p className="text-gray-500 text-center mb-6">
              Please sign in to continue
            </p>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex items-center justify-center w-full space-x-2 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              {
                isLoading?
                  <WaveSpinner />
                  :
                  <>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 533.5 544.3"
                    >
                      <path
                        fill="#4285F4"
                        d="M533.5 278.4c0-15.4-1.2-30.2-3.5-44.4H272v84.1h146.3c-6.3 33.7-25 62.2-53.3 81.3v67.4h85.9c50 45.9 78.7 113.7 78.7 191.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M272 544.3c72.6 0 133.4-24.1 177.8-65.3l-85.9-67.4c-24.1 16.1-55 25.7-91.9 25.7-70.8 0-130.6-47.8-152.1-112.1H32.3v70.2C76.2 483 169.8 544.3 272 544.3z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M119.9 324.9c-6.6-19.9-10.4-41.2-10.4-63 0-21.8 3.8-43.1 10.4-63V128h-87.6C14.1 164.3 0 208.6 0 264.7s14.1 100.4 32.3 136.7l87.6-76.5z"
                      />
                      <path
                        fill="#EA4335"
                        d="M272 126.1c38.8 0 73.4 13.3 101 39l75.7-75.7C429.5 34.4 368.7 0 272 0 169.8 0 76.2 61.3 32.3 159.3l87.6 76.5c21.6-64.3 81.4-112.1 152.1-112.1z"
                      />
                    </svg>
                  </>
              }
            </button>
          </div>
        </div>
      }
    </>
  );
}
