
"use client";

import { useCallback, useEffect, useState } from "react";
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
  movement_type?: string;
  quantity?: number | string;
  stock_before?: number | string;
  stock_after?: number | string;
  note?: string;
  source_type?: string;
  created_at?: string;
};

export default function RiwayatStokPage() {
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loadingStockMovements, setLoadingStockMovements] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

      setStockMovements(
        Array.isArray(result.data) ? result.data : []
      );
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

  return (
    <main
      className={`${plusJakarta.variable} min-h-screen w-full bg-[#f8f9ff] px-4 py-6 text-[#0b1c30] antialiased transition-colors sm:px-5 md:px-6 lg:px-8 dark:bg-[#0b1411] dark:text-[#edf7f1]`}
      style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-5">
        <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Riwayat Pergerakan Stok
            </h1>
            <p className="mt-1 text-sm text-[#718078] dark:text-[#a7b8ae]">
              Catatan stok masuk, stok keluar, dan penyesuaian.
            </p>
          </div>

          <button
            type="button"
            disabled={loadingStockMovements}
            onClick={() => void loadStockMovements()}
            className="inline-flex items-center justify-center rounded-lg border border-[#cfe5d8] bg-white px-4 py-2.5 text-sm font-bold text-[#006948] transition hover:bg-[#eff8f2] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#29483a] dark:bg-[#14231c] dark:text-[#8de0b7]"
          >
            {loadingStockMovements ? "Memuat..." : "Muat Ulang"}
          </button>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#e5ece7] bg-white shadow-sm dark:border-[#263b31] dark:bg-[#111f18]">
          <div className="flex items-center justify-between gap-3 border-b border-[#e5ece7] p-4 sm:p-5 dark:border-[#263b31]">
            <div>
              <h2 className="text-sm font-extrabold">
                Catatan Pergerakan Stok
              </h2>
              <p className="mt-1 text-xs text-[#718078] dark:text-[#a7b8ae]">
                {stockMovements.length} catatan
              </p>
            </div>
          </div>

          {loadingStockMovements ? (
            <p className="p-10 text-center text-sm text-[#718078]">
              Memuat riwayat stok...
            </p>
          ) : errorMessage ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-[#ba1a1a]">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => void loadStockMovements()}
                className="mt-4 rounded-lg border border-[#cfe5d8] px-4 py-2 text-xs font-bold text-[#006948] hover:bg-[#eff8f2]"
              >
                Coba Lagi
              </button>
            </div>
          ) : stockMovements.length === 0 ? (
            <p className="p-10 text-center text-sm text-[#718078]">
              Belum ada riwayat pergerakan stok.
            </p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full min-w-[850px] text-left text-xs">
                <thead className="sticky top-0 bg-[#f4f8f6] text-[10px] uppercase text-[#59675f] dark:bg-[#1b2b22] dark:text-[#b4c6bb]">
                  <tr>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3">Jenis</th>
                    <th className="px-4 py-3 text-right">Jumlah</th>
                    <th className="px-4 py-3 text-right">Stok Sebelum</th>
                    <th className="px-4 py-3 text-right">Stok Sesudah</th>
                    <th className="px-4 py-3">Catatan</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#edf1ee] dark:divide-[#263b31]">
                  {stockMovements.map((item, index) => {
                    const type = String(
                      item.movement_type || ""
                    ).toLowerCase();

                    const incoming = type === "stock_in";
                    const outgoing = type === "stock_out";

                    return (
                      <tr
                        key={
                          item.id ??
                          `${item.product_id}-${item.created_at}-${index}`
                        }
                        className="transition hover:bg-[#f8fbf9] dark:hover:bg-[#192920]"
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString(
                                "id-ID"
                              )
                            : "-"}
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          {item.nama_produk ||
                            item.product_name ||
                            item.nama ||
                            "-"}
                          <span className="mt-1 block text-[10px] text-[#87938a]">
                            ID: {item.product_id ?? "-"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-block whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-bold ${
                              incoming
                                ? "bg-[#d8f8e7] text-[#006948]"
                                : outgoing
                                  ? "bg-[#ffdad6] text-[#ba1a1a]"
                                  : "bg-[#eff4ff] text-[#455b85]"
                            }`}
                          >
                            {incoming
                              ? "Stok Masuk"
                              : outgoing
                                ? "Stok Keluar"
                                : "Penyesuaian"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right font-bold">
                          {incoming ? "+" : outgoing ? "−" : ""}
                          {Math.abs(
                            Number(item.quantity ?? 0)
                          ).toLocaleString("id-ID")}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {Number(item.stock_before ?? 0).toLocaleString(
                            "id-ID"
                          )}
                        </td>

                        <td className="px-4 py-3 text-right font-bold">
                          {Number(item.stock_after ?? 0).toLocaleString(
                            "id-ID"
                          )}
                        </td>

                        <td className="px-4 py-3 text-[#718078] dark:text-[#a7b8ae]">
                          {item.note || item.source_type || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
