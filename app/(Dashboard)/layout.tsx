
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import LogoutButton from "../components/LogoutButton";
import AuthGuard from "../components/AuthGuard";

import {
  IconLayoutDashboard,
  IconCash,
  IconPackage,
  IconReportAnalytics,
  IconSettings,
  IconSearch,
  IconBell,
  IconClock,
  IconCloud,
  IconMenu2,
  IconX,
  IconTrash,
  IconCrown,
  IconSparkles,
  IconChevronDown,
  IconTag,
  IconClipboardCheck,
  IconHistory,
  IconClipboardList,
} from "@tabler/icons-react";

type Notifikasi = {
  id: string;
  tipe: "transaksi" | "stok";
  judul: string;
  pesan: string;
  status?: string;
  waktu: string | null;
  href: string;
};

type MenuIcon = typeof IconPackage;

type SubmenuItem = {
  href: string;
  label: string;
  icon: MenuIcon;
};

type MenuItem = {
  href: string;
  label: string;
  icon: MenuIcon;
  submenu?: SubmenuItem[];
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [produkMenuOpen, setProdukMenuOpen] = useState(
    pathname.startsWith("/produk") ||
      pathname.startsWith("/kategori") ||
      pathname.startsWith("/stock-opname") ||
      pathname.startsWith("/riwayat-stok") ||
      pathname.startsWith("/riwayat-opname")
  );

  const [opened, setOpened] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notifikasi[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  // Membuka submenu Produk saat berpindah ke halaman terkait.
  useEffect(() => {
    if (
      pathname.startsWith("/produk") ||
      pathname.startsWith("/kategori") ||
      pathname.startsWith("/stock-opname") ||
      pathname.startsWith("/riwayat-stok") ||
      pathname.startsWith("/riwayat-opname")
    ) {
      setProdukMenuOpen(true);
    }
  }, [pathname]);

  // Mengambil kunci notifikasi sesuai pengguna login.
  const getReadKey = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return `looppos_notifikasi_dibaca_${payload.id ?? "user"}`;
    } catch {
      return "looppos_notifikasi_dibaca_user";
    }
  };

  // Mengambil daftar notifikasi yang sudah dibaca.
  const getSudahDibaca = (readKey: string): string[] => {
    try {
      const hasil = JSON.parse(localStorage.getItem(readKey) || "[]");
      return Array.isArray(hasil) ? hasil : [];
    } catch {
      return [];
    }
  };

  // Menandai notifikasi sebagai sudah dibaca.
  const tandaiDibaca = (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const readKey = getReadKey(token);
    const sudahDibaca = getSudahDibaca(readKey);

    if (sudahDibaca.includes(id)) return;

    localStorage.setItem(
      readKey,
      JSON.stringify([...sudahDibaca, id])
    );

    setUnreadCount((jumlah) => Math.max(0, jumlah - 1));
  };

  // Membaca role pengguna dari token.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    } catch (error) {
      console.error("[AUTH] Gagal membaca role:", error);
    }
  }, []);

  // Mengambil notifikasi dari backend.
  useEffect(() => {
    let aktif = true;
    let sedangMengambil = false;
    let interval: number | undefined;
    let controller: AbortController | null = null;

    const ambilNotifikasi = async () => {
      if (!aktif || sedangMengambil) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      sedangMengambil = true;

      const requestController = new AbortController();
      controller = requestController;

      const timeout = window.setTimeout(() => {
        requestController.abort();
      }, 20_000);

      try {
        const response = await fetch("/api/notifikasi", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: requestController.signal,
        });

        if (!response.ok) {
          console.error(
            "[NOTIFIKASI] HTTP:",
            response.status,
            await response.text()
          );
          return;
        }

        const hasil = await response.json();

        if (!aktif) return;

        const daftar: Notifikasi[] = Array.isArray(hasil.data)
          ? hasil.data
          : [];

        const sudahDibaca = getSudahDibaca(getReadKey(token));

        setNotifications(daftar);
        setUnreadCount(
          daftar.filter(
            (item) => !sudahDibaca.includes(item.id)
          ).length
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          if (aktif) {
            console.error(
              "[NOTIFIKASI] Request timeout setelah 20 detik."
            );
          }
        } else {
          console.error("[NOTIFIKASI] Fetch gagal:", error);
        }
      } finally {
        window.clearTimeout(timeout);
        sedangMengambil = false;

        if (controller === requestController) {
          controller = null;
        }
      }
    };

    void ambilNotifikasi();

    interval = window.setInterval(() => {
      void ambilNotifikasi();
    }, 60_000);

    return () => {
      aktif = false;

      if (interval !== undefined) {
        window.clearInterval(interval);
      }

      controller?.abort();
    };
  }, []);

  // Menghapus satu notifikasi atau semua notifikasi.
  const hapusNotifikasi = async (id?: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        id
          ? `/api/notifikasi/${encodeURIComponent(id)}`
          : "/api/notifikasi",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const hasil = await response.json().catch(() => ({}));
        alert(hasil.pesan || "Gagal menghapus notifikasi.");
        return;
      }

      const daftarBaru = id
        ? notifications.filter((item) => item.id !== id)
        : [];

      setNotifications(daftarBaru);

      const sudahDibaca = getSudahDibaca(getReadKey(token));

      setUnreadCount(
        daftarBaru.filter(
          (item) => !sudahDibaca.includes(item.id)
        ).length
      );
    } catch (error) {
      console.error("[NOTIFIKASI] Gagal menghapus:", error);
      alert("Tidak dapat menghapus notifikasi. Periksa koneksi.");
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  // MENU OWNER.
  const ownerMenu: MenuItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: IconLayoutDashboard,
    },
    {
      href: "/transaksi",
      label: "Transaksi",
      icon: IconCash,
    },
    {
      href: "/produk",
      label: "Produk",
      icon: IconPackage,
      submenu: [
        {
          href: "/produk",
          label: "Daftar Produk",
          icon: IconPackage,
        },
        {
          href: "/kategori",
          label: "Kategori",
          icon: IconTag,
        },
        {
          href: "/produk?modal=stock-opname",
          label: "Stock Opname",
          icon: IconClipboardCheck,
        },
        {
          href: "/produk?modal=stock-history",
          label: "Riwayat Pergerakan Stok",
          icon: IconHistory,
        },
        {
          href: "/produk?modal=stock-opname-history",
          label: "Riwayat Opname",
          icon: IconClipboardList,
        },
      ],
    },
    {
      href: "/laporan",
      label: "Laporan",
      icon: IconReportAnalytics,
    },
    {
      href: "/setting",
      label: "Pengaturan",
      icon: IconSettings,
    },
  ];

  // MENU KASIR TETAP TERPISAH.
  const kasirMenu: MenuItem[] = [
    {
      href: "/transaksi",
      label: "Transaksi Kasir (POS)",
      icon: IconCash,
    },
    {
      href: "/shift",
      label: "Shift Kasir",
      icon: IconClock,
    },
    {
      href: "/laporan",
      label: "Laporan & Analitik",
      icon: IconReportAnalytics,
    },
  ];

  const navItems: MenuItem[] =
    role === "kasir" ? kasirMenu : ownerMenu;

  return (
    <AuthGuard>
      <div
        className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] transition-colors duration-200 dark:bg-[#0b1210] dark:text-[#f1f5f3]"
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}
      >
        {/* MOBILE OVERLAY */}
        {opened && (
          <button
            aria-label="Tutup menu"
            onClick={() => setOpened(false)}
            className="fixed inset-0 z-40 bg-black/30 dark:bg-black/60 lg:hidden"
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed left-0 top-0 z-50
            flex h-full w-64 flex-col justify-between
            bg-white py-4
            shadow-[0_1px_8px_rgba(0,0,0,0.04)]
            transition-transform duration-200
            dark:bg-[#101a16]
            dark:shadow-[0_1px_12px_rgba(0,0,0,0.35)]
            ${
              opened
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <div className="flex min-h-0 flex-col">
            {/* LOGO */}
            <div className="flex shrink-0 items-center gap-2 px-4 pb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <img
                  src="/logo-LoopPOS.svg"
                  alt="LoopPOS Logo"
                  className="h-10 w-10 object-contain"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-[16px] font-semibold leading-none tracking-tight text-[#0b1c30] dark:text-[#f1f5f3]">
                  LoopPOS
                </span>

                <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#006948] dark:text-[#28b987]">
                  POS Enterprise
                </span>
              </div>

              <button
                type="button"
                onClick={() => setOpened(false)}
                aria-label="Tutup sidebar"
                className="ml-auto rounded-lg p-1.5 hover:bg-[#eff4ff] dark:hover:bg-[#1d3028] lg:hidden"
              >
                <IconX
                  size={20}
                  className="text-[#3d4a42] dark:text-[#c7d3cd]"
                />
              </button>
            </div>

            {/* MENU TITLE */}
            <div className="shrink-0 px-4 py-1">
              <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wider text-[#3d4a42] dark:text-[#91a29a]">
                Menu Utama
              </p>
            </div>

            {/* NAVIGATION */}
            <nav className="flex flex-col gap-1 overflow-y-auto px-4">
              {navItems.map((item) => {
                const Icon = item.icon;

                if (item.submenu) {
                  const active =
                    pathname.startsWith("/produk") ||
                    pathname.startsWith("/kategori") ||
                    pathname.startsWith("/stock-opname") ||
                    pathname.startsWith("/riwayat-stok") ||
                    pathname.startsWith("/riwayat-opname");

                  return (
                    <div key={item.href}>
                      <button
                        type="button"
                        onClick={() =>
                          setProdukMenuOpen((prev) => !prev)
                        }
                        aria-expanded={produkMenuOpen}
                        className={`
                          flex w-full items-center gap-2
                          rounded-lg px-2 py-2 transition-all
                          ${
                            active
                              ? "bg-[#00855d] font-bold text-white shadow-sm"
                              : "text-[#3d4a42] hover:bg-[#eff4ff] hover:text-[#0b1c30] dark:text-[#b8c5be] dark:hover:bg-[#1d3028] dark:hover:text-[#f1f5f3]"
                          }
                          dark:bg-opacity-100
                        `}
                      >
                        <Icon size={20} stroke={active ? 2.1 : 1.8} />

                        <span className="flex-1 text-left text-[14px] font-semibold leading-5">
                          {item.label}
                        </span>

                        <IconChevronDown
                          size={17}
                          className={`transition-transform ${
                            produkMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {produkMenuOpen && (
                        <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-[#dce5df] pl-3 dark:border-[#293b32]">
                          {item.submenu.map((subitem) => {
                            const SubIcon = subitem.icon;
                            const isModalLink =
                              subitem.href.includes("?modal=");

                            const subActive = isModalLink
                              ? false
                              : pathname === subitem.href ||
                                pathname.startsWith(
                                  subitem.href + "/"
                                );

                            return (
                              <Link
                                key={subitem.href}
                                href={subitem.href}
                                onClick={() => setOpened(false)}
                                className={`
                                  flex items-center gap-2
                                  rounded-lg px-2 py-2
                                  text-[12px] transition-colors
                                  ${
                                    subActive
                                      ? "bg-[#e5f4ec] font-bold text-[#006948] dark:bg-[#163026] dark:text-[#28b987]"
                                      : "text-[#52645a] hover:bg-[#eff4ff] hover:text-[#006948] dark:text-[#b8c5be] dark:hover:bg-[#1d3028] dark:hover:text-[#28b987]"
                                  }
                                `}
                              >
                                <SubIcon size={17} stroke={1.8} />
                                <span>{subitem.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpened(false)}
                    className={`
                      flex items-center gap-2
                      rounded-lg px-2 py-2 transition-all
                      ${
                        active
                          ? "bg-[#00855d] font-bold text-white shadow-sm"
                          : "text-[#3d4a42] hover:bg-[#eff4ff] hover:text-[#0b1c30] dark:text-[#b8c5be] dark:hover:bg-[#1d3028] dark:hover:text-[#f1f5f3]"
                      }
                    `}
                  >
                    <Icon size={20} stroke={active ? 2.1 : 1.8} />

                    <span className="text-[14px] font-semibold leading-5">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* SIDEBAR BOTTOM */}
          <div className="shrink-0 px-4">
            {/* STATUS TERMINAL */}
            <div className="mb-3 flex items-center justify-between rounded-lg bg-[#eff4ff] p-2 dark:bg-[#17231e]">
              <div className="flex items-center gap-2">
                <IconCloud
                  size={20}
                  className="text-[#006948] dark:text-[#28b987]"
                  stroke={1.9}
                />

                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#0b1c30] dark:text-[#f1f5f3]">
                    Status Terminal
                  </span>

                  <span className="text-[12px] text-[#3d4a42] dark:text-[#91a29a]">
                    Online Sync Aktif
                  </span>
                </div>
              </div>

              <span className="h-2 w-2 animate-pulse rounded-full bg-[#006948] dark:bg-[#28b987]" />
            </div>

            {/* LOGOUT */}
            <div className="mt-1">
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="lg:pl-64">
          {/* HEADER */}
          <header
            className="
              fixed left-0 right-0 top-0 z-30
              flex h-16 items-center justify-between
              bg-white/90 px-4
              shadow-[0_1px_8px_rgba(0,0,0,0.04)]
              backdrop-blur-xl transition-colors duration-200
              dark:bg-[#101a16]/95
              dark:shadow-[0_1px_12px_rgba(0,0,0,0.35)]
              lg:left-64 lg:px-6
            "
          >
            {/* LEFT HEADER */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* MOBILE MENU */}
              <button
                type="button"
                onClick={() => setOpened(true)}
                aria-label="Buka menu"
                className="rounded-lg p-2 text-[#3d4a42] hover:bg-[#eff4ff] dark:text-[#b8c5be] dark:hover:bg-[#1d3028] lg:hidden"
              >
                <IconMenu2 size={22} />
              </button>

              {/* TOKO BUKA */}
              <div className="flex items-center gap-1.5 rounded-full bg-[#e5eeff] px-2 py-1 dark:bg-[#163026]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#006948] dark:bg-[#28b987]" />
                <span className="text-[11px] font-bold uppercase text-[#006948] dark:text-[#28b987]">
                  Toko Buka
                </span>
              </div>

              {/* SHIFT KASIR: TETAP DIPERTAHANKAN DI HEADER */}
              <Link
                href="/shift"
                onClick={() => setOpened(false)}
                className={`
                  flex shrink-0 items-center gap-1.5
                  rounded-lg px-3 py-2
                  text-[12px] font-semibold transition-colors
                  ${
                    isActive("/shift")
                      ? "bg-[#00855d] text-white"
                      : "bg-[#eff4ff] text-[#006948] hover:bg-[#e0eee7] dark:bg-[#17231e] dark:text-[#28b987] dark:hover:bg-[#1d3028]"
                  }
                `}
                aria-label="Buka halaman Shift Kasir"
              >
                <IconClock size={18} stroke={1.8} />
                <span>Shift Kasir</span>
              </Link>

              {/* SEARCH */}
              <div className="relative hidden items-center md:flex">
                <IconSearch
                  size={18}
                  className="absolute left-2.5 text-[#3d4a42] dark:text-[#91a29a]"
                  stroke={1.8}
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/laporan?search=${encodeURIComponent(
                        searchQuery.trim()
                      )}`;
                    }
                  }}
                  placeholder="Cari invoice, SKU barang, pelanggan [F1]..."
                  className="
                    w-72 rounded-lg bg-[#eff4ff] py-1.5 pl-8 pr-4
                    text-[12px] text-[#0b1c30] outline-none
                    placeholder:text-[#3d4a42]
                    focus:bg-white focus:ring-1 focus:ring-[#006948]
                    transition-all dark:bg-[#17231e] dark:text-[#f1f5f3]
                    dark:placeholder:text-[#7f9188]
                    dark:focus:bg-[#1d3028] dark:focus:ring-[#28b987]
                  "
                />
              </div>
            </div>

            {/* RIGHT HEADER */}
            <div className="flex items-center gap-2">
              {/* LANGGANAN PREMIUM - KHUSUS OWNER */}
              {role === "owner" && (
                <Link
                  href="/langganan"
                  aria-label="Buka halaman Langganan"
                  className={`
                    group relative inline-flex shrink-0 items-center gap-2
                    overflow-hidden rounded-xl border px-3 py-2
                    text-xs font-bold transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-md
                    sm:px-4 sm:text-sm
                    ${
                      isActive("/langganan")
                        ? "border-[#b99a45] bg-gradient-to-r from-[#005c40] via-[#00855d] to-[#006948] text-white shadow-md shadow-[#006948]/20"
                        : "border-[#d7c18a] bg-gradient-to-r from-[#006948] via-[#00855d] to-[#006948] text-white shadow-sm hover:border-[#c5a65b] hover:shadow-[#c5a65b]/20 dark:border-[#8d763e] dark:from-[#123c2c] dark:via-[#006948] dark:to-[#123c2c]"
                    }
                  `}
                >
                  <IconSparkles
                    size={13}
                    stroke={2}
                    className="absolute right-1 top-0.5 text-[#ffe6a0] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125"
                  />

                  <IconCrown
                    size={19}
                    stroke={2}
                    className="shrink-0 text-[#ffe29a] transition-transform duration-200 group-hover:scale-110"
                  />

                  <span>Langganan</span>

                  <span className="rounded-md border border-[#ffe29a]/40 bg-[#ffe29a]/15 px-1 py-0.5 text-[9px] font-extrabold tracking-wider text-[#ffe29a]">
                    PRO
                  </span>
                </Link>
              )}

              {/* NOTIFICATION */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setNotificationOpen((prev) => !prev)
                  }
                  aria-label="Notifikasi"
                  aria-expanded={notificationOpen}
                  className="relative rounded-lg p-1.5 text-[#3d4a42] transition-colors hover:bg-[#eff4ff] dark:text-[#b8c5be] dark:hover:bg-[#1d3028]"
                >
                  <IconBell size={22} stroke={1.8} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-[9px] font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-xl border border-[#e1e8e3] bg-white shadow-xl dark:border-[#293b32] dark:bg-[#101a16]">
                    <div className="flex items-center justify-between border-b border-[#e1e8e3] px-4 py-3 dark:border-[#293b32]">
                      <div>
                        <h3 className="text-sm font-bold text-[#0b1c30] dark:text-[#f1f5f3]">
                          Notifikasi
                        </h3>

                        <p className="mt-0.5 text-xs text-[#64746b] dark:text-[#91a29a]">
                          {unreadCount > 0
                            ? `${unreadCount} belum dibaca`
                            : "Semua sudah dibaca"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {notifications.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Hapus semua notifikasi?"
                                )
                              ) {
                                void hapusNotifikasi();
                              }
                            }}
                            title="Hapus semua notifikasi"
                            aria-label="Hapus semua notifikasi"
                            className="rounded-lg p-1.5 text-[#64746b] hover:bg-red-50 hover:text-red-600 dark:text-[#b8c5be] dark:hover:bg-[#38201e] dark:hover:text-red-400"
                          >
                            <IconTrash size={17} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setNotificationOpen(false)}
                          aria-label="Tutup notifikasi"
                          className="rounded-lg p-1.5 text-[#64746b] hover:bg-[#eff4ff] dark:text-[#b8c5be] dark:hover:bg-[#1d3028]"
                        >
                          <IconX size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-10 text-center">
                          <IconBell
                            size={28}
                            stroke={1.5}
                            className="mx-auto mb-2 text-[#91a29a]"
                          />

                          <p className="text-sm font-semibold text-[#3d4a42] dark:text-[#c7d3cd]">
                            Belum ada notifikasi
                          </p>

                          <p className="mt-1 text-xs text-[#64746b] dark:text-[#91a29a]">
                            Notifikasi baru akan muncul di sini.
                          </p>
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-2 border-b border-[#e1e8e3] px-3 py-3 dark:border-[#293b32]"
                          >
                            <Link
                              href={item.href || "/dashboard"}
                              onClick={() => {
                                tandaiDibaca(item.id);
                                setNotificationOpen(false);
                              }}
                              className="flex min-w-0 flex-1 gap-3"
                            >
                              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f4ec] text-[#006948] dark:bg-[#163026] dark:text-[#28b987]">
                                {item.tipe === "transaksi" ? (
                                  <IconCash size={18} />
                                ) : (
                                  <IconPackage size={18} />
                                )}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-[#0b1c30] dark:text-[#f1f5f3]">
                                  {item.judul}
                                </span>

                                <span className="mt-1 block text-xs leading-5 text-[#52645a] dark:text-[#b8c5be]">
                                  {item.pesan}
                                </span>

                                {item.waktu && (
                                  <span className="mt-1 block text-[11px] text-[#819087] dark:text-[#91a29a]">
                                    {new Date(
                                      item.waktu
                                    ).toLocaleString("id-ID")}
                                  </span>
                                )}
                              </span>
                            </Link>

                            <button
                              type="button"
                              title="Hapus notifikasi"
                              aria-label={`Hapus ${item.judul}`}
                              onClick={() =>
                                void hapusNotifikasi(item.id)
                              }
                              className="shrink-0 rounded-lg p-1.5 text-[#819087] hover:bg-red-50 hover:text-red-600 dark:hover:bg-[#38201e] dark:hover:text-red-400"
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="min-h-screen bg-[#f8f9ff] pt-16 transition-colors duration-200 dark:bg-[#0b1210]">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
