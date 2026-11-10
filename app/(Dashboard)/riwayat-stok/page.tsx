"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const API_URL = "/api";

type StockMovement = {
  id?: number | string;
  product_id?: number | string;
  nama_produk?: string;
  product_name?: string;
  nama?: string;
  sku?: string;
  kode_produk?: string;
  gambar?: string | null;
  movement_type?: string;
  quantity?: number | string;
  stock_before?: number | string;
  stock_after?: number | string;
  note?: string;
  source_type?: string;
  created_at?: string;
  actor_name?: string;
  created_by_name?: string;
};

type ProductImage = {
  id: number | string;
  gambar?: string | null;
};

type FilterType = "all" | "stock_in" | "stock_out" | "opname";
type DateRange = "today" | "7days" | "month";

const numberFormat = new Intl.NumberFormat("id-ID");

function formatNumber(value: number) {
  return numberFormat.format(value);
}

function getProductName(item: StockMovement) {
  return (
    item.nama_produk ||
    item.product_name ||
    item.nama ||
    `Produk #${item.product_id ?? "-"}`
  );
}


const API_ORIGIN =
  "https://belajar-express-production-7cfb.up.railway.app";

function getProductImage(gambar?: string | null) {
  if (!gambar?.trim()) return null;

  const value = gambar.trim();

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${API_ORIGIN}/${value.replace(/^\/+/, "")}`;
}


function getType(item: StockMovement): FilterType | "adjustment" {
  const type = String(item.movement_type || "").toLowerCase();
  const source = String(item.source_type || "").toLowerCase();
  const note = String(item.note || "").toLowerCase();

  if (
    source.includes("opname") ||
    note.includes("opname") ||
    type.includes("opname")
  ) {
    return "opname";
  }

  if (
    type === "stock_in" ||
    type === "in" ||
    type === "masuk" ||
    type.includes("stock_in")
  ) {
    return "stock_in";
  }

  if (
    type === "stock_out" ||
    type === "out" ||
    type === "keluar" ||
    type.includes("stock_out")
  ) {
    return "stock_out";
  }

  return "adjustment";
}

function getQuantity(item: StockMovement) {
  const type = getType(item);
  const quantity = Math.abs(Number(item.quantity ?? 0));

  if (type === "stock_in") return quantity;
  if (type === "stock_out") return -quantity;

  const before = Number(item.stock_before);
  const after = Number(item.stock_after);

  if (
    item.stock_before !== undefined &&
    item.stock_after !== undefined &&
    Number.isFinite(before) &&
    Number.isFinite(after)
  ) {
    return after - before;
  }

  return Number(item.quantity ?? 0);
}

function getDate(item: StockMovement) {
  if (!item.created_at) return null;

  const date = new Date(item.created_at);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date | null) {
  if (!date) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: Date | null) {
  if (!date) return "-";

  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSourceLabel(item: StockMovement) {
  const source = String(item.source_type || "").toLowerCase();
  const note = String(item.note || "").toLowerCase();
  const type = getType(item);

  if (type === "opname") return "Penyesuaian stok opname";
  if (source === "transaksi") return "Penjualan";
  if (source === "product_created") return "Stok awal produk";
  if (note.includes("edit produk")) return "Edit produk";
  if (type === "stock_in") return "Stok masuk";
  if (type === "stock_out") return "Stok keluar";

  return item.note || item.source_type || "Penyesuaian stok";
}

function getMovementLabel(item: StockMovement) {
  const type = getType(item);

  if (type === "opname") return "Stock Opname";
  if (type === "stock_in") return "Stok Masuk";
  if (type === "stock_out") return "Stok Keluar";

  return "Penyesuaian";
}

function isWithinRange(date: Date, range: DateRange) {
  const now = new Date();
  const start = new Date(now);

  if (range === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (range === "7days") {
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return date >= start && date <= now;
}

function downloadCsv(movements: StockMovement[]) {
  const headers = [
    "Waktu",
    "Produk",
    "ID Produk",
    "SKU",
    "Jenis Mutasi",
    "Jumlah",
    "Stok Sebelum",
    "Stok Sesudah",
    "Catatan",
    "Sumber",
  ];

  const escapeCsv = (value: unknown) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const rows = movements.map((item) => [
    item.created_at
      ? new Date(item.created_at).toLocaleString("id-ID")
      : "",
    getProductName(item),
    item.product_id ?? "",
    item.sku || item.kode_produk || "",
    getSourceLabel(item),
    getQuantity(item),
    item.stock_before ?? "",
    item.stock_after ?? "",
    item.note || "",
    item.source_type || "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `riwayat-pergerakan-stok-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function RiwayatStokPage() {
  const router = useRouter();

  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [productImages, setProductImages] = useState<
    Record<string, string>
  >({});
  const [loadingStockMovements, setLoadingStockMovements] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [dateRange, setDateRange] = useState<DateRange>("7days");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const loadStockMovements = useCallback(async () => {
    setLoadingStockMovements(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");
      }

      const res = await fetch(`${API_URL}/products/stock-movements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.pesan || "Gagal mengambil riwayat stok.");
      }

      setStockMovements(Array.isArray(result.data) ? result.data : []);

      // Ambil gambar terbaru dari data produk, bukan hanya dari riwayat mutasi.
      try {
        const productsRes = await fetch(`${API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (productsRes.ok) {
          const productsResult = await productsRes.json();

          const products: ProductImage[] = Array.isArray(productsResult)
            ? productsResult
            : Array.isArray(productsResult.data)
              ? productsResult.data
              : Array.isArray(productsResult.data?.products)
                ? productsResult.data.products
                : Array.isArray(productsResult.products)
                  ? productsResult.products
                  : Array.isArray(productsResult.data?.data)
                    ? productsResult.data.data
                    : [];

          const images: Record<string, string> = {};

          products.forEach((product) => {
            if (product.id != null && product.gambar?.trim()) {
              images[String(product.id)] = product.gambar.trim();
            }
          });

          setProductImages(images);
        }
      } catch (error) {
        console.error("Gagal mengambil gambar produk terbaru:", error);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat stok:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Riwayat stok gagal dimuat. Periksa koneksi server."
      );
    } finally {
      setLoadingStockMovements(false);
    }
  }, []);

  useEffect(() => {
    void loadStockMovements();
  }, [loadStockMovements]);

  const filteredMovements = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return stockMovements
      .filter((item) => {
        const type = getType(item);

        if (activeFilter === "stock_in" && type !== "stock_in") return false;
        if (activeFilter === "stock_out" && type !== "stock_out") return false;
        if (activeFilter === "opname" && type !== "opname") return false;

        const date = getDate(item);
        if (!date || !isWithinRange(date, dateRange)) return false;

        if (selectedProduct && getProductName(item) !== selectedProduct) {
          return false;
        }

        if (query) {
          const searchable = [
            getProductName(item),
            item.product_id,
            item.sku,
            item.kode_produk,
            item.note,
            item.source_type,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (!searchable.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = getDate(a)?.getTime() ?? 0;
        const dateB = getDate(b)?.getTime() ?? 0;
        return dateB - dateA;
      });
  }, [
    stockMovements,
    activeFilter,
    dateRange,
    searchQuery,
    selectedProduct,
  ]);

  const summary = useMemo(() => {
    const incoming = filteredMovements.reduce((total, item) => {
      return getQuantity(item) > 0 ? total + getQuantity(item) : total;
    }, 0);

    const outgoing = filteredMovements.reduce((total, item) => {
      return getQuantity(item) < 0
        ? total + Math.abs(getQuantity(item))
        : total;
    }, 0);

    const reasons = new Map<string, number>();

    filteredMovements.forEach((item) => {
      const label = getSourceLabel(item);
      reasons.set(label, (reasons.get(label) || 0) + 1);
    });

    const topReasons = Array.from(reasons.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const productCounts = new Map<string, number>();

    filteredMovements.forEach((item) => {
      const name = getProductName(item);
      productCounts.set(name, (productCounts.get(name) || 0) + 1);
    });

    const activeProducts = Array.from(productCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const largestMovement = filteredMovements.reduce<{
      item: StockMovement | null;
      quantity: number;
    }>(
      (largest, item) => {
        const quantity = Math.abs(getQuantity(item));

        return quantity > largest.quantity
          ? { item, quantity }
          : largest;
      },
      { item: null, quantity: 0 }
    );

    return {
      incoming,
      outgoing,
      net: incoming - outgoing,
      total: filteredMovements.length,
      topReasons,
      activeProducts,
      largestMovement,
    };
  }, [filteredMovements]);

  const totalPages = Math.max(1, Math.ceil(filteredMovements.length / pageSize));

  const paginatedMovements = filteredMovements.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [activeFilter, dateRange, searchQuery, selectedProduct]);

  const todayLabel = useMemo(() => formatDate(new Date()), []);

  const filterOptions: {
    id: FilterType;
    label: string;
  }[] = [
    { id: "all", label: "Semua Mutasi" },
    { id: "stock_in", label: "Stok Masuk" },
    { id: "stock_out", label: "Stok Keluar" },
    { id: "opname", label: "Opname Sesi" },
  ];

  return (
    <main
      className={`${plusJakarta.variable} min-h-screen w-full bg-[#f5f8f7] px-4 py-6 text-[#172b24] antialiased transition-colors sm:px-5 md:px-6 lg:px-8 dark:bg-[#0b1411] dark:text-[#edf7f1]`}
      style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#819087] dark:text-[#a7b8ae]">
              <span>Produk &amp; Inventaris</span>
              <span className="text-[#b5c4bc]">/</span>
              <span className="text-[#08794f] dark:text-[#83ddb0]">
                Audit Mutasi Stok
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Riwayat Pergerakan Stok
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c8ead7] bg-[#e5f8ed] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#08794f] dark:border-[#28533d] dark:bg-[#163325] dark:text-[#8de0b7]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0b9963]" />
                Live Audit Feed
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#74847b] dark:text-[#a7b8ae]">
              Pantau seluruh aktivitas stok masuk, stok keluar, dan penyesuaian
              inventaris dalam satu tampilan audit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-[#e0e9e3] bg-white p-1 shadow-sm dark:border-[#29483a] dark:bg-[#14231c]">
              {(
                [
                  ["today", "Hari Ini"],
                  ["7days", "7 Hari"],
                  ["month", "Bulan Ini"],
                ] as [DateRange, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDateRange(value)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    dateRange === value
                      ? "bg-[#08794f] text-white shadow-sm"
                      : "text-[#718078] hover:bg-[#f1f7f3] hover:text-[#08794f] dark:text-[#b3c4b9] dark:hover:bg-[#1d3327]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => downloadCsv(filteredMovements)}
              disabled={loadingStockMovements || filteredMovements.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce7e0] bg-white px-4 py-3 text-xs font-bold text-[#365247] shadow-sm transition hover:border-[#b6d8c3] hover:bg-[#f2faf5] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#29483a] dark:bg-[#14231c] dark:text-[#d3e5d9] dark:hover:bg-[#1d3327]"
            >
              <span aria-hidden="true">↓</span>
              Ekspor XLS
            </button>

            <button
              type="button"
              onClick={() => void loadStockMovements()}
              disabled={loadingStockMovements}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#08794f] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#066540] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                aria-hidden="true"
                className={loadingStockMovements ? "animate-spin" : ""}
              >
                ↻
              </span>
              {loadingStockMovements ? "Sinkronisasi..." : "Sinkronisasi"}
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="relative overflow-hidden rounded-2xl border border-[#dce9e1] bg-white p-5 shadow-[0_2px_12px_rgba(22,65,42,0.035)] dark:border-[#263b31] dark:bg-[#111f18]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#77877d] dark:text-[#a7b8ae]">
                  Total Volume Mutasi
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight">
                  {formatNumber(summary.total)}
                  <span className="ml-1.5 text-xs font-semibold text-[#87958d]">
                    catatan
                  </span>
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3f7eb] text-xl text-[#08794f] dark:bg-[#193b29] dark:text-[#8de0b7]">
                ↗
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-[#7c8c82]">
                <span>Net pergerakan stok</span>
                <span
                  className={
                    summary.net >= 0 ? "text-[#08794f]" : "text-[#c53c3c]"
                  }
                >
                  {summary.net > 0 ? "+" : ""}
                  {formatNumber(summary.net)} unit
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#eaf0ec] dark:bg-[#25372c]">
                <div
                  className={`h-full rounded-full ${
                    summary.net < 0 ? "bg-[#d74c4c]" : "bg-[#0c9962]"
                  }`}
                  style={{
                    width: `${
                      summary.incoming + summary.outgoing === 0
                        ? 0
                        : Math.min(
                            100,
                            (Math.abs(summary.net) /
                              (summary.incoming + summary.outgoing)) *
                              100
                          )
                    }%`,
                  }}
                />
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#dce9e1] bg-white p-5 shadow-[0_2px_12px_rgba(22,65,42,0.035)] dark:border-[#263b31] dark:bg-[#111f18]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#77877d] dark:text-[#a7b8ae]">
                  Stok Masuk
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#08794f]">
                  +{formatNumber(summary.incoming)}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3f7eb] text-xl text-[#08794f] dark:bg-[#193b29] dark:text-[#8de0b7]">
                ↑
              </div>
            </div>
            <p className="mt-5 text-[11px] text-[#849188] dark:text-[#a7b8ae]">
              Total unit masuk dalam periode terpilih
            </p>
          </article>

          <article className="rounded-2xl border border-[#dce9e1] bg-white p-5 shadow-[0_2px_12px_rgba(22,65,42,0.035)] dark:border-[#263b31] dark:bg-[#111f18]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#77877d] dark:text-[#a7b8ae]">
                  Stok Keluar
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#c53c3c]">
                  −{formatNumber(summary.outgoing)}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffebe8] text-xl text-[#c53c3c] dark:bg-[#402320] dark:text-[#ffaaa2]">
                ↓
              </div>
            </div>
            <p className="mt-5 text-[11px] text-[#849188] dark:text-[#a7b8ae]">
              Total unit keluar dalam periode terpilih
            </p>
          </article>

          <article className="rounded-2xl border border-[#dce9e1] bg-white p-5 shadow-[0_2px_12px_rgba(22,65,42,0.035)] dark:border-[#263b31] dark:bg-[#111f18]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#77877d] dark:text-[#a7b8ae]">
                  Penyesuaian Terbesar
                </p>
                <p className="mt-3 truncate text-lg font-extrabold tracking-tight">
                  {summary.largestMovement.item
                    ? getProductName(summary.largestMovement.item)
                    : "Belum ada data"}
                </p>
                <p className="mt-1 text-xs font-bold text-[#08794f]">
                  {summary.largestMovement.item
                    ? `${getQuantity(summary.largestMovement.item) > 0 ? "+" : ""}${formatNumber(
                        getQuantity(summary.largestMovement.item)
                      )} unit`
                    : "Tidak ada mutasi pada periode ini"}
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf1ff] text-xl text-[#5266a7] dark:bg-[#252f4b] dark:text-[#aebdff]">
                ◈
              </div>
            </div>
            <p className="mt-4 truncate text-[10px] text-[#849188] dark:text-[#a7b8ae]">
              {summary.largestMovement.item
                ? getSourceLabel(summary.largestMovement.item)
                : "Berdasarkan data yang tersedia"}
            </p>
          </article>
        </section>

        <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
          <div className="min-w-0 xl:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-[#dce9e1] bg-white shadow-[0_2px_12px_rgba(22,65,42,0.035)] dark:border-[#263b31] dark:bg-[#111f18]">
              <div className="border-b border-[#e7eee9] p-5 dark:border-[#263b31] sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-base font-extrabold">
                      Ledger Pergerakan Stok
                    </h2>
                    <p className="mt-1.5 text-xs leading-5 text-[#829087] dark:text-[#a7b8ae]">
                      Jejak audit perubahan stok produk secara kronologis.
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#f0f7f2] px-3 py-2 text-[10px] font-bold text-[#47735b] dark:bg-[#1b3023] dark:text-[#a8d8b9]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0c9962]" />
                    {formatNumber(filteredMovements.length)} catatan ditemukan
                  </span>
                </div>

                <div className="mt-5 flex gap-1 overflow-x-auto border-b border-[#e8eee9] dark:border-[#263b31]">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`-mb-px shrink-0 border-b-2 px-3 py-3 text-xs font-bold transition sm:px-4 ${
                        activeFilter === filter.id
                          ? "border-[#08794f] text-[#08794f] dark:text-[#8de0b7]"
                          : "border-transparent text-[#87958c] hover:text-[#365247] dark:text-[#a7b8ae] dark:hover:text-white"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {loadingStockMovements ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dce9e1] border-t-[#08794f]" />
                  <p className="text-sm text-[#7d8c83]">
                    Memuat riwayat pergerakan stok...
                  </p>
                </div>
              ) : errorMessage ? (
                <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffebe8] text-xl text-[#c53c3c]">
                    !
                  </div>
                  <p className="mt-4 max-w-lg text-sm font-semibold text-[#ba1a1a]">
                    {errorMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => void loadStockMovements()}
                    className="mt-4 rounded-xl bg-[#08794f] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#066540]"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : filteredMovements.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf5ef] text-2xl text-[#648775] dark:bg-[#1b3023] dark:text-[#a8d8b9]">
                    ◷
                  </div>
                  <h3 className="mt-4 text-sm font-extrabold">
                    Tidak ada mutasi stok
                  </h3>
                  <p className="mt-2 max-w-sm text-xs leading-5 text-[#829087] dark:text-[#a7b8ae]">
                    Tidak ditemukan catatan yang sesuai dengan periode dan
                    filter yang dipilih.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter("all");
                      setDateRange("month");
                      setSearchQuery("");
                      setSelectedProduct("");
                    }}
                    className="mt-4 text-xs font-bold text-[#08794f] hover:underline dark:text-[#8de0b7]"
                  >
                    Tampilkan semua mutasi bulan ini
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 bg-[#f7faf8] px-5 py-3 dark:bg-[#16241c] sm:px-6">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#718078] dark:text-[#a7b8ae]">
                      Aktivitas terbaru
                    </p>
                    <p className="text-[10px] font-semibold text-[#8b9990]">
                      {todayLabel}
                    </p>
                  </div>

                  <div className="divide-y divide-[#edf2ee] dark:divide-[#263b31]">
                    {paginatedMovements.map((item, index) => {
                      const type = getType(item);
                      const quantity = getQuantity(item);
                      const incoming = quantity > 0;
                      const outgoing = quantity < 0;
                      const date = getDate(item);
                      const productCode =
                        item.sku || item.kode_produk || null;
                      const actor =
                        item.actor_name || item.created_by_name || null;
                      const currentProductImage =
                        productImages[String(item.product_id ?? "")];

                      const imageUrl = getProductImage(
                        currentProductImage || item.gambar
                      );

                      return (
                        <article
                          key={
                            item.id ??
                            `${item.product_id}-${item.created_at}-${index}`
                          }
                          className="px-5 py-5 transition hover:bg-[#fbfdfb] dark:hover:bg-[#15231b] sm:px-6"
                        >
                          <div className="flex gap-3 sm:gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e0e9e3] bg-[#edf5ef] text-xl text-[#08794f] dark:border-[#29483a] dark:bg-[#1b3023] dark:text-[#8de0b7]">
                              {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={getProductName(item)}
                                loading="lazy"
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                  const placeholder = event.currentTarget
                                    .parentElement?.querySelector("[data-image-placeholder]");

                                  placeholder?.classList.remove("hidden");
                                }}
                              />
                            ) : null}

                            <span
                              data-image-placeholder
                              aria-hidden="true"
                              className={imageUrl ? "hidden" : ""}
                            >
                              ▤
                            </span>
                            </div>

                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                                incoming
                                  ? "bg-[#e2f7eb] text-[#08794f] dark:bg-[#193b29] dark:text-[#8de0b7]"
                                  : outgoing
                                    ? "bg-[#ffebe8] text-[#c53c3c] dark:bg-[#402320] dark:text-[#ffaaa2]"
                                    : "bg-[#edf1ff] text-[#5266a7] dark:bg-[#252f4b] dark:text-[#aebdff]"
                              }`}
                            >
                              {incoming ? "↑" : outgoing ? "↓" : "↔"}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                <div className="min-w-0">
                                  <h3 className="break-words text-sm font-extrabold">
                                    {getProductName(item)}
                                  </h3>

                                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-medium text-[#89968e]">
                                      {productCode
                                        ? `SKU: ${productCode}`
                                        : `ID Produk: ${item.product_id ?? "-"}`}
                                    </span>

                                    <span className="h-1 w-1 rounded-full bg-[#c0cbc3]" />

                                    <span
                                      className={`rounded-md px-2 py-1 text-[9px] font-extrabold ${
                                        incoming
                                          ? "bg-[#e2f7eb] text-[#08794f] dark:bg-[#193b29] dark:text-[#8de0b7]"
                                          : outgoing
                                            ? "bg-[#ffebe8] text-[#c53c3c] dark:bg-[#402320] dark:text-[#ffaaa2]"
                                            : "bg-[#edf1ff] text-[#5266a7] dark:bg-[#252f4b] dark:text-[#aebdff]"
                                      }`}
                                    >
                                      {getMovementLabel(item)}
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0 sm:text-right">
                                  <p
                                    className={`text-lg font-extrabold tracking-tight ${
                                      incoming
                                        ? "text-[#08794f]"
                                        : outgoing
                                          ? "text-[#c53c3c]"
                                          : "text-[#5266a7] dark:text-[#aebdff]"
                                    }`}
                                  >
                                    {quantity > 0 ? "+" : ""}
                                    {formatNumber(quantity)}
                                  </p>
                                  <p className="mt-0.5 text-[10px] text-[#89968e]">
                                    unit
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl bg-[#f6f9f7] p-3 dark:bg-[#17261d] sm:flex-row sm:items-center">
                                <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                                  <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#89968e]">
                                      Stok Sebelum
                                    </p>
                                    <p className="mt-1 text-xs font-bold">
                                      {item.stock_before !== undefined
                                        ? formatNumber(
                                            Number(item.stock_before)
                                          )
                                        : "-"}
                                    </p>
                                  </div>

                                  <span className="text-[#b2c0b7]">→</span>

                                  <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#89968e]">
                                      Stok Sesudah
                                    </p>
                                    <p className="mt-1 text-xs font-extrabold">
                                      {item.stock_after !== undefined
                                        ? formatNumber(Number(item.stock_after))
                                        : "-"}
                                    </p>
                                  </div>
                                </div>

                                <div className="min-w-0 sm:max-w-[48%] sm:text-right">
                                  <p className="truncate text-[10px] font-semibold text-[#52685b] dark:text-[#bfd1c4]">
                                    {item.note || item.source_type || "Tanpa catatan"}
                                  </p>
                                  <p className="mt-1 text-[10px] text-[#89968e]">
                                    {formatDate(date)} · {formatTime(date)}
                                    {actor ? ` · ${actor}` : ""}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="flex flex-col justify-between gap-3 border-t border-[#e7eee9] px-5 py-4 dark:border-[#263b31] sm:flex-row sm:items-center sm:px-6">
                    <p className="text-[10px] text-[#829087] dark:text-[#a7b8ae]">
                      Menampilkan{" "}
                      <span className="font-bold text-[#365247] dark:text-[#d3e5d9]">
                        {(page - 1) * pageSize + 1}–
                        {Math.min(page * pageSize, filteredMovements.length)}
                      </span>{" "}
                      dari{" "}
                      <span className="font-bold text-[#365247] dark:text-[#d3e5d9]">
                        {formatNumber(filteredMovements.length)}
                      </span>{" "}
                      catatan
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((current) => current - 1)}
                        className="rounded-lg border border-[#dce7e0] px-3 py-2 text-xs font-bold text-[#52685b] transition hover:bg-[#f1f7f3] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29483a] dark:text-[#d3e5d9] dark:hover:bg-[#1d3327]"
                      >
                        Sebelumnya
                      </button>

                      <span className="min-w-16 text-center text-xs font-bold text-[#52685b] dark:text-[#d3e5d9]">
                        {page} / {totalPages}
                      </span>

                      <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((current) => current + 1)}
                        className="rounded-lg border border-[#dce7e0] px-3 py-2 text-xs font-bold text-[#52685b] transition hover:bg-[#f1f7f3] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29483a] dark:text-[#d3e5d9] dark:hover:bg-[#1d3327]"
                      >
                        Berikutnya
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <aside className="flex min-w-0 flex-col gap-5 xl:col-span-4">
            <section className="rounded-2xl border border-[#dce9e1] bg-white p-5 shadow-[0_2px_12px_rgba(22,65,42,0.035)] dark:border-[#263b31] dark:bg-[#111f18] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-extrabold">Pencarian SKU Cepat</h2>
                <span className="text-lg text-[#08794f]">⌕</span>
              </div>

              <p className="mt-1.5 text-xs leading-5 text-[#829087] dark:text-[#a7b8ae]">
                Cari produk berdasarkan nama, SKU, atau ID produk.
              </p>

              <div className="relative mt-4">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b9990]">
                  ⌕
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Masukkan nama atau SKU..."
                  className="w-full rounded-xl border border-[#dce7e0] bg-[#f8faf8] py-3 pl-9 pr-3 text-xs text-[#172b24] outline-none transition placeholder:text-[#a0aca4] focus:border-[#0c9962] focus:ring-2 focus:ring-[#0c9962]/10 dark:border-[#29483a] dark:bg-[#17261d] dark:text-[#edf7f1] dark:placeholder:text-[#718078]"
                />
              </div>

              <div className="mt-5">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-wider text-[#89968e]">
                  Produk paling aktif
                </p>

                {summary.activeProducts.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {summary.activeProducts.map((product) => (
                      <button
                        key={product.name}
                        type="button"
                        onClick={() =>
                          setSelectedProduct((current) =>
                            current === product.name ? "" : product.name
                          )
                        }
                        className={`inline-flex max-w-full items-center gap-2 rounded-lg border px-3 py-2 text-[10px] font-bold transition ${
                          selectedProduct === product.name
                            ? "border-[#08794f] bg-[#e3f7eb] text-[#08794f] dark:border-[#3a8059] dark:bg-[#193b29] dark:text-[#8de0b7]"
                            : "border-[#e0e9e3] bg-white text-[#52685b] hover:border-[#b6d8c3] dark:border-[#29483a] dark:bg-[#14231c] dark:text-[#c2d5c8]"
                        }`}
                      >
                        <span className="max-w-36 truncate">{product.name}</span>
                        <span className="rounded-md bg-[#edf3ef] px-1.5 py-0.5 text-[9px] dark:bg-[#24382b]">
                          {product.count}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#89968e]">
                    Belum ada produk dalam periode ini.
                  </p>
                )}

                {selectedProduct && (
                  <button
                    type="button"
                    onClick={() => setSelectedProduct("")}
                    className="mt-3 text-[10px] font-bold text-[#08794f] hover:underline dark:text-[#8de0b7]"
                  >
                    Hapus filter produk
                  </button>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#dce9e1] bg-white p-5 shadow-[0_2px_12px_rgba(22,65,42,0.035)] dark:border-[#263b31] dark:bg-[#111f18] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-extrabold">Alasan Pergerakan</h2>
                  <p className="mt-1 text-[10px] text-[#829087] dark:text-[#a7b8ae]">
                    Distribusi berdasarkan catatan mutasi.
                  </p>
                </div>
                <span className="text-lg text-[#08794f]">▤</span>
              </div>

              {summary.topReasons.length > 0 ? (
                <div className="mt-6 space-y-5">
                  {summary.topReasons.map((reason, index) => {
                    const percentage =
                      summary.total > 0
                        ? (reason.count / summary.total) * 100
                        : 0;

                    return (
                      <div key={reason.label}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="truncate text-xs font-semibold text-[#52685b] dark:text-[#d3e5d9]">
                            {reason.label}
                          </span>
                          <span className="shrink-0 text-[10px] font-extrabold text-[#365247] dark:text-[#d3e5d9]">
                            {reason.count}{" "}
                            <span className="font-medium text-[#89968e]">
                              ({Math.round(percentage)}%)
                            </span>
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[#edf2ee] dark:bg-[#25372c]">
                          <div
                            className={`h-full rounded-full ${
                              index === 0
                                ? "bg-[#08794f]"
                                : index === 1
                                  ? "bg-[#4ca77c]"
                                  : index === 2
                                    ? "bg-[#8cc5a4]"
                                    : "bg-[#b7d9c3]"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-[#f6f9f7] p-5 text-center dark:bg-[#17261d]">
                  <p className="text-xs text-[#829087] dark:text-[#a7b8ae]">
                    Belum ada data alasan pergerakan.
                  </p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-[#e7eee9] pt-4 dark:border-[#263b31]">
                <span className="text-[10px] text-[#829087] dark:text-[#a7b8ae]">
                  Total catatan
                </span>
                <span className="text-xs font-extrabold">
                  {formatNumber(summary.total)}
                </span>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-[#103d2b] p-6 text-white shadow-[0_8px_24px_rgba(16,61,43,0.12)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border-[24px] border-white/[0.05]" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full border-[24px] border-white/[0.04]" />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-xl">
                  ◈
                </div>

                <h2 className="mt-5 text-base font-extrabold">
                  Audit Cepat Kasir
                </h2>

                <p className="mt-2 text-xs leading-6 text-[#c0d9ca]">
                  Periksa kesesuaian stok fisik dengan catatan sistem melalui
                  sesi Stock Opname.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/stock-opname")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-extrabold text-[#103d2b] transition hover:bg-[#e8f5ec]"
                >
                  Buka Lembar Opname Cepat
                  <span aria-hidden="true">→</span>
                </button>

                <p className="mt-3 text-center text-[9px] text-[#b3d0be]">
                  Selisih stok dapat dicatat melalui proses opname.
                </p>
              </div>
            </section>
          </aside>
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-[#e0e9e3] py-4 text-[10px] text-[#89968e] dark:border-[#263b31] sm:flex-row sm:items-center">
          <p>
            Riwayat Pergerakan Stok · Data mengikuti catatan yang tersedia di
            server.
          </p>
          <p>LoopPOS Inventory Audit</p>
        </footer>
      </div>
    </main>
  );
}