"use client";

import { Search, Bell, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {

  const { data: session } = useSession();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Dışarı tıklayınca popup’ı kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="h-16 bg-white shadow-md flex items-center px-6 fixed top-0 left-64 right-0 w-[calc(100%-16rem)] z-50">
      {/* Arama Çubuğu */}
      <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-1/3">
        <Search size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full"
        />
      </div>

      {/* Boşluk */}
      <div className="flex-1"></div>

      {/* Sağ Üst Menü */}
      <div ref={menuRef} className="flex items-center space-x-6">
        {/* Bildirimler */}
        <div className="relative">
          <button onClick={() => toggleMenu("notifications")} className="relative">
            <Bell size={24} className="text-gray-600 hover:text-gray-800 transition" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
          </button>

          {activeMenu === "notifications" && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-3">
              <p className="text-sm text-gray-700">📩 Yeni Bildiriminiz Var</p>
              <p className="text-sm text-gray-500 mt-1">Yeni bir cafe eklendi.</p>
            </div>
          )}
        </div>

        {/* Kullanıcı Profili */}
        <div className="relative">

          {session
          ?
          <button onClick={() => toggleMenu("profile")} className="flex items-center space-x-2">
            <User size={24} className="text-gray-600 hover:text-gray-800 transition" />
            <span className="text-gray-700 font-medium">{session?.user.name}</span>
          </button>
          :
          <button onClick={() => toggleMenu("login")} className="flex items-center space-x-2">
            <User size={24} className="text-gray-600 hover:text-gray-800 transition" />
            <span className="text-gray-700 font-medium">Login</span>
          </button>
          }

          {activeMenu === "profile" && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
              <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-100 w-full">
                Profil
              </button>
              <button className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-100 w-full">
                Ayarlar
              </button>
              <button className="block text-left px-4 py-2 text-red-600 hover:bg-gray-100 w-full" onClick={()=>signOut()}>
                Çıkış Yap
              </button>
            </div>
          )}

          {activeMenu === "login" && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
              <button onClick={() => signIn("google")} className="block text-left px-4 py-2 text-gray-700 hover:bg-gray-100 w-full">
                Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
