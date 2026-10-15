"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  IconCalendar,
  IconDownload,
  IconRefresh,
  IconSearch,
  IconFilter,
  IconChartBar,
  IconReceipt,
  IconTrendingUp,
  IconPackage,
  IconClock,
  IconEye,
  IconChevronLeft,
  IconChevronRight,
  IconCash,
  IconCreditCard,
  IconQrcode,
  IconBuildingBank,
  IconShoppingCart,
  IconChartPie,
  IconWallet,
} from "@tabler/icons-react";
import * as XLSX from "xlsx";

type Transaksi = {
  id: number;
  tanggal: string;
  total: number;
  subtotal?: number;
  pajak?: number;
  service_charge?: number;
  bayar: number;
  nama_kasir?: string;
  kasir?: string;
  payment_method?: string;
  payment_status?: string;
  payment_id?: string;
  payment_reference?: string;
  status?: string;
};

type DetailTransaksi = {
  id: number;
  transaksi_id: number;
  produk_id: number;
  qty: number;
  harga: number;
  subtotal: number;
  harga_modal?: number;
  hpp?: number;
};

type Produk = {
  id: number;
  nama: string;
  qty: number;
  harga: number;
  harga_modal?: number;
  hpp?: number;
  id_kategori: number;
  gambar?: string;
  nama_kategori?: string;
  aktif?: boolean;
};

const API_URL = "/api";

export default function LaporanPage() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [detail, setDetail] = useState<DetailTransaksi[]>([]);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [transaksiPerPage, setTransaksiPerPage] = useState(10);

  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [searchInvoice, setSearchInvoice] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const keyword = searchParams.get("search");

    if (keyword !== null) {
      setSearchInvoice(keyword);
    }
  }, [searchParams]);

  const [quickRange, setQuickRange] = useState("Hari Ini");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterMetode, setFilterMetode] = useState("Semua");
  const [filterKasir, setFilterKasir] = useState("Semua");

  const tanggalMulaiRef = useRef<HTMLInputElement>(null);
  const tanggalSelesaiRef = useRef<HTMLInputElement>(null);

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
  });

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(angka || 0));
  };

  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTanggalPendek = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatWaktu = (tanggal: string) => {
    return new Date(tanggal).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getKasir = (item: Transaksi) => {
    return item.nama_kasir || item.kasir || "—";
  };

  const getMetode = (item: Transaksi) => {
    return item.payment_method || "";
  };

  /*
   * Status transaksi dan status pembayaran dipisahkan.
   * Pembayaran pending tidak boleh dihitung sebagai penjualan selesai.
   */
  const getStatus = (item: Transaksi) => {
    const paymentStatus = String(item.payment_status || "")
      .trim()
      .toLowerCase();

    const transactionStatus = String(item.status || "")
      .trim()
      .toLowerCase();

    const cancelledStatuses = [
      "void",
      "dibatalkan",
      "cancelled",
      "canceled",
      "failed",
      "gagal",
      "expired",
      "kedaluwarsa",
    ];

    const pendingStatuses = [
      "pending",
      "waiting",
      "unpaid",
      "menunggu",
      "menunggu pembayaran",
    ];

    const paidStatuses = [
      "paid",
      "success",
      "succeeded",
      "settled",
      "capture",
      "captured",
      "berhasil",
      "selesai",
      "completed",
      "complete",
    ];

    // Status pembatalan selalu didahulukan.
    if (
      cancelledStatuses.includes(transactionStatus) ||
      cancelledStatuses.includes(paymentStatus)
    ) {
      return "Dibatalkan";
    }

    // Pembayaran yang belum berhasil tidak dihitung sebagai penjualan.
    if (
      pendingStatuses.includes(paymentStatus) ||
      pendingStatuses.includes(transactionStatus)
    ) {
      return "Menunggu Pembayaran";
    }

    // Status pembayaran berhasil.
    if (
      paidStatuses.includes(paymentStatus) ||
      paidStatuses.includes(transactionStatus)
    ) {
      return "Selesai";
    }

    // Kompatibilitas dengan transaksi lama tanpa status.
    if (!paymentStatus && !transactionStatus) {
      return "Selesai";
    }

    // Status tidak dikenal tidak otomatis dianggap lunas.
    return "Menunggu Pembayaran";
  };

  const getBayarLaporan = (item: Transaksi) => {
    const metode = getMetode(item).toLowerCase();
    const total = Number(item.total || 0);
    const bayar = Number(item.bayar || 0);

    if (
      metode === "qris" ||
      metode === "debit" ||
      metode === "kartu" ||
      metode === "transfer"
    ) {
      return total;
    }

    return bayar;
  };

  const getKembalianLaporan = (item: Transaksi) => {
    const metode = getMetode(item).toLowerCase();

    if (
      metode === "qris" ||
      metode === "debit" ||
      metode === "kartu" ||
      metode === "transfer"
    ) {
      return 0;
    }

    return Math.max(
      0,
      Number(item.bayar || 0) - Number(item.total || 0)
    );
  };

  const formatInvoice = (item: Transaksi) => {
    const date = new Date(item.tanggal);
    const tahun = date.getFullYear();
    const bulan = String(date.getMonth() + 1).padStart(2, "0");
    const hari = String(date.getDate()).padStart(2, "0");

    return `TRX-${tahun}${bulan}${hari}-${String(item.id).padStart(4, "0")}`;
  };

  const formatTanggalInput = (tanggal: string) => {
    if (!tanggal) return "";

    const [tahun, bulan, hari] = tanggal.split("-").map(Number);

    if (!tahun || !bulan || !hari) {
      return "";
    }

    const namaBulan = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    return `${hari} ${namaBulan[bulan - 1]} ${tahun}`;
  };

  const bukaDatePicker = (
    ref: React.RefObject<HTMLInputElement | null>
  ) => {
    const input = ref.current;

    if (!input) return;

    try {
      input.showPicker();
    } catch {
      input.focus();
      input.click();
    }
  };

  const showPopup = (title: string, message: string) => {
    setPopup({
      show: true,
      title,
      message,
    });
  };

  const closePopup = () => {
    setPopup({
      show: false,
      title: "",
      message: "",
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const [transaksiRes, detailRes, produkRes] = await Promise.all([
        fetch(`${API_URL}/transaksi`, { headers }),
        fetch(`${API_URL}/transaksi-detail`, { headers }),
        fetch(`${API_URL}/products`, { headers }),
      ]);

      const transaksiData = await transaksiRes.json();
      const detailData = await detailRes.json();
      const produkData = await produkRes.json();

      console.log("DETAIL TRANSAKSI LAPORAN:", detailData.data);
      console.log("PRODUK LAPORAN:", produkData);

      if (!transaksiRes.ok) {
        showPopup(
          "Gagal Mengambil Transaksi",
          transaksiData.pesan || "Data transaksi gagal diambil."
        );
        return;
      }

      if (!detailRes.ok) {
        showPopup(
          "Gagal Mengambil Detail",
          detailData.pesan || "Detail transaksi gagal diambil."
        );
        return;
      }

      if (!produkRes.ok) {
        showPopup(
          "Gagal Mengambil Produk",
          produkData.pesan || "Data produk gagal diambil."
        );
        return;
      }

      const transaksiList: Transaksi[] = Array.isArray(transaksiData)
        ? transaksiData
        : transaksiData.data || [];

      const detailList: DetailTransaksi[] = Array.isArray(detailData)
        ? detailData
        : detailData.data || [];

      const produkList: Produk[] = Array.isArray(produkData)
        ? produkData
        : produkData.data || [];

      console.log(
        "PRODUK GAMBAR LAPORAN:",
        produkList.map((p) => ({
          id: p.id,
          nama: p.nama,
          gambar: p.gambar,
        }))
      );

      setTransaksi(transaksiList);
      setDetail(detailList);
      setProduk(produkList);
    } catch (error) {
      console.error(error);

      showPopup(
        "Server Tidak Terhubung",
        "Pastikan backend Express sedang berjalan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    tanggalMulai,
    tanggalSelesai,
    searchInvoice,
    transaksiPerPage,
    filterStatus,
    filterMetode,
    filterKasir,
  ]);

  const getProduk = (produkId: number) => {
    return produk.find(
      (item) => Number(item.id) === Number(produkId)
    );
  };

  /*
   * HPP menggunakan snapshot harga_modal dari detail transaksi.
   * Fallback ke data produk hanya jika snapshot tidak tersedia.
   */
  const getHargaModal = (produkId: number) => {
    const product = getProduk(produkId);

    if (!product) {
      return 0;
    }

    return Number(product.harga_modal ?? product.hpp ?? 0);
  };

  const getHppDetail = (item: DetailTransaksi) => {
    const hppDetail = Number(item.harga_modal ?? item.hpp ?? 0);

    if (hppDetail > 0) {
      return hppDetail;
    }

    return getHargaModal(item.produk_id);
  };

  const transaksiTanggalFiltered = useMemo(() => {
    return transaksi.filter((item) => {
      const tanggal = new Date(item.tanggal);

      const tahun = tanggal.getFullYear();
      const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
      const hari = String(tanggal.getDate()).padStart(2, "0");

      const tanggalTransaksi = `${tahun}-${bulan}-${hari}`;

      if (tanggalMulai && tanggalTransaksi < tanggalMulai) {
        return false;
      }

      if (tanggalSelesai && tanggalTransaksi > tanggalSelesai) {
        return false;
      }

      return true;
    });
  }, [transaksi, tanggalMulai, tanggalSelesai]);

  const transaksiFiltered = useMemo(() => {
    const keyword = searchInvoice.trim().toLowerCase();

    return transaksiTanggalFiltered
      .filter((item) => {
        const invoice = formatInvoice(item).toLowerCase();
        const id = String(item.id).toLowerCase();
        const kasir = getKasir(item);
        const metode = getMetode(item);

        const cocokSearch =
          !keyword ||
          invoice.includes(keyword) ||
          id.includes(keyword) ||
          kasir.toLowerCase().includes(keyword) ||
          metode.toLowerCase().includes(keyword);

        const cocokStatus =
          filterStatus === "Semua" ||
          getStatus(item) === filterStatus;

        const cocokMetode =
          filterMetode === "Semua" ||
          metode.toLowerCase() === filterMetode.toLowerCase();

        const cocokKasir =
          filterKasir === "Semua" ||
          kasir === filterKasir;

        return (
          cocokSearch &&
          cocokStatus &&
          cocokMetode &&
          cocokKasir
        );
      })
      .sort((a, b) => {
        const dateDiff =
          new Date(b.tanggal).getTime() -
          new Date(a.tanggal).getTime();

        if (dateDiff !== 0) {
          return dateDiff;
        }

        return b.id - a.id;
      });
  }, [
    transaksiTanggalFiltered,
    searchInvoice,
    filterStatus,
    filterMetode,
    filterKasir,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(transaksiFiltered.length / transaksiPerPage)
  );

  const transaksiPaginated = useMemo(() => {
    const start = (currentPage - 1) * transaksiPerPage;
    const end = start + transaksiPerPage;

    return transaksiFiltered.slice(start, end);
  }, [transaksiFiltered, currentPage, transaksiPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const transaksiIds = useMemo(() => {
    return new Set(transaksiFiltered.map((item) => item.id));
  }, [transaksiFiltered]);

  const detailFiltered = useMemo(() => {
    return detail.filter((item) =>
      transaksiIds.has(item.transaksi_id)
    );
  }, [detail, transaksiIds]);

  const transaksiSelesai = useMemo(() => {
    return transaksiFiltered.filter(
      (item) => getStatus(item) === "Selesai"
    );
  }, [transaksiFiltered]);

  const transaksiSelesaiIds = useMemo(() => {
    return new Set(transaksiSelesai.map((item) => item.id));
  }, [transaksiSelesai]);

  const detailSelesai = useMemo(() => {
    return detail.filter((item) =>
      transaksiSelesaiIds.has(item.transaksi_id)
    );
  }, [detail, transaksiSelesaiIds]);

  /*
   * Pendapatan laba kotor menggunakan subtotal.
   * PB1 dan service charge tidak dimasukkan sebagai laba toko.
   */
  const totalPendapatan = useMemo(() => {
    return transaksiSelesai.reduce((total, item) => {
      const subtotal = Number(item.subtotal ?? 0);
      const pajak = Number(item.pajak || 0);
      const service = Number(item.service_charge || 0);

      const pendapatan =
        item.subtotal != null
          ? subtotal
          : Math.max(
              0,
              Number(item.total || 0) - pajak - service
            );

      return total + pendapatan;
    }, 0);
  }, [transaksiSelesai]);

  const jumlahTransaksi = transaksiSelesai.length;

  const totalHPP = useMemo(() => {
    return detailSelesai.reduce((total, item) => {
      return total + getHppDetail(item) * Number(item.qty || 0);
    }, 0);
  }, [detailSelesai, produk]);

  const labaKotor = totalPendapatan - totalHPP;

  const marginLaba =
    totalPendapatan > 0
      ? (labaKotor / totalPendapatan) * 100
      : 0;

  const totalBarangTerjual = useMemo(() => {
    return detailSelesai.reduce(
      (total, item) => total + Number(item.qty || 0),
      0
    );
  }, [detailSelesai]);

  const rataRata =
    jumlahTransaksi > 0
      ? totalPendapatan / jumlahTransaksi
      : 0;

  const productSales = useMemo(() => {
    const map = new Map<
      number,
      {
        id: number;
        nama: string;
        kategori: string;
        gambar?: string;
        qty: number;
        omzet: number;
        hpp: number;
        laba: number;
      }
    >();

    detailSelesai.forEach((item) => {
      const product = getProduk(item.produk_id);
      const id = Number(item.produk_id);
      const existing = map.get(id);
      const qty = Number(item.qty || 0);
      const omzet = Number(item.subtotal ?? item.harga * qty);
      const hpp = getHppDetail(item) * qty;

      if (existing) {
        existing.qty += qty;
        existing.omzet += omzet;
        existing.hpp += hpp;
        existing.laba += omzet - hpp;
      } else {
        map.set(id, {
          id,
          nama: product?.nama || `Produk #${id}`,
          kategori: product?.nama_kategori || "Tanpa Kategori",
          gambar: product?.gambar,
          qty,
          omzet,
          hpp,
          laba: omzet - hpp,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => b.qty - a.qty
    );
  }, [detailSelesai, produk]);

  const produkTerlaris = productSales.slice(0, 5);

  const categorySales = useMemo(() => {
    const map = new Map<
      string,
      {
        nama: string;
        qty: number;
        omzet: number;
        hpp: number;
        laba: number;
      }
    >();

    productSales.forEach((item) => {
      const kategori = item.kategori || "Tanpa Kategori";
      const existing = map.get(kategori);

      if (existing) {
        existing.qty += item.qty;
        existing.omzet += item.omzet;
        existing.hpp += item.hpp;
        existing.laba += item.laba;
      } else {
        map.set(kategori, {
          nama: kategori,
          qty: item.qty,
          omzet: item.omzet,
          hpp: item.hpp,
          laba: item.laba,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => b.omzet - a.omzet
    );
  }, [productSales]);

  const hourlySales = useMemo(() => {
    const hours = [8, 10, 12, 14, 16, 18, 20, 22];

    return hours.map((hour) => {
      const endHour = hour === 22 ? 24 : hour + 2;

      const value = transaksiSelesai.reduce((total, item) => {
        const date = new Date(item.tanggal);
        const itemHour = date.getHours();

        if (itemHour >= hour && itemHour < endHour) {
          return total + Number(item.total || 0);
        }

        return total;
      }, 0);

      return { hour, value };
    });
  }, [transaksiSelesai]);

  const maxHourlySales = useMemo(() => {
    return Math.max(
      ...hourlySales.map((item) => item.value),
      1
    );
  }, [hourlySales]);

  const peakHour = useMemo(() => {
    if (!hourlySales.length) {
      return null;
    }

    return hourlySales.reduce(
      (max, item) => item.value > max.value ? item : max,
      hourlySales[0]
    );
  }, [hourlySales]);

  const paymentData = useMemo(() => {
    const result = [
      {
        key: "qris",
        label: "QRIS Dinamis",
        icon: IconQrcode,
        value: 0,
        count: 0,
      },
      {
        key: "cash",
        label: "Uang Tunai (Cash)",
        icon: IconCash,
        value: 0,
        count: 0,
      },
      {
        key: "debit",
        label: "Kartu Debit (EDC)",
        icon: IconCreditCard,
        value: 0,
        count: 0,
      },
      {
        key: "transfer",
        label: "Transfer",
        icon: IconBuildingBank,
        value: 0,
        count: 0,
      },
    ];

    transaksiSelesai.forEach((item) => {
      const metode = getMetode(item).toLowerCase().trim();

      let target: (typeof result)[number] | undefined;

      if (metode.includes("qris") || metode.includes("qr")) {
        target = result[0];
      } else if (
        metode.includes("cash") ||
        metode.includes("tunai")
      ) {
        target = result[1];
      } else if (
        metode.includes("debit") ||
        metode.includes("kartu") ||
        metode.includes("edc")
      ) {
        target = result[2];
      } else if (metode.includes("transfer")) {
        target = result[3];
      }

      if (target) {
        target.value += Number(item.total || 0);
        target.count += 1;
      }
    });

    return result;
  }, [transaksiSelesai]);

  const totalPaymentValue = useMemo(() => {
    return paymentData.reduce(
      (total, item) => total + item.value,
      0
    );
  }, [paymentData]);

  const rekonsiliasiKas = useMemo(() => {
    const transaksiCash = transaksiSelesai.filter((item) => {
      const metode = getMetode(item).toLowerCase().trim();

      return metode === "cash" || metode === "tunai";
    });

    const penjualanCash = transaksiCash.reduce(
      (total, item) => total + Number(item.total || 0),
      0
    );

    const uangDiterima = transaksiCash.reduce(
      (total, item) => total + Number(item.bayar || 0),
      0
    );

    const kembalian = transaksiCash.reduce(
      (total, item) => total + getKembalianLaporan(item),
      0
    );

    return {
      jumlah: transaksiCash.length,
      penjualanCash,
      uangDiterima,
      kembalian,
      kasBersih: uangDiterima - kembalian,
    };
  }, [transaksiSelesai]);

  const setRange = (range: string) => {
    const today = new Date();

    const toInputDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const end = toInputDate(today);
    const startDate = new Date(today);

    if (range === "Hari Ini") {
      setTanggalMulai(end);
      setTanggalSelesai(end);
    }

    if (range === "7 Hari") {
      startDate.setDate(today.getDate() - 6);
      setTanggalMulai(toInputDate(startDate));
      setTanggalSelesai(end);
    }

    if (range === "Bulan Ini") {
      startDate.setDate(1);
      setTanggalMulai(toInputDate(startDate));
      setTanggalSelesai(end);
    }

    if (range === "Tahun Ini") {
      startDate.setMonth(0);
      startDate.setDate(1);
      setTanggalMulai(toInputDate(startDate));
      setTanggalSelesai(end);
    }

    setQuickRange(range);
  };

  const resetTanggal = () => {
    setTanggalMulai("");
    setTanggalSelesai("");
    setQuickRange("");
  };

  const resetFilter = () => {
    setFilterStatus("Semua");
    setFilterMetode("Semua");
    setFilterKasir("Semua");
    setSearchInvoice("");
    setCurrentPage(1);
  };

  const downloadLaporan = () => {
    const dataExcel = transaksiFiltered.map((item, index) => {
      const detailTransaksi = detailFiltered.filter(
        (d) => d.transaksi_id === item.id
      );

      const jumlahBarang = detailTransaksi.reduce(
        (total, d) => total + Number(d.qty || 0),
        0
      );

      const detailBarang = detailTransaksi
        .map((d) => {
          const product = getProduk(d.produk_id);

          return `${product?.nama || `Produk #${d.produk_id}`} x${d.qty}`;
        })
        .join(", ");

      const hpp = detailTransaksi.reduce(
        (total, d) => total + getHppDetail(d) * Number(d.qty || 0),
        0
      );

      const total = Number(item.total || 0);

      const subtotal = Number(
        item.subtotal ??
          Math.max(
            0,
            total -
              Number(item.pajak || 0) -
              Number(item.service_charge || 0)
          )
      );

      return {
        No: index + 1,
        Invoice: formatInvoice(item),
        "Tanggal & Waktu": formatTanggal(item.tanggal),
        Kasir: getKasir(item),
        Barang: jumlahBarang,
        "Detail Barang": detailBarang || "-",
        "Metode Pembayaran": getMetode(item) || "-",
        Status: getStatus(item),
        Subtotal: subtotal,
        PB1: Number(item.pajak || 0),
        "Service Charge": Number(item.service_charge || 0),
        Total: total,
        HPP: hpp,
        "Laba Kotor": subtotal - hpp,
        Bayar: getBayarLaporan(item),
        Kembalian: getKembalianLaporan(item),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

    XLSX.writeFile(
      workbook,
      `laporan-${tanggalMulai || "semua"}-${tanggalSelesai || "tanggal"}.xlsx`
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] transition-colors dark:bg-[#0b1411] dark:text-[#edf7f1]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-7">
          <div className="flex flex-col gap-5 md:gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#006948] dark:text-[#85f8c4]">
                <IconChartBar size={17} />
                <span>Executive Financial Overview</span>
              </div>

              <h1 className="text-[30px] font-extrabold tracking-[-0.03em] sm:text-[36px]">
                Laporan &amp; Analitik
              </h1>

              <p className="mt-2 max-w-[700px] text-sm leading-6 text-[#526158] dark:text-[#9eb2a7]">
                Ringkasan performa finansial, arus kas kasir, &amp; tren
                penjualan toko secara realtime.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 md:w-full md:grid-cols-2 xl:flex xl:w-auto xl:flex-row xl:flex-wrap xl:items-center xl:justify-end">
              {["Hari Ini", "7 Hari", "Bulan Ini", "Tahun Ini"].map(
                (range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setRange(range)}
                    className={`rounded-full px-4 py-2 text-xs font-bold ${
                      quickRange === range
                        ? "bg-[#006948] text-white"
                        : "bg-white text-[#526158] ring-1 ring-[#dbe5f5] dark:bg-[#101a16] dark:text-[#b5c8bd] dark:ring-[#263a31]"
                    }`}
                  >
                    {range}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => setShowCustomDate((prev) => !prev)}
                className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#526158] ring-1 ring-[#dbe5f5] dark:bg-[#101a16] dark:text-[#b5c8bd] dark:ring-[#263a31]"
              >
                <IconCalendar size={15} />
                Custom
              </button>

              <button
                type="button"
                onClick={downloadLaporan}
                className="flex items-center justify-center gap-2 rounded-full bg-[#006948] px-4 py-2 text-xs font-bold text-white"
              >
                <IconDownload size={15} />
                Unduh Rekap
              </button>
            </div>
          </div>

          {showCustomDate && (
            <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 ring-1 ring-[#e5ebf5] dark:bg-[#101a16] dark:ring-[#263a31] sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold">
                  Tanggal Mulai
                </label>

                <input
                  ref={tanggalMulaiRef}
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => {
                    setTanggalMulai(e.target.value);
                    setQuickRange("");
                  }}
                  className="h-10 w-full rounded-xl border border-[#dbe5f5] bg-white px-3 text-xs font-semibold dark:border-[#2a4036] dark:bg-[#17231e]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold">
                  Tanggal Selesai
                </label>

                <input
                  ref={tanggalSelesaiRef}
                  type="date"
                  value={tanggalSelesai}
                  onChange={(e) => {
                    setTanggalSelesai(e.target.value);
                    setQuickRange("");
                  }}
                  className="h-10 w-full rounded-xl border border-[#dbe5f5] bg-white px-3 text-xs font-semibold dark:border-[#2a4036] dark:bg-[#17231e]"
                />
              </div>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[16px] bg-white p-5 shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31]">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef6f2] text-[#006948] dark:bg-[#173c2e] dark:text-[#85f8c4]">
                <IconTrendingUp size={22} />
              </div>

              <span className="rounded-full bg-[#e8f7ef] px-3 py-1 text-[10px] font-extrabold text-[#006948]">
                Data Real
              </span>
            </div>

            <p className="text-xs font-bold text-[#718078] dark:text-[#9eb2a7]">
              Total Pendapatan
            </p>

            <h2 className="mt-2 text-[25px] font-extrabold">
              {formatRupiah(totalPendapatan)}
            </h2>

            <p className="mt-1 text-[11px] text-[#7b8780]">
              {jumlahTransaksi} transaksi selesai
            </p>
          </div>

          <div className="rounded-[16px] bg-white p-5 shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31]">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef6f2] text-[#006948] dark:bg-[#173c2e] dark:text-[#85f8c4]">
                <IconChartBar size={22} />
              </div>

              <span className="rounded-full bg-[#e8f7ef] px-3 py-1 text-[10px] font-extrabold text-[#006948]">
                HPP {formatRupiah(totalHPP)}
              </span>
            </div>

            <p className="text-xs font-bold text-[#718078] dark:text-[#9eb2a7]">
              Laba Kotor
            </p>

            <h2 className="mt-2 text-[25px] font-extrabold">
              {formatRupiah(labaKotor)}
            </h2>

            <p className="mt-1 text-[11px] text-[#7b8780]">
              Margin {marginLaba.toFixed(1)}%
            </p>
          </div>

          <div className="rounded-[16px] bg-white p-5 shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31]">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef6f2] text-[#006948] dark:bg-[#173c2e] dark:text-[#85f8c4]">
                <IconReceipt size={22} />
              </div>

              <span className="rounded-full bg-[#e8f7ef] px-3 py-1 text-[10px] font-extrabold text-[#006948]">
                {jumlahTransaksi} struk
              </span>
            </div>

            <p className="text-xs font-bold text-[#718078] dark:text-[#9eb2a7]">
              Transaksi Selesai
            </p>

            <h2 className="mt-2 text-[25px] font-extrabold">
              {jumlahTransaksi} Struk
            </h2>

            <p className="mt-1 text-[11px] text-[#7b8780]">
              Rata-rata {formatRupiah(rataRata)} / order
            </p>
          </div>

        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-[16px] bg-white p-5 shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31]">
            <div className="flex items-center gap-2">
              <IconPackage size={19} className="text-[#006948] dark:text-[#85f8c4]" />
              <h3 className="text-base font-extrabold">Total HPP</h3>
            </div>

            <p className="mt-1 text-xs text-[#78847d]">
              Modal barang yang terjual
            </p>

            <div className="mt-5 text-2xl font-extrabold">
              {formatRupiah(totalHPP)}
            </div>

            <div className="mt-3 flex justify-between text-xs">
              <span className="text-[#78847d]">Barang terjual</span>
              <span className="font-extrabold">{totalBarangTerjual}</span>
            </div>
          </div>

          <div className="rounded-[16px] bg-white p-5 shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31]">
            <div className="flex items-center gap-2">
              <IconCash size={19} className="text-[#006948] dark:text-[#85f8c4]" />
              <h3 className="text-base font-extrabold">Rekonsiliasi Tunai</h3>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#78847d]">Penjualan cash</span>
                <strong>{formatRupiah(rekonsiliasiKas.penjualanCash)}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#78847d]">Uang diterima</span>
                <strong>{formatRupiah(rekonsiliasiKas.uangDiterima)}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#78847d]">Kembalian</span>
                <strong>{formatRupiah(rekonsiliasiKas.kembalian)}</strong>
              </div>

              <div className="mt-3 flex justify-between border-t border-[#edf1f5] pt-3 dark:border-[#263a31]">
                <span className="font-extrabold">Kas bersih</span>
                <strong className="text-[#006948] dark:text-[#85f8c4]">
                  {formatRupiah(rekonsiliasiKas.kasBersih)}
                </strong>
              </div>
            </div>
          </div>
          <div className="rounded-[16px] bg-white p-5 shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31]">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef6f2] text-[#006948] dark:bg-[#173c2e] dark:text-[#85f8c4]">
                <IconWallet size={22} />
              </div>

              <span className="rounded-full bg-[#e8f7ef] px-3 py-1 text-[10px] font-extrabold text-[#006948]">
                {rekonsiliasiKas.jumlah} cash
              </span>
            </div>

            <p className="text-xs font-bold text-[#718078] dark:text-[#9eb2a7]">
              Rekonsiliasi Kas
            </p>

            <h2 className="mt-2 text-[25px] font-extrabold">
              {formatRupiah(rekonsiliasiKas.kasBersih)}
            </h2>

            <p className="mt-1 text-[11px] text-[#7b8780]">
              Kas bersih transaksi tunai
            </p>
          </div>

        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
          <div className="rounded-[16px] bg-white p-5 shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31] sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <IconChartBar size={19} className="text-[#006948] dark:text-[#85f8c4]" />
                  <h3 className="text-base font-extrabold">Tren Penjualan Per Jam</h3>
                </div>

                <p className="mt-1 text-xs text-[#78847d]">
                  Distribusi nominal transaksi
                </p>
              </div>

              <span className="text-[11px] font-bold text-[#78847d]">
                Peak {peakHour ? `${peakHour.hour}:00` : "—"}
              </span>
            </div>

            <div className="mt-8 flex h-[260px] items-end gap-2 sm:gap-4">
              {hourlySales.map((item) => {
                const height =
                  item.value > 0
                    ? Math.max(
                        8,
                        (item.value / maxHourlySales) * 100
                      )
                    : 3;

                const isPeak =
                  peakHour &&
                  peakHour.hour === item.hour &&
                  item.value > 0;

                return (
                  <div
                    key={item.hour}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="relative flex h-full items-end">
                      <div
                        className={`w-full rounded-t-lg ${
                          isPeak
                            ? "bg-[#006948]"
                            : "bg-[#a9ebcc] dark:bg-[#245642]"
                        }`}
                        style={{ height: `${height}%` }}
                        title={`${item.hour}:00 - ${formatRupiah(item.value)}`}
                      />
                    </div>

                    <div className="mt-3 text-center text-[10px] font-bold text-[#78847d]">
                      {String(item.hour).padStart(2, "0")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[16px] bg-white p-5 shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31] sm:p-6">
            <div className="flex items-center gap-2">
              <IconCreditCard size={19} className="text-[#006948] dark:text-[#85f8c4]" />
              <h3 className="text-base font-extrabold">Metode Pembayaran</h3>
            </div>

            <div className="mt-7 space-y-5">
              {paymentData.map((item) => {
                const percentage =
                  totalPaymentValue > 0
                    ? Math.round((item.value / totalPaymentValue) * 100)
                    : 0;

                const Icon = item.icon;

                return (
                  <div key={item.key}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={17} className="text-[#006948]" />
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>

                      <span className="text-xs font-extrabold">{percentage}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#edf2f7] dark:bg-[#1a2822]">
                      <div
                        className="h-full rounded-full bg-[#006948]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="mt-1 flex justify-between text-[10px] text-[#8a958f]">
                      <span>{item.count} transaksi</span>
                      <span>{formatRupiah(item.value)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-[16px] bg-white p-5 shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31]">
            <div className="flex items-center gap-2">
              <IconShoppingCart size={19} className="text-[#006948]" />
              <h3 className="text-base font-extrabold">Produk Terlaris</h3>
            </div>

            <div className="mt-5 space-y-3">
              {produkTerlaris.length === 0 ? (
                <div className="rounded-xl bg-[#f7f9fc] p-5 text-center text-xs font-semibold text-[#78847d] dark:bg-[#17231e]">
                  Belum ada data produk.
                </div>
              ) : (
                produkTerlaris.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-[#f8fafc] p-3 dark:bg-[#17231e]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#eef6f2] dark:bg-[#173c2e]">
                        {item.gambar ? (
                          <img
                            src={`${API_URL}${item.gambar}`}
                            alt={item.nama}
                            loading="lazy"
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              const image = event.currentTarget;
                              image.onerror = null;
                              image.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-extrabold text-[#006948] dark:text-[#85f8c4]">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold">{item.nama}</p>
                        <p className="text-[10px] text-[#78847d]">{item.kategori}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-extrabold">{item.qty} pcs</p>
                      <p className="text-[10px] text-[#78847d]">
                        {formatRupiah(item.omzet)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[16px] bg-white p-5 shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31]">
            <div className="flex items-center gap-2">
              <IconChartPie size={19} className="text-[#006948]" />
              <h3 className="text-base font-extrabold">Penjualan per Kategori</h3>
            </div>

            <div className="mt-5 space-y-4">
              {categorySales.length === 0 ? (
                <div className="rounded-xl bg-[#f7f9fc] p-5 text-center text-xs font-semibold text-[#78847d] dark:bg-[#17231e]">
                  Belum ada data kategori.
                </div>
              ) : (
                categorySales.slice(0, 5).map((item) => {
                  const percentage =
                    totalPendapatan > 0
                      ? Math.round((item.omzet / totalPendapatan) * 100)
                      : 0;

                  return (
                    <div key={item.nama}>
                      <div className="mb-2 flex justify-between">
                        <span className="text-xs font-bold">{item.nama}</span>
                        <span className="text-xs font-extrabold">
                          {formatRupiah(item.omzet)}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-[#edf2f7] dark:bg-[#1a2822]">
                        <div
                          className="h-full rounded-full bg-[#006948]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-[16px] bg-white shadow-sm ring-1 ring-[#e6ebf3] dark:bg-[#101a16] dark:ring-[#263a31]">
          <div className="border-b border-[#edf1f5] p-5 dark:border-[#263a31] sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <IconReceipt size={19} className="text-[#006948]" />
                  <h3 className="text-base font-extrabold">Transaksi Terkini</h3>
                </div>

                <p className="mt-1 text-xs text-[#78847d]">
                  Daftar struk penjualan tercatat
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-[250px]">
                  <IconSearch
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b8780]"
                  />

                  <input
                    type="text"
                    value={searchInvoice}
                    onChange={(e) => setSearchInvoice(e.target.value)}
                    placeholder="Cari invoice..."
                    className="h-10 w-full rounded-xl border border-[#dbe5f5] bg-[#fbfcff] pl-10 pr-4 text-xs font-semibold outline-none dark:border-[#2a4036] dark:bg-[#17231e]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdvancedFilter((prev) => !prev)}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#f1f5fb] px-4 text-xs font-bold dark:bg-[#17231e]"
                >
                  <IconFilter size={16} />
                  Filter
                </button>

                <button
                  type="button"
                  onClick={fetchData}
                  className="flex h-10 items-center justify-center rounded-xl bg-[#f1f5fb] px-4 text-[#006948] dark:bg-[#17231e]"
                >
                  <IconRefresh
                    size={17}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>
          </div>

          {showAdvancedFilter && (
            <div className="border-b border-[#edf1f5] bg-[#fbfcff] px-5 py-4 dark:border-[#263a31] dark:bg-[#0f1915] sm:px-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-extrabold">Filter Transaksi</h4>

                <button
                  type="button"
                  onClick={resetFilter}
                  className="text-xs font-bold text-[#006948]"
                >
                  Reset Filter
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold">Status</label>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#dbe5f5] bg-white px-3 text-xs font-semibold dark:border-[#2a4036] dark:bg-[#17231e]"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                    <option value="Menunggu Pembayaran">
                      Menunggu Pembayaran
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold">
                    Metode Pembayaran
                  </label>

                  <select
                    value={filterMetode}
                    onChange={(e) => setFilterMetode(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#dbe5f5] bg-white px-3 text-xs font-semibold dark:border-[#2a4036] dark:bg-[#17231e]"
                  >
                    <option value="Semua">Semua Metode</option>

                    {[
                      ...new Set(
                        transaksi
                          .map((item) => getMetode(item))
                          .filter(Boolean)
                      ),
                    ].map((metode) => (
                      <option key={metode} value={metode}>
                        {metode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold">Kasir</label>

                  <select
                    value={filterKasir}
                    onChange={(e) => setFilterKasir(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#dbe5f5] bg-white px-3 text-xs font-semibold dark:border-[#2a4036] dark:bg-[#17231e]"
                  >
                    <option value="Semua">Semua Kasir</option>

                    {[
                      ...new Set(
                        transaksi
                          .map((item) => getKasir(item))
                          .filter((kasir) => kasir !== "—")
                      ),
                    ].map((kasir) => (
                      <option key={kasir} value={kasir}>
                        {kasir}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="bg-[#fbfcff] dark:bg-[#17231e]">
                  {[
                    "No. Invoice",
                    "Waktu",
                    "Kasir",
                    "Item Ringkas",
                    "Metode",
                    "Bayar",
                    "Kembalian",
                    "Total Akhir",
                    "Status",
                    "Aksi",
                  ].map((title, index) => (
                    <th
                      key={title}
                      className={`px-5 py-4 text-[10px] font-extrabold uppercase tracking-wider text-[#78847d] ${
                        index >= 5 && index <= 7
                          ? "text-right"
                          : index >= 8
                            ? "text-center"
                            : "text-left"
                      }`}
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dbe5f5] border-t-[#006948]" />
                        <span className="text-xs font-semibold text-[#78847d]">
                          Memuat laporan...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : transaksiFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef6f2] text-[#006948]">
                          <IconReceipt size={22} />
                        </div>

                        <p className="text-sm font-extrabold">
                          Tidak ada transaksi
                        </p>

                        <p className="mt-1 text-xs text-[#78847d]">
                          Belum ada transaksi yang sesuai filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transaksiPaginated.map((item) => {
                    const detailItem = detail.filter(
                      (d) => d.transaksi_id === item.id
                    );

                    const firstProduct =
                      detailItem.length > 0
                        ? getProduk(detailItem[0].produk_id)
                        : undefined;

                    const itemSummary = detailItem
                      .slice(0, 2)
                      .map((d) => {
                        const p = getProduk(d.produk_id);
                        return `${d.qty}x ${p?.nama || "Produk"}`;
                      })
                      .join(", ");

                    const additional =
                      detailItem.length > 2
                        ? ` +${detailItem.length - 2} item`
                        : "";

                    const status = getStatus(item);

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-[#edf1f5] dark:border-[#263a31]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef6f2] text-[#006948]">
                              <IconReceipt size={17} />
                            </div>

                            <div>
                              <div className="text-xs font-extrabold">
                                {formatInvoice(item)}
                              </div>

                              <div className="text-[10px] text-[#8a958f]">
                                #{item.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <IconClock size={14} className="text-[#8a958f]" />

                            <div>
                              <div className="text-xs font-bold">
                                {formatWaktu(item.tanggal)}
                              </div>

                              <div className="text-[10px] text-[#8a958f]">
                                {formatTanggalPendek(item.tanggal)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-xs font-bold">
                            {getKasir(item)}
                          </span>
                        </td>

                        <td className="max-w-[300px] px-5 py-4">
                          <div className="flex min-w-0 flex-col gap-2">
                            {detailItem.slice(0, 2).map((d) => {
                              const product = getProduk(d.produk_id);

                              return (
                                <div
                                  key={`${item.id}-${d.produk_id}`}
                                  className="flex min-w-0 items-center gap-2.5"
                                >
                                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#eef6f2] dark:bg-[#173c2e]">
                                    {product?.gambar ? (
                                      <img
                                        src={`${API_URL}${product.gambar}`}
                                        alt={product.nama || "Produk"}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                        onError={(event) => {
                                          const image = event.currentTarget;
                                          image.onerror = null;
                                          image.style.display = "none";
                                        }}
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-[#006948] dark:text-[#85f8c4]">
                                        <IconPackage size={16} />
                                      </div>
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="truncate text-xs font-bold">
                                      {d.qty}x {product?.nama || "Produk"}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {additional && (
                              <div className="text-[10px] font-semibold text-[#8a958f]">
                                {additional}
                              </div>
                            )}
                          </div>

                          <div className="mt-1 text-[10px] text-[#8a958f]">
                            {detailItem.length} jenis item
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#f1f5fb] px-3 py-1.5 text-[10px] font-extrabold dark:bg-[#17231e]">
                            {getMetode(item) || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right text-xs font-bold">
                          {formatRupiah(getBayarLaporan(item))}
                        </td>

                        <td className="px-5 py-4 text-right text-xs font-bold">
                          {formatRupiah(getKembalianLaporan(item))}
                        </td>

                        <td className="px-5 py-4 text-right text-xs font-extrabold">
                          {formatRupiah(item.total)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                              status === "Dibatalkan"
                                ? "bg-[#ffdad6] text-[#ba1a1a]"
                                : status === "Menunggu Pembayaran"
                                  ? "bg-[#fff3cd] text-[#856404]"
                                  : "bg-[#e8f7ef] text-[#006948]"
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              window.location.href = `/struk?id=${item.id}`;
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#eef6f2] px-3 py-2 text-[10px] font-extrabold text-[#006948]"
                          >
                            <IconEye size={14} />
                            Struk
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#edf1f5] p-5 dark:border-[#263a31] sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs font-semibold text-[#78847d]">
              Menampilkan{" "}
              <span className="font-extrabold">
                {transaksiPaginated.length}
              </span>{" "}
              dari{" "}
              <span className="font-extrabold">
                {transaksiFiltered.length}
              </span>{" "}
              transaksi
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={transaksiPerPage}
                onChange={(e) => {
                  setTransaksiPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-9 rounded-lg border border-[#dbe5f5] bg-white px-3 text-[11px] font-bold dark:border-[#2a4036] dark:bg-[#17231e]"
              >
                <option value={10}>10 / halaman</option>
                <option value={20}>20 / halaman</option>
                <option value={50}>50 / halaman</option>
                <option value={100}>100 / halaman</option>
              </select>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentPage <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f5fb] text-[#006948] disabled:opacity-40 dark:bg-[#17231e]"
              >
                <IconChevronLeft size={17} />
              </button>

              <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#006948] px-3 text-[11px] font-extrabold text-white">
                {currentPage}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(totalPages, prev + 1)
                  )
                }
                disabled={currentPage >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f5fb] text-[#006948] disabled:opacity-40 dark:bg-[#17231e]"
              >
                <IconChevronRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {popup.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#101a16]">
            <h3 className="text-base font-extrabold">{popup.title}</h3>
            <p className="mt-2 text-sm text-[#526158] dark:text-[#b5c8bd]">
              {popup.message}
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={closePopup}
                className="rounded-xl bg-[#006948] px-5 py-2.5 text-xs font-bold text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}