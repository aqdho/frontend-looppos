"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const API_URL = "/api";

type SettingsTransaksi = {
  pajak_aktif: boolean;
  pajak_persentase: number | string;
  service_aktif: boolean;
  service_persentase: number | string;
  pembulatan_kembalian: boolean;
};

type Produk = {
  id: number;
  nama: string;
  qty: number;
  harga: number;
  gambar?: string;
};

type Keranjang = Produk & {
  jumlah: number;
};

type Printer = {
  device_id: string;
  printer: string;
  agent_url?: string;
};

type IconName =
  | "search"
  | "tune"
  | "barcode"
  | "grid"
  | "restaurant"
  | "coffee"
  | "snack"
  | "loyalty"
  | "account"
  | "table"
  | "pause"
  | "wifi"
  | "plus"
  | "minus"
  | "delete"
  | "note"
  | "ticket"
  | "info"
  | "payments"
  | "qris"
  | "receipt"
  | "close"
  | "check"
  | "package"
  | "warning";

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M16 16L21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "tune":
      return (
        <svg {...common}>
          <path
            d="M4 7H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 17H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="9" cy="7" r="2" fill="currentColor" />
          <circle cx="15" cy="17" r="2" fill="currentColor" />
        </svg>
      );

    case "barcode":
      return (
        <svg {...common}>
          <path
            d="M4 5V19M7 5V19M10 5V19M14 5V19M17 5V19M20 5V19"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M3 3H7M17 3H21M3 21H7M17 21H21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "grid":
      return (
        <svg {...common}>
          <rect
            x="4"
            y="4"
            width="6"
            height="6"
            rx="1"
            fill="currentColor"
          />
          <rect
            x="14"
            y="4"
            width="6"
            height="6"
            rx="1"
            fill="currentColor"
          />
          <rect
            x="4"
            y="14"
            width="6"
            height="6"
            rx="1"
            fill="currentColor"
          />
          <rect
            x="14"
            y="14"
            width="6"
            height="6"
            rx="1"
            fill="currentColor"
          />
        </svg>
      );

    case "restaurant":
      return (
        <svg {...common}>
          <path
            d="M7 3V11M4 3V7C4 9 5.3 10 7 10C8.7 10 10 9 10 7V3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7 10V21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M16 3C13.5 5 13 8 13 11V21M13 8H18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case "coffee":
      return (
        <svg {...common}>
          <path
            d="M5 8H17V14C17 17 15 19 11 19H11C7 19 5 17 5 14V8Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M17 10H19C20.1 10 21 10.9 21 12C21 13.1 20.1 14 19 14H17"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 4C8 5 9 5 9 6M12 4C12 5 13 5 13 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "snack":
      return (
        <svg {...common}>
          <path
            d="M5 10H19L17.5 19H6.5L5 10Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M7 10C7 7 8.8 5 12 5C15.2 5 17 7 17 10"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M9 13H15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "loyalty":
      return (
        <svg {...common}>
          <path
            d="M4 7.5C4 6.4 4.9 5.5 6 5.5H18C19.1 5.5 20 6.4 20 7.5V16.5C20 17.6 19.1 18.5 18 18.5H6C4.9 18.5 4 17.6 4 16.5V7.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 12H16M12 8V16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case "account":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" fill="currentColor" />
          <path
            d="M5 20C5.5 16.3 8 14 12 14C16 14 18.5 16.3 19 20"
            fill="currentColor"
          />
        </svg>
      );

    case "table":
      return (
        <svg {...common}>
          <path
            d="M4 8H20M6 8V18M18 8V18M3 18H21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M5 5H19"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case "pause":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="8.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M10 9V15M14 9V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "wifi":
      return (
        <svg {...common}>
          <path
            d="M3 8.5C8 4.2 16 4.2 21 8.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6.5 12C9.5 9.5 14.5 9.5 17.5 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M10 15.5C11.2 14.5 12.8 14.5 14 15.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "minus":
      return (
        <svg {...common}>
          <path
            d="M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "delete":
      return (
        <svg {...common}>
          <path
            d="M5 7H19M9 7V4H15V7M8 7L9 20H15L16 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 10V17M14 10V17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "note":
      return (
        <svg {...common}>
          <path
            d="M6 4H18V20H6V4Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M9 8H15M9 12H15M9 16H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "ticket":
      return (
        <svg {...common}>
          <path
            d="M4 7.5A2.5 2.5 0 0 0 6.5 5H17.5A2.5 2.5 0 0 0 20 7.5V8A2.5 2.5 0 0 0 20 13V13.5A2.5 2.5 0 0 0 17.5 16H6.5A2.5 2.5 0 0 0 4 13.5V13A2.5 2.5 0 0 0 4 8V7.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M12 7V14M12 16.5V17"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );

    case "info":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="8.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M12 11V16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
        </svg>
      );

    case "payments":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="6"
            width="18"
            height="13"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M3 10H21M8 15H11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case "qris":
      return (
        <svg {...common}>
          <path
            d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M14 14H17V17H14M17 17H20V20M14 20H16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case "receipt":
      return (
        <svg {...common}>
          <path
            d="M6 3H18V21L15 19L12 21L9 19L6 21V3Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M9 8H15M9 12H15M9 16H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path
            d="M5 12.5L10 17L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "package":
      return (
        <svg {...common}>
          <path
            d="M4 8L12 4L20 8V17L12 21L4 17V8Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M4 8L12 12L20 8M12 12V21"
            stroke="currentColor"
            strokeWidth="1.7"
          />
        </svg>
      );

    case "warning":
      return (
        <svg {...common}>
          <path
            d="M12 4L21 19H3L12 4Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M12 9V13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      );

    default:
      return null;
  }
}

export default function TransaksiPage() {
  const searchRef = useRef<HTMLInputElement>(null);

  const [produk, setProduk] = useState<Produk[]>([]);
  const [keranjang, setKeranjang] = useState<Keranjang[]>([]);
  const [pesananDitahan, setPesananDitahan] = useState<Keranjang[][]>(() => { 
    if (typeof window === "undefined") return [];

    try { 
      const tersimpan = localStorage.getItem("looppos_pesanan_ditahan");
      return tersimpan ? JSON.parse(tersimpan) : [];
    } catch { 
      return [];
    }
  });

  useEffect(() => { 
    try { 
      localStorage.setItem( 
        "looppos_pesanan_ditahan",
        JSON.stringify(pesananDitahan)
      );
    } catch (error) { 
      console.error("Gagal menyimpan pesanan ditahan:", error); 
    }
  }, [pesananDitahan]);
  const [showPesananDitahan, setShowPesananDitahan] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [uangBayar, setUangBayar] = useState("");

  const [modePesanan, setModePesanan] =
    useState<"dine_in" | "take_away">("dine_in");

  const [bayarTerakhir, setBayarTerakhir] = useState(0);
  const [transaksiTerakhir, setTransaksiTerakhir] =
    useState<number | null>(null);

  const [printerTerpilih, setPrinterTerpilih] =
    useState<Printer | null>(null);

  const [daftarPrinter, setDaftarPrinter] = useState<Printer[]>([]);

  const [keranjangPopup, setKeranjangPopup] = useState(false);
  const [qrisPopup, setQrisPopup] = useState(false);

  const [qrisLoading, setQrisLoading] = useState(false);

  const [qrisData, setQrisData] = useState<{
    transaksiId: number;
    paymentId?: string;
    referenceId: string;
    qrString?: string;
    status?: string;
  } | null>(null);

  const [qrisPaidLoading, setQrisPaidLoading] =
    useState(false);

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
  });

  const [kategoriAktif, setKategoriAktif] = useState("all");

  const [pajakAktif, setPajakAktif] = useState(false);
  const [pajakPersentase, setPajakPersentase] = useState(0);

  const [serviceAktif, setServiceAktif] = useState(false);
  const [servicePersentase, setServicePersentase] = useState(0);

  const [pembulatanKembalian, setPembulatanKembalian] = 
    useState(false);

  const subtotal = keranjang.reduce(
    (jumlah, item) =>
      jumlah + item.jumlah * item.harga,
    0
  );

  const pajak =
    pajakAktif && pajakPersentase > 0
      ? Math.round(
          subtotal *
            pajakPersentase /
            100
        )
      : 0;

  const serviceCharge =
    serviceAktif && servicePersentase > 0
      ? Math.round(
          subtotal *
            servicePersentase /
            100
        )
      : 0;

  const total =
    subtotal +
    pajak +
    serviceCharge;

  const jumlahItem = keranjang.reduce(
    (jumlah, item) => jumlah + item.jumlah,
    0
  );

  const formatUang = (value: string | number) => {
    const angka = String(value).replace(/\D/g, "");

    if (!angka) return "";

    return Number(angka).toLocaleString("id-ID");
  };

  const showPopup = (
    title: string,
    message: string
  ) => {
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

  /*
   * URL gambar produk.
   *
   * Untuk localhost:
   *   laptop -> localhost:3000
   *
   * Untuk perangkat lain yang membuka aplikasi
   * melalui IP laptop:
   *   tablet -> IP laptop:3000
   *
   * Jika URL gambar sudah menunjuk ke server lain,
   * URL tersebut tetap digunakan.
   */
  

  const getProduk = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("URL PRODUK:", res.url);
      console.log("STATUS PRODUK:", res.status);
      console.log("RESPONS PRODUK:", await res.clone().text());

      if (!res.ok) {
        throw new Error("Gagal mengambil produk");
      }

      const data = await res.json();

      setProduk(
        Array.isArray(data)
          ? data
          : data.data || []
      );
    } catch (error) {
      console.error(
        "GET PRODUK ERROR:",
        error
      );

      showPopup(
        "Gagal Memuat Produk",
        "Produk tidak dapat dimuat dari server."
      );
    } finally {
      setLoading(false);
    }
  };

  const getSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await fetch(
        `${API_URL}/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error(
          "GET SETTINGS ERROR:",
          res.status
        );
        return;
      }

      const result = await res.json();

      const settings: SettingsTransaksi =
        result?.data || result;

      setPajakAktif(
        settings.pajak_aktif === true
      );

      setPajakPersentase(
        Number(settings.pajak_persentase) || 0
      );

      setServiceAktif(
        settings.service_aktif === true
      );

      setServicePersentase(
        Number(settings.service_persentase) || 0
      );

      setPembulatanKembalian( 
        settings.pembulatan_kembalian === true 
      );

    } catch (error) {
      console.error(
        "GET SETTINGS ERROR:",
        error
      );
    }
  };

  const getPrinters = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/print-agent/printers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      const printers: Printer[] =
        Array.isArray(data)
          ? data
          : data.data || [];

      setDaftarPrinter(printers);

      if (printers.length > 0) {
        const pilihan =
          printers.find(
            (item) =>
              item.device_id ===
              printerTerpilih?.device_id
          ) ||
          printers.find(
            (item) =>
              item.printer === "RPP02N"
          ) ||
          printers[0];

        setPrinterTerpilih(pilihan);
      }
    } catch (error) {
      console.error(
        "GET PRINTER ERROR:",
        error
      );
    }
  };

  useEffect(() => {
    getProduk();
    getPrinters();
    getSettings();
  }, []);

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent
    ) => {
      if (event.key === "F2") {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "F8") {
        event.preventDefault();

        const button =
          document.getElementById(
            "btnPay"
          ) as HTMLButtonElement | null;

        button?.click();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  const tambahKeKeranjang = (
    item: Produk
  ) => {
    if (item.qty <= 0) {
      showPopup(
        "Stok Habis",
        `${item.nama} sedang tidak memiliki stok.`
      );
      return;
    }

    const existing =
      keranjang.find(
        (x) => x.id === item.id
      );

    if (existing) {
      if (
        existing.jumlah >= item.qty
      ) {
        showPopup(
          "Stok Tidak Cukup",
          `Stok ${item.nama} hanya tersedia ${item.qty}.`
        );
        return;
      }

      setKeranjang((prev) =>
        prev.map((x) =>
          x.id === item.id
            ? {
                ...x,
                jumlah:
                  x.jumlah + 1,
              }
            : x
        )
      );

      return;
    }

    setKeranjang((prev) => [
      ...prev,
      {
        ...item,
        jumlah: 1,
      },
    ]);
  };

  const tambahJumlah = (
    id: number
  ) => {
    const item =
      keranjang.find(
        (x) => x.id === id
      );

    if (!item) return;

    if (
      item.jumlah >= item.qty
    ) {
      showPopup(
        "Stok Tidak Cukup",
        `Stok ${item.nama} hanya tersedia ${item.qty}.`
      );
      return;
    }

    setKeranjang((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              jumlah:
                x.jumlah + 1,
            }
          : x
      )
    );
  };

  const kurangiJumlah = (
    id: number
  ) => {
    setKeranjang((prev) =>
      prev
        .map((x) =>
          x.id === id
            ? {
                ...x,
                jumlah:
                  x.jumlah - 1,
              }
            : x
        )
        .filter(
          (x) => x.jumlah > 0
        )
    );
  };

  const handleDelete = (
    id: number
  ) => {
    setKeranjang((prev) =>
      prev.filter(
        (x) => x.id !== id
      )
    );
  };

  const cetakStruk = async () => {
    if (!transaksiTerakhir) {
      showPopup(
        "Belum Ada Transaksi",
        "Selesaikan pembayaran terlebih dahulu."
      );
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const resPrinter =
        await fetch(
          `${API_URL}/print-agent/printers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (resPrinter.ok) {
        const printerData =
          await resPrinter.json();

        const printers: Printer[] =
          Array.isArray(printerData)
            ? printerData
            : printerData.data || [];

        setDaftarPrinter(
          printers
        );

        const printerYangDipakai =
          printers.find(
            (item) =>
              item.device_id ===
              printerTerpilih?.device_id
          ) ||
          printers.find(
            (item) =>
              item.printer ===
              "RPP02N"
          ) ||
          printers[0];

        if (!printerYangDipakai) {
          showPopup(
            "Printer Tidak Tersedia",
            "Belum ada printer yang terhubung ke Print Agent."
          );
          return;
        }

        setPrinterTerpilih(
          printerYangDipakai
        );

        const res =
          await fetch(
            `${API_URL}/print/struk`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
              body: JSON.stringify({
                transaksi_id:
                  transaksiTerakhir,
                bayar:
                  bayarTerakhir,
                printer:
                  printerYangDipakai.printer,
                device_id:
                  printerYangDipakai.device_id,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data?.message ||
              "Gagal mencetak struk."
          );
        }

        showPopup(
          "Struk Berhasil Dicetak",
          "Struk transaksi berhasil dikirim ke printer."
        );
      }
    } catch (error) {
      console.error(
        "CETAK STRUK ERROR:",
        error
      );

      showPopup(
        "Gagal Mencetak",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mencetak struk."
      );
    }
  };

  const tahanPesanan = () => {
    if (keranjang.length === 0) {
      showPopup(
        "Keranjang Kosong",
        "Silahkan tambahkan produk terlebih dahulu sebelum menahan pesanan."
      );
      return;
    }

    setPesananDitahan((prev) => [
      ...prev,
      [...keranjang],
    ]);

    setKeranjang([]);
    setUangBayar("");
    setKeranjangPopup(false);

    showPopup(
      "Pesanan Ditahan",
      "Pesanan Berhasil ditahan dan keranjang dikosongkan."
    );
  };

  const bukaPesananDitahan = () => {
    if (pesananDitahan.length === 0) {
      showPopup(
        "Pesanan Ditahan",
        "Belum ada pesanan yang ditahan."
      );
      return;
    }

    setShowPesananDitahan(true);
  };

  const bayar = async () => {
    if (keranjang.length === 0) {
      showPopup(
        "Keranjang Kosong",
        "Silakan tambahkan produk terlebih dahulu."
      );
      return;
    }

    const bayarNumber = Number(
      String(uangBayar).replace(/\D/g, "")
    );

    if (
      !Number.isFinite(bayarNumber) ||
      bayarNumber <= 0
    ) {
      showPopup(
        "Pembayaran Tidak Valid",
        "Masukkan jumlah uang bayar yang valid."
      );
      return;
    }

    const subtotalPembayaran = keranjang.reduce(
      (sum, item) =>
        sum + Number(item.harga) * Number(item.jumlah),
      0
    );

    const pajakPembayaran = pajakAktif
      ? Math.round(
          subtotalPembayaran *
            Number(pajakPersentase) /
            100
        )
      : 0;

    const servicePembayaran = serviceAktif
      ? Math.round(
          subtotalPembayaran *
            Number(servicePersentase) /
            100
        )
      : 0;

    const totalPembayaran =
      subtotalPembayaran +
      pajakPembayaran +
      servicePembayaran;

    if (bayarNumber < totalPembayaran) {
      showPopup(
        "Uang Tidak Cukup",
        `Uang bayar kurang. Total transaksi Rp ${totalPembayaran.toLocaleString(
          "id-ID"
        )}.`
      );
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        showPopup(
          "Tidak Terautentikasi",
          "Silakan login kembali."
        );
        return;
      }

      const tanggal =
        new Date()
          .toLocaleString("sv-SE", {
            timeZone: "Asia/Jakarta",
          })
          .replace(" ", "T");

      const items = keranjang.map(
        (item) => ({
          produk_id: item.id,
          qty: item.jumlah,
          harga: item.harga,
        })
      );

      const response =
        await fetch(
          `${API_URL}/transaksi/pembayaran`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              tanggal,
              total: totalPembayaran,
              bayar: bayarNumber,
              mode_pesanan: modePesanan,
              items,
            }),
          }
        );

      const dataTransaksi =
        await response.json();

      if (!response.ok) {
        throw new Error(
          dataTransaksi?.pesan ||
            "Pembayaran gagal"
        );
      }

      const transaksi =
        dataTransaksi.data;

      if (!transaksi?.id) {
        throw new Error(
          "Transaksi berhasil tetapi ID transaksi tidak ditemukan."
        );
      }

      setTransaksiTerakhir(
        transaksi.id
      );

      setBayarTerakhir(
        bayarNumber
      );

      await getProduk();
      await getPrinters();

      setKeranjang([]);
      setUangBayar("");
      setKeranjangPopup(false);

      showPopup(
        "Pembayaran Berhasil",
        `Transaksi berhasil disimpan.

Total: Rp ${totalPembayaran.toLocaleString(
          "id-ID"
        )}
Bayar: Rp ${bayarNumber.toLocaleString(
          "id-ID"
        )}
Kembalian: Rp ${( 
    pembulatanKembalian
      ? Math.round( 
          (bayarNumber - totalPembayaran) /100 
      ) * 100
      : bayarNumber - totalPembayaran
    ).toLocaleString("id-ID")}`
      );
    } catch (error) {
      console.error(
        "ERROR PEMBAYARAN:",
        error
      );

      showPopup(
        "Pembayaran Gagal",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses pembayaran."
      );
    }
  };

  const buatQris = async () => {
    if (keranjang.length === 0) {
      showPopup(
        "Keranjang Kosong",
        "Silakan tambahkan produk terlebih dahulu."
      );
      return;
    }

    try {
      setQrisLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        showPopup(
          "Tidak Terautentikasi",
          "Silahkan login kembali."
        );
        return;
      }

      const tanggal = new Date()
        .toLocaleString("sv-SE", {
          timeZone: "Asia/Jakarta",
        })
        .replace(" ", "T");

      const items = keranjang.map((item) => ({
        produk_id: item.id,
        qty: item.jumlah,
        harga: item.harga,
      }));

      const response = await fetch(
        `${API_URL}/transaksi/qris`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tanggal,
            total,
            mode_pesanan: modePesanan,
            items,
          }),
        }
      );

      const contentType = 
        response.headers.get("content-type") || "";

      let data: any;

      if (contentType.includes("application/json")) { 
        data = await response.json();
      } else { 
        const responseText = await response.text();

        console.error( 
          "CREATE QRIS RESPONSE BUKAN JSON:",
          response.status,
          responseText 
        );

        throw new Error( 
          `Respons server bukan JSON (HTTP ${response.status}). Periksa Console untuk detailnya.`
        );
      }

      if (!response.ok) { 
        throw new Error( 
          data?.pesan ||
            "Gagal membuat pembayaran QRIS." 
        );
      }

      const transaksi = data?.data;

      if (!transaksi?.id) {
        throw new Error(
          "Transaksi QRIS berhasil dibuat tetapi ID transaksi tidak ditemukan."
        );
      }

      setQrisData({
        transaksiId: transaksi.id,
        paymentId:
          data?.qris?.payment_request_id ||
          transaksi.payment_id,
        referenceId:
          data?.qris?.reference_id ||
          transaksi.payment_reference,
        qrString:
          data?.qris?.qr_string ||
          (
            data?.simulator === true
              ? `KASIRKILAT-SIMULATOR|TRANSAKSI:${transaksi.id}|REFERENSI:${data?.payment_reference || transaksi.payment_reference || ""}|TOTAL:${data?.total ?? transaksi.total}`
              : undefined
          ),
        status:
          data?.qris?.status ||
          transaksi.payment_status ||
          "PENDING",
      });

      setQrisPopup(true);
    } catch (error) {
      console.error(
        "CREATE QRIS ERROR:",
        error
      );

      showPopup(
        "QRIS Gagal",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat pembayaran QRIS."
      );
    } finally {
      setQrisLoading(false);
    }
  };

  const simulasiQrisPaid = async () => {
    if (!qrisData?.transaksiId) {
      showPopup(
        "Transaksi QRIS Tidak Ditemukan",
        "Buat transaksi QRIS terlebih dahulu."
      );
      return;
    }

    try {
      setQrisPaidLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        showPopup(
          "Tidak Terautentikasi",
          "Silakan login kembali."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/transaksi/qris/${qrisData.transaksiId}/simulate-paid`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data: any = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "SIMULATE QRIS RESPONSE BUKAN JSON:",
          text
        );

        throw new Error(
          `Server mengembalikan response bukan JSON (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.pesan ||
            "Gagal mensimulasikan pembayaran QRIS."
        );
      }

      const transaksi = data?.data;

      setTransaksiTerakhir(
        transaksi?.id ||
          qrisData.transaksiId
      );

      setBayarTerakhir(
        Number(transaksi?.total || total)
      );

      setQrisData((prev) =>
        prev
          ? {
              ...prev,
              status: "paid",
            }
          : prev
      );

      await getProduk();
      await getPrinters();

      setKeranjang([]);
      setUangBayar("");
      setKeranjangPopup(false);

      showPopup(
        "Pembayaran QRIS Berhasil",
        `Transaksi #${
          transaksi?.id ||
          qrisData.transaksiId
        } berhasil dibayar.

Total: Rp ${Number(
          transaksi?.total || total
        ).toLocaleString("id-ID")}

Stok produk sudah diperbarui.`
      );
    } catch (error) {
      console.error(
        "SIMULATE QRIS PAID ERROR:",
        error
      );

      showPopup(
        "Pembayaran QRIS Gagal",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mensimulasikan pembayaran QRIS."
      );
    } finally {
      setQrisPaidLoading(false);
    }
  };

  const setUangPas = () => {
    if (total > 0) {
      setUangBayar(
        total.toLocaleString(
          "id-ID"
        )
      );
    }
  };

  const setNominalCepat = (
    nominal: number
  ) => {
    setUangBayar(
      nominal.toLocaleString(
        "id-ID"
      )
    );
  };

  const uangBayarNumber = Number( 
    String(uangBayar).replace(/\D/g, "")
  );

  const kembalianDasar = 
    uangBayarNumber >= total
      ? uangBayarNumber - total
      : 0;

  const kembalian = pembulatanKembalian
    ? Math.round(kembalianDasar / 100) * 100
    : kembalianDasar;

  const kategoriProduk = (
    nama: string
  ) => {
    const text =
      nama.toLowerCase();

    if (
      text.includes("kopi") ||
      text.includes("teh") ||
      text.includes("jus") ||
      text.includes("minum") ||
      text.includes("matcha") ||
      text.includes("latte") ||
      text.includes("es ")
    ) {
      return "minuman";
    }

    if (
      text.includes("paket") ||
      text.includes("combo") ||
      text.includes("kombo")
    ) {
      return "paket";
    }

    if (
      text.includes("tahu") ||
      text.includes("snack") ||
      text.includes("keripik") ||
      text.includes("gorengan")
    ) {
      return "snack";
    }

    return "makanan";
  };

  const filteredProduk =
    produk.filter((item) =>
      item.nama
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
    );

  const produkKategoriFiltered =
    filteredProduk.filter(
      (item) => {
        if (
          kategoriAktif ===
          "all"
        ) {
          return true;
        }

        return (
          kategoriProduk(
            item.nama
          ) ===
          kategoriAktif
        );
      }
    );

  const kategoriCount = {
    all: produk.length,

    makanan:
      produk.filter(
        (item) =>
          kategoriProduk(
            item.nama
          ) === "makanan"
      ).length,

    minuman:
      produk.filter(
        (item) =>
          kategoriProduk(
            item.nama
          ) === "minuman"
      ).length,

    snack:
      produk.filter(
        (item) =>
          kategoriProduk(
            item.nama
          ) === "snack"
      ).length,

    paket:
      produk.filter(
        (item) =>
          kategoriProduk(
            item.nama
          ) === "paket"
      ).length,
  };

  const tombolKategori = [
    {
      id: "all",
      label: "Semua Menu",
      icon: "grid" as IconName,
      count:
        kategoriCount.all,
    },
    {
      id: "makanan",
      label: "Makanan Utama",
      icon: "restaurant" as IconName,
      count:
        kategoriCount.makanan,
    },
    {
      id: "minuman",
      label: "Minuman & Kopi",
      icon: "coffee" as IconName,
      count:
        kategoriCount.minuman,
    },
    {
      id: "snack",
      label: "Camilan / Snack",
      icon: "snack" as IconName,
      count:
        kategoriCount.snack,
    },
    {
      id: "paket",
      label: "Paket Hemat",
      icon: "loyalty" as IconName,
      count:
        kategoriCount.paket,
    },
  ];

  const resetKeranjang = () => {
    setKeranjang([]);
    setUangBayar("");
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap");

        * {
          scrollbar-width: none;
        }

        *::-webkit-scrollbar {
          display: none;
        }

        body {
          margin: 0;
          padding: 0;
        }

        .pos-page {
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        @media (min-width: 768px) and (max-width: 1279px) {
          .pos-page {
            padding-left: 18px;
            padding-right: 18px;
          }
        }
      `}</style>

      <main
        className="pos-page relative min-h-screen w-full bg-[#f8f9ff] px-4 py-6 text-[#0b1c30] transition-colors sm:px-5 lg:px-6 dark:bg-[#0b1411] dark:text-[#edf7f1]"
        style={{
          fontFamily:
            '"Plus Jakarta Sans", sans-serif',
        }}
      >
        <div className="flex w-full flex-col">

          {/* CONTROL BAR */}

          <div className="mb-4 flex flex-col gap-3 pb-1 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:flex xl:w-auto xl:flex-wrap xl:items-center">

              <div className="flex min-w-0 items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-[#101a16]">
                <Icon
                  name="account"
                  size={20}
                  className="shrink-0 text-[#006948]"
                />

                <div className="flex min-w-0 flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d4a42] dark:text-[#9eb2a7]">
                    Operator Kasir
                  </span>

                  <span className="truncate text-[13px] font-semibold leading-5 text-[#0b1c30] dark:text-[#edf7f1]">
                    Kasir Aktif •{" "}
                    <span className="font-bold text-[#006948]">
                      Siap Melayani
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-2 rounded-xl bg-[#eff4ff] px-3 py-2 dark:bg-[#17231e]">
                <Icon
                  name="package"
                  size={18}
                  className="shrink-0 text-[#3d4a42] dark:text-[#9eb2a7]"
                />

                <span className="truncate text-[13px] leading-5 text-[#0b1c30] dark:text-[#edf7f1]">
                  Produk Tersedia:{" "}
                  <strong className="text-[15px] font-semibold">
                    {produk.length}
                  </strong>
                </span>
              </div>

              <button
                type="button"
                onClick={bukaPesananDitahan}
                className="flex min-w-0 items-center justify-center gap-2 rounded-xl bg-[#dae2fd] px-3 py-2 text-[#5c647a] shadow-sm transition-all hover:bg-[#bec6e0] active:scale-95 dark:bg-[#17231e] dark:text-[#b5c5bd] dark:hover:bg-[#1d2c25]"
              >
                <Icon
                  name="pause"
                  size={18}
                  className="shrink-0"
                />

                <span className="truncate text-[12px] font-semibold">
                  Pesanan Ditahan
                </span>

                <span className="shrink-0 rounded-full bg-[#006948] px-1.5 py-0.5 text-[11px] font-bold text-white">
                  {pesananDitahan.reduce(
                    (total, pesanan) =>
                      total +
                      pesanan.reduce(
                        (jumlah, item) =>
                          jumlah + item.jumlah,
                        0
                      ),
                    0
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* MAIN POS */}

          <div className="flex w-full flex-col items-start gap-4 lg:flex-row lg:gap-5 xl:gap-6">

            {/* PRODUCT */}

            <div className="flex w-full min-w-0 flex-col gap-4 lg:w-[63%] xl:w-[65%]">

              {/* SEARCH */}

              <div className="flex items-center gap-3">
                <div className="relative min-w-0 flex-1">

                  <Icon
                    name="search"
                    size={21}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3d4a42] dark:text-[#9eb2a7]"
                  />

                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(
                        event.target.value
                      )
                    }
                    type="text"
                    placeholder="Ketik nama menu, kode SKU....."
                    className="w-full rounded-xl bg-white py-3 pl-12 pr-20 text-[13px] text-[#0b1c30] shadow-sm outline-none placeholder:text-[#3d4a42] focus:shadow-md dark:bg-[#101a16] dark:text-[#edf7f1] dark:placeholder:text-[#81968b]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    showPopup(
                      "Filter & Tata Letak",
                      "Filter tambahan akan mengikuti kategori produk yang tersedia."
                    )
                  }
                  className="flex shrink-0 items-center justify-center rounded-xl bg-white p-3 text-[#0b1c30] shadow-sm transition-all hover:text-[#006948] hover:shadow dark:bg-[#101a16] dark:text-[#edf7f1]"
                >
                  <Icon
                    name="tune"
                    size={21}
                  />
                </button>
              </div>

              {/* CATEGORY */}

              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {tombolKategori.map(
                  (kategori) => {
                    const aktif =
                      kategoriAktif ===
                      kategori.id;

                    return (
                      <button
                        key={
                          kategori.id
                        }
                        type="button"
                        onClick={() =>
                          setKategoriAktif(
                            kategori.id
                          )
                        }
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[11px] font-semibold shadow-sm transition-all sm:px-4 sm:text-[12px] ${
                          aktif
                            ? "bg-[#006948] text-white"
                            : "bg-white text-[#3d4a42] hover:bg-[#eff4ff] hover:text-[#0b1c30] dark:bg-[#101a16] dark:text-[#b5c5bd] dark:hover:bg-[#17231e] dark:hover:text-[#edf7f1]"
                        }`}
                      >
                        <Icon
                          name={
                            kategori.icon
                          }
                          size={17}
                        />

                        <span>
                          {
                            kategori.label
                          }
                        </span>

                        {kategori.id ===
                          "all" && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              aktif
                                ? "bg-[#00855d] text-white"
                                : "bg-[#e5eeff] text-[#3d4a42] dark:bg-[#1a2822] dark:text-[#b5c5bd]"
                            }`}
                          >
                            {
                              kategori.count
                            }
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              {/* PRODUCTS */}

              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                  {[
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                  ].map(
                    (item) => (
                      <div
                        key={item}
                        className="animate-pulse rounded-xl bg-white p-2 shadow-sm dark:bg-[#101a16]"
                      >
                        <div className="mb-2 h-28 rounded-lg bg-[#e5eeff] sm:h-36 dark:bg-[#1a2822]" />

                        <div className="mb-2 h-3 w-20 rounded bg-[#e5eeff] dark:bg-[#1a2822]" />

                        <div className="mb-4 h-5 w-3/4 rounded bg-[#e5eeff] dark:bg-[#1a2822]" />

                        <div className="flex justify-between">
                          <div className="h-5 w-24 rounded bg-[#e5eeff] dark:bg-[#1a2822]" />

                          <div className="h-8 w-8 rounded-lg bg-[#e5eeff] dark:bg-[#1a2822]" />
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : produkKategoriFiltered.length ===
                0 ? (
                <div className="rounded-xl bg-white p-10 text-center shadow-sm dark:bg-[#101a16]">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eff4ff] text-[#006948] dark:bg-[#17231e]">
                    <Icon
                      name="package"
                      size={24}
                    />
                  </div>

                  <p className="text-[16px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                    Produk tidak ditemukan
                  </p>

                  <p className="mt-1 text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                    Coba ubah pencarian atau kategori.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                  {produkKategoriFiltered.map(
                    (item) => {
                      const kategori =
                        kategoriProduk(
                          item.nama
                        );

                      const stokMenipis =
                        item.qty >
                          0 &&
                        item.qty <= 5;

                      const stokHabis =
                        item.qty <=
                        0;

                      return (
                        <div
                          key={
                            item.id
                          }
                          onClick={() =>
                            tambahKeKeranjang(
                              item
                            )
                          }
                          className={`group flex cursor-pointer flex-col justify-between rounded-xl bg-white p-2 shadow-sm transition-all hover:shadow-md active:scale-[0.98] dark:bg-[#101a16] ${
                            stokHabis
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          <div>
                            <div className="relative mb-2 h-28 w-full overflow-hidden rounded-lg bg-[#e5eeff] sm:h-36 md:h-32 lg:h-28 xl:h-36 dark:bg-[#1a2822]">
                              {item.gambar ? (
                                <img
                                    src={`${API_URL}${item.gambar}`}
                                    alt={item.nama}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(event) => {
                                    const image =
                                      event.currentTarget;

                                    image.onerror = null;
                                    image.src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e5eeff'/%3E%3Cpath d='M160 210l55-65 45 52 30-35 70 83H40z' fill='%23006948' opacity='.35'/%3E%3Ccircle cx='145' cy='105' r='28' fill='%23006948' opacity='.35'/%3E%3C/svg%3E";
                                  }}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#006948]">
                                  <Icon
                                    name="package"
                                    size={42}
                                  />
                                </div>
                              )}

                              <span
                                className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${
                                  kategori ===
                                  "paket"
                                    ? "bg-[#00855b] text-white"
                                    : "bg-[#213145]/85 text-white"
                                }`}
                              >
                                {kategori ===
                                "makanan"
                                  ? "MAKANAN"
                                  : kategori ===
                                    "minuman"
                                  ? "MINUMAN"
                                  : kategori ===
                                    "snack"
                                  ? "SNACK"
                                  : "PAKET KOMBO"}
                              </span>

                              <span
                                className={`absolute right-2 top-2 max-w-[58%] truncate rounded-md px-2 py-0.5 text-[10px] font-bold shadow-sm sm:text-[11px] ${
                                  stokHabis ||
                                  stokMenipis
                                    ? "bg-[#ffdad6] text-[#93000a]"
                                    : "bg-white text-[#006948] dark:bg-[#edf7f1]"
                                }`}
                              >
                                {stokHabis
                                  ? "Stok Habis"
                                  : stokMenipis
                                  ? `Sisa ${item.qty} (Menipis)`
                                  : `Sisa ${item.qty}`}
                              </span>
                            </div>

                            <p className="text-[10px] font-bold uppercase tracking-wide text-[#3d4a42] sm:text-[11px] dark:text-[#9eb2a7]">
                              {kategori ===
                              "makanan"
                                ? "MAKANAN"
                                : kategori ===
                                  "minuman"
                                ? "MINUMAN"
                                : kategori ===
                                  "snack"
                                ? "SNACK"
                                : "PAKET KOMBO"}
                            </p>

                            <h3 className="mt-0.5 line-clamp-1 text-[14px] font-semibold text-[#0b1c30] transition-colors group-hover:text-[#006948] sm:text-[16px] dark:text-[#edf7f1]">
                              {
                                item.nama
                              }
                            </h3>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-2 pt-1">
                            <span className="min-w-0 truncate text-[15px] font-bold text-[#006948] sm:text-[18px]">
                              Rp{" "}
                              {Number(
                                item.harga
                              ).toLocaleString(
                                "id-ID"
                              )}
                            </span>

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e5eeff] text-[#0b1c30] transition-colors group-hover:bg-[#006948] group-hover:text-white dark:bg-[#1a2822] dark:text-[#edf7f1]">
                              <Icon
                                name="plus"
                                size={18}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* ORDER PANEL */}

            <div className="hidden w-full min-w-0 flex-col rounded-2xl bg-white p-3.5 shadow-md lg:sticky lg:top-20 lg:flex lg:w-[37%] xl:w-[35%] xl:p-4 dark:bg-[#101a16]">
              <div className="flex items-center justify-between pb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[16px] font-bold text-[#0b1c30] xl:text-[18px] dark:text-[#edf7f1]">
                      Pesanan Aktif
                    </span>

                    <span className="shrink-0 rounded-md bg-[#006948]/10 px-2 py-0.5 text-[10px] font-semibold text-[#006948]">
                      Transaksi Baru
                    </span>
                  </div>

                  <span className="text-[11px] text-[#3d4a42] dark:text-[#9eb2a7]">
                    {jumlahItem} item dalam pesanan
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={tahanPesanan}
                    disabled={keranjang.length === 0}
                    title="Tahan Pesanan"
                    className="rounded-lg p-1.5 text-[#006948] hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-[#1a2822]"
                  >
                    <Icon
                      name="pause"
                      size={19}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={resetKeranjang}
                    title="Reset Pesanan"
                    className="rounded-lg p-1.5 text-[#3d4a42] hover:bg-[#e5eeff] hover:text-[#ba1a1a] dark:text-[#9eb2a7] dark:hover:bg-[#1a2822]"
                  >
                    <Icon
                      name="delete"
                      size={19}
                    />
                  </button>
                </div>
              </div>

              {/* MODE PESANAN */}

              <div className="my-1 grid grid-cols-2 gap-1 rounded-xl bg-[#eff4ff] p-1 dark:bg-[#17231e]">
                <button
                  type="button"
                  onClick={() =>
                    setModePesanan("dine_in")
                  }
                  className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-semibold transition-all xl:text-[12px] ${
                    modePesanan === "dine_in"
                      ? "bg-white text-[#0b1c30] shadow-sm dark:bg-[#24342c] dark:text-[#edf7f1]"
                      : "text-[#3d4a42] hover:bg-white/60 dark:text-[#9eb2a7] dark:hover:bg-[#24342c]"
                  }`}
                >
                  <Icon
                    name="table"
                    size={17}
                    className={
                      modePesanan === "dine_in"
                        ? "text-[#006948]"
                        : "text-[#3d4a42] dark:text-[#9eb2a7]"
                    }
                  />
                  Dine In
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setModePesanan("take_away")
                  }
                  className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-semibold transition-all xl:text-[12px] ${
                    modePesanan === "take_away"
                      ? "bg-white text-[#0b1c30] shadow-sm dark:bg-[#24342c] dark:text-[#edf7f1]"
                      : "text-[#3d4a42] hover:bg-white/60 dark:text-[#9eb2a7] dark:hover:bg-[#24342c]"
                  }`}
                >
                  <span className="text-[15px]">
                    🥡
                  </span>
                  Take Away
                </button>
              </div>

              {/* CART */}

              <div className="my-2 flex max-h-[300px] flex-col gap-2 overflow-y-auto pr-1 xl:max-h-[320px]">
                {keranjang.length ===
                0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl bg-[#eff4ff]/60 px-4 py-8 text-center xl:py-10 dark:bg-[#17231e]/60">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#006948] shadow-sm dark:bg-[#24342c]">
                      <Icon
                        name="package"
                        size={23}
                      />
                    </div>

                    <span className="text-[13px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Keranjang masih kosong
                    </span>

                    <span className="mt-1 text-[11px] text-[#3d4a42] dark:text-[#9eb2a7]">
                      Klik produk untuk menambahkannya.
                    </span>
                  </div>
                ) : (
                  keranjang.map(
                    (item) => (
                      <div
                        key={
                          item.id
                        }
                        className="rounded-xl bg-[#eff4ff]/60 p-1 dark:bg-[#17231e]"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="min-w-0 flex-1 pr-1">
                            <span className="line-clamp-1 text-[12px] font-semibold text-[#0b1c30] xl:text-[14px] dark:text-[#edf7f1]">
                              {
                                item.nama
                              }
                            </span>

                            <span className="text-[11px] font-bold text-[#006948] xl:text-[12px]">
                              Rp{" "}
                              {Number(
                                item.harga
                              ).toLocaleString(
                                "id-ID"
                              )}
                            </span>
                          </div>

                          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-white p-1 shadow-sm dark:bg-[#24342c]">
                            <button
                              type="button"
                              onClick={() =>
                                kurangiJumlah(
                                  item.id
                                )
                              }
                              className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#e5eeff] dark:hover:bg-[#1a2822]"
                            >
                              <Icon
                                name="minus"
                                size={15}
                              />
                            </button>

                            <span className="px-1 text-[11px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                              {
                                item.jumlah
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                tambahJumlah(
                                  item.id
                                )
                              }
                              className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#e5eeff] dark:hover:bg-[#1a2822]"
                            >
                              <Icon
                                name="plus"
                                size={15}
                              />
                            </button>
                          </div>

                          <div className="w-[72px] shrink-0 text-right xl:w-20">
                            <span className="text-[12px] font-bold text-[#0b1c30] xl:text-[14px] dark:text-[#edf7f1]">
                              Rp{" "}
                              {(
                                item.jumlah *
                                item.harga
                              ).toLocaleString(
                                "id-ID"
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pl-1">
                          <Icon
                            name="note"
                            size={13}
                            className="text-[#006948]"
                          />

                          <input
                            type="text"
                            disabled
                            placeholder="Catatan koki..."
                            className="w-full bg-transparent text-[11px] italic text-[#3d4a42] outline-none placeholder:text-[#3d4a42] dark:text-[#9eb2a7] dark:placeholder:text-[#81968b]"
                          />
                        </div>
                      </div>
                    )
                  )
                )}
              </div>

              {/* VOUCHER */}

              <div className="my-1 flex items-center gap-1 rounded-xl bg-[#eff4ff] p-2 dark:bg-[#17231e]">
                <Icon
                  name="ticket"
                  size={17}
                  className="shrink-0 text-[#006948]"
                />

                <input
                  disabled
                  type="text"
                  placeholder="Gunakan Voucher Diskon..."
                  className="min-w-0 flex-1 bg-transparent text-[11px] uppercase text-[#0b1c30] outline-none placeholder:text-[#3d4a42] dark:text-[#edf7f1] dark:placeholder:text-[#81968b]"
                />

                <button
                  type="button"
                  onClick={() =>
                    showPopup(
                      "Voucher",
                      "Fitur voucher belum diaktifkan pada transaksi."
                    )
                  }
                  className="shrink-0 rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-[#006948] shadow-sm dark:bg-[#24342c]"
                >
                  Terapkan
                </button>
              </div>

              {/* CALCULATION */}

              <div className="mt-1 flex flex-col gap-1.5 rounded-xl bg-[#eff4ff]/40 p-2 pt-3 dark:bg-[#17231e]/70">
                <div className="flex justify-between text-[11px] text-[#3d4a42] dark:text-[#9eb2a7]">
                  <span>
                    Subtotal Item
                  </span>

                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    Rp{" "}
                    {subtotal.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-[#3d4a42] dark:text-[#9eb2a7]">
                  <span>
                    Diskon Promo
                  </span>

                  <span className="font-medium text-[#ba1a1a]">
                    - Rp 0
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-[#3d4a42] dark:text-[#9eb2a7]">
                  <div className="flex items-center gap-1">
                    <span>
                      PB1
                      {pajakAktif &&
                        pajakPersentase > 0
                        ? ` (${pajakPersentase}%)`
                        : ""}
                    </span>

                    <Icon
                      name="info"
                      size={13}
                    />
                  </div>

                  <span className="font-medium text-[#0b1c30] dark:text-[#edf7f1]">
                    Rp{" "}
                    {pajak.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-[#3d4a42] dark:text-[#9eb2a7]">
                  <span>
                    Service Charge
                    {serviceAktif &&
                      servicePersentase > 0
                      ? ` (${servicePersentase}%)`
                      : ""}
                  </span>

                  <span className="font-medium text-[#0b1c30] dark:text-[#edf7f1]">
                    Rp{" "}
                    {serviceCharge.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>

                <div className="my-1 h-px bg-[#e5eeff] dark:bg-[#26372f]" />

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-bold text-[#0b1c30] xl:text-[16px] dark:text-[#edf7f1]">
                    Total Pembayaran
                  </span>

                  <span className="whitespace-nowrap text-[22px] font-extrabold tracking-tight text-[#006948] sm:text-[24px] xl:text-[28px]">
                    Rp{" "}
                    {total.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>
              </div>

              {/* QUICK CASH */}

              <div className="mt-2 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d4a42] dark:text-[#9eb2a7]">
                  Uang Pas & Pecahan Cepat:
                </span>

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={setUangPas}
                    className="rounded-lg bg-[#eff4ff] py-1.5 text-[10px] font-semibold shadow-sm hover:bg-[#e5eeff] xl:text-[12px] dark:bg-[#17231e] dark:hover:bg-[#24342c]"
                  >
                    Uang Pas
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNominalCepat(
                        85000
                      )
                    }
                    className="rounded-lg bg-[#eff4ff] py-1.5 text-[10px] font-semibold shadow-sm hover:bg-[#e5eeff] xl:text-[12px] dark:bg-[#17231e] dark:hover:bg-[#24342c]"
                  >
                    85.000
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNominalCepat(
                        90000
                      )
                    }
                    className="rounded-lg bg-[#eff4ff] py-1.5 text-[10px] font-semibold shadow-sm hover:bg-[#e5eeff] xl:text-[12px] dark:bg-[#17231e] dark:hover:bg-[#24342c]"
                  >
                    90.000
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNominalCepat(
                        100000
                      )
                    }
                    className="rounded-lg bg-[#eff4ff] py-1.5 text-[10px] font-semibold shadow-sm hover:bg-[#e5eeff] xl:text-[12px] dark:bg-[#17231e] dark:hover:bg-[#24342c]"
                  >
                    100.000
                  </button>
                </div>
              </div>

              {/* PAYMENT */}

              <div className="mt-3 rounded-xl bg-[#eff4ff] p-2.5 dark:bg-[#17231e]">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#3d4a42] dark:text-[#9eb2a7]">
                    Uang Diterima
                  </span>

                  {kembalian >
                    0 && (
                    <span className="text-[11px] font-bold text-[#006948]">
                      Kembalian Rp{" "}
                      {kembalian.toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#3d4a42] dark:text-[#9eb2a7]">
                    Rp
                  </span>

                  <input
                    value={
                      uangBayar
                    }
                    onChange={(
                      event
                    ) =>
                      setUangBayar(
                        formatUang(
                          event.target
                            .value
                        )
                      )
                    }
                    inputMode="numeric"
                    type="text"
                    placeholder="0"
                    className="w-full rounded-lg bg-white py-2.5 pl-10 pr-3 text-right text-[16px] font-bold text-[#0b1c30] outline-none shadow-sm focus:ring-1 focus:ring-[#006948] dark:bg-[#101a16] dark:text-[#edf7f1]"
                  />
                </div>
              </div>

              {/* PAY */}

              <div className="mt-3 flex flex-col gap-2">
                <button
                  id="btnPay"
                  type="button"
                  onClick={bayar}
                  className="flex w-full items-center justify-center rounded-xl bg-[#006948] px-4 py-3 text-white shadow-md transition-all hover:bg-[#00855d] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-1.5">
                    <Icon
                      name="payments"
                      size={21}
                    />

                    <span className="text-[17px] font-semibold xl:text-[20px]">
                      Bayar Sekarang
                    </span>
                  </div>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={buatQris}
                    disabled={qrisLoading}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#213145] py-2.5 text-[12px] font-semibold text-[#eaf1ff] shadow-sm disabled:cursor-not-allowed disabled:opacity-50 xl:text-[14px]"
                  >
                    <img
                      src="https://zonalogo.com/assets/logo-qris.webp"
                      alt="QRIS"
                      className="h-6 w-auto object-contain xl:h-7"
                    />

                    <span>
                      {qrisLoading
                        ? "Membuat QRIS..."
                        : "QRIS"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={
                      cetakStruk
                    }
                    disabled={
                      !transaksiTerakhir
                    }
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#e5eeff] py-2.5 text-[12px] font-semibold text-[#0b1c30] shadow-sm disabled:cursor-not-allowed disabled:opacity-50 xl:text-[14px] dark:bg-[#1a2822] dark:text-[#edf7f1]"
                  >
                    <Icon
                      name="receipt"
                      size={18}
                    />

                    Cetak Struk
                  </button>
                </div>
              </div>

              {/* PRINTER */}

              {daftarPrinter.length >
                0 && (
                <div className="mt-3 rounded-xl bg-[#eff4ff] p-2.5 dark:bg-[#17231e]">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d4a42] dark:text-[#9eb2a7]">
                      Printer Aktif
                    </span>

                    <span className="h-2 w-2 rounded-full bg-[#006948]" />
                  </div>

                  <select
                    value={
                      printerTerpilih?.device_id ||
                      ""
                    }
                    onChange={(
                      event
                    ) => {
                      const printer =
                        daftarPrinter.find(
                          (item) =>
                            item.device_id ===
                            event.target.value
                        );

                      setPrinterTerpilih(
                        printer ||
                          null
                      );
                    }}
                    className="w-full rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-[#0b1c30] outline-none dark:bg-[#101a16] dark:text-[#edf7f1]"
                  >
                    {daftarPrinter.map(
                      (
                        printer
                      ) => (
                        <option
                          key={
                            printer.device_id
                          }
                          value={
                            printer.device_id
                          }
                        >
                          {
                            printer.printer
                          }{" "}
                          —{" "}
                          {
                            printer.device_id
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE CART */}

        <button
          type="button"
          onClick={() =>
            setKeranjangPopup(
              true
            )
          }
          className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[#006948] px-5 py-3 text-white shadow-xl transition-all hover:bg-[#00855d] active:scale-95 lg:hidden"
        >
          <Icon
            name="receipt"
            size={20}
          />

          <span className="text-[14px] font-bold">
            Keranjang
          </span>

          {jumlahItem > 0 && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#006948]">
              {jumlahItem}
            </span>
          )}
        </button>

        {/* MOBILE CART MODAL */}

        {keranjangPopup && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#213145]/40 p-0 backdrop-blur-sm dark:bg-black/60 lg:hidden">
            <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl dark:bg-[#101a16]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                    Pesanan Aktif
                  </h2>

                  <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                    {jumlahItem} item dalam pesanan
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setKeranjangPopup(
                      false
                    )
                  }
                  className="rounded-lg p-2 hover:bg-[#e5eeff] dark:hover:bg-[#1a2822]"
                >
                  <Icon
                    name="close"
                    size={20}
                  />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {keranjang.length ===
                0 ? (
                  <div className="rounded-xl bg-[#eff4ff] p-8 text-center dark:bg-[#17231e]">
                    <Icon
                      name="package"
                      size={32}
                      className="mx-auto mb-3 text-[#006948]"
                    />

                    <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Keranjang masih kosong
                    </p>
                  </div>
                ) : (
                  keranjang.map(
                    (item) => (
                      <div
                        key={
                          item.id
                        }
                        className="rounded-xl bg-[#eff4ff]/70 p-3 dark:bg-[#17231e]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                              {
                                item.nama
                              }
                            </p>

                            <p className="text-[12px] font-bold text-[#006948]">
                              Rp{" "}
                              {item.harga.toLocaleString(
                                "id-ID"
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 rounded-lg bg-white p-1 shadow-sm dark:bg-[#24342c]">
                            <button
                              type="button"
                              onClick={() =>
                                kurangiJumlah(
                                  item.id
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded hover:bg-[#e5eeff] dark:hover:bg-[#1a2822]"
                            >
                              <Icon
                                name="minus"
                                size={16}
                              />
                            </button>

                            <span className="px-1 text-[12px] font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                              {
                                item.jumlah
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                tambahJumlah(
                                  item.id
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded hover:bg-[#e5eeff] dark:hover:bg-[#1a2822]"
                            >
                              <Icon
                                name="plus"
                                size={16}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                            Subtotal
                          </span>

                          <span className="text-[14px] font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                            Rp{" "}
                            {(
                              item.jumlah *
                              item.harga
                            ).toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>

              <div className="mt-4 rounded-xl bg-[#eff4ff] p-3 dark:bg-[#17231e]">
                <div className="flex justify-between text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                  <span>
                    Subtotal Item
                  </span>

                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Rp{" "}
                    {subtotal.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>

                <div className="mt-1 flex justify-between text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                  <span>
                    PB1
                  </span>

                  <span>
                    Rp{" "}
                    {pajak.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>

                <div className="mt-1 flex justify-between text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                  <span>
                    Service
                  </span>

                  <span>
                    Rp{" "}
                    {serviceCharge.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#dce5df] pt-2 dark:border-[#304238]">
                  <span className="text-[15px] font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                    Total Pembayaran
                  </span>

                  <span className="whitespace-nowrap text-[21px] font-extrabold text-[#006948]">
                    Rp{" "}
                    {total.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[12px] font-semibold text-[#3d4a42] dark:text-[#9eb2a7]">
                  Uang Diterima
                </label>

                <input
                  value={
                    uangBayar
                  }
                  onChange={(
                    event
                  ) =>
                    setUangBayar(
                      formatUang(
                        event.target
                          .value
                      )
                    )
                  }
                  inputMode="numeric"
                  placeholder="0"
                  className="w-full rounded-xl bg-[#eff4ff] px-4 py-3 text-right text-[18px] font-bold text-[#0b1c30] outline-none dark:bg-[#17231e] dark:text-[#edf7f1]"
                />
              </div>

              <button
                type="button"
                onClick={bayar}
                className="mt-3 flex w-full items-center justify-between rounded-xl bg-[#006948] px-4 py-3.5 text-white shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Icon
                    name="payments"
                    size={22}
                  />

                  <span className="text-[16px] font-bold">
                    Bayar Sekarang
                  </span>
                </div>

                <span className="rounded bg-white/20 px-2 py-0.5 text-[11px] font-bold">
                  F8
                </span>
              </button>

              <button
                type="button"
                onClick={
                  cetakStruk
                }
                disabled={
                  !transaksiTerakhir
                }
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e5eeff] py-3 text-[14px] font-semibold text-[#0b1c30] disabled:opacity-50 dark:bg-[#1a2822] dark:text-[#edf7f1]"
              >
                <Icon
                  name="receipt"
                  size={20}
                />

                Cetak Bill
              </button>
            </div>
          </div>
        )}

        {/* QRIS */}

        {qrisPopup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#213145]/40 p-4 backdrop-blur-sm dark:bg-black/60">
            <div className="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-[#101a16]">

              <div className="mb-4 flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    name="qris"
                    size={24}
                    className="text-[#006948]"
                  />

                  <span className="text-[16px] font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                    QRIS Pembayaran
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!qrisPaidLoading) {
                      setQrisPopup(false);
                    }
                  }}
                  className="rounded-lg p-1 hover:bg-[#e5eeff] dark:hover:bg-[#1a2822]"
                >
                  <Icon
                    name="close"
                    size={20}
                  />
                </button>
              </div>

              <div className="rounded-xl border border-dashed border-[#bccac0] bg-white p-4 shadow-sm dark:border-[#34483e] dark:bg-[#17231e]">
                <div className="flex h-48 w-48 items-center justify-center bg-white p-2">
                  {qrisData?.qrString ? (
                    <QRCodeSVG
                      value={
                        qrisData.qrString
                      }
                      size={176}
                      level="M"
                      includeMargin
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      QR belum tersedia
                    </div>
                  )}
                </div>

                <span className="mt-2 block text-[11px] font-bold text-[#3d4a42] dark:text-[#9eb2a7]">
                  QRIS Pembayaran
                </span>
              </div>

              <div className="mt-4">
                <span className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                  Total Tagihan:
                </span>

                <span className="block text-[28px] font-extrabold text-[#006948]">
                  Rp{" "}
                  {(
                    qrisData
                      ? total
                      : total
                  ).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="mt-2 flex w-full flex-col gap-2">
                <div
                  className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold ${
                    qrisData?.status === "paid"
                      ? "bg-[#006948]/10 text-[#006948]"
                      : "bg-[#006948]/10 text-[#006948]"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      qrisData?.status === "paid"
                        ? "bg-[#006948]"
                        : "animate-pulse bg-[#006948]"
                    }`}
                  />

                  {qrisData?.status === "paid"
                    ? "PEMBAYARAN BERHASIL"
                    : "MENUNGGU PEMBAYARAN"}
                </div>

                {qrisData?.referenceId && (
                  <div className="rounded-lg bg-[#eff4ff] px-3 py-2 text-left dark:bg-[#17231e]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#3d4a42] dark:text-[#9eb2a7]">
                      Reference ID
                    </p>

                    <p className="mt-0.5 break-all text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      {
                        qrisData.referenceId
                      }
                    </p>
                  </div>
                )}

                {qrisData?.paymentId && (
                  <div className="rounded-lg bg-[#eff4ff] px-3 py-2 text-left dark:bg-[#17231e]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#3d4a42] dark:text-[#9eb2a7]">
                      Payment ID
                    </p>

                    <p className="mt-0.5 break-all text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      {
                        qrisData.paymentId
                      }
                    </p>
                  </div>
                )}
              </div>

              {qrisData?.status !== "paid" && (
                <button
                  type="button"
                  onClick={
                    simulasiQrisPaid
                  }
                  disabled={
                    qrisPaidLoading
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#006948] py-3 text-[13px] font-bold text-white shadow-md transition-all hover:bg-[#00855d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon
                    name="check"
                    size={19}
                  />

                  {qrisPaidLoading
                    ? "Memproses Pembayaran..."
                    : "Simulasikan Pembayaran Berhasil"}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!qrisPaidLoading) {
                    setQrisPopup(false);
                  }
                }}
                disabled={
                  qrisPaidLoading
                }
                className="mt-2 w-full rounded-xl bg-[#e5eeff] py-2.5 text-[12px] font-semibold text-[#0b1c30] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#1a2822] dark:text-[#edf7f1]"
              >
                {qrisData?.status === "paid"
                  ? "Tutup"
                  : "Batalkan / Tutup"}
              </button>
            </div>
          </div>
        )}

        {/* PESANAN DITAHAN */}

        {showPesananDitahan && (
          <div className="fixed inset-0 z-[65] flex items-center justify-center bg-[#213145]/40 p-4 backdrop-blur-sm dark:bg-black/60">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-[#101a16]">

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                    Pesanan Ditahan
                  </h2>

                  <p className="mt-0.5 text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                    Pilih pesanan untuk dipanggil kembali.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPesananDitahan(false)
                  }
                  className="rounded-lg p-2 hover:bg-[#e5eeff] dark:hover:bg-[#1a2822]"
                >
                  <Icon
                    name="close"
                    size={20}
                  />
                </button>
              </div>

              <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
                {pesananDitahan.map(
                  (pesanan, index) => {
                    const jumlah = pesanan.reduce(
                      (sum, item) =>
                        sum + item.jumlah,
                      0
                    );

                    const totalPesanan =
                      pesanan.reduce(
                        (sum, item) =>
                          sum +
                          item.harga *
                            item.jumlah,
                        0
                      );

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-xl bg-[#eff4ff] p-3 dark:bg-[#17231e]"
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                            Pesanan #{index + 1}
                          </p>

                          <p className="mt-0.5 text-[11px] text-[#3d4a42] dark:text-[#9eb2a7]">
                            {jumlah} item
                          </p>

                          <p className="mt-1 text-[14px] font-bold text-[#006948]">
                            Rp{" "}
                            {totalPesanan.toLocaleString(
                              "id-ID"
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setKeranjang(
                              pesanan
                            );

                            setPesananDitahan(
                              (prev) =>
                                prev.filter(
                                  (_, i) =>
                                    i !== index
                                )
                            );

                            setShowPesananDitahan(
                              false
                            );

                            setUangBayar("");
                          }}
                          className="rounded-xl bg-[#006948] px-3 py-2 text-[12px] font-bold text-white shadow-sm transition-all hover:bg-[#00855d] active:scale-95"
                        >
                          Panggil Kembali
                        </button>
                      </div>
                    );
                  }
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPesananDitahan(false)
                }
                className="mt-4 w-full rounded-xl bg-[#e5eeff] py-2.5 text-[12px] font-semibold text-[#0b1c30] dark:bg-[#1a2822] dark:text-[#edf7f1]"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* GENERAL POPUP */}

        {popup.show && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#213145]/40 p-4 backdrop-blur-sm dark:bg-black/60">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-[#101a16]">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff4ff] text-[#006948] dark:bg-[#17231e]">
                  <Icon
                    name="check"
                    size={22}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-[18px] font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                    {
                      popup.title
                    }
                  </h3>

                  <p className="mt-2 whitespace-pre-line text-[12px] leading-5 text-[#3d4a42] dark:text-[#9eb2a7]">
                    {
                      popup.message
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closePopup
                  }
                  className="rounded-lg p-1 hover:bg-[#e5eeff] dark:hover:bg-[#1a2822]"
                >
                  <Icon
                    name="close"
                    size={18}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={
                  closePopup
                }
                className="mt-5 w-full rounded-xl bg-[#006948] py-2.5 text-[14px] font-semibold text-white hover:bg-[#00855d]"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}