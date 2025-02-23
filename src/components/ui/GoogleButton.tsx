import { signIn } from "next-auth/react"
import { useState } from "react"
import WaveSpinner from "./WaveSpinner"
import { FcGoogle } from "react-icons/fc"

export function GoogleButton() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    await signIn("google")
    setLoading(false)
  }

  return (
    <button 
      onClick={handleLogin}
      disabled={loading}
    >
      {loading ? (
        <WaveSpinner /> // Özel yüklenme bileşeni
      ) : (
        <>
          <FcGoogle className="text-5xl"/>
        </>
      )}
    </button>
  )
}