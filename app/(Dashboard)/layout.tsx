"use client";

import { usePathname } from "next/navigation";
import LogoutButton from "../components/LogoutButton";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/produk", label: "Produk" },
  { href: "/kategori", label: "Kategori" },
  { href: "/transaksi", label: "Transaksi" },
  { href: "/laporan", label: "Laporan" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-md p-6">

        <h1 className="text-2xl font-bold text-blue-600 mb-8">
          Kasir App
        </h1>

        <nav className="space-y-3">

          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 transition-colors ${
                isActive(item.href)
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </a>
          ))}

        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-6 left-6 right-6">
          <LogoutButton />
        </div>

      </aside>

      {/* ISI HALAMAN */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>

    </div>
  );
}