// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  callbacks: {
    async signIn() {
      return true; // Girişe izin ver
    },
    async jwt({ token, account }) {
      if (account && account.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        // Google gives you an access_token and id_token
        // Suppose you want to use 'id_token' to call your backend:
        const googleIdToken = account.id_token;

        // 2. Call your backend with googleIdToken:
        try {
          console.log(account.id_token)
          const resp = await fetch("http://localhost:5064/api/system-admin/oauth-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: googleIdToken }),
          });
          const data = await resp.json();
          token.customAppToken = data.token;
        } catch (e) {
          console.error("Error in jwt callback fetch:", e);
          // If you rethrow, NextAuth aborts sign-in
          throw e;
        }

      }

      return token;
    },
    async session({ session, token }) {
      session.user.customAppToken = token.customAppToken as string;
      return session;
    },
  },
  events: {
    async signOut({ session, token }) {
      console.log(JSON.stringify(session));
      console.log(JSON.stringify(token));
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };