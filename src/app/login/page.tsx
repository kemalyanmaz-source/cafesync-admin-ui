"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Eğer kullanıcı zaten giriş yapmışsa, doğrudan /'a gönder.
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  // Google ile giriş butonuna tıklandığında
  const handleGoogleSignIn = () => {
    // Burada callbackUrl ile giriş sonrası yönleneceğimiz adresi belirtiyoruz
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <main
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Giriş Yap</h1>

      {/* Session yoksa giriş butonunu gösteririz */}
      {!session && (
        <button
          style={{
            padding: "8px 16px",
            marginTop: 16,
          }}
          onClick={handleGoogleSignIn}
        >
          Google ile Giriş
        </button>
      )}

      {session && <p>Zaten giriş yaptınız; yönlendiriliyorsunuz...</p>}
    </main>
  );
}
