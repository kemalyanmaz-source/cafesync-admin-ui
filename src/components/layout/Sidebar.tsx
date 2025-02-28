import { LayoutDashboard, Table, Settings } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

export default function Sidebar({
  isUser
}: {
  isUser: boolean;
}) {

  return (
    <>
      {
        isUser ?

          <div className="h-screen w-64 bg-gradient-to-b from-indigo-900 to-purple-800 text-white flex flex-col p-4">
            <h2 className="text-2xl font-bold mb-6">CafeSync Admin</h2>
            {
              <nav className="flex-1 space-y-4">
                <SidebarItem href="/home" icon={<LayoutDashboard size={20} />} text="Dashboard" />
                <SidebarItem href="/users" icon={<Table size={20} />} text="Users" />
                <SidebarItem href="/cafes" icon={<Table size={20} />} text="Cafes" />
                <SidebarItem href="/settings" icon={<Settings size={20} />} text="Settings" />
              </nav>
            }
          </div>
          :
          <div className="h-screen w-64 bg-gradient-to-b from-black-900 to-white text-indigo flex flex-col p-4">
            <h2 className="text-2xl font-bold mb-6">CafeSync Admin</h2>
            {
              <nav className="flex-1 space-y-4">
                <SidebarItem href="/" icon={<LayoutDashboard size={20} />} text="About Us" />
              </nav>
            }
          </div>
      }
    </>
  );
};

const SidebarItem = ({ href, icon, text }: { href: string; icon: JSX.Element; text: string }) => (
  <Link href={href} className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-md transition">
    {icon}
    <span>{text}</span>
  </Link>
);

