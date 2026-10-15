"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = "/api";

type Transaksi = {
    id: number;
    tanggal: string;
    total: number;
    bayar: number;
    payment_method?: string;
    metode_pembayaran?: string;
    nama_kasir?: string;
    cashier_name?: string;
    username?: string;
};

type DetailTransaksi = {
    id: number;
    transaksi_id: number;
    produk_id: number;
    nama: string;
    qty: number;
    harga: number;
    subtotal: number;
};

type Settings = {
    ukuran_kertas?: string;
    nama_toko?: string;
    alamat_toko?: string;
    telepon_toko?: string;
    pesan_struk?: string;
    tampil_nama?: boolean | number | string;
    tampil_alamat?: boolean | number | string;
    tampil_telepon?: boolean | number | string;
    tampil_tanggal?: boolean | number | string;
};

type Printer = {
    printer: string;
    device_id: string;
};

function Icon({
    name,
    className = "h-5 w-5",
}: {
    name: "back" | "check" | "store" | "send" | "printer" | "download" | "plus";
    className?: string;
}) {
    const common = {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };

    switch (name) {
        case "back":
            return (
                <svg {...common} viewBox="0 0 24 24">
                    <path d="M10.5 19.5 3 12l7.5-7.5M3 12h18" />
                </svg>
            );

        case "check":
            return (
                <svg {...common} viewBox="0 0 24 24">
                    <path d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            );

        case "store":
            return (
                <svg {...common} viewBox="0 0 24 24">
                    <path d="M12 8.25v-1.5m0 1.5c-1.35 0-2.7.06-4.02.17C6.85 8.51 6 9.47 6 10.61v2.51m6-4.87c1.35 0 2.7.06 4.02.17 1.13.09 1.98 1.05 1.98 2.19v2.51M15 8.25v-1.5m-6 1.5v-1.5M3 16.5l1.5.75a3.35 3.35 0 0 0 3 0 3.35 3.35 0 0 1 3 0 3.35 3.35 0 0 0 3 0 3.35 3.35 0 0 1 3 0l1.5-.75" />
                    <path d="M6 13.12a48 48 0 0 1 12 0M6 13.12c-1.07.16-1.84 1.1-1.84 2.18v5.14c0 .62.5 1.13 1.12 1.13h13.44c.62 0 1.12-.51 1.12-1.13V15.3c0-1.08-.77-2.02-1.84-2.18" />
                </svg>
            );

        case "send":
            return (
                <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
            );

        case "printer":
            return (
                <svg {...common} viewBox="0 0 24 24">
                    <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z" />
                </svg>
            );

        case "download":
            return (
                <svg {...common} viewBox="0 0 24 24">
                    <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5" />
                </svg>
            );

        case "plus":
            return (
                <svg {...common} viewBox="0 0 24 24">
                    <path d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            );
    }
}

function StrukContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const transaksiId = searchParams.get("id");

    const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
    const [detailTransaksi, setDetailTransaksi] = useState<DetailTransaksi[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [printers, setPrinters] = useState<Printer[]>([]);
    const [printerYangDipakai, setPrinterYangDipakai] = useState<Printer | null>(null);
    const [nomorPelanggan, setNomorPelanggan] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingPrint, setLoadingPrint] = useState(false);
    const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);
    const [error, setError] = useState("");

    const strukRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!transaksiId) {
            setError("ID transaksi tidak ditemukan.");
            setLoading(false);
            return;
        }

        async function loadData() {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Token login tidak ditemukan.");
                    setLoading(false);
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };

                const transaksiRes = await fetch(
                    `${API_URL}/transaksi/${transaksiId}`,
                    { headers }
                );
                const transaksiData = await transaksiRes.json();

                if (!transaksiRes.ok) {
                    throw new Error(
                        transaksiData.pesan || "Gagal mengambil transaksi."
                    );
                }

                setTransaksi(
                    transaksiData.data ||
                    transaksiData.transaksi ||
                    transaksiData
                );

                const detailRes = await fetch(
                    `${API_URL}/transaksi-detail/transaksi/${transaksiId}`,
                    { headers }
                );
                const detailData = await detailRes.json();

                if (!detailRes.ok) {
                    throw new Error(
                        detailData.pesan || "Gagal mengambil detail transaksi."
                    );
                }

                setDetailTransaksi(detailData.data || []);

                const settingsRes = await fetch(`${API_URL}/settings`, { headers });
                const settingsData = await settingsRes.json();

                if (settingsRes.ok) {
                    const dataSettings = Array.isArray(settingsData.data)
                        ? settingsData.data[0]
                        : settingsData.data ??
                          settingsData.settings ??
                          settingsData;

                    if (dataSettings) {
                        setSettings(dataSettings);
                    }
                }

                const printerRes = await fetch(
                    `${API_URL}/print-agent/printers`,
                    { headers }
                );
                const printerData = await printerRes.json();

                if (printerRes.ok) {
                    const daftarPrinter =
                        printerData.printers || printerData.data || [];

                    setPrinters(daftarPrinter);

                    if (daftarPrinter.length > 0) {
                        setPrinterYangDipakai(daftarPrinter[0]);
                    }
                }
            } catch (err) {
                console.error("ERROR LOAD STRUK:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Gagal mengambil data struk."
                );
            } finally {
                setLoading(false);
            }
        }

        void loadData();
    }, [transaksiId]);

    const formatRupiah = (angka: number) =>
        `Rp${Number(angka || 0).toLocaleString("id-ID")}`;

    const formatTanggal = (tanggal: string) =>
        new Date(tanggal).toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

    const pengaturanAktif = (
        value: boolean | number | string | undefined
    ) => {
        if (value === undefined || value === null) return true;

        return (
            value === true ||
            value === 1 ||
            value === "1" ||
            value === "true"
        );
    };

    const formatNomorWhatsApp = (nomor: string) => {
        let hasil = nomor.replace(/\D/g, "");

        if (hasil.startsWith("0")) {
            hasil = "62" + hasil.slice(1);
        } else if (hasil.startsWith("8")) {
            hasil = "62" + hasil;
        } else if (hasil && !hasil.startsWith("62")) {
            hasil = "62" + hasil;
        }

        return hasil;
    };

    const kirimWhatsApp = async () => {
        const nomor = formatNomorWhatsApp(nomorPelanggan);

        if (!nomor) {
            alert("Masukkan nomor pelanggan terlebih dahulu.");
            return;
        }

        if (!transaksi) {
            alert("Data transaksi belum tersedia.");
            return;
        }

        try {
            setLoadingWhatsApp(true);

            const token = localStorage.getItem("token");

            if (!token) {
                alert("Token login tidak ditemukan.");
                return;
            }

            const response = await fetch(
                `${API_URL}/whatsapp/struk-gambar/${transaksi.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.pesan || "Gagal membuat gambar struk.");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `struk-${transaksi.id}.png`;
            link.style.display = "none";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            await new Promise((resolve) => setTimeout(resolve, 1000));
            URL.revokeObjectURL(url);

            window.location.href = `https://wa.me/${nomor}`;
        } catch (err) {
            console.error("ERROR WHATSAPP:", err);
            alert(
                err instanceof Error
                    ? err.message
                    : "Gagal menyiapkan struk WhatsApp."
            );
        } finally {
            setLoadingWhatsApp(false);
        }
    };

    const cetakStruk = async () => {
        if (!transaksi) {
            alert("Data transaksi belum tersedia.");
            return;
        }

        if (!printerYangDipakai) {
            alert("Printer tidak tersedia.");
            return;
        }

        try {
            setLoadingPrint(true);

            const token = localStorage.getItem("token");

            if (!token) {
                alert("Token login tidak ditemukan.");
                return;
            }

            const res = await fetch(`${API_URL}/print/struk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    transaksi_id: transaksi.id,
                    printer: printerYangDipakai.printer,
                    device_id: printerYangDipakai.device_id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.pesan || "Gagal mencetak struk.");
                return;
            }

            alert(data.pesan || "Struk berhasil dicetak.");
        } catch (err) {
            console.error("ERROR CETAK STRUK:", err);
            alert("Gagal terhubung ke server.");
        } finally {
            setLoadingPrint(false);
        }
    };

    const downloadPDF = () => {
        window.print();
    };

    const transaksiBaru = () => {
        router.push("/transaksi");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#070a0f] text-slate-300">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-emerald-500/20 border-t-emerald-400" />
                    <p className="text-sm">Memuat struk...</p>
                </div>
            </div>
        );
    }

    if (error || !transaksi) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#070a0f] p-6">
                <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#111723] p-6 text-center">
                    <p className="mb-5 text-sm text-red-400">
                        {error || "Transaksi tidak ditemukan."}
                    </p>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const total = Number(transaksi.total || 0);
    const bayar = Number(transaksi.bayar || 0);
    const kembalian = Math.max(bayar - total, 0);

    const namaToko = settings?.nama_toko || "Nama Toko";
    const tanggal = transaksi.tanggal
        ? formatTanggal(transaksi.tanggal)
        : "-";

    const namaKasir =
        transaksi.nama_kasir ||
        transaksi.cashier_name ||
        transaksi.username ||
        "-";

    const metodeRaw =
        transaksi.payment_method ||
        transaksi.metode_pembayaran ||
        "Tunai";

    const metodePembayaran =
        ({
            cash: "Tunai",
            tunai: "Tunai",
            qris: "QRIS",
            transfer: "Transfer",
            debit: "Debit",
        } as Record<string, string>)[String(metodeRaw).toLowerCase()] ||
        metodeRaw;

    return (
        <div className="struk-page relative flex min-h-screen flex-col overflow-x-hidden bg-[#070a0f] text-slate-100 antialiased selection:bg-emerald-500 selection:text-white print:block print:min-h-0 print:bg-white">
            <div className="ambient-glow pointer-events-none fixed inset-0 -z-10 print:hidden" />
            <div className="pointer-events-none fixed -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-emerald-500/[0.04] blur-3xl print:hidden" />
            <div className="pointer-events-none fixed -bottom-40 -left-40 -z-10 h-96 w-96 rounded-full bg-blue-500/[0.04] blur-3xl print:hidden" />

            {/* HEADER */}
            <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#0c111a]/90 backdrop-blur-xl print:hidden">
                <div className="mx-auto flex h-[68px] w-full max-w-none items-center justify-between gap-3 px-2 sm:px-4 lg:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            title="Kembali ke kasir"
                            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#172030] text-slate-300 transition hover:border-white/20 hover:bg-[#1b2637] hover:text-white active:scale-95"
                        >
                            <Icon
                                name="back"
                                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                            />
                        </button>

                        <div className="min-w-0 leading-tight">
                            <div className="flex items-center gap-2">
                                <h1 className="max-w-[190px] truncate text-[13px] font-extrabold uppercase tracking-[0.04em] text-white sm:max-w-[260px] sm:text-sm">
                                    {namaToko}
                                </h1>
                                <span className="rounded border border-emerald-500/20 bg-emerald-500/[0.08] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-emerald-400">
                                    POS
                                </span>
                            </div>
                            <p className="mt-1 text-[10px] tracking-wide text-slate-500 sm:text-[11px]">
                                KasirKilat · Struk Transaksi
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-lg border border-white/[0.06] bg-[#111723] px-3 py-2 text-[11px] text-slate-300 sm:flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span>Transaksi Selesai</span>
                            <span className="text-slate-700">|</span>
                            <span className="font-mono text-slate-400">
                                #{transaksi.id}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={transaksiBaru}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[11px] font-semibold text-slate-200 transition hover:bg-white/[0.09] sm:px-4 sm:text-xs"
                        >
                            <span className="hidden xs:inline">
                                Selesai &amp; Kasir Baru
                            </span>
                            <span className="xs:hidden">Kasir Baru</span>
                            <Icon name="plus" className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* KONTEN */}
            <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-10 print:block print:p-0">
                {/* STATUS TRANSAKSI */}
                <div className="mb-8 text-center sm:mb-9 print:hidden">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400 shadow-[0_0_28px_rgba(34,197,94,0.10)]">
                        <Icon name="check" className="h-5 w-5" />
                    </div>
                    <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-white sm:text-[26px]">
                        Pembayaran Sukses
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-[13px]">
                        Struk siap dicetak atau dibagikan kepada pelanggan.
                    </p>
                </div>

                <div className="mx-auto grid w-full max-w-[1020px] grid-cols-1 items-start gap-6 lg:grid-cols-[390px_minmax(0,1fr)] lg:gap-8 print:block">
                    {/* STRUK */}
                    <section
                        aria-label="Pratinjau struk"
                        className="flex w-full justify-center lg:justify-start print:block"
                    >
                        <article
                            id="printable-receipt"
                            ref={strukRef}
                            className="relative w-full max-w-[390px] overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-[0_18px_50px_rgba(0,0,0,0.28)] print:mx-0 print:max-w-none print:rounded-none print:border-0 print:shadow-none"
                        >
                            <div className="hidden print:hidden" />

                            <div className="space-y-5 p-5 sm:p-6 print:space-y-3 print:p-3">
                                {/* IDENTITAS TOKO */}
                                <div className="space-y-1 border-b border-dashed border-slate-300 pb-4 text-center">
                                    <div className="mb-1 inline-flex rounded-full border border-slate-200 p-1.5">
                                        <Icon
                                            name="store"
                                            className="h-[18px] w-[18px] text-slate-800"
                                        />
                                    </div>

                                    {pengaturanAktif(settings?.tampil_nama) && (
                                        <h3 className="break-words font-mono text-lg font-black uppercase tracking-[0.07em] text-slate-950">
                                            {namaToko}
                                        </h3>
                                    )}

                                    {pengaturanAktif(settings?.tampil_alamat) &&
                                        settings?.alamat_toko && (
                                            <p className="whitespace-pre-wrap break-words text-[11px] leading-relaxed text-slate-500">
                                                {settings.alamat_toko}
                                            </p>
                                        )}

                                    {pengaturanAktif(settings?.tampil_telepon) &&
                                        settings?.telepon_toko && (
                                            <p className="font-mono text-[10px] text-slate-500">
                                                Telp: {settings.telepon_toko}
                                            </p>
                                        )}
                                </div>

                                {/* TANGGAL DAN KASIR */}
                                <div className="flex items-start justify-between gap-3 pb-1 font-mono text-[10px] leading-relaxed text-slate-500">
                                    <span className="min-w-0">
                                        {pengaturanAktif(settings?.tampil_tanggal)
                                            ? tanggal
                                            : ""}
                                    </span>
                                    <span className="max-w-[45%] shrink-0 break-words text-right font-medium text-slate-700">
                                        KASIR: {namaKasir}
                                    </span>
                                </div>

                                {/* DAFTAR BARANG */}
                                <div className="border-y border-dashed border-slate-300 py-3">
                                    <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                                        {detailTransaksi.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-start justify-between gap-3"
                                            >
                                                <div className="min-w-0 flex-1 pr-2">
                                                    <p className="break-words font-semibold uppercase text-slate-900">
                                                        {item.nama}
                                                    </p>
                                                    <p className="mt-0.5 text-[10px] text-slate-500">
                                                        {item.qty} ×{" "}
                                                        {formatRupiah(Number(item.harga))}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 whitespace-nowrap text-right font-medium text-slate-900">
                                                    {formatRupiah(Number(item.subtotal))}
                                                </span>
                                            </div>
                                        ))}

                                        {detailTransaksi.length === 0 && (
                                            <p className="py-2 text-center text-[11px] text-slate-400">
                                                Detail barang tidak tersedia.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* TOTAL DAN PEMBAYARAN */}
                                <div className="space-y-2 font-mono text-[11px]">
                                    <div className="flex items-baseline justify-between gap-3 pt-1 text-sm font-extrabold text-slate-950">
                                        <span>TOTAL</span>
                                        <span className="text-right text-base">
                                            {formatRupiah(total)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 pt-1 text-slate-600">
                                        <span>Bayar ({metodePembayaran})</span>
                                        <span className="text-right font-medium text-slate-900">
                                            {formatRupiah(bayar)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 text-slate-600">
                                        <span>Kembali</span>
                                        <span className="text-right font-semibold text-emerald-700">
                                            {formatRupiah(kembalian)}
                                        </span>
                                    </div>
                                </div>

                                {/* FOOTER STRUK */}
                                <div className="space-y-3 border-t border-dashed border-slate-300 pt-4 text-center">
                                    <p className="text-[11px] font-semibold text-slate-800">
                                        Terima Kasih 🙏
                                    </p>

                                    <div
                                        aria-label="Barcode transaksi"
                                        className="flex justify-center pt-1"
                                    >
                                        <svg
                                            className="h-9 w-40 text-slate-900 opacity-80"
                                            viewBox="0 0 160 38"
                                            fill="currentColor"
                                        >
                                            {[
                                                [0, 3], [5, 2], [9, 4], [16, 1],
                                                [19, 3], [25, 2], [30, 5], [38, 2],
                                                [42, 4], [48, 1], [52, 3], [57, 2],
                                                [62, 6], [71, 2], [75, 3], [80, 1],
                                                [84, 5], [91, 2], [95, 4], [102, 2],
                                                [106, 1], [110, 4], [116, 3], [122, 2],
                                                [127, 5], [135, 2], [140, 3], [146, 1],
                                                [150, 4], [157, 3],
                                            ].map(([x, width], index) => (
                                                <rect
                                                    key={index}
                                                    x={x}
                                                    y="0"
                                                    width={width}
                                                    height="38"
                                                />
                                            ))}
                                        </svg>
                                    </div>

                                    <span className="block break-all font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400">
                                        LOOPPOS-{transaksi.id}
                                    </span>
                                </div>
                            </div>

                            <div className="hidden print:hidden" />
                        </article>
                    </section>

                    {/* PANEL AKSI */}
                    <section
                        aria-label="Panel tindakan"
                        className="w-full min-w-0 space-y-5 print:hidden"
                    >
                        {/* WHATSAPP */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c111a]/90 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-6">
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400">
                                        <svg
                                            className="h-6 w-6"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-label="Logo WhatsApp"
                                            role="img"
                                        >
                                            <path d="M20.52 3.48A11.78 11.78 0 0 0 12.13 0C5.57 0 .23 5.34.23 11.9c0 2.1.55 4.15 1.6 5.96L.13 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.56 0 11.9-5.34 11.9-11.9a11.8 11.8 0 0 0-3.51-8.42ZM12.13 21.8a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.86 9.86 0 0 1-1.52-5.26c0-5.47 4.45-9.92 9.92-9.92a9.85 9.85 0 0 1 7.02 2.91 9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.89-9.93 9.89Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <h4 className="text-[13px] font-bold tracking-tight text-white sm:text-sm">
                                            Kirim Struk Digital
                                        </h4>
                                        <p className="mt-1 text-[11px] leading-relaxed text-slate-400 sm:text-xs">
                                            Kirim nota kepada pelanggan via WhatsApp
                                        </p>
                                    </div>
                                </div>

                                <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1 font-mono text-[9px] font-medium text-emerald-400 sm:text-[10px]">
                                    Paperless
                                </span>
                            </div>

                            <form
                                className="space-y-3"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    void kirimWhatsApp();
                                }}
                            >
                                <label
                                    htmlFor="wa-input"
                                    className="block text-[11px] font-medium text-slate-300 sm:text-xs"
                                >
                                    Nomor Pelanggan
                                </label>

                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 font-mono text-xs text-slate-400">
                                        +62
                                    </span>
                                    <input
                                        id="wa-input"
                                        name="phone"
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        value={nomorPelanggan}
                                        onChange={(e) =>
                                            setNomorPelanggan(e.target.value)
                                        }
                                        placeholder="8xxxxxxxxxx"
                                        className="block h-11 w-full rounded-xl border border-white/10 bg-[#070a0f] pl-12 pr-4 font-mono text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10 sm:text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loadingWhatsApp}
                                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold tracking-wide text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                                >
                                    {loadingWhatsApp ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Menyiapkan Struk...
                                        </>
                                    ) : (
                                        <>
                                            {/* Logo WhatsApp */}
                                            <svg
                                                className="h-5 w-5 shrink-0"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path d="M20.52 3.48A11.78 11.78 0 0 0 12.13 0C5.57 0 .23 5.34.23 11.9c0 2.1.55 4.15 1.6 5.96L.13 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.56 0 11.9-5.34 11.9-11.9a11.8 11.8 0 0 0-3.51-8.42ZM12.13 21.8a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.86 9.86 0 0 1-1.52-5.26c0-5.47 4.45-9.92 9.92-9.92a9.85 9.85 0 0 1 7.02 2.91 9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.89-9.93 9.89Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
                                            </svg>
                                            Kirim WhatsApp
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* PRINTER */}
                        <div className="space-y-5 rounded-2xl border border-white/[0.08] bg-[#0c111a]/90 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/[0.08] text-blue-400">
                                        <Icon name="printer" className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <h4 className="text-[13px] font-bold tracking-tight text-white sm:text-sm">
                                            Cetak Struk Fisik
                                        </h4>
                                        <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                                            Printer thermal POS 58/80 mm
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium ${
                                        printerYangDipakai
                                            ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400"
                                            : "border-red-500/20 bg-red-500/[0.08] text-red-400"
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            printerYangDipakai
                                                ? "bg-emerald-400"
                                                : "bg-red-400"
                                        }`}
                                    />
                                    {printerYangDipakai ? "Siap" : "Offline"}
                                </div>
                            </div>

                            {printerYangDipakai && (
                                <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#070a0f]/80 p-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <Icon
                                            name="printer"
                                            className="h-4 w-4 shrink-0 text-slate-500"
                                        />
                                        <span className="truncate font-mono text-[11px] font-medium text-slate-300">
                                            {printerYangDipakai.printer}
                                        </span>
                                    </div>
                                    <span className="max-w-[40%] shrink-0 truncate font-mono text-[10px] text-slate-500">
                                        {printerYangDipakai.device_id}
                                    </span>
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="pilih-printer"
                                    className="mb-2 block text-[11px] font-medium text-slate-300 sm:text-xs"
                                >
                                    Pilih Printer
                                </label>

                                {printers.length === 0 ? (
                                    <p className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3 text-xs leading-relaxed text-red-400">
                                        Tidak ada printer yang tersedia. Periksa koneksi print bridge.
                                    </p>
                                ) : (
                                    <select
                                        id="pilih-printer"
                                        value={
                                            printerYangDipakai
                                                ? String(
                                                      printers.findIndex(
                                                          (printer) =>
                                                              printer.device_id ===
                                                                  printerYangDipakai.device_id &&
                                                              printer.printer ===
                                                                  printerYangDipakai.printer
                                                      )
                                                  )
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const selected =
                                                printers[Number(e.target.value)];
                                            setPrinterYangDipakai(selected || null);
                                        }}
                                        className="block h-11 w-full rounded-xl border border-white/10 bg-[#070a0f] px-3 text-xs text-white outline-none transition focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10 sm:text-sm"
                                    >
                                        {printers.map((printer, index) => (
                                            <option
                                                key={`${printer.device_id}-${printer.printer}-${index}`}
                                                value={String(index)}
                                                className="bg-[#070a0f]"
                                            >
                                                {printer.printer} — {printer.device_id}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => void cetakStruk()}
                                disabled={loadingPrint || !printerYangDipakai}
                                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-bold tracking-wide text-white shadow-lg shadow-indigo-950/20 transition hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                            >
                                {loadingPrint ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Mencetak...
                                    </>
                                ) : (
                                    <>
                                        <Icon
                                            name="printer"
                                            className="h-4 w-4 text-indigo-200 transition-transform group-hover:scale-110"
                                        />
                                        Cetak Struk Sekarang
                                    </>
                                )}
                            </button>
                        </div>

                        {/* AKSI BAWAH */}
                        <div className="grid grid-cols-2 gap-3 pt-0.5">
                            <button
                                type="button"
                                onClick={downloadPDF}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111723] px-3 py-3 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-[#172030] hover:text-white"
                            >
                                <Icon
                                    name="download"
                                    className="h-4 w-4 text-slate-400"
                                />
                                Download PDF
                            </button>

                            <button
                                type="button"
                                onClick={transaksiBaru}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-[#070a0f] transition hover:bg-slate-200 active:scale-[0.99]"
                            >
                                <Icon
                                    name="plus"
                                    className="h-4 w-4 text-[#070a0f]"
                                />
                                Transaksi Baru
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="mt-auto w-full border-t border-white/[0.06] py-5 text-xs text-slate-500 print:hidden">
                <div className="flex w-full flex-col items-center justify-between gap-2 px-2 sm:flex-row sm:px-4 lg:px-6">
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] tracking-wide text-slate-400 sm:text-[11px]">
                            KasirKilat POS · Struk Transaksi
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                        KasirKilat © 2026
                    </p>
                </div>
            </footer>

            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

                .struk-page {
                    font-family: "Plus Jakarta Sans", sans-serif;
                }

                .struk-page .font-mono {
                    font-family: "DM Mono", monospace;
                    font-variant-numeric: tabular-nums;
                }

                .ambient-glow {
                    background: radial-gradient(
                        ellipse at 50% 10%,
                        rgba(34, 197, 94, 0.07) 0%,
                        rgba(7, 10, 15, 0) 65%
                    );
                }

                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }

                    html,
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        color: #000000 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    body * {
                        visibility: hidden !important;
                    }

                    #printable-receipt,
                    #printable-receipt * {
                        visibility: visible !important;
                    }

                    .struk-page {
                        display: block !important;
                        min-height: 0 !important;
                        height: auto !important;
                        overflow: visible !important;
                        background: #ffffff !important;
                    }

                    #printable-receipt {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        display: block !important;
                        box-sizing: border-box !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        height: auto !important;
                        margin: 0 !important;
                        border: 0 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                        overflow: visible !important;
                        background: #ffffff !important;
                        color: #000000 !important;
                    }

                    #printable-receipt .print\\:hidden {
                        display: none !important;
                    }

                    #printable-receipt .print\\:p-3 {
                        padding: 12px !important;
                    }

                    #printable-receipt .print\\:space-y-3 > :not(:last-child) {
                        margin-bottom: 12px !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default function Struk() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#070a0f] text-sm text-slate-300">
                    Memuat struk...
                </div>
            }
        >
            <StrukContent />
        </Suspense>
    );
}