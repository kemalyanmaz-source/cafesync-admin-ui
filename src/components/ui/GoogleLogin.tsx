// src/components/ui/GoogleLogin.tsx

import { signIn } from 'next-auth/react';

export default function GoogleLogin() {
  return (
    <button
      onClick={() => signIn('google')}
      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
    >
    </button>
  );
}
