
"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const API_URL = "/api";

type Product = {
  id: number;
  nama: string;
  qty: number;
};

type StockOpnameItem = {
  product_id: number;
  nama: string;
  stock_system: number;
  stock_physical: string;
};

export default function StockOpnamePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockOpnameItems, setStockOpnameItems] = useState<StockOpnameItem[]>([]);
  const [stockOpnameNote, setStockOpnameNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingStockOpname, setSavingStockOpname] = useState(false);
  const [search, setSearch] = useState("");

  const loadProducts = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Sesi login tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        }),
      );

      setProducts(normalized);
      setStockOpnameItems(
        normalized.map((product) => ({
          product_id: product.id,
          nama: product.nama,
          stock_system: product.qty,
          stock_physical: String(product.qty),
        })),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memuat produk.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

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
    setStockOpnameItems(
      products.map((product) => ({
        product_id: product.id,
        nama: product.nama,
        stock_system: product.qty,
        stock_physical: String(product.qty),
      })),
    );
    setStockOpnameNote("");
  };

  const saveStockOpname = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Sesi login tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (stockOpnameItems.length === 0) {
      alert("Tidak ada produk untuk opname.");
      return;
    }

    const invalidItem = stockOpnameItems.find((item) => {
      const qty = Number(item.stock_physical);

      return (
        item.stock_physical.trim() === "" ||
        !Number.isSafeInteger(qty) ||
        qty < 0
      );
    });

    if (invalidItem) {
      alert(
        `Stok fisik produk "${invalidItem.nama}" harus berupa bilangan bulat minimal 0.`,
      );
      return;
    }

    if (!window.confirm("Simpan hasil opname dan sesuaikan stok produk?")) {
      return;
    }

    setSavingStockOpname(true);

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

      await loadProducts();

      alert(
        `Stok opname berhasil disimpan.\nProduk diperiksa: ${result.data.total_items}\nProduk disesuaikan: ${result.data.total_adjustments}`,
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan stok opname.",
      );
    } finally {
      setSavingStockOpname(false);
    }
  };

  const filteredItems = stockOpnameItems.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main
      className={`${plusJakarta.variable} min-h-screen w-full bg-[#f8f9ff] px-4 py-6 text-[#0b1c30] antialiased transition-colors sm:px-5 md:px-6 lg:px-8 dark:bg-[#0b1411] dark:text-[#edf7f1]`}
      style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Stok Opname
            </h1>
            <p className="mt-1 text-sm text-[#718078] dark:text-[#9eb2a7]">
              Cocokkan stok sistem dengan jumlah fisik di toko.
            </p>
          </div>

          <button
            type="button"
            onClick={resetOpname}
            disabled={loading || savingStockOpname}
            className="rounded-lg border border-[#dfe7e3] bg-white px-4 py-2.5 text-xs font-bold text-[#3d4a42] transition hover:bg-[#f3f8f5] disabled:opacity-50 dark:border-[#30463b] dark:bg-[#101a16] dark:text-[#c7d7ce]"
          >
            Reset ke stok sistem
          </button>
        </header>

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#e3eae5] bg-white p-4 dark:border-[#26382f] dark:bg-[#101a16]">
            <p className="text-xs font-semibold text-[#718078] dark:text-[#9eb2a7]">
              Total produk
            </p>
            <p className="mt-2 text-2xl font-extrabold">{products.length}</p>
          </div>

          <div className="rounded-xl border border-[#e3eae5] bg-white p-4 dark:border-[#26382f] dark:bg-[#101a16]">
            <p className="text-xs font-semibold text-[#718078] dark:text-[#9eb2a7]">
              Produk diperiksa
            </p>
            <p className="mt-2 text-2xl font-extrabold">
              {stockOpnameItems.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#e3eae5] bg-white p-4 dark:border-[#26382f] dark:bg-[#101a16]">
            <p className="text-xs font-semibold text-[#718078] dark:text-[#9eb2a7]">
              Produk dengan selisih
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#006948]">
              {
                stockOpnameItems.filter(
                  (item) =>
                    item.stock_physical.trim() !== "" &&
                    Number.isSafeInteger(Number(item.stock_physical)) &&
                    Number(item.stock_physical) >= 0 &&
                    Number(item.stock_physical) !== item.stock_system,
                ).length
              }
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#e3eae5] bg-white shadow-sm dark:border-[#26382f] dark:bg-[#101a16]">
          <div className="flex flex-col gap-4 border-b border-[#e3eae5] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-[#26382f]">
            <div>
              <h2 className="text-sm font-extrabold">Pemeriksaan stok produk</h2>
              <p className="mt-1 text-xs text-[#718078] dark:text-[#9eb2a7]">
                Selisih = stok fisik − stok sistem.
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama produk..."
              className="h-10 w-full rounded-lg border border-[#dfe7e3] bg-white px-3 text-sm outline-none transition focus:border-[#006948] sm:max-w-xs dark:border-[#30463b] dark:bg-[#17231e] dark:text-white"
            />
          </div>

          <div className="p-4 sm:p-5">
            <label className="mb-5 block">
              <span className="mb-1.5 block text-xs font-bold text-[#3d4a42] dark:text-[#c7d7ce]">
                Catatan opname (opsional)
              </span>
              <input
                value={stockOpnameNote}
                onChange={(event) => setStockOpnameNote(event.target.value)}
                maxLength={500}
                placeholder="Contoh: Pemeriksaan stok akhir bulan"
                disabled={savingStockOpname}
                className="h-10 w-full rounded-lg border border-[#dfe7e3] bg-white px-3 text-sm outline-none focus:border-[#006948] disabled:opacity-60 dark:border-[#30463b] dark:bg-[#17231e] dark:text-white"
              />
            </label>

            {loading ? (
              <p className="py-12 text-center text-sm text-[#718078]">
                Memuat produk...
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#e3eae5] dark:border-[#26382f]">
                <table className="w-full min-w-[560px] text-left text-xs">
                  <thead className="bg-[#f5f8f6] dark:bg-[#17231e]">
                    <tr>
                      <th className="px-3 py-3">Produk</th>
                      <th className="px-3 py-3 text-center">Stok Sistem</th>
                      <th className="px-3 py-3 text-center">Stok Fisik</th>
                      <th className="px-3 py-3 text-center">Selisih</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => {
                      const physical = Number(item.stock_physical);
                      const valid =
                        item.stock_physical.trim() !== "" &&
                        Number.isSafeInteger(physical) &&
                        physical >= 0;
                      const difference = valid
                        ? physical - item.stock_system
                        : null;

                      return (
                        <tr
                          key={item.product_id}
                          className="border-t border-[#edf1ef] dark:border-[#26382f]"
                        >
                          <td className="max-w-[240px] px-3 py-3 font-bold text-[#26382f] dark:text-[#e7f1ec]">
                            {item.nama}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {item.stock_system}
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={item.stock_physical}
                              disabled={savingStockOpname}
                              onChange={(event) =>
                                updatePhysicalStock(
                                  item.product_id,
                                  event.target.value,
                                )
                              }
                              className="h-9 w-24 rounded-md border border-[#dfe7e3] bg-white px-2 text-center outline-none focus:border-[#006948] disabled:opacity-60 dark:border-[#30463b] dark:bg-[#17231e] dark:text-white"
                            />
                          </td>
                          <td
                            className={`px-3 py-3 text-center font-extrabold ${
                              difference === null
                                ? "text-[#718078]"
                                : difference < 0
                                  ? "text-red-600"
                                  : difference > 0
                                    ? "text-[#006948]"
                                    : "text-[#718078]"
                            }`}
                          >
                            {difference === null
                              ? "—"
                              : difference > 0
                                ? `+${difference}`
                                : difference}
                          </td>
                        </tr>
                      );
                    })}

                    {!loading && filteredItems.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-12 text-center text-[#718078]"
                        >
                          {stockOpnameItems.length === 0
                            ? "Tidak ada produk untuk diperiksa."
                            : "Produk tidak ditemukan."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <p className="mt-3 text-[11px] leading-relaxed text-[#718078] dark:text-[#9eb2a7]">
              Periksa jumlah fisik setiap produk sebelum menyimpan. Stok produk
              akan disesuaikan dengan stok fisik setelah opname berhasil disimpan.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                disabled={loading || savingStockOpname || stockOpnameItems.length === 0}
                onClick={saveStockOpname}
                className="rounded-lg bg-[#006948] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#00583d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingStockOpname ? "Menyimpan..." : "Simpan Stok Opname"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
