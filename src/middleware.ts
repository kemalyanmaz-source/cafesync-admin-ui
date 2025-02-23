// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Giriş yapmış kullanıcıyı login sayfasından uzaklaştır
 
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Login sayfasını koruma dışında bırak
        return !!token
      },
    },
    pages: {
      signIn: "/login", // Doğru login sayfası yolu
    },
  }
)