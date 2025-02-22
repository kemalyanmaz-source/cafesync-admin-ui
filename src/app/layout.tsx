import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* İçerik Alanı */}
        <div className="flex flex-col w-[calc(100%-16rem)]">
          <Navbar />
          <main className="mt-16 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
