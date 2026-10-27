
"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const API_URL = "/api";

type StockOpnameDetail = {
  product_id: number;
  product_name: string;
  stock_system: number;
  stock_physical: number;
  difference: number;
};

type StockOpnameHistoryItem = {
  id: number;
  total_items: number;
  total_adjustments: number;
  note: string | null;
  created_at: string;
  details: StockOpnameDetail[];
};

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function RiwayatOpnamePage() {
  const [history, setHistory] = useState<StockOpnameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const filteredHistory = history.filter((opname) => {
    const keyword = search.toLowerCase();

    return (
      String(opname.id).includes(keyword) ||
      (opname.note || "").toLowerCase().includes(keyword) ||
      (opname.details || []).some((detail) =>
        detail.product_name.toLowerCase().includes(keyword),
      )
    );
  });

  const totalProductsChecked = history.reduce(
    (total, opname) => total + Number(opname.total_items || 0),
    0,
  );

  const totalAdjustments = history.reduce(
    (total, opname) => total + Number(opname.total_adjustments || 0),
    0,
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
              Riwayat Stok Opname
            </h1>
            <p className="mt-1 text-sm text-[#718078] dark:text-[#9eb2a7]">
              Lihat hasil pemeriksaan dan penyesuaian stok yang sudah tersimpan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadHistory()}
            disabled={loading}
            className="rounded-lg border border-[#dfe7e3] bg-white px-4 py-2.5 text-xs font-bold text-[#3d4a42] transition hover:bg-[#f3f8f5] disabled:opacity-50 dark:border-[#30463b] dark:bg-[#101a16] dark:text-[#c7d7ce]"
          >
            {loading ? "Memuat..." : "Muat ulang"}
          </button>
        </header>

        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#e3eae5] bg-white p-4 dark:border-[#26382f] dark:bg-[#101a16]">
            <p className="text-xs font-semibold text-[#718078] dark:text-[#9eb2a7]">
              Total sesi opname
            </p>
            <p className="mt-2 text-2xl font-extrabold">{history.length}</p>
          </div>

          <div className="rounded-xl border border-[#e3eae5] bg-white p-4 dark:border-[#26382f] dark:bg-[#101a16]">
            <p className="text-xs font-semibold text-[#718078] dark:text-[#9eb2a7]">
              Total pemeriksaan produk
            </p>
            <p className="mt-2 text-2xl font-extrabold">
              {totalProductsChecked}
            </p>
          </div>

          <div className="rounded-xl border border-[#e3eae5] bg-white p-4 dark:border-[#26382f] dark:bg-[#101a16]">
            <p className="text-xs font-semibold text-[#718078] dark:text-[#9eb2a7]">
              Total penyesuaian
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#006948]">
              {totalAdjustments}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#e3eae5] bg-white shadow-sm dark:border-[#26382f] dark:bg-[#101a16]">
          <div className="flex flex-col gap-3 border-b border-[#e3eae5] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-[#26382f]">
            <div>
              <h2 className="text-sm font-extrabold">Daftar pemeriksaan</h2>
              <p className="mt-1 text-xs text-[#718078] dark:text-[#9eb2a7]">
                Pilih salah satu sesi untuk melihat rincian produknya.
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nomor, catatan, atau produk..."
              className="h-10 w-full rounded-lg border border-[#dfe7e3] bg-white px-3 text-sm outline-none transition focus:border-[#006948] sm:max-w-sm dark:border-[#30463b] dark:bg-[#17231e] dark:text-white"
            />
          </div>

          <div className="p-4 sm:p-5">
            {loading ? (
              <p className="py-12 text-center text-sm text-[#718078]">
                Memuat riwayat stok opname...
              </p>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-900 dark:bg-red-950/30">
                <p className="text-sm font-bold text-red-700 dark:text-red-300">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => void loadHistory()}
                  className="mt-3 rounded-lg bg-[#006948] px-4 py-2 text-xs font-bold text-white hover:bg-[#00583d]"
                >
                  Coba lagi
                </button>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#dfe7e3] px-4 py-12 text-center dark:border-[#30463b]">
                <p className="text-sm font-bold text-[#3d4a42] dark:text-[#e7f1ec]">
                  {history.length === 0
                    ? "Belum ada riwayat stok opname"
                    : "Riwayat tidak ditemukan"}
                </p>
                <p className="mt-1 text-xs text-[#718078] dark:text-[#9eb2a7]">
                  {history.length === 0
                    ? "Riwayat akan muncul setelah stok opname berhasil disimpan."
                    : "Coba gunakan kata kunci pencarian yang berbeda."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((opname) => {
                  const isExpanded = expandedId === opname.id;

                  return (
                    <article
                      key={opname.id}
                      className="overflow-hidden rounded-xl border border-[#e3eae5] dark:border-[#26382f]"
                    >
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : opname.id)
                        }
                        className="w-full p-4 text-left transition hover:bg-[#f5f8f6] dark:hover:bg-[#17231e]"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-extrabold text-[#26382f] dark:text-[#e7f1ec]">
                              Opname #{opname.id}
                            </p>
                            <p className="mt-1 text-xs text-[#718078] dark:text-[#9eb2a7]">
                              {formatDate(opname.created_at)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[11px]">
                            <span className="rounded-lg bg-[#eff7f2] px-3 py-2 font-bold text-[#006948]">
                              {opname.total_items} produk diperiksa
                            </span>
                            <span className="rounded-lg bg-[#fff4e5] px-3 py-2 font-bold text-[#9a5b00]">
                              {opname.total_adjustments} penyesuaian
                            </span>
                          </div>
                        </div>

                        {opname.note && (
                          <p className="mt-3 text-xs text-[#718078] dark:text-[#9eb2a7]">
                            Catatan: {opname.note}
                          </p>
                        )}

                        <p className="mt-2 text-[10px] font-bold text-[#006948]">
                          {isExpanded
                            ? "Tutup rincian ▲"
                            : "Lihat rincian produk ▼"}
                        </p>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-[#e3eae5] p-3 dark:border-[#26382f]">
                          <div className="overflow-x-auto rounded-lg border border-[#e3eae5] dark:border-[#26382f]">
                            <table className="w-full min-w-[540px] text-left text-xs">
                              <thead className="bg-[#f5f8f6] dark:bg-[#17231e]">
                                <tr>
                                  <th className="px-3 py-3">Produk</th>
                                  <th className="px-3 py-3 text-center">
                                    Stok Sistem
                                  </th>
                                  <th className="px-3 py-3 text-center">
                                    Stok Fisik
                                  </th>
                                  <th className="px-3 py-3 text-center">
                                    Selisih
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {(opname.details || []).map((detail, index) => (
                                  <tr
                                    key={`${opname.id}-${detail.product_id}-${index}`}
                                    className="border-t border-[#edf1ef] dark:border-[#26382f]"
                                  >
                                    <td className="px-3 py-3 font-bold text-[#26382f] dark:text-[#e7f1ec]">
                                      {detail.product_name}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                      {detail.stock_system}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                      {detail.stock_physical}
                                    </td>
                                    <td
                                      className={`px-3 py-3 text-center font-extrabold ${
                                        detail.difference < 0
                                          ? "text-red-600"
                                          : detail.difference > 0
                                            ? "text-[#006948]"
                                            : "text-[#718078]"
                                      }`}
                                    >
                                      {detail.difference > 0
                                        ? `+${detail.difference}`
                                        : detail.difference}
                                    </td>
                                  </tr>
                                ))}

                                {(!opname.details ||
                                  opname.details.length === 0) && (
                                  <tr>
                                    <td
                                      colSpan={4}
                                      className="px-3 py-8 text-center text-[#718078]"
                                    >
                                      Rincian opname belum tersedia dari server.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
