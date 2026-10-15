"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

const API_URL = "/api";

type Kasir = {
  id: number;
  id_kasir?: string;
  username: string;
  phone?: string;
  email: string;
  role?: string;
  aktif?: boolean;
  permissions?: {
    produk?: boolean;
    laporan?: boolean;
    kategori?: boolean;
    transaksi?: boolean;
    pengaturan?: boolean;
  };
  pin?: string;
  created_at?: string;
};

type FormKasir = {
  username: string;
  phone: string;
  email: string;
  pin: string;
};

type AuditKasir = {
  id: string;
  kasirId: number;
  idKasir: string;
  username: string;
  aktivitas: string;
  waktu: string;
};

type IconName =
  | "users"
  | "userPlus"
  | "search"
  | "download"
  | "more"
  | "check"
  | "clock"
  | "x"
  | "trash"
  | "edit"
  | "key"
  | "shield"
  | "activity"
  | "calendar"
  | "refresh";

function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "userPlus":
      return (
        <svg {...common}>
          <path d="M15 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );

    case "more":
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "x":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    case "trash":
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 15H6L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
      );

    case "key":
      return (
        <svg {...common}>
          <circle cx="7.5" cy="15.5" r="3.5" />
          <path d="m10 13 9-9" />
          <path d="m15 5 4 4" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "activity":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-7 4 14 2-7h6" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" />
          <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
        </svg>
      );

    default:
      return null;
  }
}

function getKasirId(kasir: Kasir) {
  return kasir.id_kasir || `KSR-${String(kasir.id).padStart(5, "0")}`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "K";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatTanggal(date?: string) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getAuditIcon(aktivitas: string): IconName {
  const text = aktivitas.toLowerCase();

  if (text.includes("dibuat")) return "userPlus";
  if (text.includes("diperbarui") || text.includes("diedit")) {
    return "edit";
  }
  if (text.includes("diaktifkan")) return "check";
  if (text.includes("dinonaktifkan")) return "x";
  if (text.includes("dihapus")) return "trash";

  return "activity";
}

function getAuditIconClass(aktivitas: string) {
  const text = aktivitas.toLowerCase();

  if (text.includes("dibuat")) {
    return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300";
  }

  if (text.includes("diperbarui") || text.includes("diedit")) {
    return "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300";
  }

  if (text.includes("diaktifkan")) {
    return "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-300";
  }

  if (text.includes("dinonaktifkan")) {
    return "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300";
  }

  if (text.includes("dihapus")) {
    return "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300";
  }

  return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300";
}

export default function KelolaKasir() {
  const [kasir, setKasir] = useState<Kasir[]>([]);
  const [auditKasir, setAuditKasir] = useState<AuditKasir[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] = useState<
    "SEMUA" | "AKTIF" | "NONAKTIF"
  >("SEMUA");

  const [modalTambah, setModalTambah] = useState(false);
  const [modalEdit, setModalEdit] = useState<Kasir | null>(null);
  const [modalHapus, setModalHapus] = useState<Kasir | null>(null);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [toast, setToast] = useState("");

  const [form, setForm] = useState<FormKasir>({
    username: "",
    phone: "",
    email: "",
    pin: "",
  });

  function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  function showToast(message: string) {
    setToast(message);
  }

  async function loadKasir() {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/users/kasir`, {
        method: "GET",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.pesan || "Gagal mengambil data kasir."
        );
      }

      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.kasir)
          ? data.kasir
          : Array.isArray(data?.users)
            ? data.users
            : Array.isArray(data?.data)
              ? data.data
              : [];

      setKasir(rows);
    } catch (err) {
      setKasir([]);

      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat data kasir."
      );
    } finally {
      setLoading(false);
    }
  }

  function loadAuditKasir() {
    try {
      const data = localStorage.getItem("auditKasir");

      if (!data) {
        setAuditKasir([]);
        return;
      }

      const parsed = JSON.parse(data);

      setAuditKasir(Array.isArray(parsed) ? parsed : []);
    } catch {
      setAuditKasir([]);
    }
  }

  function tambahAudit(item: Kasir, aktivitas: string) {
    const auditBaru: AuditKasir = {
      id: `${Date.now()}-${item.id}`,
      kasirId: item.id,
      idKasir: getKasirId(item),
      username: item.username,
      aktivitas,
      waktu: new Date().toISOString(),
    };

    setAuditKasir((prev) => {
      const dataBaru = [auditBaru, ...prev].slice(0, 100);

      localStorage.setItem("auditKasir", JSON.stringify(dataBaru));

      return dataBaru;
    });
  }

  useEffect(() => {
    loadKasir();
    loadAuditKasir();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const kasirAktif = useMemo(
    () => kasir.filter((item) => item.aktif !== false),
    [kasir]
  );

  const kasirNonaktif = useMemo(
    () => kasir.filter((item) => item.aktif === false),
    [kasir]
  );

  const kasirFiltered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return kasir.filter((item) => {
      const idKasir = getKasirId(item);

      const text = [
        item.username,
        item.email,
        item.phone || "",
        idKasir,
      ]
        .join(" ")
        .toLowerCase();

      const cocokSearch = text.includes(keyword);

      const cocokStatus =
        filterStatus === "SEMUA" ||
        (filterStatus === "AKTIF" && item.aktif !== false) ||
        (filterStatus === "NONAKTIF" && item.aktif === false);

      return cocokSearch && cocokStatus;
    });
  }, [kasir, search, filterStatus]);

  const jumlahHakTransaksi = useMemo(
    () =>
      kasir.filter(
        (item) => item.permissions?.transaksi !== false
      ).length,
    [kasir]
  );

  const jumlahDenganLaporan = useMemo(
    () =>
      kasir.filter(
        (item) => item.permissions?.laporan === true
      ).length,
    [kasir]
  );

  const jumlahDenganProduk = useMemo(
    () =>
      kasir.filter(
        (item) => item.permissions?.produk === true
      ).length,
    [kasir]
  );

  const persentaseAktif =
    kasir.length === 0
      ? 0
      : Math.round((kasirAktif.length / kasir.length) * 100);

  const kasirTerbaru = useMemo(() => {
    if (kasir.length === 0) return null;

    return [...kasir].sort((a, b) => b.id - a.id)[0];
  }, [kasir]);

  function resetForm() {
    setForm({
      username: "",
      phone: "",
      email: "",
      pin: "",
    });
  }

  function openTambah() {
    resetForm();
    setModalTambah(true);
  }

  function openEdit(item: Kasir) {
    setForm({
      username: item.username || "",
      phone: item.phone || "",
      email: item.email || "",
      pin: "",
    });

    setModalEdit(item);
  }

  async function tambahKasir(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.username.trim()) {
      showToast("Nama kasir wajib diisi.");
      return;
    }

    if (!form.email.trim()) {
      showToast("Email kasir wajib diisi.");
      return;
    }

    if (!form.pin || !/^\d{6}$/.test(form.pin)) {
      showToast("PIN kasir harus 6 digit.");
      return;
    }

    setSaving(true);

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/users/kasir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify({
          username: form.username.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          pin: form.pin,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.pesan || "Gagal menambahkan kasir."
        );
      }

      setModalTambah(false);
      resetForm();

      await loadKasir();

      if (data?.kasir) {
        tambahAudit(data.kasir, "Akun kasir dibuat");
      }

      showToast(
        `Kasir berhasil ditambahkan${
          data?.kasir?.id_kasir
            ? ` • ${data.kasir.id_kasir}`
            : ""
        }`
      );
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : "Gagal menambahkan kasir."
      );
    } finally {
      setSaving(false);
    }
  }

  async function editKasir(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!modalEdit) return;

    if (!form.username.trim()) {
      showToast("Nama kasir wajib diisi.");
      return;
    }

    if (!form.email.trim()) {
      showToast("Email kasir wajib diisi.");
      return;
    }

    if (form.pin.trim() && !/^\d{6}$/.test(form.pin)) {
      showToast("PIN kasir harus 6 digit.");
      return;
    }

    setSaving(true);

    try {
      const token = getToken();

      const body: Record<string, string> = {
        username: form.username.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      };

      if (form.pin.trim()) {
        body.pin = form.pin;
      }

      const response = await fetch(
        `${API_URL}/users/kasir/${modalEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.pesan || "Gagal mengubah data kasir."
        );
      }

      const auditItem: Kasir = {
        ...modalEdit,
        username:
          data?.kasir?.username || form.username.trim(),
        email:
          data?.kasir?.email || form.email.trim(),
        phone:
          data?.kasir?.phone || form.phone.trim(),
      };

      setModalEdit(null);
      resetForm();

      await loadKasir();

      tambahAudit(
        auditItem,
        form.pin.trim()
          ? "Data kasir dan PIN diperbarui"
          : "Data kasir diperbarui"
      );

      showToast("Data kasir berhasil diperbarui.");
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : "Gagal mengubah data kasir."
      );
    } finally {
      setSaving(false);
    }
  }

  async function ubahStatus(item: Kasir) {
    setProcessingId(item.id);

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/users/kasir/${item.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({
            aktif: item.aktif === false,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.pesan || "Gagal mengubah status kasir."
        );
      }

      await loadKasir();

      tambahAudit(
        item,
        item.aktif === false
          ? "Kasir diaktifkan"
          : "Kasir dinonaktifkan"
      );

      showToast(
        item.aktif === false
          ? "Kasir berhasil diaktifkan."
          : "Kasir berhasil dinonaktifkan."
      );
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : "Gagal mengubah status kasir."
      );
    } finally {
      setProcessingId(null);
      setOpenMenuId(null);
    }
  }

  async function hapusKasir() {
    if (!modalHapus) return;

    setDeleting(true);

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/users/kasir/${modalHapus.id}`,
        {
          method: "DELETE",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.pesan || "Gagal menghapus kasir."
        );
      }

      tambahAudit(modalHapus, "Akun kasir dihapus");

      setModalHapus(null);

      await loadKasir();

      showToast("Kasir berhasil dihapus.");
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : "Gagal menghapus kasir."
      );
    } finally {
      setDeleting(false);
    }
  }

  function exportCSV() {
    if (kasirFiltered.length === 0) {
      showToast("Tidak ada data kasir untuk diekspor.");
      return;
    }

    const header = [
      "Nama",
      "ID Kasir",
      "Email",
      "Telepon",
      "Status",
      "Tanggal Dibuat",
    ];

    const rows = kasirFiltered.map((item) => [
      item.username,
      getKasirId(item),
      item.email,
      item.phone || "",
      item.aktif === false ? "Nonaktif" : "Aktif",
      formatTanggal(item.created_at),
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `data-kasir-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showToast("Data kasir berhasil diekspor.");
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] px-4 py-6 text-[#0b1c30] transition-colors dark:bg-[#0b1411] dark:text-[#edf7f1] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* HEADER */}
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500 dark:text-[#9eb2a7]">
              <span>Pengaturan</span>
              <span>/</span>
              <span className="font-medium text-[#006948] dark:text-[#85f8c4]">
                Kelola Kasir
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Kelola Kasir
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-[#9eb2a7]">
              Kelola akun, akses, status, dan aktivitas kasir toko.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadKasir}
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-[#24372f] dark:bg-[#101a16] dark:text-[#edf7f1] dark:hover:bg-[#17231e]"
            >
              <Icon name="refresh" size={18} />
              Refresh
            </button>

            <button
              type="button"
              onClick={exportCSV}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-[#24372f] dark:bg-[#101a16] dark:text-[#edf7f1] dark:hover:bg-[#17231e]"
            >
              <Icon name="download" size={18} />
              Export
            </button>

            <button
              type="button"
              onClick={openTambah}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#006948] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#00563b]"
            >
              <Icon name="userPlus" size={18} />
              Tambah Kasir
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <span>{error}</span>

            <button
              type="button"
              onClick={loadKasir}
              className="font-bold underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* TOP CARDS */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Kasir",
              value: kasir.length,
              description: "Semua akun kasir terdaftar",
              icon: "users" as IconName,
              iconClass:
                "bg-emerald-50 text-[#006948] dark:bg-emerald-950/40 dark:text-[#85f8c4]",
            },
            {
              title: "Kasir Aktif",
              value: kasirAktif.length,
              description: `${persentaseAktif}% dari seluruh kasir`,
              icon: "check" as IconName,
              iconClass:
                "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-300",
            },
            {
              title: "Kasir Nonaktif",
              value: kasirNonaktif.length,
              description: "Akun yang dinonaktifkan",
              icon: "x" as IconName,
              iconClass:
                "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
            },
            {
              title: "Akses Transaksi",
              value: jumlahHakTransaksi,
              description: "Kasir dengan akses transaksi",
              icon: "activity" as IconName,
              iconClass:
                "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#24372f] dark:bg-[#101a16]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-[#9eb2a7]">
                    {card.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {card.value}
                  </p>

                  <p className="mt-2 text-xs text-slate-500 dark:text-[#9eb2a7]">
                    {card.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconClass}`}
                >
                  <Icon name={card.icon} size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FILTER */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#24372f] dark:bg-[#101a16]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#82958b]">
                <Icon name="search" size={19} />
              </div>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama, email, telepon, KSR-00032..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-[#0b1c30] outline-none transition placeholder:text-slate-400 focus:border-[#006948] focus:ring-2 focus:ring-[#006948]/10 dark:border-[#2a4036] dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#82958b]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["SEMUA", "AKTIF", "NONAKTIF"] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilterStatus(status)}
                    className={`h-10 rounded-xl px-4 text-xs font-bold transition ${
                      filterStatus === status
                        ? "bg-[#006948] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-[#2a4036] dark:bg-[#101a16] dark:text-[#b8c8c0] dark:hover:bg-[#17231e]"
                    }`}
                  >
                    {status === "SEMUA"
                      ? "Semua"
                      : status === "AKTIF"
                        ? "Aktif"
                        : "Nonaktif"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#24372f] dark:bg-[#101a16]">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center dark:border-[#24372f]">
            <div>
              <h2 className="font-bold">Daftar Kasir</h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-[#9eb2a7]">
                Menampilkan {kasirFiltered.length} kasir dari{" "}
                {kasir.length} kasir terdaftar
              </p>
            </div>

            {search || filterStatus !== "SEMUA" ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilterStatus("SEMUA");
                }}
                className="text-xs font-bold text-[#006948] hover:underline dark:text-[#85f8c4]"
              >
                Reset filter
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-[#9eb2a7]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#006948] dark:border-[#2a4036] dark:border-t-[#85f8c4]" />
                Memuat data kasir...
              </div>
            </div>
          ) : kasirFiltered.length === 0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-[#17231e] dark:text-[#82958b]">
                <Icon name="users" size={30} />
              </div>

              <h3 className="font-bold">
                {kasir.length === 0
                  ? "Belum ada akun kasir"
                  : "Data tidak ditemukan"}
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-[#9eb2a7]">
                {kasir.length === 0
                  ? "Tambahkan akun kasir pertama untuk mulai mengelola kasir."
                  : "Coba ubah kata pencarian atau filter status."}
              </p>

              {kasir.length === 0 && (
                <button
                  type="button"
                  onClick={openTambah}
                  className="mt-5 rounded-xl bg-[#006948] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#00563b]"
                >
                  Tambahkan akun kasir
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-[#24372f] dark:bg-[#17231e] dark:text-[#9eb2a7]">
                    <th className="px-5 py-4 font-bold">
                      Karyawan
                    </th>

                    <th className="px-5 py-4 font-bold">
                      ID Kasir
                    </th>

                    <th className="px-5 py-4 font-bold">
                      Peran & Hak Akses
                    </th>

                    <th className="px-5 py-4 font-bold">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right font-bold">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-[#24372f]">
                  {kasirFiltered.map((item) => {
                    const aktif = item.aktif !== false;

                    return (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-50/70 dark:hover:bg-[#17231e]/70"
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#006948]/10 font-bold text-[#006948] dark:bg-emerald-950/40 dark:text-[#85f8c4]">
                              {getInitials(item.username)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-bold">
                                {item.username}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-[#9eb2a7]">
                                {item.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-sm font-bold text-slate-700 dark:bg-[#17231e] dark:text-[#edf7f1]">
                            {getKasirId(item)}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                              Transaksi
                            </span>

                            {item.permissions?.produk === true && (
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                Produk
                              </span>
                            )}

                            {item.permissions?.laporan === true && (
                              <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                                Laporan
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <button
                            type="button"
                            onClick={() => ubahStatus(item)}
                            disabled={processingId === item.id}
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                              aktif
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#17231e] dark:text-slate-300 dark:hover:bg-[#21332c]"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                aktif
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />

                            {processingId === item.id
                              ? "Memproses..."
                              : aktif
                                ? "Aktif"
                                : "Nonaktif"}
                          </button>
                        </td>

                        <td className="relative px-5 py-5">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#006948] dark:text-slate-400 dark:hover:bg-[#17231e] dark:hover:text-[#85f8c4]"
                              title="Edit kasir"
                            >
                              <Icon name="edit" size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setModalHapus(item)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30"
                              title="Hapus kasir"
                            >
                              <Icon name="trash" size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === item.id
                                    ? null
                                    : item.id
                                )
                              }
                              className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#17231e] ${
                                openMenuId === item.id
                                  ? "bg-slate-100 text-[#006948] dark:bg-[#17231e] dark:text-[#85f8c4]"
                                  : ""
                              }`}
                              title="Menu kasir"
                            >
                              <Icon name="more" size={17} />
                            </button>
                          </div>

                          {openMenuId === item.id && (
                            <div className="absolute right-5 top-14 z-40 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-[#2a4036] dark:bg-[#101a16]">
                              <button
                                type="button"
                                onClick={() => {
                                  openEdit(item);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-[#edf7f1] dark:hover:bg-[#17231e]"
                              >
                                <Icon name="edit" size={16} />
                                Edit Kasir
                              </button>

                              <button
                                type="button"
                                onClick={() => ubahStatus(item)}
                                disabled={processingId === item.id}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-[#edf7f1] dark:hover:bg-[#17231e]"
                              >
                                {item.aktif === false ? (
                                  <>
                                    <Icon name="check" size={16} />
                                    Aktifkan Kasir
                                  </>
                                ) : (
                                  <>
                                    <Icon name="x" size={16} />
                                    Nonaktifkan Kasir
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setModalHapus(item);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                              >
                                <Icon name="trash" size={16} />
                                Hapus Kasir
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* BOTTOM CARDS */}
        <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#24372f] dark:bg-[#101a16]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold">Ringkasan Kasir</h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#9eb2a7]">
                  Kondisi akun saat ini
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#006948] dark:bg-emerald-950/40 dark:text-[#85f8c4]">
                <Icon name="activity" size={19} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-[#9eb2a7]">
                  Total akun
                </span>

                <span className="font-bold">{kasir.length}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#17231e]">
                <div
                  className="h-full rounded-full bg-[#006948] transition-all"
                  style={{
                    width: `${persentaseAktif}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {kasirAktif.length} aktif
                </span>

                <span className="text-slate-500 dark:text-[#9eb2a7]">
                  {kasirNonaktif.length} nonaktif
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#24372f] dark:bg-[#101a16]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold">Hak Akses</h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#9eb2a7]">
                  Distribusi akses kasir
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                <Icon name="shield" size={19} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-[#9eb2a7]">
                  Transaksi
                </span>

                <span className="font-bold">
                  {jumlahHakTransaksi}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-[#9eb2a7]">
                  Laporan
                </span>

                <span className="font-bold">
                  {jumlahDenganLaporan}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-[#9eb2a7]">
                  Produk
                </span>

                <span className="font-bold">
                  {jumlahDenganProduk}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#24372f] dark:bg-[#101a16]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold">Informasi Sistem</h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#9eb2a7]">
                  Data pengelolaan kasir
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300">
                <Icon name="calendar" size={19} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-[#9eb2a7]">
                  Kasir terbaru
                </span>

                <span className="text-right text-sm font-bold">
                  {kasirTerbaru ? kasirTerbaru.username : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-[#9eb2a7]">
                  ID terakhir
                </span>

                <span className="font-mono text-sm font-bold">
                  {kasirTerbaru
                    ? getKasirId(kasirTerbaru)
                    : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-[#9eb2a7]">
                  Tanggal dibuat
                </span>

                <span className="text-sm font-bold">
                  {kasirTerbaru
                    ? formatTanggal(kasirTerbaru.created_at)
                    : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-[#9eb2a7]">
                  Sinkronisasi
                </span>

                <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Terhubung
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AUDIT KASIR */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#24372f] dark:bg-[#101a16]">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center dark:border-[#24372f]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-[#17231e] dark:text-[#b8c8c0]">
                <Icon name="activity" size={19} />
              </div>

              <div>
                <h3 className="font-bold">Audit Kasir</h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#9eb2a7]">
                  Riwayat aktivitas pengelolaan akun kasir.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-[#17231e] dark:text-[#b8c8c0]">
                {auditKasir.length} aktivitas
              </span>

              {auditKasir.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("auditKasir");
                    setAuditKasir([]);
                    showToast(
                      "Riwayat audit berhasil dibersihkan."
                    );
                  }}
                  className="text-xs font-bold text-red-500 transition hover:text-red-600 hover:underline"
                >
                  Bersihkan
                </button>
              )}
            </div>
          </div>

          {auditKasir.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-[#17231e] dark:text-[#82958b]">
                <Icon name="activity" size={20} />
              </div>

              <p className="text-sm font-semibold text-slate-600 dark:text-[#b8c8c0]">
                Belum ada aktivitas kasir.
              </p>

              <p className="mx-auto mt-1 max-w-md text-xs text-slate-400 dark:text-[#82958b]">
                Aktivitas tambah, edit, status, dan hapus
                akan muncul otomatis di sini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-[#24372f]">
              {auditKasir.slice(0, 8).map((audit) => (
                <div
                  key={audit.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center dark:hover:bg-[#17231e]/60"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getAuditIconClass(
                      audit.aktivitas
                    )}`}
                  >
                    <Icon
                      name={getAuditIcon(audit.aktivitas)}
                      size={16}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-bold">
                        {audit.username}
                      </span>

                      <span className="font-mono text-[10px] font-bold text-[#006948] dark:text-[#85f8c4]">
                        {audit.idKasir}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500 dark:text-[#9eb2a7]">
                      {audit.aktivitas}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400 dark:text-[#82958b]">
                    <Icon name="clock" size={14} />

                    {new Date(audit.waktu).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-slate-500 sm:flex-row sm:items-center dark:text-[#9eb2a7]">
          <span>
            Menampilkan {kasirFiltered.length} dari {kasir.length} kasir
          </span>

          <span>
            ID kasir dibuat otomatis berdasarkan ID database
          </span>
        </div>
      </div>

      {/* MODAL TAMBAH */}
      {modalTambah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/60">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-[#101a16]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#24372f]">
              <div>
                <h2 className="text-lg font-bold">
                  Tambah Kasir
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#9eb2a7]">
                  ID Kasir akan dibuat otomatis.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalTambah(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-[#9eb2a7] dark:hover:bg-[#17231e]"
              >
                <Icon name="x" size={19} />
              </button>
            </div>

            <form
              onSubmit={tambahKasir}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nama Kasir
                </label>

                <input
                  value={form.username}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      username: event.target.value,
                    }))
                  }
                  placeholder="Contoh: Deo Martin"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-[#0b1c30] outline-none focus:border-[#006948] focus:ring-2 focus:ring-[#006948]/10 dark:border-[#2a4036] dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#82958b]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="kasir@email.com"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-[#0b1c30] outline-none focus:border-[#006948] focus:ring-2 focus:ring-[#006948]/10 dark:border-[#2a4036] dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#82958b]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nomor Telepon
                </label>

                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="08xxxxxxxxxx"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-[#0b1c30] outline-none focus:border-[#006948] focus:ring-2 focus:ring-[#006948]/10 dark:border-[#2a4036] dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#82958b]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  PIN Kasir
                </label>

                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pin}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      pin: event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6),
                    }))
                  }
                  placeholder="6 digit"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm tracking-[0.3em] text-[#0b1c30] outline-none focus:border-[#006948] focus:ring-2 focus:ring-[#006948]/10 dark:border-[#2a4036] dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#82958b]"
                />
              </div>

              <div className="rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                <div className="flex gap-3">
                  <Icon name="shield" size={18} />

                  <p>
                    ID Kasir dibuat otomatis, contohnya{" "}
                    <strong>KSR-00032</strong>. Kasir nantinya login
                    menggunakan ID Kasir dan PIN 6 digit.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalTambah(false)}
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-[#2a4036] dark:bg-[#101a16] dark:text-[#edf7f1] dark:hover:bg-[#17231e]"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 flex-1 rounded-xl bg-[#006948] text-sm font-bold text-white hover:bg-[#00563b] disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Kasir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {modalEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/60">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-[#101a16]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#24372f]">
              <div>
                <h2 className="text-lg font-bold">
                  Edit Kasir
                </h2>

                <p className="mt-1 font-mono text-xs text-[#006948] dark:text-[#85f8c4]">
                  {getKasirId(modalEdit)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalEdit(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-[#9eb2a7] dark:hover:bg-[#17231e]"
              >
                <Icon name="x" size={19} />
              </button>
            </div>

            <form
              onSubmit={editKasir}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  ID Kasir
                </label>

                <div className="flex h-11 items-center rounded-xl bg-slate-100 px-4 font-mono text-sm font-bold text-slate-600 dark:bg-[#17231e] dark:text-[#b8c8c0]">
                  {getKasirId(modalEdit)}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nama Kasir
                </label>

                <input
                  value={form.username}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      username: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-[#0b1c30] outline-none focus:border-[#006948] dark:border-[#2a4036] dark:bg-[#17231e] dark:text-[#edf7f1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-[#0b1c30] outline-none focus:border-[#006948] dark:border-[#2a4036] dark:bg-[#17231e] dark:text-[#edf7f1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nomor Telepon
                </label>

                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-[#0b1c30] outline-none focus:border-[#006948] dark:border-[#2a4036] dark:bg-[#17231e] dark:text-[#edf7f1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  PIN Baru
                </label>

                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pin}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      pin: event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6),
                    }))
                  }
                  placeholder="Kosongkan jika tidak ingin mengubah PIN"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm tracking-[0.3em] text-[#0b1c30] outline-none focus:border-[#006948] dark:border-[#2a4036] dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#82958b]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalEdit(null)}
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-[#2a4036] dark:bg-[#101a16] dark:text-[#edf7f1] dark:hover:bg-[#17231e]"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 flex-1 rounded-xl bg-[#006948] text-sm font-bold text-white hover:bg-[#00563b] disabled:opacity-50"
                >
                  {saving
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#101a16]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
              <Icon name="trash" size={22} />
            </div>

            <h2 className="text-lg font-bold">
              Hapus Kasir?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#9eb2a7]">
              Kamu akan menghapus akun{" "}
              <strong className="text-slate-800 dark:text-[#edf7f1]">
                {modalHapus.username}
              </strong>{" "}
              dengan ID{" "}
              <strong className="font-mono text-slate-800 dark:text-[#edf7f1]">
                {getKasirId(modalHapus)}
              </strong>
              . Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setModalHapus(null)}
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-[#2a4036] dark:bg-[#101a16] dark:text-[#edf7f1] dark:hover:bg-[#17231e]"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={hapusKasir}
                disabled={deleting}
                className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl dark:bg-white dark:text-slate-900">
          {toast}
        </div>
      )}
    </div>
  );
}
