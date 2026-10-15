"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

const API_URL = "/api";

type Shift = {
  id: number;
  cashier_id: number;
  cashier_name?: string;
  terminal_id: string;
  opening_cash: number | string;
  closing_cash?: number | string | null;
  expected_cash?: number | string | null;
  cash_difference?: number | string | null;
  status: string;
  opened_at: string;
  closed_at?: string | null;
};

type IconName = "plus" | "terminal" | "calendar" | "search" | "filter" | "arrow";

const rupiah = (value: number | string | null | undefined) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

const formatTanggal = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatNominalInput = (value: string) => {
  const angka = value.replace(/\D/g, "");
  return angka ? angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
};

const nominalAngka = (value: string) => {
  const angka = value.replace(/\./g, "");
  return angka ? Number(angka) : 0;
};

const nominalSingkat = (value: number | string | null | undefined) => {
  const amount = Number(value ?? 0);
  return amount > 0 ? `+${rupiah(amount)}` : rupiah(amount);
};

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "terminal":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="14" rx="2" />
          <path d="m8 21 1-4m6 4-1-4M3 13h18" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <path d="M8 2v4m8-4v4M3 10h18" />
          <rect x="3" y="4" width="18" height="17" rx="2" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "filter":
      return (
        <svg {...common}>
          <path d="M4 4h16l-6 7v6l-4 3v-9L4 4Z" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
  }
}

export default function ShiftPage() {
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [lastShift, setLastShift] = useState<Shift | null>(null);
  const [history, setHistory] = useState<Shift[]>([]);

  const [openingCash, setOpeningCash] = useState("200.000");
  const [closingCash, setClosingCash] = useState("");
  const [terminalId, setTerminalId] = useState("default");
  const [shiftNote, setShiftNote] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const request = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.pesan ||
            result.message ||
            `Permintaan gagal (${response.status}).`
        );
      }

      return result;
    },
    []
  );

  const loadShifts = useCallback(async () => {
    setLoading(true);

    try {
      setError("");

      const [activeResult, historyResult] = await Promise.all([
        request("/shift/active"),
        request("/shift"),
      ]);

      setActiveShift(activeResult.data ?? null);
      setLastShift(activeResult.last_shift ?? null);

      const data = historyResult.data;

      setHistory(
        Array.isArray(data)
          ? data
          : Array.isArray(historyResult.rows)
            ? historyResult.rows
            : []
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data shift."
      );
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    void loadShifts();
  }, [loadShifts]);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      );
    };

    updateTime();
    const timer = window.setInterval(updateTime, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const openShift = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!openingCash.trim()) {
      setError("Masukkan jumlah kas awal terlebih dahulu.");
      return;
    }

    const amount = nominalAngka(openingCash);

    if (!Number.isFinite(amount) || amount < 0) {
      setError("Kas awal harus berupa angka nol atau lebih.");
      return;
    }

    if (!terminalId.trim()) {
      setError("ID terminal wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const result = await request("/shift", {
        method: "POST",
        body: JSON.stringify({
          opening_cash: amount,
          terminal_id: terminalId.trim(),
          note: shiftNote.trim(),
        }),
      });

      setSuccess(result.pesan || "Shift berhasil dibuka.");
      setClosingCash("");
      await loadShifts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuka shift.");
    } finally {
      setSaving(false);
    }
  };

  const closeShift = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeShift) return;

    setError("");
    setSuccess("");

    if (!closingCash.trim()) {
      setError("Masukkan jumlah kas akhir terlebih dahulu.");
      return;
    }

    const amount = nominalAngka(closingCash);

    if (!Number.isFinite(amount) || amount < 0) {
      setError("Kas akhir harus berupa angka nol atau lebih.");
      return;
    }

    const confirmed = window.confirm(
      "Tutup shift sekarang? Pastikan uang kas fisik sudah dihitung."
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      const result = await request(`/shift/${activeShift.id}/close`, {
        method: "POST",
        body: JSON.stringify({ closing_cash: amount }),
      });

      setSuccess(result.pesan || "Shift berhasil ditutup.");
      setClosingCash("");
      await loadShifts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menutup shift.");
    } finally {
      setSaving(false);
    }
  };

  const filteredHistory = history.filter((shift) =>
    String(shift.id).includes(search.trim().replace(/^#/, ""))
  );

  const card =
    "min-w-0 rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_2px_20px_-2px_rgba(15,23,42,0.05)] backdrop-blur-md transition-colors sm:p-6 dark:border-[#26352f] dark:bg-[#111c17]/90";

  const field =
    "block w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 dark:border-[#34443c] dark:bg-[#0b1210] dark:text-gray-100 dark:focus:bg-[#111c17]";

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  const differenceColor = (value: number | string | null | undefined) => {
    const amount = Number(value ?? 0);

    if (amount < 0) return "text-rose-600 dark:text-rose-400";
    if (amount > 0) return "text-emerald-700 dark:text-emerald-400";
    return "text-slate-700 dark:text-slate-300";
  };

  return (
    <main className="relative isolate mx-auto flex min-h-full w-full max-w-[1600px] flex-col gap-7 overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9]/70 to-[#ecfdf5]/40 px-4 py-6 text-slate-800 antialiased sm:gap-8 sm:px-6 sm:py-9 lg:px-8 dark:from-[#09110d] dark:via-[#0b1510] dark:to-[#0d2118] dark:text-gray-100">
      <div className="pointer-events-none absolute -top-40 -left-40 -z-10 h-96 w-96 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-500/10" />
      <div className="pointer-events-none absolute top-1/3 -right-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-teal-200/25 blur-3xl dark:bg-teal-500/10" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 -z-10 h-[32rem] w-[32rem] rounded-full bg-emerald-100/40 blur-3xl dark:bg-emerald-500/10" />

      {/* Header */}
      <section className="flex flex-col justify-between gap-5 pb-2 xl:flex-row xl:items-end">
        <div className="min-w-0 space-y-2">
          <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                activeShift ? "animate-pulse bg-emerald-500" : "bg-slate-400"
              }`}
            />
            <span>POS Terminal Operasional</span>
            <span className="text-emerald-300">•</span>
            <span className="break-all font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
              {activeShift?.terminal_id || terminalId || "default-station"}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-gray-100">
            Shift Kasir
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base dark:text-gray-400">
            Kelola pembukaan modal awal kasir, rekonsiliasi laci uang tunai,
            dan monitor status serah terima terkini.
          </p>
        </div>

        {/* Header responsif: informasi dan tombol tetap sejajar */}
        <div className="grid w-full grid-cols-2 items-stretch gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-3 xl:shrink-0">
          <div className="col-span-2 flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md sm:col-span-1 dark:border-[#26352f] dark:bg-[#111c17]/90">
            <div className="relative flex h-3 w-3 shrink-0 items-center justify-center">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  activeShift ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {activeShift && (
                <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500 opacity-40" />
              )}
            </div>

            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sesi Terminal
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-gray-200">
                {loading
                  ? "Memuat status..."
                  : activeShift
                    ? "Online / Shift Aktif"
                    : "Offline / Shift Tutup"}
              </div>
            </div>
          </div>

          <div className="col-span-2 flex min-w-0 flex-col justify-center rounded-2xl border border-slate-200/50 bg-slate-100/60 px-4 py-3 sm:col-span-1 sm:text-right dark:border-[#26352f] dark:bg-[#111c17]/70">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Waktu Sistem
            </span>
            <span className="break-words font-mono text-xs font-medium text-slate-600 dark:text-gray-300">
              {currentTime || "Memuat waktu..."}
            </span>
          </div>

          <button
            type="button"
            onClick={() => void loadShifts()}
            disabled={loading || saving}
            className="col-span-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-1 sm:w-auto dark:border-[#34443c] dark:bg-[#111c17] dark:text-gray-200"
          >
            <span aria-hidden="true" className="text-base leading-none">
              ↻
            </span>
            {loading ? "Memuat..." : "Perbarui"}
          </button>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {success}
        </div>
      )}

      {/* Grid utama */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-12 xl:gap-8">
        {/* Form shift */}
        <div className="min-w-0 space-y-6 xl:col-span-7">
          <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-5 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all duration-200 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.18)] sm:p-7 lg:p-8 dark:border-[#26352f] dark:bg-[#111c17]/95">
            <div className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full bg-gradient-to-br from-emerald-200/40 to-teal-100/0 blur-2xl dark:from-emerald-500/10" />

            <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-[#26352f]">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
                  <Icon
                    name={activeShift ? "terminal" : "plus"}
                    className="h-6 w-6"
                  />
                </div>

                <div className="min-w-0">
                  <div
                    className={`mb-1 inline-flex max-w-full items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${
                      activeShift
                        ? "border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300"
                    }`}
                  >
                    {loading
                      ? "Memuat status shift"
                      : activeShift
                        ? "Shift Sedang Berjalan"
                        : "Belum Ada Shift Aktif"}
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100">
                    {activeShift ? "Sesi Shift Berjalan" : "Buka Sesi Shift Baru"}
                  </h2>
                </div>
              </div>

              <span className="hidden text-xs font-medium text-slate-400 sm:inline-flex">
                Laci Kasir #01
              </span>
            </div>

            {loading ? (
              <div className="relative py-8 text-sm text-slate-500 dark:text-gray-400">
                Mengambil data shift...
              </div>
            ) : activeShift ? (
              <div className="relative pt-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-[#26352f] dark:bg-[#0b1210]">
                    <span className="text-[11px] font-medium text-slate-500">
                      Shift Aktif
                    </span>
                    <div className="mt-2 break-words text-xl font-bold text-slate-900 dark:text-gray-100">
                      #{activeShift.id}
                    </div>
                    <span className="mt-1 block text-[10px] text-slate-400">
                      Mulai {formatTanggal(activeShift.opened_at)}
                    </span>
                  </div>

                  <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-[#26352f] dark:bg-[#0b1210]">
                    <span className="text-[11px] font-medium text-slate-500">
                      Kas Awal Shift
                    </span>
                    <div className="mt-2 break-words font-mono text-lg font-bold text-slate-900 sm:text-xl dark:text-gray-100">
                      {rupiah(activeShift.opening_cash)}
                    </div>
                    <span className="mt-1 block break-words text-[10px] text-slate-400">
                      Terminal {activeShift.terminal_id || "default"}
                    </span>
                  </div>
                </div>

                <form onSubmit={closeShift} className="mt-6 space-y-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label
                        className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300"
                        htmlFor="closingCash"
                      >
                        Kas Akhir Tunai (Uang Fisik){" "}
                        <span className="text-emerald-500">*</span>
                      </label>
                      <span className="text-xs text-slate-400">
                        Hitung uang fisik sebelum tutup
                      </span>
                    </div>

                    <div className="group rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/80 p-1.5 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-[#34443c] dark:from-[#0b1210] dark:to-[#101a15]">
                      <div className="flex min-w-0 items-center px-3 py-2 sm:px-4">
                        <span className="select-none pr-3 font-mono text-2xl font-extrabold text-emerald-600 sm:text-3xl">
                          Rp
                        </span>
                        <input
                          id="closingCash"
                          type="text"
                          inputMode="numeric"
                          value={closingCash}
                          onChange={(event) =>
                            setClosingCash(
                              formatNominalInput(event.target.value)
                            )
                          }
                          placeholder="0"
                          className="w-full min-w-0 border-0 bg-transparent p-0 font-mono text-2xl font-extrabold text-slate-900 outline-none placeholder:text-slate-300 focus:ring-0 sm:text-3xl dark:text-gray-100 dark:placeholder:text-gray-600"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-r from-slate-50 to-emerald-50/50 p-4 text-xs text-slate-600 dark:border-[#26352f] dark:from-[#0b1210] dark:to-[#10241a] dark:text-gray-300">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 dark:text-gray-400">
                        Kas awal shift
                      </span>
                      <span className="font-mono font-bold">
                        {rupiah(activeShift.opening_cash)}
                      </span>
                    </div>
                    <p className="mt-2 border-t border-slate-200/60 pt-2 text-[11px] leading-relaxed text-slate-500 dark:border-[#26352f] dark:text-gray-400">
                      Kas yang diharapkan dihitung berdasarkan kas awal dan
                      transaksi tunai yang telah dibayar. Pembayaran QRIS
                      bukan uang tunai.
                    </p>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center dark:border-[#26352f]">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-emerald-500">●</span>
                      <span>Periksa kas fisik sebelum konfirmasi</span>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-700/20 transition hover:from-rose-700 hover:to-red-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
                    >
                      {saving ? "Memproses..." : "Tutup Shift Sekarang"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <form onSubmit={openShift} className="relative space-y-6 pt-6">
                {/* Kas awal */}
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300"
                      htmlFor="openingCash"
                    >
                      Kas Awal Tunai (Modal Kerja){" "}
                      <span className="text-emerald-500">*</span>
                    </label>
                    <span className="text-xs text-slate-400">
                      Pastikan uang fisik dihitung
                    </span>
                  </div>

                  <div className="group min-w-0 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/80 p-1.5 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-[#34443c] dark:from-[#0b1210] dark:to-[#101a15]">
                    <div className="flex min-w-0 items-center px-3 py-2 sm:px-4">
                      <span className="select-none pr-3 font-mono text-2xl font-extrabold text-emerald-600 sm:text-3xl">
                        Rp
                      </span>
                      <input
                        id="openingCash"
                        type="text"
                        inputMode="numeric"
                        value={openingCash}
                        onChange={(event) =>
                          setOpeningCash(
                            formatNominalInput(event.target.value)
                          )
                        }
                        placeholder="0"
                        className="w-full min-w-0 border-0 bg-transparent p-0 font-mono text-2xl font-extrabold text-slate-900 outline-none placeholder:text-slate-300 focus:ring-0 sm:text-3xl dark:text-gray-100 dark:placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  {/* Pilihan nominal: grid responsif untuk tablet */}
                  <div className="grid min-w-0 grid-cols-2 gap-2 min-[420px]:grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
                    <span className="col-span-2 self-center pb-0.5 text-[11px] font-semibold text-slate-400 min-[420px]:col-span-3 sm:col-span-5 lg:col-span-3 xl:col-span-5">
                      Pilihan Cepat:
                    </span>

                    {quickAmounts.map((amount) => {
                      const selected = nominalAngka(openingCash) === amount;

                      return (
                        <button
                          key={amount}
                          type="button"
                          onClick={() =>
                            setOpeningCash(
                              formatNominalInput(String(amount))
                            )
                          }
                          className={`min-w-0 whitespace-nowrap rounded-xl border px-2 py-2 text-xs transition-all active:scale-[0.98] ${
                            selected
                              ? "border-emerald-600 bg-emerald-600 font-bold text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700"
                              : "border-slate-200/80 bg-slate-100 font-semibold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-[#34443c] dark:bg-[#17231c] dark:text-gray-300 dark:hover:bg-emerald-950/50"
                          }`}
                        >
                          {new Intl.NumberFormat("id-ID").format(amount)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Terminal dan catatan */}
                <div className="grid min-w-0 grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
                  <div className="min-w-0 space-y-1.5">
                    <label
                      className="text-xs font-semibold text-slate-600 dark:text-gray-300"
                      htmlFor="terminalId"
                    >
                      ID Terminal POS
                    </label>

                    <div className="relative min-w-0">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Icon name="terminal" className="h-4 w-4" />
                      </div>
                      <input
                        id="terminalId"
                        type="text"
                        value={terminalId}
                        onChange={(event) => setTerminalId(event.target.value)}
                        className={`${field} pl-10 font-mono text-xs`}
                        required
                      />
                    </div>
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <label
                      className="text-xs font-semibold text-slate-600 dark:text-gray-300"
                      htmlFor="shiftNote"
                    >
                      Catatan Shift (Opsional)
                    </label>
                    <input
                      id="shiftNote"
                      type="text"
                      value={shiftNote}
                      onChange={(event) => setShiftNote(event.target.value)}
                      placeholder="Contoh: Shift pagi / reg A"
                      className={`${field} text-xs`}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center dark:border-[#26352f]">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-emerald-500">●</span>
                    <span>Laci uang tunai siap dihitung</span>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-700/25 transition hover:from-emerald-700 hover:to-teal-800 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
                  >
                    <Icon
                      name="plus"
                      className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
                    />
                    <span>
                      {saving ? "Membuka shift..." : "Buka Shift Sekarang"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* Panel serah terima */}
        <div className="min-w-0 space-y-6 xl:col-span-5">
          <section
            className={`${card} space-y-5`}
            data-purpose="handover-panel"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <Icon name="calendar" className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-gray-100">
                    Serah Terima Kasir
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lastShift
                      ? `Ringkasan shift terakhir (#${lastShift.id})`
                      : "Ringkasan penutupan shift terakhir"}
                  </p>
                </div>
              </div>

              {lastShift ? (
                <span
                  className={`max-w-full rounded-full border px-2 py-1 font-mono text-[11px] font-medium ${
                    lastShift.cash_difference == null
                      ? "border-slate-200 bg-slate-100 text-slate-600 dark:border-[#34443c] dark:bg-[#17231c] dark:text-gray-300"
                      : Number(lastShift.cash_difference) === 0
                        ? "border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "border-amber-200/60 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300"
                  }`}
                >
                  {lastShift.cash_difference == null
                    ? "Belum direkonsiliasi"
                    : Number(lastShift.cash_difference) === 0
                      ? "Seimbang (Rp 0)"
                      : `Selisih ${rupiah(lastShift.cash_difference)}`}
                </span>
              ) : (
                <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 font-mono text-[11px] font-medium text-slate-500 dark:border-[#34443c] dark:bg-[#17231c] dark:text-gray-400">
                  Belum tersedia
                </span>
              )}
            </div>

            {lastShift ? (
              <>
                <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                  <div className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-[#26352f] dark:bg-[#0b1210]">
                    <span className="text-[11px] font-medium text-slate-500">
                      Kas Awal Shift #{lastShift.id}
                    </span>
                    <div className="mt-2 break-words font-mono text-sm font-bold text-slate-800 dark:text-gray-100">
                      {rupiah(lastShift.opening_cash)}
                    </div>
                    <span className="mt-1 text-[10px] text-slate-400">
                      {formatTanggal(lastShift.opened_at)}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-[#26352f] dark:bg-[#0b1210]">
                    <span className="text-[11px] font-medium text-slate-500">
                      Kas Akhir Fisik
                    </span>
                    <div className="mt-2 break-words font-mono text-sm font-bold text-slate-900 dark:text-gray-100">
                      {lastShift.closing_cash == null
                        ? "Belum ditutup"
                        : rupiah(lastShift.closing_cash)}
                    </div>
                    <span className="mt-1 text-[10px] text-slate-400">
                      {lastShift.closed_at
                        ? `Selesai ${formatTanggal(lastShift.closed_at)}`
                        : "Menunggu penutupan"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-gradient-to-r from-slate-50 to-emerald-50/50 p-3.5 text-xs text-slate-600 dark:border-[#26352f] dark:from-[#0b1210] dark:to-[#10241a] dark:text-gray-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-gray-400">
                    <span>Petugas Sebelumnya</span>
                    <span className="break-words font-semibold text-slate-700 dark:text-gray-200">
                      {lastShift.cashier_name ||
                        `Kasir #${lastShift.cashier_id}`}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-gray-400">
                    <span>Status Selisih</span>
                    <span
                      className={`font-mono font-bold ${differenceColor(
                        lastShift.cash_difference
                      )}`}
                    >
                      {lastShift.cash_difference == null
                        ? "Belum tersedia"
                        : nominalSingkat(lastShift.cash_difference)}
                    </span>
                  </div>

                  {lastShift.status === "open" ? (
                    <p className="border-t border-slate-200/60 pt-2 text-[11px] leading-relaxed text-amber-700 dark:border-[#26352f] dark:text-amber-300">
                      Shift sebelumnya masih terbuka. Pastikan penutupan dan
                      pergantian kasir ditangani dengan benar.
                    </p>
                  ) : (
                    <p className="border-t border-slate-200/60 pt-2 text-[11px] leading-relaxed text-slate-500 dark:border-[#26352f] dark:text-gray-400">
                      Informasi ini berasal dari riwayat shift yang tersimpan.
                      Kas awal shift baru tetap dicatat secara terpisah.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center dark:border-[#34443c] dark:bg-[#0b1210]">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <Icon name="calendar" className="h-5 w-5" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-slate-800 dark:text-gray-100">
                  Belum ada shift sebelumnya
                </h4>
                <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-gray-400">
                  Informasi kasir sebelumnya, kas awal, kas akhir, dan selisih
                  akan ditampilkan di sini setelah tersedia riwayat shift.
                </p>
              </div>
            )}
          </section>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-lg dark:from-[#101b15] dark:to-[#09110d]">
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-xl" />
            <div className="relative flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
                💡
              </div>
              <div className="min-w-0 space-y-1">
                <div className="text-xs font-semibold text-slate-100">
                  Protokol Penutupan Shift
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Selalu hitung uang fisik sebelum mengonfirmasi kas akhir.
                  Pastikan transaksi tunai dan pembayaran non-tunai dibedakan
                  saat rekonsiliasi kas.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Riwayat shift */}
      <section
        className="min-w-0 space-y-4 pt-2 sm:pt-4"
        data-purpose="shift-history-ledger"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
              Riwayat Shift Terkini
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
              Daftar rekapitulasi sesi kasir dan rekonsiliasi laci kas.
            </p>
          </div>

          <div className="relative w-full sm:w-64 sm:shrink-0">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nomor shift..."
              className="w-full rounded-xl border border-slate-200 bg-white/90 py-2.5 pl-9 pr-3 text-xs text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-[#34443c] dark:bg-[#111c17] dark:text-gray-100"
            />
            <span className="absolute top-3 left-3 text-slate-400">
              <Icon name="search" className="h-4 w-4" />
            </span>
          </div>
        </div>

        {loading ? (
          <div className={`${card} text-sm text-slate-500 dark:text-gray-400`}>
            Mengambil riwayat shift...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 text-center shadow-sm dark:border-[#26352f] dark:bg-[#111c17]/80">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-[#0b1210] dark:text-gray-400">
              <Icon name="calendar" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-gray-100">
              {search ? "Shift tidak ditemukan" : "Belum ada riwayat shift"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
              {search
                ? "Coba cari menggunakan nomor shift yang berbeda."
                : "Riwayat shift akan muncul setelah ada sesi yang tercatat."}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredHistory.map((shift) => {
              const closed = shift.status !== "open";
              const difference = Number(shift.cash_difference ?? 0);

              return (
                <article
                  key={shift.id}
                  className="group min-w-0 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_2px_20px_-2px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md sm:p-5 dark:border-[#26352f] dark:bg-[#111c17]/90 dark:hover:border-emerald-900"
                >
                  <div className="flex min-w-0 flex-col justify-between gap-4 xl:flex-row xl:items-center">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 font-mono text-sm font-bold text-slate-700 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700 dark:bg-[#0b1210] dark:text-gray-300 dark:group-hover:bg-emerald-950 dark:group-hover:text-emerald-300">
                        #{shift.id}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-gray-100">
                            Shift #{shift.id}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                              closed
                                ? "bg-slate-100 text-slate-600 dark:bg-[#26352f] dark:text-gray-300"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            }`}
                          >
                            {closed ? "Ditutup" : "Aktif"}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 dark:text-gray-400">
                          <span>
                            Mulai:{" "}
                            <strong className="font-normal text-slate-700 dark:text-gray-300">
                              {formatTanggal(shift.opened_at)}
                            </strong>
                          </span>
                          <span className="hidden text-slate-300 sm:inline">
                            •
                          </span>
                          <span>
                            Selesai:{" "}
                            <strong className="font-normal text-slate-700 dark:text-gray-300">
                              {formatTanggal(shift.closed_at)}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid min-w-0 grid-cols-2 gap-4 border-t border-slate-100 pt-3 min-[520px]:grid-cols-3 xl:flex xl:flex-wrap xl:items-center xl:justify-end xl:gap-x-6 xl:border-t-0 xl:pt-0 dark:border-[#26352f]">
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Kas Awal
                        </span>
                        <span className="break-words font-mono text-xs font-medium tabular-nums text-slate-700 sm:text-sm dark:text-gray-300">
                          {rupiah(shift.opening_cash)}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Kas Akhir
                        </span>
                        <span className="break-words font-mono text-xs font-semibold tabular-nums text-slate-800 sm:text-sm dark:text-gray-100">
                          {shift.closing_cash == null
                            ? "-"
                            : rupiah(shift.closing_cash)}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Selisih Kas
                        </span>

                        {shift.cash_difference == null ? (
                          <span className="inline-flex rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-500 dark:border-[#34443c] dark:bg-[#17231c] dark:text-gray-400">
                            -
                          </span>
                        ) : (
                          <span
                            className={`inline-flex max-w-full rounded-xl border px-2 py-1 font-mono text-xs font-bold sm:px-2.5 ${
                              difference < 0
                                ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
                                : difference > 0
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                                  : "border-slate-200 bg-slate-100 text-slate-800 dark:border-[#34443c] dark:bg-[#17231c] dark:text-gray-200"
                            }`}
                          >
                            {difference > 0
                              ? `+${rupiah(difference)}`
                              : rupiah(difference)}
                          </span>
                        )}
                      </div>

                      <div
                        className="hidden text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600 xl:block"
                        aria-hidden="true"
                      >
                        <Icon name="arrow" className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="flex flex-col items-start justify-between gap-3 pb-2 pt-3 text-xs text-slate-500 sm:flex-row sm:items-center dark:text-gray-400">
          <span>
            Menampilkan <strong>{filteredHistory.length}</strong> dari{" "}
            <strong>{history.length}</strong> shift
          </span>
          <span className="font-medium text-emerald-700 dark:text-emerald-400">
            Riwayat tersinkronisasi dengan server
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 bg-white/40 py-4 text-xs text-slate-500 backdrop-blur-sm sm:flex-row dark:border-[#26352f] dark:bg-[#111c17]/40">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-gray-200">
            POS Operasional Kasir
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-medium text-emerald-700 dark:text-emerald-400">
            Sinkronisasi Server Aktif
          </span>
        </div>
        <p className="text-center">
          © 2026 KasirKilat / LoopPOS · Rekonsiliasi kas shift
        </p>
      </footer>
    </main>
  );
}