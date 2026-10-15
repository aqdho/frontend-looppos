
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

type Produk = {
id: number;
nama: string;
qty: number;
harga: number;
gambar?: string;
};

type Transaksi = {
id: number;
tanggal: string;
total: number;
user_id?: number;
payment_method?: string;
payment_status?: string;
payment_id?: string;
payment_reference?: string;
kasir?: string;
};

type TransaksiDetail = {
id: number;
transaksi_id: number;
produk_id: number;
qty: number;
harga: number;
nama_produk?: string;
gambar?: string;
};

type DateFilter = "today" | "7d" | "month";
type ChartView = "hourly" | "daily";

const API_URL = "/api";

export default function DashboardPage() {
const router = useRouter();

const [produk, setProduk] = useState<Produk[]>([]);
const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
const [transaksiDetail, setTransaksiDetail] = useState<TransaksiDetail[]>(
[]
);

const [error, setError] = useState("");
const [loading, setLoading] = useState(true);

const [dateFilter, setDateFilter] = useState<DateFilter>("today");
const [exportOpen, setExportOpen] = useState(false);
const [chartView, setChartView] = useState<ChartView>("hourly");
const [syncing, setSyncing] = useState(false);
const [search, setSearch] = useState("");

const formatRupiah = (value: number) => {
return new Intl.NumberFormat("id-ID", {
style: "currency",
currency: "IDR",
minimumFractionDigits: 0,
maximumFractionDigits: 0,
}).format(Number(value) || 0);
};

const isToday = (tanggal: string) => {
const date = new Date(tanggal);
const today = new Date();


return (
  date.getDate() === today.getDate() &&
  date.getMonth() === today.getMonth() &&
  date.getFullYear() === today.getFullYear()
);


};

const formatJam = (tanggal: string) => {
const date = new Date(tanggal);


if (Number.isNaN(date.getTime())) {
  return "-";
}

return (
  date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }) + " WIB"
);


};

const loadDashboard = async () => {
try {
setLoading(true);
setError("");


  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [produkRes, transaksiRes] = await Promise.all([
    fetch(`${API_URL}/products`, { headers }),
    fetch(`${API_URL}/transaksi`, { headers }),
  ]);

  if (!produkRes.ok || !transaksiRes.ok) {
    throw new Error("Gagal mengambil data dashboard");
  }

  const produkData = await produkRes.json();
  const transaksiData = await transaksiRes.json();

  const produkArray = Array.isArray(produkData)
    ? produkData
    : Array.isArray(produkData?.data)
      ? produkData.data
      : [];

  const transaksiArray = Array.isArray(transaksiData)
    ? transaksiData
    : Array.isArray(transaksiData?.data)
      ? transaksiData.data
      : [];

  setProduk(produkArray);
  setTransaksi(transaksiArray);

  const detailResults = await Promise.all(
    transaksiArray.map(async (item: Transaksi) => {
      try {
        const response = await fetch(
          `${API_URL}/transaksi-detail/transaksi/${item.id}`,
          { headers }
        );

        if (!response.ok) return [];

        const data = await response.json();

        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;

        return [];
      } catch {
        return [];
      }
    })
  );

  setTransaksiDetail(detailResults.flat());
} catch (err) {
  console.error(err);
  setError("Gagal memuat data dashboard.");
} finally {
  setLoading(false);
}


};

useEffect(() => {
loadDashboard();
}, []);

const transaksiHariIni = useMemo(() => {
return transaksi.filter((item) => isToday(item.tanggal));
}, [transaksi]);

const penjualanHariIni = useMemo(() => {
return transaksiHariIni.reduce(
(total, item) => total + Number(item.total || 0),
0
);
}, [transaksiHariIni]);

const transaksiFiltered = useMemo(() => {
const now = new Date();


return transaksi.filter((item) => {
  const date = new Date(item.tanggal);

  if (Number.isNaN(date.getTime())) return false;

  if (dateFilter === "today") {
    return isToday(item.tanggal);
  }

  if (dateFilter === "7d") {
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return date >= sevenDaysAgo && date <= now;
  }

  if (dateFilter === "month") {
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  return true;
});


}, [transaksi, dateFilter]);

const filteredSales = useMemo(() => {
return transaksiFiltered.reduce(
(total, item) => total + Number(item.total || 0),
0
);
}, [transaksiFiltered]);

const filteredAverage = useMemo(() => {
if (!transaksiFiltered.length) return 0;


return filteredSales / transaksiFiltered.length;


}, [filteredSales, transaksiFiltered]);

const rataRataNilai = useMemo(() => {
if (!transaksiHariIni.length) return 0;


return penjualanHariIni / transaksiHariIni.length;


}, [penjualanHariIni, transaksiHariIni]);

const transaksiTerbaru = useMemo(() => {
return [...transaksi]
.filter((item) => isToday(item.tanggal))
.sort(
(a, b) =>
new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
)
.slice(0, 5);
}, [transaksi]);

/*

* ============================
* GRAFIK DASHBOARD
* ============================
*
* Mode:
* * hourly = hari ini, dibagi per 2 jam
* * daily  = 7 hari terakhir
*
* Semua nilai berasal dari transaksi asli.
  */

const chartData = useMemo(() => {
if (chartView === "daily") {
const result = Array(7).fill(0);
const now = new Date();


  transaksi.forEach((item) => {
    const date = new Date(item.tanggal);

    if (Number.isNaN(date.getTime())) return;

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    const transactionDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();

    const diff = Math.floor(
      (todayStart - transactionDay) / 86400000
    );

    if (diff >= 0 && diff < 7) {
      result[6 - diff] += Number(item.total || 0);
    }
  });

  return result;
}

const result = Array(7).fill(0);

transaksiHariIni.forEach((item) => {
  const date = new Date(item.tanggal);

  if (Number.isNaN(date.getTime())) return;

  const hour = date.getHours();

  const index = Math.floor((hour - 8) / 2);

  if (index >= 0 && index < 7) {
    result[index] += Number(item.total || 0);
  }
});

return result;


}, [chartView, transaksi, transaksiHariIni]);

const chartMax = Math.max(...chartData, 1);

const chartPoints = chartData.map((value, index) => {
const x = 45 + index * 100;


const y = 195 - (value / chartMax) * 150;

return {
  x,
  y: Math.max(35, Math.min(195, y)),
  value,
};


});

const chartLinePath = chartPoints
.map((point, index) => {
if (index === 0) {
return `M ${point.x} ${point.y}`;
}


  const previous = chartPoints[index - 1];
  const controlX = (previous.x + point.x) / 2;

  return `Q ${controlX} ${previous.y} ${point.x} ${point.y}`;
})
.join(" ");


const chartAreaPath =
`${chartLinePath} L ${
      chartPoints[chartPoints.length - 1]?.x || 645
    } 195 ` +
`L ${chartPoints[0]?.x || 45} 195 Z`;

const chartLabels =
chartView === "hourly"
? [
"08:00",
"10:00",
"12:00",
"14:00",
"16:00",
"18:00",
"20:00",
]
: Array.from({ length: 7 }, (_, index) => {
const date = new Date();
date.setDate(date.getDate() - (6 - index));


      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
      });
    });


const chartPeakIndex = chartData.reduce(
(maxIndex, value, index, array) =>
value > array[maxIndex] ? index : maxIndex,
0
);

const chartPeak = chartPoints[chartPeakIndex];
const chartPeakValue = chartData[chartPeakIndex] || 0;
const chartPeakLabel = chartLabels[chartPeakIndex] || "-";

const formatChartAxis = (value: number) => {
if (value >= 1_000_000) {
const juta = value / 1_000_000;


  return `${juta >= 10 ? Math.round(juta) : juta.toFixed(1)}jt`;
}

if (value >= 1_000) {
  return `${Math.round(value / 1_000)}k`;
}

return `${Math.round(value)}`;


};

const chartYAxisValues = [
chartMax,
chartMax * 0.75,
chartMax * 0.5,
0,
];

const chartPeriodText =
chartView === "hourly"
? chartPeakValue > 0
? `${chartPeakLabel} - ${String(
            Number(chartPeakLabel.slice(0, 2)) + 1
          ).padStart(2, "0")}:59 WIB`
: "Belum ada penjualan"
: chartPeakValue > 0
? `Tanggal ${chartPeakLabel}`
: "Belum ada penjualan";

const chartTitle =
chartView === "hourly"
? "Tren Penjualan Per Jam"
: "Tren Penjualan 7 Hari";

const chartSubtitle =
chartView === "hourly"
? "Pola omzet kasir hari ini berdasarkan interval waktu (WIB)"
: "Pola omzet kasir selama 7 hari terakhir";

const produkTerlaris = useMemo(() => {
const map = new Map<number, number>();


transaksiDetail.forEach((detail) => {
  const transaksiParent = transaksi.find(
    (item) => item.id === detail.transaksi_id
  );

  if (!transaksiParent || !isToday(transaksiParent.tanggal)) {
    return;
  }

  const current = map.get(detail.produk_id) || 0;

  map.set(
    detail.produk_id,
    current + Number(detail.qty || 0)
  );
});

return Array.from(map.entries())
  .map(([produkId, qty]) => {
    const item = produk.find((p) => p.id === produkId);

    return {
      id: produkId,
      nama:
        item?.nama ||
        transaksiDetail.find((d) => d.produk_id === produkId)
          ?.nama_produk ||
        "Produk",
      qty,
      harga: Number(item?.harga || 0),
      gambar:
        item?.gambar ||
        transaksiDetail.find((d) => d.produk_id === produkId)?.gambar,
    };
  })
  .sort((a, b) => b.qty - a.qty)
  .slice(0, 5);


}, [transaksiDetail, transaksi, produk]);

const produkTerlarisMaksimal = Math.max(
...produkTerlaris.map((item) => item.qty),
1
);

const getMetodePembayaran = (item: Transaksi) => {
return item.payment_method || "Pembayaran";
};

const getInitialKasir = (item: Transaksi) => {
if (!item.kasir) return "KS";


return item.kasir
  .split(" ")
  .map((part) => part.charAt(0))
  .join("")
  .slice(0, 2)
  .toUpperCase();


};

const getMetodeIcon = (item: Transaksi) => {
const metode = getMetodePembayaran(item).toLowerCase();


if (
  metode.includes("qris") ||
  metode.includes("gopay") ||
  metode.includes("ovo") ||
  metode.includes("dana")
) {
  return "qr_code_2";
}

if (
  metode.includes("debit") ||
  metode.includes("card") ||
  metode.includes("kartu")
) {
  return "credit_card";
}

return "payments";


};

const getMetodeColor = (item: Transaksi) => {
const metode = getMetodePembayaran(item).toLowerCase();


if (
  metode.includes("debit") ||
  metode.includes("card") ||
  metode.includes("kartu")
) {
  return "text-secondary";
}

return "text-primary";


};

const triggerExport = (format: "PDF" | "Excel") => {
setExportOpen(false);


if (format === "PDF") {
  alert("Export PDF belum tersedia.");
  return;
}

const dataExport = transaksiFiltered.map((item) => ({
  ID: item.id,
  Tanggal: new Date(item.tanggal).toLocaleString("id-ID"),
  Total: item.total,
  Metode_Pembayaran: getMetodePembayaran(item),
  Kasir: item.kasir || "-",
}));

if (dataExport.length === 0) {
  alert("tidak ada data transaksi untuk diekspor.");
  return;
}

const worksheet = XLSX.utils.json_to_sheet(dataExport);

const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
  workbook,
  worksheet,
  "Transaksi"
);

XLSX.writeFile(
  workbook,
  `laporan-dashboard-${dateFilter}-${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`
);


};

const handleSync = async () => {
try {
setSyncing(true);


  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [produkRes, transaksiRes] = await Promise.all([
    fetch(`${API_URL}/products`, { headers }),
    fetch(`${API_URL}/transaksi`, { headers }),
  ]);

  if (produkRes.ok) {
    const data = await produkRes.json();

    setProduk(
      Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : []
    );
  }

  if (transaksiRes.ok) {
    const data = await transaksiRes.json();

    setTransaksi(
      Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : []
    );
  }

  setTimeout(() => {
    setSyncing(false);
  }, 500);
} catch (err) {
  console.error(err);
  setSyncing(false);
  alert("Sinkronisasi gagal.");
}


};

const filteredSearchTransactions = useMemo(() => {
const keyword = search.trim().toLowerCase();


if (!keyword) return transaksiTerbaru;

return transaksiTerbaru.filter((item) => {
  return (
    String(item.id).includes(keyword) ||
    String(item.kasir || "").toLowerCase().includes(keyword) ||
    getMetodePembayaran(item).toLowerCase().includes(keyword)
  );
});


}, [search, transaksiTerbaru]);

const totalQris = transaksiHariIni.filter((item) =>
getMetodePembayaran(item).toLowerCase().includes("qris")
).length;

const totalCash = transaksiHariIni.filter((item) => {
const metode = getMetodePembayaran(item).toLowerCase();


return (
  metode.includes("cash") ||
  metode.includes("tunai") ||
  metode.includes("uang")
);


}).length;

const totalDebit = transaksiHariIni.filter((item) => {
const metode = getMetodePembayaran(item).toLowerCase();


return (
  metode.includes("debit") ||
  metode.includes("card") ||
  metode.includes("kartu")
);


}).length;

const totalMetode =
totalQris + totalCash + totalDebit || transaksiHariIni.length || 1;

const qrisPercent = Math.round((totalQris / totalMetode) * 100);
const cashPercent = Math.round((totalCash / totalMetode) * 100);
const debitPercent = Math.max(
0,
100 - qrisPercent - cashPercent
);

return (
<> <style jsx global>{`
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap");


    body {
      font-family: "Plus Jakarta Sans", sans-serif;
    }

    ::-webkit-scrollbar {
      display: none;
    }

    * {
      scrollbar-width: none;
    }
  `}</style>

  <main className="min-h-screen w-full bg-[#f8f9ff] dark:bg-[#0b1210] px-4 pb-8 pt-4 lg:px-6 lg:pt-6">
    <div className="flex w-full flex-col gap-4">

      {/* HEADER DASHBOARD */}
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#3d4a42] dark:text-[#b8c5be]">
            <span>Ringkasan Eksekutif</span>

            <span className="inline-block h-1 w-1 rounded-full bg-[#bccac0] dark:bg-[#31443b]" />

            <span className="font-bold text-[#006948] dark:text-[#28b987]">
              Live Data
            </span>
          </div>

          <h1 className="mt-0.5 text-[24px] font-bold tracking-tight text-[#0b1c30] dark:text-[#f1f5f3] lg:text-[28px]">
            Analitik Toko &amp; Pendapatan
          </h1>
        </div>

        {/* 
          TABLET:
          Filter tanggal = 1 baris penuh
          Export + Sinkronisasi = baris kedua

          DESKTOP:
          Semuanya kembali satu baris
        */}
        <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">

          {/* FILTER TANGGAL */}
          <div className="flex w-full items-center justify-center rounded-xl bg-[#eff4ff] dark:bg-[#17231e] p-1 shadow-sm lg:w-auto">
            <button
              onClick={() => setDateFilter("today")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold lg:flex-none ${
                dateFilter === "today"
                  ? "bg-white dark:bg-[#101a16] text-[#0b1c30] dark:text-[#f1f5f3] shadow-sm"
                  : "text-[#3d4a42] dark:text-[#b8c5be]"
              }`}
            >
              Hari ini
            </button>

            <button
              onClick={() => setDateFilter("7d")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold lg:flex-none ${
                dateFilter === "7d"
                  ? "bg-white dark:bg-[#101a16] text-[#0b1c30] dark:text-[#f1f5f3] shadow-sm"
                  : "text-[#3d4a42] dark:text-[#b8c5be]"
              }`}
            >
              7 Hari Terakhir
            </button>

            <button
              onClick={() => setDateFilter("month")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold lg:flex-none ${
                dateFilter === "month"
                  ? "bg-white dark:bg-[#101a16] text-[#0b1c30] dark:text-[#f1f5f3] shadow-sm"
                  : "text-[#3d4a42] dark:text-[#b8c5be]"
              }`}
            >
              Bulan Ini
            </button>
          </div>

          {/* EXPORT + SINKRONISASI */}
          <div className="flex w-full gap-2 lg:w-auto">

            <div className="relative flex-1 lg:flex-none">
              <button
                onClick={() => setExportOpen((prev) => !prev)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white dark:bg-[#101a16] px-3 py-2.5 text-[12px] font-semibold text-[#0b1c30] dark:text-[#f1f5f3] shadow-sm lg:w-auto"
              >
                <span className="material-symbols-outlined text-[18px] text-[#006948] dark:text-[#28b987]">
                  download
                </span>

                <span>Export Data</span>

                <span className="material-symbols-outlined text-[16px] text-[#3d4a42] dark:text-[#b8c5be]">
                  expand_more
                </span>
              </button>

              {exportOpen && (
                <div className="absolute right-0 z-30 mt-2 w-52 rounded-xl bg-white dark:bg-[#101a16] py-1.5 shadow-xl">
                  <button
                    onClick={() => triggerExport("PDF")}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[12px] text-[#0b1c30] dark:text-[#f1f5f3] hover:bg-[#eff4ff] dark:bg-[#17231e] dark:hover:bg-[#1d3028]"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] dark:text-[#ff9b9b]">
                      picture_as_pdf
                    </span>

                    Unduh Laporan PDF
                  </button>

                  <button
                    onClick={() => triggerExport("Excel")}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[12px] text-[#0b1c30] dark:text-[#f1f5f3] hover:bg-[#eff4ff] dark:bg-[#17231e] dark:hover:bg-[#1d3028]"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#006948] dark:text-[#28b987]">
                      table_view
                    </span>

                    Unduh Spreadsheet (.xlsx)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#006948] dark:bg-[#00a06d] px-3 py-2.5 text-[12px] font-semibold text-white dark:text-[#f1f5f3] shadow-md disabled:opacity-70 lg:flex-none"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  syncing ? "animate-spin" : ""
                }`}
              >
                sync
              </span>

              {syncing ? "Sinkronisasi..." : "Sinkronisasi"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl bg-white dark:bg-[#101a16] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#3d4a42] dark:text-[#b8c5be]">
                Total Pendapatan
              </p>

              <h2 className="mt-1 text-[22px] font-bold tracking-tight text-[#0b1c30] dark:text-[#f1f5f3]">
                {loading ? "..." : formatRupiah(filteredSales)}
              </h2>

              <p className="mt-1 text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                Berdasarkan periode yang dipilih
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e5eeff] dark:bg-[#1d3028]">
              <span className="material-symbols-outlined text-[20px] text-[#006948] dark:text-[#28b987]">
                payments
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#101a16] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#3d4a42] dark:text-[#b8c5be]">
                Total Transaksi
              </p>

              <h2 className="mt-1 text-[22px] font-bold tracking-tight text-[#0b1c30] dark:text-[#f1f5f3]">
                {loading ? "..." : transaksiFiltered.length}
              </h2>

              <p className="mt-1 text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                Transaksi pada periode aktif
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e5eeff] dark:bg-[#1d3028]">
              <span className="material-symbols-outlined text-[20px] text-[#006948] dark:text-[#28b987]">
                receipt_long
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#101a16] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#3d4a42] dark:text-[#b8c5be]">
                Rata-rata Transaksi
              </p>

              <h2 className="mt-1 text-[22px] font-bold tracking-tight text-[#0b1c30] dark:text-[#f1f5f3]">
                {loading ? "..." : formatRupiah(filteredAverage)}
              </h2>

              <p className="mt-1 text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                Nilai rata-rata per transaksi
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e5eeff] dark:bg-[#1d3028]">
              <span className="material-symbols-outlined text-[20px] text-[#006948] dark:text-[#28b987]">
                monitoring
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#101a16] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#3d4a42] dark:text-[#b8c5be]">
                Produk Terjual
              </p>

              <h2 className="mt-1 text-[22px] font-bold tracking-tight text-[#0b1c30] dark:text-[#f1f5f3]">
                {loading
                  ? "..."
                  : transaksiDetail
                      .filter((detail) => {
                        const parent = transaksi.find(
                          (item) => item.id === detail.transaksi_id
                        );

                        return (
                          parent &&
                          isToday(parent.tanggal)
                        );
                      })
                      .reduce(
                        (total, detail) =>
                          total + Number(detail.qty || 0),
                        0
                      )}
              </h2>

              <p className="mt-1 text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                Unit terjual hari ini
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e5eeff] dark:bg-[#1d3028]">
              <span className="material-symbols-outlined text-[20px] text-[#006948] dark:text-[#28b987]">
                inventory_2
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BAGIAN GRAFIK + METODE PEMBAYARAN */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="rounded-xl bg-white dark:bg-[#101a16] p-6 shadow-sm lg:col-span-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-[16px] font-bold text-[#0b1c30] dark:text-[#f1f5f3]">
                {chartTitle}
              </h2>

              <p className="mt-1 text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                {chartSubtitle}
              </p>
            </div>

            <div className="flex items-center rounded-lg bg-[#eff4ff] dark:bg-[#17231e] p-1">
              <button
                onClick={() => setChartView("hourly")}
                className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${
                  chartView === "hourly"
                    ? "bg-white dark:bg-[#101a16] text-[#0b1c30] dark:text-[#f1f5f3] shadow-sm"
                    : "text-[#3d4a42] dark:text-[#91a29a]"
                }`}
              >
                Per Jam
              </button>

              <button
                onClick={() => setChartView("daily")}
                className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${
                  chartView === "daily"
                    ? "bg-white dark:bg-[#101a16] text-[#0b1c30] dark:text-[#f1f5f3] shadow-sm"
                    : "text-[#3d4a42] dark:text-[#91a29a]"
                }`}
              >
                Per Hari
              </button>
            </div>
          </div>

          <div className="mt-5">
            <div className="relative h-[260px] w-full">
              <svg
                viewBox="0 0 700 230"
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="emeraldAreaGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#00a06d"
                      stopOpacity="0.22"
                    />

                    <stop
                      offset="100%"
                      stopColor="#00a06d"
                      stopOpacity="0"
                    />
                  </linearGradient>

                  <linearGradient
                    id="emeraldLineGrad"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor="#006948"
                    />

                    <stop
                      offset="100%"
                      stopColor="#00a06d"
                    />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3].map((line) => {
                  const y = 35 + line * 53.333;

                  return (
                    <line
                      key={line}
                      x1="45"
                      y1={y}
                      x2="645"
                      y2={y}
                      stroke="#dce9ff"
                      className="dark:stroke-[#26372f]"
                      strokeWidth="1"
                    />
                  );
                })}

                {chartYAxisValues.map((value, index) => {
                  const y = 35 + index * 53.333;

                  return (
                    <text
                      key={index}
                      x="0"
                      y={y + 4}
                      fill="#565e74"
                      className="dark:fill-[#91a29a]"
                      fontSize="10"
                    >
                      {formatChartAxis(value)}
                    </text>
                  );
                })}

                {chartData.some((value) => value > 0) ? (
                  <>
                    <path
                      d={chartAreaPath}
                      fill="url(#emeraldAreaGrad)"
                    />

                    <path
                      d={chartLinePath}
                      fill="none"
                      stroke="url(#emeraldLineGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {chartPoints.map((point, index) => (
                      <g key={index}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={index === chartPeakIndex ? 5 : 3.5}
                          fill="#ffffff"
                          className="dark:fill-[#101a16]"
                          stroke="#006948"
                          strokeWidth="2"
                        />

                        {index === chartPeakIndex && (
                          <g>
                            <rect
                              x={point.x - 45}
                              y={point.y - 52}
                              width="90"
                              height="36"
                              rx="8"
                              fill="#0b1c30"
                              className="dark:fill-[#26372f]"
                            />

                            <text
                              x={point.x}
                              y={point.y - 37}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="9"
                              fontWeight="600"
                            >
                              {chartPeriodText}
                            </text>

                            <text
                              x={point.x}
                              y={point.y - 23}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="10"
                              fontWeight="700"
                            >
                              {formatRupiah(chartPeakValue)}
                            </text>
                          </g>
                        )}
                      </g>
                    ))}
                  </>
                ) : (
                  <>
                    <line
                      x1="45"
                      y1="195"
                      x2="645"
                      y2="195"
                      stroke="#b8c4bd"
                      className="dark:stroke-[#3a4c43]"
                      strokeDasharray="5 5"
                    />

                    <text
                      x="345"
                      y="120"
                      textAnchor="middle"
                      fill="#565e74"
                      className="dark:fill-[#91a29a]"
                      fontSize="12"
                    >
                      Belum ada data penjualan
                    </text>
                  </>
                )}
              </svg>

              <div className="absolute bottom-0 left-[45px] right-[55px] flex justify-between">
                {chartLabels.map((label) => (
                  <span
                    key={label}
                    className="text-xs text-gray-500 dark:text-[#91a29a]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-xl bg-[#eff4ff]/50 dark:bg-[#17231e]/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-medium text-[#3d4a42] dark:text-[#91a29a]">
                  Performa periode aktif
                </p>

                <p className="mt-0.5 text-[13px] font-bold text-[#0b1c30] dark:text-[#f1f5f3]">
                  {formatRupiah(filteredSales)}
                </p>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#006948] dark:bg-[#28b987]" />

                  <span className="text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                    Omzet
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#dae2fd] dark:bg-[#3b5147]" />

                  <span className="text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                    Target
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#101a16] p-6 shadow-sm lg:col-span-4">
          <div>
            <h2 className="text-[16px] font-bold text-[#0b1c30] dark:text-[#f1f5f3]">
              Metode Pembayaran
            </h2>

            <p className="mt-1 text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
              Distribusi transaksi hari ini
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center">
            <div className="relative h-44 w-44">
              <svg
                viewBox="0 0 200 200"
                className="h-full w-full -rotate-90"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  fill="none"
                  stroke="#dce9ff"
                  className="dark:stroke-[#26372f]"
                  strokeWidth="22"
                />

                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  fill="none"
                  stroke="#006948"
                  className="dark:stroke-[#28b987]"
                  strokeWidth="22"
                  strokeDasharray={`${qrisPercent * 4.52} ${
                    452 - qrisPercent * 4.52
                  }`}
                  strokeLinecap="round"
                />

                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  fill="none"
                  stroke="#565e74"
                  className="dark:stroke-[#66786f]"
                  strokeWidth="22"
                  strokeDasharray={`${cashPercent * 4.52} ${
                    452 - cashPercent * 4.52
                  }`}
                  strokeDashoffset={`-${qrisPercent * 4.52}`}
                  strokeLinecap="round"
                />

                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  fill="none"
                  stroke="#dae2fd"
                  className="dark:stroke-[#3b5147]"
                  strokeWidth="22"
                  strokeDasharray={`${debitPercent * 4.52} ${
                    452 - debitPercent * 4.52
                  }`}
                  strokeDashoffset={`-${
                    (qrisPercent + cashPercent) * 4.52
                  }`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                  Total
                </span>

                <span className="text-[22px] font-bold text-[#0b1c30] dark:text-[#f1f5f3]">
                  {transaksiHariIni.length}
                </span>

                <span className="text-[10px] font-semibold text-[#006948] dark:text-[#28b987]">
                  transaksi
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-[#eff4ff]/60 dark:bg-[#17231e]/70 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#006948] dark:bg-[#28b987]" />

                <span className="text-[11px] font-semibold text-[#0b1c30] dark:text-[#f1f5f3]">
                  QRIS
                </span>
              </div>

              <span className="text-[11px] font-bold text-[#3d4a42] dark:text-[#b8c5be]">
                {qrisPercent}%
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-[#eff4ff]/60 dark:bg-[#17231e]/70 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#565e74] dark:bg-[#66786f]" />

                <span className="text-[11px] font-semibold text-[#0b1c30] dark:text-[#f1f5f3]">
                  Tunai
                </span>
              </div>

              <span className="text-[11px] font-bold text-[#3d4a42] dark:text-[#b8c5be]">
                {cashPercent}%
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-[#eff4ff]/60 dark:bg-[#17231e]/70 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#dae2fd] dark:bg-[#3b5147]" />

                <span className="text-[11px] font-semibold text-[#0b1c30] dark:text-[#f1f5f3]">
                  Debit / Kartu
                </span>
              </div>

              <span className="text-[11px] font-bold text-[#3d4a42] dark:text-[#b8c5be]">
                {debitPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TRANSAKSI + PRODUK TERLARIS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="rounded-xl bg-white dark:bg-[#101a16] p-6 shadow-sm lg:col-span-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-[16px] font-bold text-[#0b1c30] dark:text-[#f1f5f3]">
                Transaksi Terbaru
              </h2>

              <p className="mt-1 text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                Aktivitas transaksi kasir terbaru hari ini
              </p>
            </div>

            <button
              onClick={() => router.push("/laporan")}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[#006948] dark:bg-[#00a06d] px-3 py-2 text-[11px] font-semibold text-white"
            >
              Lihat Semua

              <span className="material-symbols-outlined text-[15px]">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#eff4ff] dark:bg-[#17231e] px-3 py-2">
            <span className="material-symbols-outlined text-[18px] text-[#3d4a42] dark:text-[#91a29a]">
              search
            </span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari transaksi..."
              className="w-full bg-transparent text-[12px] text-[#0b1c30] dark:text-[#f1f5f3] outline-none placeholder:text-[#7b8598] dark:placeholder:text-[#66786f]"
            />
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="bg-[#eff4ff] dark:bg-[#17231e]">
                  <th className="rounded-l-lg px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#3d4a42] dark:text-[#91a29a]">
                    Invoice
                  </th>

                  <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#3d4a42] dark:text-[#91a29a]">
                    Waktu
                  </th>

                  <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#3d4a42] dark:text-[#91a29a]">
                    Kasir
                  </th>

                  <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#3d4a42] dark:text-[#91a29a]">
                    Metode
                  </th>

                  <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-[#3d4a42] dark:text-[#91a29a]">
                    Total
                  </th>

                  <th className="rounded-r-lg px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-[#3d4a42] dark:text-[#91a29a]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-10 text-center text-[12px] text-[#3d4a42] dark:text-[#91a29a]"
                    >
                      Memuat transaksi...
                    </td>
                  </tr>
                ) : filteredSearchTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-10 text-center text-[12px] text-[#3d4a42] dark:text-[#91a29a]"
                    >
                      Belum ada transaksi.
                    </td>
                  </tr>
                ) : (
                  filteredSearchTransactions.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#dce9ff] dark:border-[#26372f] last:border-b-0 hover:bg-[#eff4ff]/40 dark:hover:bg-[#17231e]"
                    >
                      <td className="px-3 py-3">
                        <span className="text-[11px] font-bold text-[#006948] dark:text-[#28b987]">
                          #{String(item.id).padStart(5, "0")}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                          {formatJam(item.tanggal)}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dae2fd] dark:bg-[#26372f] text-[9px] font-bold text-[#3f465c] dark:text-[#b8c5be]">
                            {getInitialKasir(item)}
                          </div>

                          <span className="text-[11px] font-semibold text-[#0b1c30] dark:text-[#f1f5f3]">
                            {item.kasir || "Kasir"}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#e5eeff] dark:bg-[#1d3028] px-2 py-1 text-[10px] font-semibold text-[#0b1c30] dark:text-[#dce9e3]">
                          <span
                            className={`material-symbols-outlined text-[13px] ${getMetodeColor(
                              item
                            )}`}
                          >
                            {getMetodeIcon(item)}
                          </span>

                          {getMetodePembayaran(item)}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-right">
                        <span className="text-[11px] font-bold text-[#0b1c30] dark:text-[#f1f5f3]">
                          {formatRupiah(Number(item.total || 0))}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#85f8c4]/40 dark:bg-[#164b39] px-2 py-1 text-[10px] font-semibold text-[#005137] dark:text-[#72e0b4]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#006948] dark:bg-[#28b987]" />

                          Selesai
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#101a16] p-6 shadow-sm lg:col-span-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#0b1c30] dark:text-[#f1f5f3]">
                Produk Terlaris
              </h2>

              <p className="mt-1 text-[11px] text-[#3d4a42] dark:text-[#91a29a]">
                Produk dengan penjualan terbanyak hari ini
              </p>
            </div>

            <span className="material-symbols-outlined text-[20px] text-[#006948] dark:text-[#28b987]">
              trending_up
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="py-8 text-center text-[12px] text-[#3d4a42] dark:text-[#91a29a]">
                Memuat produk...
              </div>
            ) : produkTerlaris.length === 0 ? (
              <div className="py-8 text-center text-[12px] text-[#3d4a42] dark:text-[#91a29a]">
                Belum ada penjualan produk hari ini.
              </div>
            ) : (
              produkTerlaris.map((item, index) => {
                const percent =
                  (item.qty / produkTerlarisMaksimal) * 100;

                const imageUrl = item.gambar
                  ? `${API_URL}${item.gambar}`
                  : "";

                return (
                  <div key={item.id}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e5eeff] dark:bg-[#1d3028]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.nama}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[18px] text-[#3d4a42] dark:text-[#91a29a]">
                            inventory_2
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[11px] font-bold text-[#0b1c30] dark:text-[#f1f5f3]">
                            {item.nama}
                          </p>

                          <span className="shrink-0 text-[11px] font-bold text-[#006948] dark:text-[#28b987]">
                            {item.qty}x
                          </span>
                        </div>

                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#e5eeff] dark:bg-[#26372f]">
                          <div
                            className="h-full rounded-full bg-[#006948] dark:bg-[#28b987]"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[9px] text-[#3d4a42] dark:text-[#91a29a]">
                            {formatRupiah(item.harga)}
                          </span>

                          <span className="text-[9px] text-[#3d4a42] dark:text-[#91a29a]">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {index < produkTerlaris.length - 1 && (
                      <div className="mt-4 border-b border-[#dce9ff] dark:border-[#26372f]" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() => router.push("/produk")}
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#eff4ff] dark:bg-[#17231e] px-3 py-2.5 text-[11px] font-semibold text-[#0b1c30] dark:text-[#f1f5f3]"
          >
            Kelola Produk

            <span className="material-symbols-outlined text-[15px] text-[#006948] dark:text-[#28b987]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* RINGKASAN BAWAH */}
      

    </div>
  </main>
</>


);
}
