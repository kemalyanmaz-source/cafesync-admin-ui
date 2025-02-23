import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // Role özelliğini ekliyoruz
      customAppToken?: string | null;
      idToken?: string | null;
    };
    
  }
  
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    customAppToken?: string | null;
    idToken?: string | null;
  }
}