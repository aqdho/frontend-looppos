
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const API_URL = "/api";
const ITEMS_PER_PAGE = 5;

type StockOpnameDetail = {
  product_id: number;
  product_name: string;
  stock_system: number;
  stock_physical: number;
  difference: number;
  category_name?: string | null;
  sku?: string | null;
};

type StockOpnameHistoryItem = {
  id: number;
  total_items: number;
  total_adjustments: number;
  note: string | null;
  created_at: string;
  details: StockOpnameDetail[];
  operator_name?: string | null;
  cashier_name?: string | null;
  shift_name?: string | null;
};

type FilterStatus = "all" | "balanced" | "adjustments";

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDateShort(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function getOperator(opname: StockOpnameHistoryItem) {
  return opname.operator_name || opname.cashier_name || null;
}

function getDifference(detail: StockOpnameDetail) {
  return Number(
    detail.difference ??
      Number(detail.stock_physical) - Number(detail.stock_system),
  );
}

function getSessionStatus(opname: StockOpnameHistoryItem) {
  return Number(opname.total_adjustments || 0) > 0
    ? "adjustments"
    : "balanced";
}

function downloadCsv(opnameList: StockOpnameHistoryItem[]) {
  const rows = [
    [
      "Nomor Opname",
      "Tanggal",
      "Petugas",
      "Catatan",
      "Nama Produk",
      "Stok Sistem",
      "Stok Fisik",
      "Selisih",
      "Status",
    ],
  ];

  opnameList.forEach((opname) => {
    const details = opname.details || [];

    if (details.length === 0) {
      rows.push([
        `Opname #${opname.id}`,
        formatDate(opname.created_at),
        getOperator(opname) || "-",
        opname.note || "-",
        "-",
        "-",
        "-",
        "-",
        Number(opname.total_adjustments || 0) > 0
          ? "Ada penyesuaian"
          : "Cocok",
      ]);

      return;
    }

    details.forEach((detail) => {
      const difference = getDifference(detail);

      rows.push([
        `Opname #${opname.id}`,
        formatDate(opname.created_at),
        getOperator(opname) || "-",
        opname.note || "-",
        detail.product_name || "-",
        String(detail.stock_system),
        String(detail.stock_physical),
        String(difference),
        difference === 0 ? "Cocok" : "Ada selisih",
      ]);
    });
  });

  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `riwayat-opname-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 7v5h-5" />
          <path d="M4 17v-5h5" />
          <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12" />
          <path d="M18.4 15a7 7 0 0 1-11.6 2L4 12" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m7 10 5 5 5-5" />
          <path d="M12 15V3" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );

    case "clipboard":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h3" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "alert":
      return (
        <svg {...common}>
          <path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="10" cy="7" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "file":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6M8 13h8M8 17h8" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );

    case "printer":
      return (
        <svg {...common}>
          <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <path d="M6 14h12v7H6zM18 12h.01" />
        </svg>
      );

    default:
      return null;
  }
}

export default function RiwayatOpnamePage() {
  const [history, setHistory] = useState<StockOpnameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [printSessionId, setPrintSessionId] = useState<number | null>(null);

  const loadHistory = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Sesi login tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/products/stock-opname`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.pesan || "Gagal memuat riwayat stok opname.",
        );
      }

      setHistory(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat riwayat.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const totalProductsChecked = useMemo(
    () =>
      history.reduce(
        (total, opname) => total + Number(opname.total_items || 0),
        0,
      ),
    [history],
  );

  const sessionsWithAdjustments = useMemo(
    () =>
      history.filter(
        (opname) => Number(opname.total_adjustments || 0) > 0,
      ).length,
    [history],
  );

  const totalDetailRows = useMemo(
    () =>
      history.reduce(
        (total, opname) => total + (opname.details || []).length,
        0,
      ),
    [history],
  );

  const matchedDetailRows = useMemo(
    () =>
      history.reduce(
        (total, opname) =>
          total +
          (opname.details || []).filter(
            (detail) => getDifference(detail) === 0,
          ).length,
        0,
      ),
    [history],
  );

  const accuracy =
    totalDetailRows > 0
      ? Math.round((matchedDetailRows / totalDetailRows) * 1000) / 10
      : null;

  const filteredHistory = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return history.filter((opname) => {
      const matchesSearch =
        !keyword ||
        String(opname.id).includes(keyword) ||
        (opname.note || "").toLowerCase().includes(keyword) ||
        (getOperator(opname) || "").toLowerCase().includes(keyword) ||
        (opname.details || []).some((detail) =>
          (detail.product_name || "").toLowerCase().includes(keyword),
        );

      const date = new Date(opname.created_at);
      const validDate = !Number.isNaN(date.getTime());

      const matchesStart =
        !startDate ||
        (validDate && date >= new Date(`${startDate}T00:00:00`));

      const matchesEnd =
        !endDate ||
        (validDate && date <= new Date(`${endDate}T23:59:59.999`));

      const matchesStatus =
        statusFilter === "all" ||
        getSessionStatus(opname) === statusFilter;

      return (
        matchesSearch &&
        matchesStart &&
        matchesEnd &&
        matchesStatus
      );
    });
  }, [history, search, startDate, endDate, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredHistory.length / ITEMS_PER_PAGE),
  );

  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const recentSessions = history.slice(0, 5);

  const recentAdjustedSessions = recentSessions.filter(
    (opname) => Number(opname.total_adjustments || 0) > 0,
  ).length;

  const recentBalancedSessions = recentSessions.length - recentAdjustedSessions;

  const latestDate = history.length
    ? history.reduce((latest, opname) => {
        const date = new Date(opname.created_at);

        if (Number.isNaN(date.getTime())) return latest;

        return !latest || date > latest ? date : latest;
      }, null as Date | null)
    : null;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const handlePrint = (opnameId: number) => {
    setPrintSessionId(opnameId);

    window.setTimeout(() => {
      window.print();
      setPrintSessionId(null);
    }, 100);
  };

  const handleStartOpname = () => {
    window.location.assign("/stock-opname");
  };

  const inputClass =
    "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

  const filterButtonClass = (active: boolean) =>
    `inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-bold transition ${
      active
        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
        : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-700"
    }`;

  return (
    <main
      className={`${plusJakarta.variable} min-h-screen w-full bg-[#F8FAFC] px-4 py-6 text-slate-800 antialiased sm:px-5 md:px-6 lg:px-8`}
      style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
    >
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          body [data-print-session="true"],
          body [data-print-session="true"] * {
            visibility: visible;
          }

          body [data-print-session="true"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 0 !important;
            box-shadow: none !important;
          }

          body [data-print-session="true"] .no-print {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        {/* Header halaman */}
        <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Log tersimpan
              </span>
              <span className="text-xs font-medium text-slate-400">
                Inventaris / Riwayat opname
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Riwayat Stok Opname
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Pantau hasil pemeriksaan stok, telusuri selisih inventaris,
              dan tinjau kembali sesi opname yang sudah tersimpan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadHistory()}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon
                name="refresh"
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Muat ulang
            </button>

            <button
              type="button"
              onClick={() => downloadCsv(filteredHistory)}
              disabled={loading || filteredHistory.length === 0}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="download" className="h-4 w-4" />
              Ekspor laporan
            </button>

            <button
              type="button"
              onClick={handleStartOpname}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#00875A] px-4 text-xs font-extrabold text-white shadow-sm shadow-emerald-900/10 transition hover:bg-[#00704A]"
            >
              <Icon name="plus" className="h-4 w-4" />
              Mulai opname baru
            </button>
          </div>
        </header>

        {/* Kartu ringkasan */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-500">
                  Total sesi opname
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                  {formatNumber(history.length)}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  Seluruh sesi yang tersimpan
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon name="clipboard" className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-500">
                  Total SKU diperiksa
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                  {formatNumber(totalProductsChecked)}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  Akumulasi item dari semua sesi
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Icon name="file" className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-500">
                  Sesi penyesuaian
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-amber-600">
                  {formatNumber(sessionsWithAdjustments)}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  Sesi yang mencatat selisih stok
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Icon name="alert" className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-500">
                  Akurasi inventaris
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                  {accuracy === null ? "—" : `${accuracy}%`}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  Berdasarkan rincian yang tersedia
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Icon name="check" className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        {/* Konten utama */}
        <div className="grid grid-cols-1 items-start gap-6 2xl:grid-cols-12">
          <section className="min-w-0 space-y-4 2xl:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Daftar sesi pemeriksaan
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Cari sesi, periksa rincian produk, dan tinjau selisih
                      inventaris.
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500">
                    <Icon name="clipboard" className="h-4 w-4" />
                    {formatNumber(filteredHistory.length)} sesi ditemukan
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <label className="relative block">
                    <span className="sr-only">Cari riwayat opname</span>
                    <Icon
                      name="search"
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Cari nomor sesi, catatan, petugas, atau produk..."
                      className={`${inputClass} pl-9`}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  >
                    Reset filter
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="relative block">
                    <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Dari tanggal
                    </span>
                    <span className="relative block">
                      <Icon
                        name="calendar"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="date"
                        value={startDate}
                        max={endDate || undefined}
                        onChange={(event) => {
                          setStartDate(event.target.value);
                          setCurrentPage(1);
                        }}
                        className={`${inputClass} pl-9`}
                      />
                    </span>
                  </label>

                  <label className="relative block">
                    <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Sampai tanggal
                    </span>
                    <span className="relative block">
                      <Icon
                        name="calendar"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="date"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={(event) => {
                          setEndDate(event.target.value);
                          setCurrentPage(1);
                        }}
                        className={`${inputClass} pl-9`}
                      />
                    </span>
                  </label>
                </div>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("all");
                      setCurrentPage(1);
                    }}
                    className={filterButtonClass(statusFilter === "all")}
                  >
                    Semua sesi
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                      {history.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("balanced");
                      setCurrentPage(1);
                    }}
                    className={filterButtonClass(
                      statusFilter === "balanced",
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Cocok
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("adjustments");
                      setCurrentPage(1);
                    }}
                    className={filterButtonClass(
                      statusFilter === "adjustments",
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Ada penyesuaian
                  </button>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50/60 p-4 sm:p-5">
                {loading ? (
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-16 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-100 border-t-emerald-600" />
                    <p className="mt-4 text-sm font-bold text-slate-600">
                      Memuat riwayat stok opname...
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Mengambil data sesi yang tersimpan.
                    </p>
                  </div>
                ) : error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-10 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Icon name="alert" />
                    </div>
                    <p className="mt-3 text-sm font-extrabold text-red-700">
                      Gagal memuat riwayat
                    </p>
                    <p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-red-600">
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={() => void loadHistory()}
                      className="mt-4 rounded-lg bg-[#00875A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#00704A]"
                    >
                      Coba lagi
                    </button>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Icon name="clipboard" className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-sm font-extrabold text-slate-700">
                      {history.length === 0
                        ? "Belum ada riwayat stok opname"
                        : "Riwayat tidak ditemukan"}
                    </p>
                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                      {history.length === 0
                        ? "Riwayat akan muncul di sini setelah sesi opname berhasil disimpan."
                        : "Coba kata kunci, tanggal, atau filter status yang berbeda."}
                    </p>
                    {history.length > 0 && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 text-xs font-extrabold text-emerald-700 hover:text-emerald-800"
                      >
                        Hapus semua filter
                      </button>
                    )}
                  </div>
                ) : (
                  paginatedHistory.map((opname) => {
                    const isExpanded = expandedId === opname.id;
                    const adjusted =
                      Number(opname.total_adjustments || 0) > 0;
                    const details = opname.details || [];
                    const operator = getOperator(opname);

                    return (
                      <article
                        key={opname.id}
                        data-print-session={
                          printSessionId === opname.id ? "true" : "false"
                        }
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300"
                      >
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setExpandedId(isExpanded ? null : opname.id)
                          }
                          className="w-full p-4 text-left transition hover:bg-slate-50/70 sm:p-5"
                        >
                          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div className="flex min-w-0 gap-3">
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                  adjusted
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                <Icon
                                  name="clipboard"
                                  className="h-5 w-5"
                                />
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-sm font-extrabold text-slate-900">
                                    Opname #{opname.id}
                                  </h3>

                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-extrabold ${
                                      adjusted
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-emerald-50 text-emerald-700"
                                    }`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        adjusted
                                          ? "bg-amber-500"
                                          : "bg-emerald-500"
                                      }`}
                                    />
                                    {adjusted
                                      ? "Ada penyesuaian"
                                      : "Cocok"}
                                  </span>
                                </div>

                                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                                  <span className="inline-flex items-center gap-1">
                                    <Icon
                                      name="calendar"
                                      className="h-3.5 w-3.5"
                                    />
                                    {formatDate(opname.created_at)}
                                  </span>
                                  {operator && (
                                    <>
                                      <span className="text-slate-300">•</span>
                                      <span className="inline-flex items-center gap-1">
                                        <Icon
                                          name="users"
                                          className="h-3.5 w-3.5"
                                        />
                                        {operator}
                                      </span>
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 md:justify-end">
                              <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-600">
                                {formatNumber(
                                  Number(opname.total_items || 0),
                                )}{" "}
                                produk diperiksa
                              </span>
                              <span
                                className={`rounded-lg px-3 py-2 text-[10px] font-bold ${
                                  adjusted
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {formatNumber(
                                  Number(opname.total_adjustments || 0),
                                )}{" "}
                                penyesuaian
                              </span>
                              <Icon
                                name="chevron"
                                className={`h-4 w-4 text-slate-400 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </div>

                          {opname.note && (
                            <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
                              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Catatan sesi
                              </p>
                              <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-slate-600">
                                {opname.note}
                              </p>
                            </div>
                          )}

                          <p className="no-print mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700">
                            {isExpanded
                              ? "Tutup rincian sesi"
                              : "Lihat rincian produk"}
                            <Icon
                              name="chevron"
                              className={`h-3.5 w-3.5 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </p>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-slate-100">
                            <div className="flex flex-col justify-between gap-3 bg-white px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-800">
                                  Rincian pemeriksaan produk
                                </h4>
                                <p className="mt-1 text-[10px] text-slate-500">
                                  {details.length} baris rincian tersedia
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handlePrint(opname.id)}
                                className="no-print inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-[11px] font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                              >
                                <Icon
                                  name="printer"
                                  className="h-4 w-4"
                                />
                                Cetak berita acara
                              </button>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full min-w-[680px] text-left text-xs">
                                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                                  <tr>
                                    <th className="px-4 py-3 font-extrabold sm:px-5">
                                      Produk
                                    </th>
                                    <th className="px-3 py-3 text-center font-extrabold">
                                      Stok sistem
                                    </th>
                                    <th className="px-3 py-3 text-center font-extrabold">
                                      Fisik dihitung
                                    </th>
                                    <th className="px-3 py-3 text-center font-extrabold">
                                      Selisih
                                    </th>
                                    <th className="px-4 py-3 text-right font-extrabold sm:px-5">
                                      Status
                                    </th>
                                  </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                  {details.map((detail, index) => {
                                    const difference = getDifference(detail);
                                    const hasDifference = difference !== 0;

                                    return (
                                      <tr
                                        key={`${opname.id}-${detail.product_id}-${index}`}
                                        className="transition hover:bg-slate-50/70"
                                      >
                                        <td className="px-4 py-3.5 sm:px-5">
                                          <p className="font-bold text-slate-800">
                                            {detail.product_name || "Produk"}
                                          </p>
                                          {(detail.sku ||
                                            detail.category_name) && (
                                            <p className="mt-1 text-[10px] text-slate-400">
                                              {[
                                                detail.sku,
                                                detail.category_name,
                                              ]
                                                .filter(Boolean)
                                                .join(" • ")}
                                            </p>
                                          )}
                                        </td>

                                        <td className="px-3 py-3.5 text-center font-semibold tabular-nums text-slate-600">
                                          {formatNumber(
                                            Number(detail.stock_system || 0),
                                          )}
                                        </td>

                                        <td className="px-3 py-3.5 text-center font-semibold tabular-nums text-slate-600">
                                          {formatNumber(
                                            Number(detail.stock_physical || 0),
                                          )}
                                        </td>

                                        <td
                                          className={`px-3 py-3.5 text-center font-extrabold tabular-nums ${
                                            difference < 0
                                              ? "text-red-600"
                                              : difference > 0
                                                ? "text-emerald-700"
                                                : "text-slate-400"
                                          }`}
                                        >
                                          {difference > 0 ? "+" : ""}
                                          {formatNumber(difference)}
                                        </td>

                                        <td className="px-4 py-3.5 text-right sm:px-5">
                                          <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-extrabold ${
                                              hasDifference
                                                ? "bg-amber-50 text-amber-700"
                                                : "bg-emerald-50 text-emerald-700"
                                            }`}
                                          >
                                            {hasDifference ? (
                                              <Icon
                                                name="alert"
                                                className="h-3 w-3"
                                              />
                                            ) : (
                                              <Icon
                                                name="check"
                                                className="h-3 w-3"
                                              />
                                            )}
                                            {hasDifference
                                              ? "Selisih"
                                              : "Cocok"}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}

                                  {details.length === 0 && (
                                    <tr>
                                      <td
                                        colSpan={5}
                                        className="px-4 py-10 text-center text-xs text-slate-500"
                                      >
                                        Rincian produk belum tersedia dari
                                        server.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                              <div className="flex flex-wrap items-center gap-4 text-[10px] font-semibold text-slate-500">
                                <span>
                                  Total produk:{" "}
                                  <strong className="text-slate-800">
                                    {formatNumber(
                                      Number(opname.total_items || 0),
                                    )}
                                  </strong>
                                </span>
                                <span>
                                  Total penyesuaian:{" "}
                                  <strong className="text-amber-700">
                                    {formatNumber(
                                      Number(
                                        opname.total_adjustments || 0,
                                      ),
                                    )}
                                  </strong>
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => downloadCsv([opname])}
                                className="no-print inline-flex items-center justify-center gap-2 text-[11px] font-extrabold text-emerald-700 transition hover:text-emerald-800"
                              >
                                <Icon
                                  name="download"
                                  className="h-4 w-4"
                                />
                                Unduh rincian CSV
                              </button>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })
                )}
              </div>

              {!loading && !error && filteredHistory.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <p className="text-[11px] text-slate-500">
                    Menampilkan{" "}
                    <strong className="text-slate-700">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        filteredHistory.length,
                      )}
                    </strong>{" "}
                    dari{" "}
                    <strong className="text-slate-700">
                      {filteredHistory.length}
                    </strong>{" "}
                    sesi
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Sebelumnya
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    )
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1,
                      )
                      .map((page, index, pages) => (
                        <span
                          key={page}
                          className="contents"
                        >
                          {index > 0 && pages[index - 1] !== page - 1 && (
                            <span className="px-1 text-xs text-slate-400">
                              …
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            aria-current={
                              currentPage === page ? "page" : undefined
                            }
                            className={`h-9 min-w-9 rounded-lg px-3 text-xs font-extrabold transition ${
                              currentPage === page
                                ? "bg-[#00875A] text-white"
                                : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        </span>
                      ))}

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1),
                        )
                      }
                      className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Panel informasi samping */}
          <aside className="space-y-5 2xl:col-span-4">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Ringkasan rekonsiliasi
                  </h2>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Ringkasan dari lima sesi terbaru yang tersedia.
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name="check" className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-600">
                    Sesi tanpa penyesuaian
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {recentSessions.length
                      ? Math.round(
                          (recentBalancedSessions / recentSessions.length) *
                            100,
                        )
                      : 0}
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${
                        recentSessions.length
                          ? (recentBalancedSessions /
                              recentSessions.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Icon name="check" className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold">Cocok</span>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-emerald-800">
                    {recentBalancedSessions}
                  </p>
                  <p className="mt-1 text-[10px] text-emerald-700/80">
                    Sesi seimbang
                  </p>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                  <div className="flex items-center gap-1.5 text-amber-700">
                    <Icon name="alert" className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold">
                      Penyesuaian
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-amber-800">
                    {recentAdjustedSessions}
                  </p>
                  <p className="mt-1 text-[10px] text-amber-700/80">
                    Sesi berselisih
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <Icon
                  name="clock"
                  className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Pemeriksaan terakhir
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {latestDate
                      ? formatDate(latestDate.toISOString())
                      : "Belum ada pemeriksaan"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Informasi petugas
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Petugas yang tercatat pada data sesi.
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon name="users" className="h-4 w-4" />
                </div>
              </div>

              {history.some((opname) => getOperator(opname)) ? (
                <div className="mt-4 space-y-3">
                  {Array.from(
                    new Set(
                      history
                        .map((opname) => getOperator(opname))
                        .filter((name): name is string => Boolean(name)),
                    ),
                  )
                    .slice(0, 4)
                    .map((name) => {
                      const sessions = history.filter(
                        (opname) => getOperator(opname) === name,
                      ).length;

                      return (
                        <div
                          key={name}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-extrabold text-slate-600">
                              {name
                                .split(" ")
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-700">
                                {name}
                              </p>
                              <p className="mt-0.5 text-[10px] text-slate-400">
                                Petugas tercatat
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-extrabold text-slate-600">
                            {sessions} sesi
                          </span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-600">
                    Data petugas belum tersedia
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Informasi petugas akan ditampilkan jika nama operator
                    disertakan oleh API riwayat opname.
                  </p>
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl bg-[#12382D] text-white shadow-sm">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      Panduan operasional
                    </span>
                    <h2 className="mt-4 text-lg font-extrabold tracking-tight">
                      SOP Opname Toko
                    </h2>
                    <p className="mt-2 text-xs leading-5 text-emerald-100/75">
                      Protokol pemeriksaan dan validasi stok agar pencatatan
                      inventaris tetap konsisten.
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                    <Icon name="clipboard" className="h-5 w-5" />
                  </div>
                </div>

                <div className="my-5 h-px bg-white/10" />

                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200/70">
                  Protokol validasi stok
                </p>

                <ul className="mt-4 space-y-3">
                  {[
                    "Hitung stok fisik berdasarkan produk yang diperiksa.",
                    "Bandingkan jumlah fisik dengan stok sistem.",
                    "Periksa kembali setiap perbedaan sebelum menyimpan.",
                    "Tinjau riwayat untuk memastikan penyesuaian tercatat.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      <span className="text-[11px] leading-5 text-emerald-50/90">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={handleStartOpname}
                  className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-[#12382D] transition hover:bg-emerald-50"
                >
                  Buka lembar opname baru
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </div>
            </section>

            <div className="px-2 pb-2 text-center text-[10px] leading-5 text-slate-400">
              <p className="font-bold text-slate-500">
                LoopPOS Inventory
              </p>
              <p>Riwayat pemeriksaan stok tersimpan melalui sistem.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
