"use client";

import { useEffect, useRef, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const API_URL = "/api";

type Category = {
  id: number;
  nama: string;
};

type IconName =
  | "coffee"
  | "fastfood"
  | "icecream"
  | "liquor"
  | "cake"
  | "local_bar"
  | "restaurant"
  | "bakery_dining"
  | "cookie"
  | "loyalty";

function Icon({
  name,
  size = 20,
}: {
  name: IconName | string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "shrink-0",
  };

  switch (name) {
    case "arrow_back":
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      );

    case "add":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "category":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );

    case "inventory_2":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M5 7l1-3h12l1 3" />
          <path d="M5 7v12h14V7" />
          <path d="M9 11h6" />
        </svg>
      );

    case "local_cafe":
    case "coffee":
      return (
        <svg {...common}>
          <path d="M5 8h11v5a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4V8Z" />
          <path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2" />
          <path d="M8 4c0 1 1 1 1 2" />
          <path d="M12 4c0 1 1 1 1 2" />
          <path d="M4 21h16" />
        </svg>
      );

    case "fastfood":
      return (
        <svg {...common}>
          <path d="M4 10h16" />
          <path d="M6 10l1 10h10l1-10" />
          <path d="M8 10c0-4 1.5-6 4-6s4 2 4 6" />
          <path d="M9 14h6" />
        </svg>
      );

    case "local_bar":
    case "liquor":
      return (
        <svg {...common}>
          <path d="M5 5h14l-7 8-7-8Z" />
          <path d="M12 13v6" />
          <path d="M8 21h8" />
        </svg>
      );

    case "restaurant":
      return (
        <svg {...common}>
          <path d="M7 3v8" />
          <path d="M4.5 3v5.5A2.5 2.5 0 0 0 7 11a2.5 2.5 0 0 0 2.5-2.5V3" />
          <path d="M7 11v10" />
          <path d="M16 3v18" />
          <path d="M16 3c2.2 1.5 3 4.2 2 7h-2" />
        </svg>
      );

    case "bakery_dining":
    case "cake":
      return (
        <svg {...common}>
          <path d="M4 12h16v8H4z" />
          <path d="M6 12c0-2 1.5-3 3-3s3 1 3 3c0-2 1.5-3 3-3s3 1 3 3" />
          <path d="M4 16h16" />
        </svg>
      );

    case "cookie":
    case "icecream":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle
            cx="9"
            cy="9"
            r="1"
            fill="currentColor"
            stroke="none"
          />
          <circle
            cx="15"
            cy="11"
            r="1"
            fill="currentColor"
            stroke="none"
          />
          <circle
            cx="11"
            cy="15"
            r="1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "loyalty":
      return (
        <svg {...common}>
          <path d="M20 12l-8 8-8-8 8-8 8 8Z" />
          <path d="M12 9.5v5" />
          <path d="M9.5 12h5" />
        </svg>
      );

    case "format_list_bulleted":
      return (
        <svg {...common}>
          <path d="M9 6h11" />
          <path d="M9 12h11" />
          <path d="M9 18h11" />
          <circle
            cx="4.5"
            cy="6"
            r="1"
            fill="currentColor"
            stroke="none"
          />
          <circle
            cx="4.5"
            cy="12"
            r="1"
            fill="currentColor"
            stroke="none"
          />
          <circle
            cx="4.5"
            cy="18"
            r="1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
          <path d="M13.5 6.5l4 4" />
        </svg>
      );

    case "delete":
      return (
        <svg {...common}>
          <path d="M5 7h14" />
          <path d="M10 4h4l1 3H9l1-3Z" />
          <path d="M7 7l1 13h8l1-13" />
          <path d="M10 11v5" />
          <path d="M14 11v5" />
        </svg>
      );

    case "touch_app":
      return (
        <svg {...common}>
          <path d="M9 11V6a1.5 1.5 0 0 1 3 0v5" />
          <path d="M12 10V5.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M15 10V7a1.5 1.5 0 0 1 3 0v7" />
          <path d="M9 10V8a1.5 1.5 0 0 0-3 0v6l4 6h6c2 0 4-2 4-4v-3" />
        </svg>
      );

    case "add_circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      );

    case "save":
      return (
        <svg {...common}>
          <path d="M5 4h12l2 2v14H5z" />
          <path d="M8 4v6h8V4" />
          <path d="M8 20v-6h8v6" />
        </svg>
      );

    case "check_circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m8.5 12 2.2 2.2 4.8-5" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

const rowIcons: IconName[] = [
  "coffee",
  "local_bar",
  "restaurant",
  "bakery_dining",
  "cookie",
  "loyalty",
];

const quickIcons: {
  icon: IconName;
  label: string;
  description: string;
}[] = [
  {
    icon: "coffee",
    label: "Kopi",
    description: "Kopi & espresso",
  },
  {
    icon: "fastfood",
    label: "Makanan",
    description: "Makanan utama",
  },
  {
    icon: "icecream",
    label: "Dessert",
    description: "Es krim & manis",
  },
  {
    icon: "liquor",
    label: "Minuman",
    description: "Minuman lainnya",
  },
  {
    icon: "cake",
    label: "Bakery",
    description: "Roti & kue",
  },
];

export default function KategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nama, setNama] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] =
    useState<IconName>("coffee");

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] =
    useState<number | null>(null);

  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const quickAddRef = useRef<HTMLElement>(null);

  const showFeedback = (message: string) => {
    setToast(message);
    setToastVisible(true);

    window.setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/kategori`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.pesan || "Gagal mengambil kategori");
        return;
      }

      setCategories(data.data || []);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    }
  };

  const fetchProductCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setTotalProducts(null);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data.data)) {
        setTotalProducts(data.data.length);
      } else if (Array.isArray(data)) {
        setTotalProducts(data.length);
      } else {
        setTotalProducts(null);
      }
    } catch (error) {
      console.error("Gagal mengambil jumlah produk:", error);
      setTotalProducts(null);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductCount();
  }, []);

  const focusQuickAdd = () => {
    quickAddRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 350);
  };

  const resetQuickForm = () => {
    setNama("");
    setSlug("");
    setDescription("");
    setSelectedIcon("coffee");
  };

  const handleAdd = async () => {
    if (!nama.trim()) {
      alert("Nama kategori wajib diisi");
      nameInputRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/kategori`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: nama.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.pesan || "Gagal menambah kategori");
        return;
      }

      const savedName = nama.trim();

      resetQuickForm();

      await fetchCategories();

      showFeedback(`Kategori "${savedName}" berhasil disimpan`);
    } catch (error) {
      console.error("Gagal menambah kategori:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const yakin = confirm("Yakin ingin menghapus kategori ini?");

    if (!yakin) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/kategori/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.pesan || "Gagal menghapus kategori");
        return;
      }

      setCategories((prev) =>
        prev.filter((category) => category.id !== id)
      );

      showFeedback("Kategori berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNama(category.nama);
  };

  const closeEdit = () => {
    setEditingCategory(null);
    setNama("");
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;

    if (!nama.trim()) {
      alert("Nama kategori wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/kategori/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nama: nama.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.pesan || "Gagal mengubah kategori");
        return;
      }

      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id ? data.data : category
        )
      );

      closeEdit();

      showFeedback("Kategori berhasil diubah");
    } catch (error) {
      console.error("Gagal mengubah kategori:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`${plusJakarta.variable} min-h-screen w-full bg-[#f8f9ff] px-4 py-6 text-[#0b1c30] antialiased transition-colors sm:px-5 md:px-6 lg:px-8 dark:bg-[#0b1411] dark:text-[#edf7f1]`}
      style={{
        fontFamily: "var(--font-plus-jakarta), sans-serif",
      }}
    >
      <div className="flex w-full flex-col">
        {/* TOAST */}
        <div
          className={`fixed bottom-8 right-4 z-[100] flex items-center gap-2 rounded-lg bg-[#213145] px-4 py-2.5 text-[#eaf1ff] shadow-xl transition-all duration-300 ease-out sm:right-8 ${
            toastVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-20 opacity-0"
          }`}
        >
          <span className="text-[#85f8c4]">
            <Icon name="check_circle" size={20} />
          </span>

          <span className="text-xs font-medium sm:text-sm">
            {toast}
          </span>
        </div>

        {/* HEADER */}
        <header className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  window.history.back();
                }}
                className="group -ml-2 inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[#3d4a42] transition-colors hover:bg-[#eff4ff] hover:text-[#006948] dark:text-[#b8c9c0] dark:hover:bg-[#17231e] dark:hover:text-[#85f8c4]"
                title="Kembali ke Manajemen Produk"
              >
                <span className="transition-transform group-hover:-translate-x-0.5">
                  <Icon name="arrow_back" size={20} />
                </span>

                <span className="text-xs font-semibold sm:text-sm">
                  Kembali ke Produk
                </span>
              </button>

              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#bccac0] dark:bg-[#52675d]" />

              <span className="text-[11px] font-bold uppercase tracking-widest text-[#006948] dark:text-[#85f8c4]">
                Katalog &amp; Menu
              </span>

              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#bccac0] dark:bg-[#52675d]" />

              <span className="text-[11px] font-medium text-[#3d4a42] dark:text-[#9eb2a7]">
                KasirKilat POS
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-2">
              <h1 className="text-[28px] font-bold leading-9 tracking-tight text-[#0b1c30] sm:text-3xl lg:text-[36px] dark:text-[#edf7f1]">
                Kategori Produk
              </h1>
            </div>

            <p className="mt-0.5 text-sm leading-5 text-[#3d4a42] dark:text-[#9eb2a7]">
              Kelola pengelompokan menu &amp; produk tokomu secara ringkas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={focusQuickAdd}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#006948] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#00855d] active:scale-95"
            >
              <Icon name="add" size={18} />
              <span>Tambah Kategori</span>
            </button>
          </div>
        </header>

        {/* SUMMARY */}
        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] dark:bg-[#101a16] dark:shadow-[0_1px_4px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col">
              <span className="text-xs font-semibold leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
                Total Kategori
              </span>

              <span className="mt-1 text-[32px] font-extrabold leading-10 tracking-tight text-[#0b1c30] dark:text-[#edf7f1]">
                {categories.length}{" "}
                <span className="text-base font-normal leading-6 text-[#3d4a42] dark:text-[#9eb2a7]">
                  Kategori
                </span>
              </span>

              <span className="mt-1 flex items-center gap-1 text-xs font-normal leading-4 text-[#006948] dark:text-[#85f8c4]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#006948] dark:bg-[#85f8c4]" />
                {categories.length > 0
                  ? "Semua kategori aktif"
                  : "Belum ada kategori aktif"}
              </span>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[#006948] dark:bg-[#17231e] dark:text-[#85f8c4]">
              <Icon name="category" size={24} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] dark:bg-[#101a16] dark:shadow-[0_1px_4px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col">
              <span className="text-xs font-semibold leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
                Total Item Terhubung
              </span>

              <span className="mt-1 text-[32px] font-extrabold leading-10 tracking-tight text-[#0b1c30] dark:text-[#edf7f1]">
                {totalProducts ?? "—"}{" "}
                <span className="text-base font-normal leading-6 text-[#3d4a42] dark:text-[#9eb2a7]">
                  Produk
                </span>
              </span>

              <span className="mt-1 text-xs leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
                Terbagi di seluruh menu
              </span>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[#565e74] dark:bg-[#17231e] dark:text-[#b8c9c0]">
              <Icon name="inventory_2" size={24} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] dark:bg-[#101a16] dark:shadow-[0_1px_4px_rgba(0,0,0,0.18)]">
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-semibold leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
                Kategori Terlaris
              </span>

              <span className="mt-1 truncate text-lg font-bold leading-7 tracking-tight text-[#0b1c30] dark:text-[#edf7f1]">
                Belum tersedia
              </span>

              <span className="mt-1 text-xs font-medium leading-4 text-[#006948] dark:text-[#85f8c4]">
                Data penjualan belum tersedia
              </span>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eff4ff] text-[#006948] dark:bg-[#17231e] dark:text-[#85f8c4]">
              <Icon name="local_cafe" size={24} />
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          {/* TABLE */}
          <section className="overflow-hidden rounded-xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)] xl:col-span-8 dark:bg-[#101a16] dark:shadow-[0_1px_4px_rgba(0,0,0,0.18)]">
            <div className="flex items-center justify-between bg-white px-6 py-4 dark:bg-[#101a16]">
              <div className="flex min-w-0 items-center gap-2 text-[#3d4a42] dark:text-[#9eb2a7]">
                <Icon name="format_list_bulleted" size={18} />

                <span className="truncate text-base font-bold leading-6 text-[#0b1c30] dark:text-[#edf7f1]">
                  Daftar Kategori Toko
                </span>

                <span className="ml-1 rounded-full bg-[#eff4ff] px-2 py-0.5 text-[11px] font-semibold leading-4 text-[#3d4a42] dark:bg-[#1a2822] dark:text-[#b8c9c0]">
                  {categories.length}
                </span>
              </div>

              <div className="hidden items-center gap-1 sm:flex">
                <span className="text-xs leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
                  Urutkan: Posisi Default POS
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto bg-white dark:bg-[#101a16]">
              <table className="w-full min-w-[760px] bg-white text-left dark:bg-[#101a16]">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#3d4a42] dark:bg-[#1a2822] dark:text-[#b8c9c0]">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                      Nama Kategori
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                      Kode Slug
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                      Jumlah Menu
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white dark:bg-[#101a16]">
                  {categories.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-sm text-[#3d4a42] dark:text-[#9eb2a7]"
                      >
                        Belum ada kategori.
                      </td>
                    </tr>
                  ) : (
                    categories.map((category, index) => {
                      const icon =
                        rowIcons[index % rowIcons.length];

                      return (
                        <tr
                          key={category.id}
                          className="group border-b border-[#eff4ff] bg-white transition-colors hover:bg-[#eff4ff]/60 dark:border-[#26382f] dark:bg-[#101a16] dark:hover:bg-[#17231e]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e5eeff] transition-colors group-hover:bg-[#d3e4fe] dark:bg-[#1a2822] dark:group-hover:bg-[#22352d] ${
                                  index % 2 === 1
                                    ? "text-[#565e74] dark:text-[#b8c9c0]"
                                    : "text-[#006948] dark:text-[#85f8c4]"
                                }`}
                              >
                                <Icon name={icon} size={20} />
                              </div>

                              <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-bold leading-5 text-[#0b1c30] dark:text-[#edf7f1]">
                                  {category.nama}
                                </span>

                                <span className="text-xs leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
                                  Kelompok menu produk
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded bg-[#eff4ff] px-2 py-1 text-[11px] font-bold tracking-wider text-[#3d4a42] dark:bg-[#1a2822] dark:text-[#b8c9c0]">
                              CAT-
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm font-semibold leading-5 text-[#0b1c30] dark:text-[#edf7f1]">
                            — Menu
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5eeff] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#006948] dark:bg-[#17372b] dark:text-[#85f8c4]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#006948] dark:bg-[#85f8c4]" />
                              Aktif
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEdit(category)}
                                title="Edit Kategori"
                                className="cursor-pointer rounded-lg p-1.5 text-[#3d4a42] transition-colors hover:bg-[#eff4ff] hover:text-[#006948] dark:text-[#9eb2a7] dark:hover:bg-[#1a2822] dark:hover:text-[#85f8c4]"
                              >
                                <Icon name="edit" size={18} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(category.id)
                                }
                                title="Hapus Kategori"
                                className="cursor-pointer rounded-lg p-1.5 text-[#3d4a42] transition-colors hover:bg-[#ffdad6]/40 hover:text-[#ba1a1a] dark:text-[#9eb2a7] dark:hover:bg-[#3a201e] dark:hover:text-[#ffb4ab]"
                              >
                                <Icon name="delete" size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 bg-white p-4 text-xs leading-4 text-[#3d4a42] sm:flex-row sm:items-center sm:justify-between dark:bg-[#101a16] dark:text-[#9eb2a7]">
              <span>
                Menampilkan {categories.length} dari{" "}
                {categories.length} kategori
              </span>

              <span className="flex items-center gap-1 text-[11px] font-bold text-[#006948] dark:text-[#85f8c4]">
                <Icon name="touch_app" size={16} />
                Tarik &amp; geser baris untuk atur urutan di kasir
              </span>
            </div>
          </section>

          {/* QUICK ADD */}
          <aside
            ref={quickAddRef}
            className="sticky top-24 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] xl:col-span-4 dark:bg-[#101a16] dark:shadow-[0_1px_4px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold leading-6 text-[#0b1c30] dark:text-[#edf7f1]">
                  Tambah Cepat
                </h2>

                <p className="mt-0.5 text-xs leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
                  Buat kategori baru tanpa keluar halaman.
                </p>
              </div>

              <span className="text-[#006948] dark:text-[#85f8c4]">
                <Icon name="add_circle" size={22} />
              </span>
            </div>

            <form
              className="mt-1 flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                handleAdd();
              }}
            >
              {/* NAMA */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="catNameInput"
                  className="text-xs font-semibold leading-4 text-[#0b1c30] dark:text-[#edf7f1]"
                >
                  Nama Kategori{" "}
                  <span className="text-[#ba1a1a] dark:text-[#ffb4ab]">
                    *
                  </span>
                </label>

                <input
                  ref={nameInputRef}
                  id="catNameInput"
                  type="text"
                  value={nama}
                  onChange={(event) => setNama(event.target.value)}
                  placeholder="Contoh: Signature Blend, Dessert..."
                  required
                  className="h-11 rounded-lg bg-[#eff4ff] px-3.5 text-sm leading-5 text-[#0b1c30] outline-none placeholder:text-[#3d4a42]/70 focus:bg-white focus:ring-2 focus:ring-[#006948] transition-all dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#9eb2a7]/70 dark:focus:bg-[#1a2822]"
                />
              </div>

              {/* SLUG */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="catSlugInput"
                  className="text-xs font-semibold leading-4 text-[#0b1c30] dark:text-[#edf7f1]"
                >
                  Kode / Slug Singkat
                </label>

                <div className="relative flex items-center">
                  <input
                    id="catSlugInput"
                    type="text"
                    value={slug}
                    onChange={(event) =>
                      setSlug(event.target.value.toUpperCase())
                    }
                    placeholder={`CAT-${String(
                      categories.length + 1
                    ).padStart(2, "0")}`}
                    className="h-11 w-full rounded-lg bg-[#eff4ff] px-3.5 pr-20 text-sm uppercase leading-5 text-[#0b1c30] outline-none placeholder:text-[#3d4a42]/70 focus:bg-white focus:ring-2 focus:ring-[#006948] transition-all dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#9eb2a7]/70 dark:focus:bg-[#1a2822]"
                  />

                  <span className="absolute right-3 text-[11px] font-bold text-[#3d4a42] dark:text-[#9eb2a7]">
                    Otomatis
                  </span>
                </div>
              </div>

              {/* ICON */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold leading-4 text-[#0b1c30] dark:text-[#edf7f1]">
                    Pilih Ikon POS
                  </label>

                  <span className="text-[10px] font-medium text-[#3d4a42] dark:text-[#9eb2a7]">
                    Sesuaikan dengan jenis menu
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
                  {quickIcons.map((item) => {
                    const active = selectedIcon === item.icon;

                    return (
                      <button
                        key={item.icon}
                        type="button"
                        onClick={() => setSelectedIcon(item.icon)}
                        title={`Pilih ikon ${item.label}`}
                        aria-label={`Pilih ikon ${item.label}`}
                        className={`group flex min-h-[58px] cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-all ${
                          active
                            ? "border-[#006948] bg-[#e5eeff] text-[#006948] shadow-sm dark:border-[#85f8c4] dark:bg-[#17372b] dark:text-[#85f8c4]"
                            : "border-transparent bg-[#eff4ff] text-[#3d4a42] hover:border-[#bccac0] hover:bg-[#e5eeff] dark:bg-[#17231e] dark:text-[#b8c9c0] dark:hover:border-[#52675d] dark:hover:bg-[#1a2822]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            active
                              ? "bg-white text-[#006948] dark:bg-[#101a16] dark:text-[#85f8c4]"
                              : "bg-white/70 text-[#565e74] group-hover:text-[#006948] dark:bg-[#101a16] dark:text-[#9eb2a7] dark:group-hover:text-[#85f8c4]"
                          }`}
                        >
                          <Icon name={item.icon} size={20} />
                        </span>

                        <span className="flex min-w-0 flex-col">
                          <span
                            className={`text-xs font-bold leading-4 ${
                              active
                                ? "text-[#006948] dark:text-[#85f8c4]"
                                : "text-[#0b1c30] dark:text-[#edf7f1]"
                            }`}
                          >
                            {item.label}
                          </span>

                          <span className="truncate text-[10px] leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
                            {item.description}
                          </span>
                        </span>

                        {active && (
                          <span className="ml-auto shrink-0 text-[#006948] dark:text-[#85f8c4]">
                            <Icon name="check_circle" size={16} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-[#f8f9ff] px-3 py-2 dark:bg-[#0d1713]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e5eeff] text-[#006948] dark:bg-[#17372b] dark:text-[#85f8c4]">
                    <Icon name={selectedIcon} size={16} />
                  </span>

                  <span className="text-[11px] text-[#3d4a42] dark:text-[#9eb2a7]">
                    Ikon dipilih:{" "}
                    <strong className="font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                      {
                        quickIcons.find(
                          (item) => item.icon === selectedIcon
                        )?.label
                      }
                    </strong>
                  </span>
                </div>
              </div>

              {/* DESKRIPSI */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="catDescInput"
                  className="text-xs font-semibold leading-4 text-[#0b1c30] dark:text-[#edf7f1]"
                >
                  Deskripsi Pendek (Opsional)
                </label>

                <input
                  id="catDescInput"
                  type="text"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Keterangan menu untuk staf kasir"
                  className="h-11 rounded-lg bg-[#eff4ff] px-3.5 text-sm leading-5 text-[#0b1c30] outline-none placeholder:text-[#3d4a42]/70 focus:bg-white focus:ring-2 focus:ring-[#006948] transition-all dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#9eb2a7]/70 dark:focus:bg-[#1a2822]"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#006948] text-sm font-bold leading-5 text-white shadow-sm transition-all duration-200 hover:bg-[#00855d] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="save" size={18} />

                <span>
                  {loading ? "Menyimpan..." : "Simpan Kategori"}
                </span>
              </button>

              <p className="text-center text-xs leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
                Kategori akan langsung muncul di layar POS tablet &amp;
                kasir.
              </p>
            </form>
          </aside>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0b1c30]/35 px-4 py-6 backdrop-blur-sm dark:bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-[0_25px_80px_rgba(0,0,0,0.2)] dark:bg-[#101a16] dark:shadow-[0_25px_80px_rgba(0,0,0,0.5)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#006948] dark:text-[#85f8c4]">
                  Katalog &amp; Menu
                </p>

                <h2 className="text-xl font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                  Edit Kategori
                </h2>

                <p className="mt-1 text-xs text-[#3d4a42] dark:text-[#9eb2a7]">
                  Perbarui nama kategori yang dipilih.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                className="rounded-lg p-2 text-[#3d4a42] transition hover:bg-[#eff4ff] hover:text-[#0b1c30] dark:text-[#9eb2a7] dark:hover:bg-[#1a2822] dark:hover:text-[#edf7f1]"
                title="Tutup"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="editCategoryInput"
                className="text-xs font-semibold text-[#0b1c30] dark:text-[#edf7f1]"
              >
                Nama Kategori
              </label>

              <input
                id="editCategoryInput"
                type="text"
                value={nama}
                onChange={(event) => setNama(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleUpdate();
                  }

                  if (event.key === "Escape") {
                    closeEdit();
                  }
                }}
                autoFocus
                className="h-11 rounded-lg bg-[#eff4ff] px-3.5 text-sm text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#006948] dark:bg-[#17231e] dark:text-[#edf7f1] dark:focus:bg-[#1a2822]"
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEdit}
                className="h-11 rounded-lg border border-[#bccac0] px-5 text-sm font-semibold text-[#0b1c30] transition hover:bg-[#eff4ff] dark:border-[#52675d] dark:text-[#edf7f1] dark:hover:bg-[#1a2822]"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className="h-11 rounded-lg bg-[#006948] px-5 text-sm font-bold text-white transition hover:bg-[#00855d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}