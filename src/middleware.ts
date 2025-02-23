// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Giriş yapmış kullanıcıyı login sayfasından uzaklaştır
    if (req.nextUrl.pathname === "/login" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/", req.url))
    }
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

// Tüm rotaları koru ama login ve static dosyaları hariç tut
export const config = {
  matcher: ["/((?!login|_next/static|favicon.ico).*)"]
}