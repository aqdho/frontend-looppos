
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const API_URL = "/api";
const MAX_NOTE_LENGTH = 150;

type Product = {
  id: number;
  nama: string;
  qty: number;
  sku: string;
  kategori: string;
  gambar: string | null;
};

type StockOpnameItem = {
  product_id: number;
  nama: string;
  stock_system: number;
  stock_physical: string;
  sku: string;
  kategori: string;
  gambar: string | null;
};

function getCategory(product: Record<string, unknown>): string {
  const raw =
    product.kategori_nama ??
    product.nama_kategori ??
    product.category_name ??
    product.kategori ??
    product.category;

  if (typeof raw === "string") return raw;

  if (raw && typeof raw === "object") {
    const category = raw as Record<string, unknown>;
    return String(category.nama ?? category.name ?? "Lainnya");
  }

  return "Lainnya";
}

function getImageUrl(gambar: string | null): string | null {
  if (!gambar?.trim()) return null;

  if (/^https?:\/\//i.test(gambar)) {
    return gambar;
  }

  if (gambar.startsWith("/api/")) {
    return gambar;
  }

  return `${API_URL}${gambar.startsWith("/") ? "" : "/"}${gambar}`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined select-none ${className}`}
    >
      {name}
    </span>
  );
}

export default function StockOpnamePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockOpnameItems, setStockOpnameItems] = useState<
    StockOpnameItem[]
  >([]);
  const [stockOpnameNote, setStockOpnameNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingStockOpname, setSavingStockOpname] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProducts = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Sesi login tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.pesan || "Gagal memuat produk.");
      }

      const rawProducts = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.products)
            ? result.data.products
            : Array.isArray(result.products)
              ? result.products
              : [];

      const normalized: Product[] = rawProducts.map(
        (product: Record<string, unknown>) => ({
          id: Number(product.id),
          nama: String(product.nama ?? product.name ?? ""),
          qty: Number(product.qty ?? product.stok ?? product.stock ?? 0),
          sku: String(
            product.sku ??
              product.kode_produk ??
              product.product_code ??
              "",
          ),
          kategori: getCategory(product),
          gambar:
            typeof product.gambar === "string" && product.gambar.trim()
              ? product.gambar
              : null,
        }),
      );

      setProducts(normalized);

      setStockOpnameItems((previous) => {
        const previousById = new Map(
          previous.map((item) => [item.product_id, item]),
        );

        return normalized.map((product) => {
          const existing = previousById.get(product.id);

          return {
            product_id: product.id,
            nama: product.nama,
            stock_system: product.qty,
            stock_physical: existing
              ? existing.stock_physical
              : String(product.qty),
            sku: product.sku,
            kategori: product.kategori,
            gambar: product.gambar,
          };
        });
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat produk.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.kategori)))],
    [products],
  );

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stockOpnameItems.filter((item) => {
      const matchesSearch =
        !query ||
        item.nama.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "Semua" || item.kategori === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [stockOpnameItems, search, activeCategory]);

  const getDifference = (item: StockOpnameItem) => {
    const value = item.stock_physical.trim();

    if (value === "") return null;

    const physical = Number(value);

    if (!Number.isSafeInteger(physical) || physical < 0) return null;

    return physical - item.stock_system;
  };

  const reviewedCount = stockOpnameItems.filter(
    (item) => getDifference(item) !== null,
  ).length;

  const discrepancyCount = stockOpnameItems.filter((item) => {
    const difference = getDifference(item);
    return difference !== null && difference !== 0;
  }).length;

  const totalSystem = stockOpnameItems.reduce(
    (sum, item) => sum + item.stock_system,
    0,
  );

  const totalPhysical = stockOpnameItems.reduce(
    (sum, item) => sum + (Number(item.stock_physical) || 0),
    0,
  );

  const totalDifference = totalPhysical - totalSystem;
  const progress =
    stockOpnameItems.length > 0
      ? Math.round((reviewedCount / stockOpnameItems.length) * 100)
      : 0;

  const updatePhysicalStock = (productId: number, value: string) => {
    setStockOpnameItems((previous) =>
      previous.map((item) =>
        item.product_id === productId
          ? { ...item, stock_physical: value }
          : item,
      ),
    );
  };

  const resetOpname = () => {
    setStockOpnameItems((previous) =>
      previous.map((item) => ({
        ...item,
        stock_physical: String(item.stock_system),
      })),
    );
    setStockOpnameNote("");
    setNotice("");
  };

  const saveStockOpname = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Sesi login tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (stockOpnameItems.length === 0) {
      setError("Tidak ada produk untuk opname.");
      return;
    }

    const invalidItem = stockOpnameItems.find((item) => {
      const value = item.stock_physical.trim();
      const qty = Number(value);

      return (
        value === "" ||
        !Number.isSafeInteger(qty) ||
        qty < 0
      );
    });

    if (invalidItem) {
      setError(
        `Stok fisik "${invalidItem.nama}" harus berupa bilangan bulat minimal 0.`,
      );
      return;
    }

    if (
      !window.confirm(
        "Simpan hasil opname dan sesuaikan stok produk sesuai hasil pemeriksaan?",
      )
    ) {
      return;
    }

    setSavingStockOpname(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/products/stock-opname`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note: stockOpnameNote,
          items: stockOpnameItems.map((item) => ({
            product_id: item.product_id,
            stock_physical: Number(item.stock_physical),
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.pesan || "Gagal menyimpan stok opname.");
      }

      setNotice(
        `Stok opname berhasil disimpan. ${result.data.total_items} produk diperiksa, ${result.data.total_adjustments} produk disesuaikan.`,
      );

      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan stok opname.",
      );
    } finally {
      setSavingStockOpname(false);
    }
  };

  const inputClass =
    "w-full rounded-lg bg-white px-3 py-2.5 text-sm text-[#111c2d] outline-none ring-1 ring-[#dfe7e3] transition placeholder:text-[#6e7a71] focus:ring-2 focus:ring-[#006b47]/30 disabled:opacity-60";

  return (
    <main
      className={`${plusJakarta.variable} min-h-screen w-full bg-[#f9f9ff] px-4 py-6 text-[#111c2d] antialiased sm:px-5 md:px-8`}
      style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0');
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          line-height: 1;
        }
      `}</style>

      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#b0f1c7] px-3 py-1 text-[11px] font-bold text-[#0f5132]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#006b47]" />
              Pemeriksaan inventaris
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-[32px]">
              Stok Opname
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#3e4942]">
              Cocokkan stok sistem dengan jumlah fisik di toko secara cepat,
              akurat, dan tercatat di LoopPOS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/riwayat-opname"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f0f3ff] px-4 py-3 text-xs font-bold text-[#111c2d] transition hover:bg-[#e7eeff]"
            >
              <Icon name="history" className="text-[19px] text-[#4c6258]" />
              Riwayat Opname
            </a>
            <button
              type="button"
              onClick={resetOpname}
              disabled={loading || savingStockOpname}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#3e4942] shadow-sm ring-1 ring-[#dfe7e3] transition hover:bg-[#f0f3ff] disabled:opacity-50"
            >
              <Icon name="restart_alt" className="text-[19px]" />
              Reset ke Stok Sistem
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-[#ffdad6] p-4 text-sm text-[#93000a]"
          >
            <Icon name="error" className="mt-0.5 text-xl" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl bg-[#b0f1c7] p-4 text-sm font-semibold text-[#0f5132]"
          >
            <Icon name="cloud_done" className="mt-0.5 text-xl" />
            <span>{notice}</span>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex min-h-[150px] flex-col justify-between rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#3e4942]">
                  Katalog Dihitung
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">
                    {formatNumber(products.length)}
                  </span>
                  <span className="text-xs text-[#3e4942]">SKU item</span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d8e3fb] text-[#006b47]">
                <Icon name="inventory_2" className="text-2xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#f0f3ff] px-2 py-1 text-[11px] font-semibold text-[#2d6a48]">
                <Icon name="check_circle" className="text-sm" />
                Siap Verifikasi
              </span>
              <span className="text-[11px] text-[#6e7a71]">
                {loading ? "Memuat..." : "Produk tersedia"}
              </span>
            </div>
          </div>

          <div className="flex min-h-[150px] flex-col justify-between rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#3e4942]">
                  Progres Pemeriksaan
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">
                    {formatNumber(reviewedCount)}
                  </span>
                  <span className="text-sm text-[#3e4942]">
                    / {formatNumber(stockOpnameItems.length)} selesai
                  </span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00875a] text-white shadow-sm">
                <Icon name="checklist_rtl" className="text-2xl" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-[#d8e3fb]">
                <div
                  className="h-full rounded-full bg-[#00875a] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between gap-2 text-[11px]">
                <span className="font-bold text-[#2d6a48]">
                  Selesai {progress}%
                </span>
                <span className="text-[#3e4942]">
                  {reviewedCount === stockOpnameItems.length
                    ? "Semua SKU terdata"
                    : "Pemeriksaan berlangsung"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex min-h-[150px] flex-col justify-between rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#3e4942]">
                  Produk Selisih
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-extrabold ${
                      discrepancyCount ? "text-[#ba1a1a]" : "text-[#006b47]"
                    }`}
                  >
                    {formatNumber(discrepancyCount)}
                  </span>
                  <span className="text-xs text-[#3e4942]">produk berbeda</span>
                </div>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  discrepancyCount
                    ? "bg-[#ffdad6] text-[#93000a]"
                    : "bg-[#b0f1c7] text-[#0f5132]"
                }`}
              >
                <Icon
                  name={discrepancyCount ? "warning" : "verified"}
                  className="text-2xl"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  discrepancyCount
                    ? "bg-[#ffdad6] text-[#93000a]"
                    : "bg-[#b0f1c7] text-[#0f5132]"
                }`}
              >
                <Icon
                  name={discrepancyCount ? "warning" : "check_circle"}
                  className="text-sm"
                />
                {discrepancyCount ? "Perlu ditinjau" : "Akurat & Seimbang"}
              </span>
              <span className="text-[11px] text-[#6e7a71]">
                Selisih unit {totalDifference > 0 ? "+" : ""}
                {formatNumber(totalDifference)}
              </span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <div className="space-y-5 rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Pemeriksaan Fisik Produk
                  </h2>
                  <p className="mt-1 text-xs text-[#3e4942]">
                    Selisih dihitung otomatis: stok fisik − stok sistem.
                  </p>
                </div>
                <div className="relative w-full sm:max-w-[260px]">
                  <Icon
                    name="search"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#6e7a71]"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari nama produk / SKU..."
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => {
                  const active = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                        active
                          ? "bg-[#006b47] text-white shadow-sm"
                          : "bg-[#d8e3fb] text-[#111c2d] hover:bg-[#cbd8f2]"
                      }`}
                    >
                      {category === "Semua"
                        ? `Semua (${stockOpnameItems.length})`
                        : category}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 rounded-xl bg-[#f0f3ff] p-4">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="opname-notes"
                    className="flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Icon name="edit_note" className="text-lg text-[#4c6258]" />
                    Catatan Opname
                    <span className="font-normal text-[#3e4942]">
                      (Opsional)
                    </span>
                  </label>
                  <span className="shrink-0 text-[10px] text-[#6e7a71]">
                    Maks. {MAX_NOTE_LENGTH} karakter
                  </span>
                </div>
                <input
                  id="opname-notes"
                  value={stockOpnameNote}
                  onChange={(event) =>
                    setStockOpnameNote(
                      event.target.value.slice(0, MAX_NOTE_LENGTH),
                    )
                  }
                  maxLength={MAX_NOTE_LENGTH}
                  disabled={savingStockOpname}
                  placeholder="Contoh: Pemeriksaan stok pergantian shift pagi"
                  className={inputClass}
                />
              </div>

              <div className="hidden grid-cols-12 gap-3 rounded-lg bg-[#d8e3fb] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#3e4942] sm:grid">
                <div className="col-span-5">Informasi Produk</div>
                <div className="col-span-2 text-center">Stok Sistem</div>
                <div className="col-span-3 text-center">Stok Fisik</div>
                <div className="col-span-2 text-right">Selisih</div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-[#3e4942]">
                  <Icon name="sync" className="animate-spin text-xl" />
                  Memuat produk...
                </div>
              ) : (
                <div className="space-y-2">
                  {visibleItems.map((item) => {
                    const difference = getDifference(item);
                    const matches = difference === 0;
                    const surplus = difference !== null && difference > 0;
                    const deficit = difference !== null && difference < 0;
                    const imageUrl = getImageUrl(item.gambar);

                    return (
                      <article
                        key={item.product_id}
                        className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#e7eeff] transition-colors hover:bg-[#f9f9ff] sm:grid-cols-12 sm:items-center sm:gap-3"
                      >
                        <div className="flex min-w-0 items-center gap-3 sm:col-span-5">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#d8e3fb] text-[#006b47]">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.nama}
                                loading="lazy"
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <Icon
                                name="inventory_2"
                                className="text-2xl"
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold">
                              {item.nama}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[10px] text-[#6e7a71]">
                                {item.sku || `ID-${item.product_id}`}
                              </span>
                              <span className="rounded bg-[#d8e3fb] px-2 py-0.5 text-[10px] font-semibold text-[#4c6258]">
                                {item.kategori}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:col-span-2 sm:justify-center">
                          <span className="text-xs text-[#3e4942] sm:hidden">
                            Stok Sistem
                          </span>
                          <span className="inline-flex min-w-12 items-center justify-center rounded-lg bg-[#d8e3fb] px-3 py-1.5 text-base font-bold">
                            {formatNumber(item.stock_system)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between sm:col-span-3 sm:justify-center">
                          <span className="text-xs text-[#3e4942] sm:hidden">
                            Stok Fisik
                          </span>
                          <div className="flex items-center gap-1 rounded-xl bg-[#f0f3ff] p-1">
                            <button
                              type="button"
                              aria-label={`Kurangi stok fisik ${item.nama}`}
                              disabled={
                                savingStockOpname ||
                                (Number(item.stock_physical) || 0) <= 0
                              }
                              onClick={() =>
                                updatePhysicalStock(
                                  item.product_id,
                                  String(
                                    Math.max(
                                      0,
                                      (Number(item.stock_physical) || 0) - 1,
                                    ),
                                  ),
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#111c2d] shadow-sm transition hover:bg-[#d8e3fb] disabled:opacity-40"
                            >
                              <Icon name="remove" className="text-lg" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              inputMode="numeric"
                              aria-label={`Stok fisik ${item.nama}`}
                              value={item.stock_physical}
                              disabled={savingStockOpname}
                              onChange={(event) =>
                                updatePhysicalStock(
                                  item.product_id,
                                  event.target.value,
                                )
                              }
                              className="h-8 w-14 rounded-lg bg-white text-center text-sm font-bold outline-none ring-[#006b47]/20 focus:ring-2 disabled:opacity-60"
                            />
                            <button
                              type="button"
                              aria-label={`Tambah stok fisik ${item.nama}`}
                              disabled={savingStockOpname}
                              onClick={() =>
                                updatePhysicalStock(
                                  item.product_id,
                                  String(
                                    (Number(item.stock_physical) || 0) + 1,
                                  ),
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#111c2d] shadow-sm transition hover:bg-[#d8e3fb] disabled:opacity-40"
                            >
                              <Icon name="add" className="text-lg" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:col-span-2 sm:justify-end">
                          <span className="text-xs text-[#3e4942] sm:hidden">
                            Selisih
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold ${
                              matches
                                ? "bg-[#b0f1c7] text-[#0f5132]"
                                : surplus
                                  ? "bg-[#d8e3fb] text-[#005235]"
                                  : deficit
                                    ? "bg-[#ffdad6] text-[#93000a]"
                                    : "bg-[#f0f3ff] text-[#3e4942]"
                            }`}
                          >
                            <Icon
                              name={
                                matches
                                  ? "check"
                                  : surplus
                                    ? "arrow_upward"
                                    : deficit
                                      ? "arrow_downward"
                                      : "remove"
                              }
                              className="text-sm"
                            />
                            {difference === null
                              ? "Periksa"
                              : difference > 0
                                ? `+${formatNumber(difference)}`
                                : formatNumber(difference)}
                            {matches ? " Cocok" : ""}
                          </span>
                        </div>
                      </article>
                    );
                  })}

                  {visibleItems.length === 0 && (
                    <div className="rounded-xl bg-[#f0f3ff] px-4 py-12 text-center text-sm text-[#3e4942]">
                      {stockOpnameItems.length === 0
                        ? "Tidak ada produk untuk diperiksa."
                        : "Produk tidak ditemukan. Coba kata kunci atau kategori lain."}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-start gap-2 rounded-xl bg-[#f0f3ff] p-4">
                <Icon
                  name="info"
                  className="mt-0.5 shrink-0 text-xl text-[#006b47]"
                />
                <p className="text-xs leading-5 text-[#3e4942]">
                  Periksa jumlah fisik setiap produk sebelum menyimpan. Setelah
                  opname berhasil, stok akan disesuaikan di server dan riwayat
                  audit dicatat oleh backend.
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#e7eeff] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-[#2d6a48]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00875a]" />
                  Siap disinkronkan ke LoopPOS
                </div>
                <button
                  type="button"
                  disabled={
                    loading ||
                    savingStockOpname ||
                    stockOpnameItems.length === 0
                  }
                  onClick={saveStockOpname}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00875a] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#006b47] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon
                    name={savingStockOpname ? "sync" : "save"}
                    className={`text-xl ${
                      savingStockOpname ? "animate-spin" : ""
                    }`}
                  />
                  {savingStockOpname
                    ? "Menyimpan..."
                    : "Simpan Stok Opname"}
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:col-span-4">
            <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold">Rekonsiliasi Sesi</h3>
                <span className="rounded-full bg-[#d8e3fb] px-2.5 py-1 text-[10px] font-bold text-[#3e4942]">
                  Real-time
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 rounded-lg bg-[#f0f3ff] p-3">
                  <div className="flex items-center gap-2">
                    <Icon
                      name="inventory"
                      className="text-lg text-[#4c6258]"
                    />
                    <span className="text-xs">Total Unit Sistem</span>
                  </div>
                  <strong className="text-sm">
                    {formatNumber(totalSystem)} pcs
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg bg-[#f0f3ff] p-3">
                  <div className="flex items-center gap-2">
                    <Icon name="pin" className="text-lg text-[#006b47]" />
                    <span className="text-xs">Total Unit Fisik</span>
                  </div>
                  <strong className="text-sm text-[#006b47]">
                    {formatNumber(totalPhysical)} pcs
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg bg-[#b0f1c7] p-3 text-[#0f5132]">
                  <div className="flex items-center gap-2">
                    <Icon name="balance" className="text-lg" />
                    <span className="text-xs font-semibold">
                      Total Selisih Unit
                    </span>
                  </div>
                  <strong className="text-sm">
                    {totalDifference > 0 ? "+" : ""}
                    {formatNumber(totalDifference)} pcs
                  </strong>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 rounded-xl p-4 ${
                  discrepancyCount ? "bg-[#ffdad6]" : "bg-[#f0f3ff]"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    discrepancyCount
                      ? "bg-[#ba1a1a] text-white"
                      : "bg-[#b0f1c7] text-[#0f5132]"
                  }`}
                >
                  <Icon
                    name={discrepancyCount ? "priority_high" : "thumb_up"}
                    className="text-xl"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold">
                    {discrepancyCount
                      ? "Perhatian: Ada Selisih"
                      : "Stok Sesuai"}
                  </h4>
                  <p className="mt-1 text-[11px] leading-5 text-[#3e4942]">
                    {discrepancyCount
                      ? `${discrepancyCount} produk memiliki perbedaan stok fisik dan sistem.`
                      : "Tidak terdeteksi selisih pada produk yang diperiksa."}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-xl bg-[#263143] p-5 text-[#ecf1ff] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00875a] text-white">
                  <Icon name="fact_check" className="text-xl" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#d8e3fb]">
                    SOP Opname Toko
                  </p>
                  <h3 className="text-base font-bold">Protokol Validasi</h3>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-5 text-[#d8e3fb]">
                <div className="flex items-start gap-2">
                  <Icon
                    name="check_circle"
                    className="mt-0.5 shrink-0 text-base text-[#95d4ac]"
                  />
                  <p>
                    Hitung stok fisik pada rak display dan tempat penyimpanan
                    sebelum menyelesaikan pemeriksaan.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon
                    name="check_circle"
                    className="mt-0.5 shrink-0 text-base text-[#95d4ac]"
                  />
                  <p>
                    Gunakan tombol tambah/kurang atau masukkan jumlah fisik
                    secara langsung.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon
                    name="check_circle"
                    className="mt-0.5 shrink-0 text-base text-[#95d4ac]"
                  />
                  <p>
                    Periksa produk yang berselisih dan tuliskan keterangan
                    pada catatan opname sebelum menyimpan.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-[10px]">
                <span>LoopPOS</span>
                <span className="font-bold text-[#95d4ac]">
                  Audit Stok Aktif
                </span>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
