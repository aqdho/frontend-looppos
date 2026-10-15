"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Tab =
  | "profil"
  | "struk"
  | "pajak"
  | "pembayaran"
  | "notifikasi"
  | "keamanan"
  | "sandi"
  | "tampilan";

type Settings = {
  nama_toko: string;
  alamat_toko: string;
  telepon_toko: string;
  logo: string;
  pesan_struk: string;

  tampil_nama: boolean;
  tampil_alamat: boolean;
  tampil_telepon: boolean;
  tampil_tanggal: boolean;

  printer: string;
  ukuran_kertas: string;

  konfirmasi_pembayaran: boolean;
  auto_clear_keranjang: boolean;

  tema: string;
  kategori_usaha: string;
  kota_wilayah: string;

  jam_buka: string;
  jam_tutup: string;

  pengingat_tutup_shift: boolean;
  pembulatan_kembalian: boolean;

  pajak_aktif: boolean;
  pajak_persentase: number;

  service_aktif: boolean;
  service_persentase: number;

  pembayaran_tunai: boolean;
  pembayaran_qris: boolean;
  pembayaran_transfer: boolean;
  pembayaran_debit: boolean;

  notifikasi_transaksi: boolean;
  notifikasi_shift: boolean;
  notifikasi_stok: boolean;
  whatsapp_notifikasi: boolean;

  pin_keamanan: boolean;
  kontras_tinggi: boolean;
};

type User = {
  id: number;
  username: string;
  email: string;
  phone: string;
  role?: string;
};

const API_URL = "/api";

const defaultSettings: Settings = {
  nama_toko: "",
  alamat_toko: "",
  telepon_toko: "",
  logo: "",
  pesan_struk: "Terima Kasih 🙏",

  tampil_nama: true,
  tampil_alamat: true,
  tampil_telepon: true,
  tampil_tanggal: true,

  printer: "",
  ukuran_kertas: "58mm",

  konfirmasi_pembayaran: true,
  auto_clear_keranjang: true,

  tema: "light",
  kategori_usaha: "Kafe & Kedai Kopi (F&B)",
  kota_wilayah: "",

  jam_buka: "07:00",
  jam_tutup: "22:00",

  pengingat_tutup_shift: false,
  pembulatan_kembalian: false,

  pajak_aktif: false,
  pajak_persentase: 0,

  service_aktif: false,
  service_persentase: 0,

  pembayaran_tunai: true,
  pembayaran_qris: true,
  pembayaran_transfer: false,
  pembayaran_debit: false,

  notifikasi_transaksi: true,
  notifikasi_shift: false,
  notifikasi_stok: false,
  whatsapp_notifikasi: false,

  pin_keamanan: false,
  kontras_tinggi: false,
};

  function Icon({ 
    name, 
    className = "",
  }: { 
    name: string;
    className?: string;
  }) { 
    return ( 
      <span
        className={`material-symbols-outlined ${className}`}
        aria-hidden="true"
      >
        {name} 
      </span>
    );
  }

  function InputIcon({ 
    icon, 
    value, 
    onChange,
    type = "text",
    placeholder = "",
  }: { 
    icon: string;
    value: string;
    onChange?: (value: string) => void;
    type?: string;
    placeholder?: string;
  }) { 
    return ( 
      <div className="relative flex items-center">
      <Icon
        name={icon}
        className="absolute left-3 text-[18px] text-[#3d4a42] dark:text-[#9eb2a7]"
      />

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg bg-[#eff4ff] py-2.5 pl-10 pr-3 text-[14px] leading-5 text-[#0b1c30] outline-none transition-all placeholder:text-[#718078] focus:bg-white focus:ring-2 focus:ring-[#006948] dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#718a7d] dark:focus:bg-[#1a2822]"
      />
    </div>
    );
  }

export default function SettingPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("profil");

  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [originalSettings, setOriginalSettings] =
    useState<Settings>(defaultSettings);

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const [logoInputKey, setLogoInputKey] =
    useState(0);

  const [logoutModal, setLogoutModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  const [toast, setToast] = useState("");
  const [toastIcon, setToastIcon] = useState("check_circle");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] =
    useState("");

  function showToast(
    message: string,
    icon = "check_circle",
  ) {
    setToast(message);
    setToastIcon(icon);

    window.setTimeout(() => {
      setToast("");
    }, 3000);
  }

  function updateSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function loadSettings() {
    try {
      const response = await fetch(`${API_URL}/settings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil pengaturan");
      }

      const result = await response.json();

      const data = Array.isArray(result.data)
        ? result.data[0]
        : result.data;

      if (!data) return;

      const savedTheme = localStorage.getItem("theme");

      const validLocalTheme =
        savedTheme === "dark" ||
        savedTheme === "light" ||
        savedTheme === "system"
          ? savedTheme
          : null;

      const loaded: Settings = {
        nama_toko: data.nama_toko ?? "",
        alamat_toko: data.alamat_toko ?? "",
        telepon_toko: data.telepon_toko ?? "",
        logo: data.logo ?? "",
        pesan_struk:
          data.pesan_struk ?? "Terima Kasih 🙏",

        tampil_nama:
          data.tampil_nama ?? true,
        tampil_alamat:
          data.tampil_alamat ?? true,
        tampil_telepon:
          data.tampil_telepon ?? true,
        tampil_tanggal:
          data.tampil_tanggal ?? true,

        printer: data.printer ?? "",
        ukuran_kertas:
          data.ukuran_kertas ?? "58mm",

        konfirmasi_pembayaran:
          data.konfirmasi_pembayaran ?? true,
        auto_clear_keranjang:
          data.auto_clear_keranjang ?? true,

        tema: data.tema ?? validLocalTheme ?? "light",
        kategori_usaha:
          data.kategori_usaha ??
          "Kafe & Kedai Kopi (F&B)",
        kota_wilayah:
          data.kota_wilayah ?? "",

        jam_buka:
          data.jam_buka ?? "07:00",
        jam_tutup:
          data.jam_tutup ?? "22:00",

        pengingat_tutup_shift:
          data.pengingat_tutup_shift ??
          false,

        pembulatan_kembalian:
          data.pembulatan_kembalian ?? false,

        pajak_aktif:
          data.pajak_aktif ?? false,
        pajak_persentase:
          Number(data.pajak_persentase ?? 0),

        service_aktif:
          data.service_aktif ?? false,
        service_persentase:
          Number(data.service_persentase ?? 0),

        pembayaran_tunai:
          data.pembayaran_tunai ?? true,
        pembayaran_qris:
          data.pembayaran_qris ?? true,
        pembayaran_transfer:
          data.pembayaran_transfer ?? false,
        pembayaran_debit:
          data.pembayaran_debit ?? false,

        notifikasi_transaksi:
          data.notifikasi_transaksi ?? true,
        notifikasi_shift:
          data.notifikasi_shift ?? false,
        notifikasi_stok:
          data.notifikasi_stok ?? false,
        whatsapp_notifikasi:
          data.whatsapp_notifikasi ?? false,

        pin_keamanan:
          data.pin_keamanan ?? false,
        kontras_tinggi:
          data.kontras_tinggi ?? false,
      };

      setSettings(loaded);
      setOriginalSettings(loaded);

      applyTheme(loaded.tema);
      applyContrast(loaded.kontras_tinggi);
    } catch (error) {
      console.error(error);

      showToast(
        "Pengaturan toko gagal dimuat.",
        "error",
      );
    }
  }

  async function loadUser() {
    try {
      const response = await fetch(
        `${API_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token",
            )}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          "Gagal mengambil data akun",
        );
      }

      const result = await response.json();

      const data = result.user ?? result;

      const loadedUser: User = {
        id: data.id,
        username: data.username ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        role: data.role,
      };

      setUser(loadedUser);
      setUsername(loadedUser.username);
      setEmail(loadedUser.email);
      setPhone(loadedUser.phone);
    } catch (error) {
      console.error(error);

      showToast(
        "Data akun gagal dimuat.",
        "error",
      );
    }
  }

  function applyTheme(theme: string) {
    if (typeof window === "undefined") return;

    localStorage.setItem("theme", theme);

    const html = document.documentElement;

    html.classList.remove("dark");

    if (theme === "dark") {
      html.classList.add("dark");
    }

    if (theme === "system") {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      if (systemDark) {
        html.classList.add("dark");
      }
    }

    window.dispatchEvent(
      new CustomEvent("kasirkilat-theme-change", {
        detail: theme,
      }),
    );
  }

  function applyContrast(enabled: boolean) {
    if (typeof window === "undefined") return;

    document.documentElement.classList.toggle(
      "high-contrast",
      enabled,
    );
  }

  async function handleThemeChange(theme: string) {
  updateSetting("tema", theme);
  applyTheme(theme);

  try {
    const token = localStorage.getItem("token");

    if (!token) return;

    const response = await fetch("/api/settings/tema", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tema: theme }),
    });

    if (!response.ok) {
      showToast("Tema gagal disimpan ke server.", "error");
    }
  } catch (error) {
    console.error("Gagal menyimpan tema:", error);
    showToast("Tema gagal disimpan ke server.", "error");
  }
}

  function handleContrastChange(value: boolean) {
    updateSetting("kontras_tinggi", value);
    applyContrast(value);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    Promise.all([
      loadSettings(),
      loadUser(),
    ]).finally(() => {
      setLoading(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLogoutModal(false);
        setPreviewModal(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  async function uploadLogo(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  // VALIDASI FORMAT
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    showToast(
      "Logo harus berupa PNG, JPG, JPEG, atau WebP.",
      "error",
    );

    setLogoInputKey((prev) => prev + 1);

    return;
  }

  // VALIDASI UKURAN MAKSIMAL 5MB
  if (file.size > 5 * 1024 * 1024) {
    showToast(
      "Ukuran logo maksimal 5 MB.",
      "error",
    );

    setLogoInputKey((prev) => prev + 1);

    return;
  }

  setUploadingLogo(true);

  try {
    const formData = new FormData();

    formData.append("logo", file);

    const response = await fetch(
      `${API_URL}/settings/logo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token",
          )}`,
        },
        body: formData,
      },
    );

    const result = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.pesan ||
          result.message ||
          "Logo gagal diupload.",
      );
    }

    const logoPath = result.logo;

    if (!logoPath) {
      throw new Error(
        "Path logo tidak diterima dari server.",
      );
    }

    updateSetting("logo", logoPath);

    setOriginalSettings((prev) => ({
      ...prev,
      logo: logoPath,
    }));

    showToast(
      "Logo toko berhasil diupload.",
      "check_circle",
    );
  } catch (error) {
    console.error(
      "ERROR UPLOAD LOGO:",
      error,
    );

    showToast(
      error instanceof Error
        ? error.message
        : "Logo gagal diupload.",
      "error",
    );
  } finally {
    setUploadingLogo(false);

    setLogoInputKey((prev) => prev + 1);
  }
}

  async function saveSettings() {
    setSaving(true);

    try {
      const payload = {
        nama_toko: settings.nama_toko,
        alamat_toko: settings.alamat_toko,
        telepon_toko: settings.telepon_toko,
        logo: settings.logo,
        pesan_struk: settings.pesan_struk,

        tampil_nama: settings.tampil_nama,
        tampil_alamat: settings.tampil_alamat,
        tampil_telepon: settings.tampil_telepon,
        tampil_tanggal: settings.tampil_tanggal,

        printer: settings.printer,
        ukuran_kertas: settings.ukuran_kertas,

        konfirmasi_pembayaran:
          settings.konfirmasi_pembayaran,
        auto_clear_keranjang:
          settings.auto_clear_keranjang,

        tema: settings.tema,
        kategori_usaha:
          settings.kategori_usaha,
        kota_wilayah:
          settings.kota_wilayah,

        jam_buka: settings.jam_buka,
        jam_tutup: settings.jam_tutup,

        pengingat_tutup_shift:
          settings.pengingat_tutup_shift,
        pembulatan_kembalian:
          settings.pembulatan_kembalian,

        pajak_aktif:
          settings.pajak_aktif,
        pajak_persentase:
          settings.pajak_persentase,

        service_aktif:
          settings.service_aktif,
        service_persentase:
          settings.service_persentase,

        pembayaran_tunai:
          settings.pembayaran_tunai,
        pembayaran_qris:
          settings.pembayaran_qris,
        pembayaran_transfer:
          settings.pembayaran_transfer,
        pembayaran_debit:
          settings.pembayaran_debit,

        notifikasi_transaksi:
          settings.notifikasi_transaksi,
        notifikasi_shift:
          settings.notifikasi_shift,
        notifikasi_stok:
          settings.notifikasi_stok,
        whatsapp_notifikasi:
          settings.whatsapp_notifikasi,

        pin_keamanan:
          settings.pin_keamanan,
        kontras_tinggi:
          settings.kontras_tinggi,
      };

      const response = await fetch(
        `${API_URL}/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              "token",
            )}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.pesan ||
            "Perubahan konfigurasi gagal disimpan.",
        );
      }

      const savedData =
        result.data ?? settings;

      const normalized: Settings = {
        ...settings,
        ...savedData,

        pajak_persentase: Number(
          savedData.pajak_persentase ??
            settings.pajak_persentase,
        ),

        service_persentase: Number(
          savedData.service_persentase ??
            settings.service_persentase,
        ),
      };

      setSettings(normalized);
      setOriginalSettings(normalized);

      applyTheme(normalized.tema);
      applyContrast(
        normalized.kontras_tinggi,
      );

      showToast(
        "Semua pengaturan toko berhasil disimpan.",
        "check_circle",
      );
    } catch (error) {
      console.error(error);

      showToast(
        error instanceof Error
          ? error.message
          : "Perubahan gagal disimpan.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  function resetChanges() {
    setSettings(originalSettings);

    applyTheme(originalSettings.tema);
    applyContrast(
      originalSettings.kontras_tinggi,
    );

    showToast(
      "Perubahan dikembalikan.",
      "restart_alt",
    );
  }

  async function saveAccount() {
    if (!user) return;

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              "token",
            )}`,
          },
          body: JSON.stringify({
            username,
            phone,
            email,
          }),
        },
      );

      const result =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.pesan ||
            "Profil akun gagal diperbarui.",
        );
      }

      setUser((prev) =>
        prev
          ? {
              ...prev,
              username,
              phone,
              email,
            }
          : prev,
      );

      showToast(
        "Profil akun berhasil diperbarui.",
        "check_circle",
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Profil akun gagal diperbarui.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (
      !passwordLama ||
      !passwordBaru ||
      !konfirmasiPassword
    ) {
      showToast(
        "Lengkapi seluruh kolom kata sandi.",
        "error",
      );
      return;
    }

    if (
      passwordBaru !==
      konfirmasiPassword
    ) {
      showToast(
        "Konfirmasi kata sandi tidak cocok.",
        "error",
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/users/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              "token",
            )}`,
          },
          body: JSON.stringify({
            passwordLama,
            passwordBaru,
          }),
        },
      );

      const result =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.pesan ||
            "Kata sandi gagal diperbarui.",
        );
      }

      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasiPassword("");

      showToast(
        "Kata sandi berhasil diperbarui.",
        "check_circle",
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Kata sandi gagal diperbarui.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  function executeLogout() {
    localStorage.removeItem("token");

    setLogoutModal(false);

    showToast(
      "Sesi diakhiri. Mengalihkan ke login...",
      "logout",
    );

    window.setTimeout(() => {
      router.replace("/login");
    }, 700);
  }

  const tabs: {
    id: Tab;
    icon: string;
    label: string;
  }[] = [
    {
      id: "profil",
      icon: "storefront",
      label: "Profil Outlet & Toko",
    },
    {
      id: "struk",
      icon: "receipt_long",
      label: "Struk & Printer Kasir",
    },
    {
      id: "pajak",
      icon: "percent",
      label: "Pajak (PB1) & Biaya Layanan",
    },
    {
      id: "pembayaran",
      icon: "qr_code_scanner",
      label: "Metode Pembayaran & QRIS",
    },
    {
      id: "notifikasi",
      icon: "chat",
      label: "Notifikasi & WhatsApp Bot",
    },
    {
      id: "keamanan",
      icon: "security",
      label: "Keamanan & Hak Akses PIN",
    },
    {
      id: "tampilan",
      icon: "palette",
      label: "Tampilan & Tema",
    },
  ];

  

  function Switch({
    checked,
    disabled = false,
    onChange,
  }: {
    checked: boolean;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
  }) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          onChange?.(!checked)
        }
        aria-pressed={checked}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#006948]"
            : "bg-[#6d7a72] dark:bg-[#4d6157]"
        } ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
      >
        <span
          className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition ${
            checked
              ? "translate-x-[22px]"
              : "translate-x-[2px]"
          }`}
        />
      </button>
    );
  }

  

  function SectionHeader({
    icon,
    title,
    description,
    iconBackground = "bg-[#006948]/10",
  }: {
    icon: string;
    title: string;
    description: string;
    iconBackground?: string;
  }) {
    return (
      <div className="flex items-center gap-2 pb-1">
        <span
          className={`flex items-center justify-center rounded-lg p-2 text-[#006948] dark:text-[#85f8c4] ${iconBackground}`}
        >
          <Icon
            name={icon}
            className="text-[20px]"
          />
        </span>

        <div className="flex min-w-0 flex-col">
          <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.005em] text-[#0b1c30] dark:text-[#edf7f1]">
            {title}
          </h2>

          <span className="text-[12px] leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
            {description}
          </span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f9ff] px-6 py-8 text-[#0b1c30] dark:bg-[#0b1411] dark:text-[#edf7f1]">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-[#3d4a42] dark:text-[#9eb2a7]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#006948] border-t-transparent" />
            Memuat pengaturan...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-[#f8f9ff] px-4 py-6 text-[#0b1c30] transition-colors sm:px-6 lg:px-8 dark:bg-[#0b1411] dark:text-[#edf7f1]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap");

        * {
          scrollbar-width: none;
        }

        *::-webkit-scrollbar {
          display: none;
        }

        body {
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .material-symbols-outlined {
          font-family: "Material Symbols Outlined";
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: "liga";
          -webkit-font-smoothing: antialiased;
        }

        html.high-contrast {
          filter: contrast(1.08);
        }
      `}</style>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[12px] font-semibold leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
              <span>Dashboard</span>

              <Icon
                name="chevron_right"
                className="text-[14px]"
              />

              <span className="font-semibold text-[#006948] dark:text-[#85f8c4]">
                Pengaturan Toko
              </span>
            </div>

            <h1 className="text-[28px] font-bold leading-9 tracking-[-0.02em] text-[#0b1c30] dark:text-[#edf7f1]">
              Pengaturan & Konfigurasi Toko
            </h1>

            <p className="max-w-3xl text-[14px] leading-5 text-[#3d4a42] dark:text-[#9eb2a7]">
              Kelola profil outlet, preferensi struk
              kasir, pembayaran, pajak, notifikasi,
              tampilan, dan keamanan akun pemilik.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={resetChanges}
              className="flex items-center gap-1 rounded-lg bg-white px-4 py-2.5 text-[14px] font-semibold leading-5 text-[#0b1c30] shadow-sm transition-all hover:bg-[#eff4ff] dark:bg-[#101a16] dark:text-[#edf7f1] dark:hover:bg-[#17231e]"
            >
              <Icon
                name="restart_alt"
                className="text-[18px]"
              />

              <span>Reset Perubahan</span>
            </button>

            <button
              type="button"
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-1 rounded-lg bg-[#006948] px-4 py-2.5 text-[14px] font-semibold leading-5 text-white shadow-sm transition-all hover:bg-[#00855d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon
                name="check_circle"
                className="text-[18px]"
              />

              <span>
                {saving
                  ? "Menyimpan..."
                  : "Simpan Pengaturan"}
              </span>
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-1 overflow-x-auto overscroll-x-contain rounded-xl bg-[#eff4ff] p-1.5 shadow-sm dark:bg-[#17231e]">
          {tabs.map((tab) => {
            const active =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`flex shrink-0 items-center gap-1 rounded-lg px-4 py-2.5 text-[14px] font-semibold leading-5 transition-all ${
                  active
                    ? "bg-white text-[#006948] shadow-sm dark:bg-[#101a16] dark:text-[#85f8c4]"
                    : "text-[#3d4a42] hover:bg-white/50 hover:text-[#0b1c30] dark:text-[#9eb2a7] dark:hover:bg-[#1a2822] dark:hover:text-[#edf7f1]"
                }`}
              >
                <Icon
                  name={tab.icon}
                  className="text-[18px]"
                />

                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "profil" && (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
                <SectionHeader
                  icon="store"
                  title="Identitas Toko & Kontak"
                  description="Informasi outlet yang digunakan pada struk dan laporan."
                />

                <div className="flex flex-col items-center gap-4 rounded-xl bg-[#eff4ff] p-4 sm:flex-row dark:bg-[#17231e]">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm dark:bg-[#1a2822]">
                    {settings.logo ? (
                      <img
                        src={
                          settings.logo.startsWith("http")
                            ? settings.logo
                            : `${API_URL}${settings.logo}`
                        }
                        alt="Logo toko"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Icon
                        name="storefront"
                        className="text-4xl text-[#006948] dark:text-[#85f8c4]"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-1 text-center sm:text-left">
                    <span className="text-[16px] font-semibold leading-[22px] text-[#0b1c30] dark:text-[#edf7f1]">
                      Logo Struk & Portal Usaha
                    </span>

                    <p className="text-[12px] leading-4 text-[#3d4a42] dark:text-[#9eb2a7]">
                      Masukkan logo toko kamu. Logo akan
                      tersimpan khusus untuk toko ini.
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <label
                        htmlFor="logo-toko-input"
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#006948] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[#00583d] ${
                          uploadingLogo
                            ? "pointer-events-none opacity-60"
                            : ""
                        }`}
                      >
                        <Icon
                          name={
                            uploadingLogo
                              ? "progress_activity"
                              : "upload"
                          }
                          className={`text-[18px] ${
                            uploadingLogo
                              ? "animate-spin"
                              : ""
                          }`}
                        />

                        {uploadingLogo
                          ? "Mengupload..."
                          : "Pilih Logo"}
                      </label>

                      <input
                        key={logoInputKey}
                        id="logo-toko-input"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={uploadLogo}
                        className="hidden"
                        disabled={uploadingLogo}
                      />

                      {settings.logo && (
                        <button
                          type="button"
                          onClick={async () => {

                            try {

                              const response =
                                await fetch(
                                  `${API_URL}/settings/logo`,
                                  {
                                    method: "DELETE",

                                    headers: {
                                      Authorization:
                                        `Bearer ${localStorage.getItem(
                                          "token",
                                        )}`,
                                    },
                                  },
                                );

                              const result =
                                await response
                                  .json()
                                  .catch(() => ({}));

                              if (!response.ok) {

                                throw new Error(
                                  result.pesan ||
                                    result.message ||
                                    "Logo gagal dihapus.",
                                );

                              }

                              updateSetting(
                                "logo",
                                "",
                              );

                              setOriginalSettings(
                                (prev) => ({
                                  ...prev,
                                  logo: "",
                                }),
                              );

                              showToast(
                                "Logo toko berhasil dihapus.",
                                "delete",
                              );

                            } catch (error) {

                              console.error(
                                "ERROR DELETE LOGO:",
                                error,
                              );

                              showToast(
                                error instanceof Error
                                  ? error.message
                                  : "Logo gagal dihapus.",
                                "error",
                              );

                            }

                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#ffdad6] px-3 py-2 text-[12px] font-semibold text-[#ba1a1a] transition hover:bg-[#ffc9c3] dark:bg-[#4a2420] dark:text-[#ffb4ab]"
                        >
                          <Icon
                            name="delete"
                            className="text-[18px]"
                          />

                          Hapus Logo
                        </button>
                      )}
                    </div>

                    <p className="mt-1 text-[11px] leading-4 text-[#718078] dark:text-[#718a7d]">
                      PNG, JPG, JPEG, atau WebP • Maksimal 5 MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Nama Outlet / Toko
                    </label>

                    <InputIcon
                      icon="business"
                      value={settings.nama_toko}
                      onChange={(value) =>
                        updateSetting(
                          "nama_toko",
                          value,
                        )
                      }
                      placeholder="Nama toko"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Kategori Usaha
                    </label>

                    <select
                      value={
                        settings.kategori_usaha
                      }
                      onChange={(e) =>
                        updateSetting(
                          "kategori_usaha",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg bg-[#eff4ff] px-3 py-2.5 text-[14px] text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#006948] dark:bg-[#17231e] dark:text-[#edf7f1] dark:focus:bg-[#1a2822]"
                    >
                      <option>
                        Kafe & Kedai Kopi (F&B)
                      </option>
                      <option>
                        Restoran Cepat Saji
                      </option>
                      <option>
                        Minimarket / Retail Kelontong
                      </option>
                      <option>
                        Bakery & Pastryoverflo
                      </option>
                      <option>
                        Jasa & Barbershop
                      </option>
                      <option>
                        Lainnya
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Nomor WhatsApp Resmi Toko
                    </label>

                    <InputIcon
                      icon="phone_iphone"
                      type="tel"
                      value={
                        settings.telepon_toko
                      }
                      onChange={(value) =>
                        updateSetting(
                          "telepon_toko",
                          value,
                        )
                      }
                      placeholder="Nomor WhatsApp"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Kota & Wilayah
                    </label>

                    <InputIcon
                      icon="location_city"
                      value={
                        settings.kota_wilayah
                      }
                      onChange={(value) =>
                        updateSetting(
                          "kota_wilayah",
                          value,
                        )
                      }
                      placeholder="Contoh: Yogyakarta"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Alamat Lengkap Toko
                    </label>

                    <textarea
                      value={
                        settings.alamat_toko
                      }
                      onChange={(e) =>
                        updateSetting(
                          "alamat_toko",
                          e.target.value,
                        )
                      }
                      rows={2}
                      placeholder="Alamat lengkap toko"
                      className="w-full rounded-lg bg-[#eff4ff] p-3 text-[14px] text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#006948] dark:bg-[#17231e] dark:text-[#edf7f1] dark:focus:bg-[#1a2822]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
                <SectionHeader
                  icon="tune"
                  title="Preferensi Operasional & Kasir"
                  description="Atur jadwal operasional dan perilaku kasir."
                  iconBackground="bg-[#dae2fd] dark:bg-[#183a2d]"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Jam Buka Operasional
                    </label>

                    <InputIcon
                      icon="schedule"
                      type="time"
                      value={
                        settings.jam_buka
                      }
                      onChange={(value) =>
                        updateSetting(
                          "jam_buka",
                          value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Jam Tutup Operasional
                    </label>

                    <InputIcon
                      icon="bedtime"
                      type="time"
                      value={
                        settings.jam_tutup
                      }
                      onChange={(value) =>
                        updateSetting(
                          "jam_tutup",
                          value,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    {
                      icon: "notification_important",
                      title: "Pengingat Tutup Shift Kasir",
                      description:
                        "Aktifkan pengingat pergantian shift.",
                      key: "pengingat_tutup_shift" as const,
                    },
                    {
                      icon: "toll",
                      title: "Pembulatan Kembalian",
                      description:
                        "Pembulatan kembalian ke Rp100 terdekat.",
                      key: "pembulatan_kembalian" as const,
                    },
                    {
                      icon: "",
                      title: "Konfirmasi Pembayaran",
                      description:
                        "Tampilkan konfirmasi sebelum pembayaran diselesaikan.",
                      key: "konfirmasi_pembayaran" as const,
                    },
                    {
                      icon: "",
                      title: "Otomatis Bersihkan Keranjang",
                      description:
                        "Keranjang dikosongkan setelah transaksi berhasil.",
                      key: "auto_clear_keranjang" as const,
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-4 rounded-lg bg-[#eff4ff] p-3 dark:bg-[#17231e]"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && (
                          <Icon
                            name={item.icon}
                            className="text-[22px] text-[#006948] dark:text-[#85f8c4]"
                          />
                        )}

                        <div>
                          <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                            {item.title}
                          </p>

                          <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <Switch
                        checked={settings[item.key]}
                        onChange={(value) =>
                          updateSetting(
                            item.key,
                            value,
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
                <SectionHeader
                  icon="manage_accounts"
                  title="Profil Akun Pemilik"
                  description="Kelola informasi akun yang sedang login."
                  iconBackground="bg-[#e5eeff] dark:bg-[#183a2d]"
                />

                <div className="grid grid-cols-1 gap-4">
                  <InputIcon
                    icon="person"
                    value={username}
                    onChange={setUsername}
                    placeholder="Username"
                  />

                  <InputIcon
                    icon="email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Email"
                  />

                  <InputIcon
                    icon="phone"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    placeholder="Nomor telepon"
                  />
                </div>

                <button
                  type="button"
                  onClick={saveAccount}
                  disabled={saving}
                  className="self-start rounded-lg bg-[#006948] px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : "Simpan Profil Akun"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("sandi")
                  }
                  className="flex items-center justify-between rounded-lg bg-[#eff4ff] p-3 text-left dark:bg-[#17231e]"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      name="key"
                      className="text-[18px] text-[#006948] dark:text-[#85f8c4]"
                    />

                    <span className="text-[13px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Ubah Kata Sandi
                    </span>
                  </div>

                  <Icon
                    name="chevron_right"
                    className="text-[18px]"
                  />
                </button>
              </div>

              <div className="rounded-xl bg-[#ffdad6]/30 p-6 shadow-sm dark:bg-[#4a2420]/40">
                <SectionHeader
                  icon="crisis_alert"
                  title="Sesi Login"
                  description="Kelola sesi browser saat ini."
                  iconBackground="bg-[#ffdad6] dark:bg-[#4a2420]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setLogoutModal(true)
                  }
                  className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg bg-[#ba1a1a] px-4 py-3 text-[14px] font-semibold text-white"
                >
                  <Icon
                    name="logout"
                    className="text-[20px]"
                  />

                  Keluar dari Akun
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
                <SectionHeader
                  icon="palette"
                  title="Tampilan & Tema"
                  description="Tema aplikasi dapat disimpan sebagai preferensi toko."
                />

                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      value: "light",
                      icon: "light_mode",
                      title: "Terang",
                    },
                    {
                      value: "dark",
                      icon: "dark_mode",
                      title: "Gelap",
                    },
                    {
                      value: "system",
                      icon: "devices",
                      title: "Sistem",
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        handleThemeChange(
                          item.value,
                        )
                      }
                      className={`rounded-xl border-2 p-3 transition ${
                        settings.tema ===
                        item.value
                          ? "border-[#006948] bg-[#006948]/10 text-[#006948] dark:border-[#85f8c4] dark:bg-[#173a2b] dark:text-[#85f8c4]"
                          : "border-transparent bg-[#eff4ff] text-[#3d4a42] dark:bg-[#17231e] dark:text-[#9eb2a7]"
                      }`}
                    >
                      <Icon
                        name={item.icon}
                        className="mx-auto mb-2 text-[24px]"
                      />

                      <span className="text-[12px] font-bold">
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between rounded-lg bg-[#eff4ff] p-3 dark:bg-[#17231e]">
                  <div className="flex items-center gap-2">
                    <Icon
                      name="contrast"
                      className="text-[20px] text-[#006948] dark:text-[#85f8c4]"
                    />

                    <div>
                      <p className="text-[13px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                        Kontras Tinggi
                      </p>

                      <p className="text-[11px] text-[#3d4a42] dark:text-[#9eb2a7]">
                        Meningkatkan keterbacaan antarmuka.
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={
                      settings.kontras_tinggi
                    }
                    onChange={
                      handleContrastChange
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
                <SectionHeader
                  icon="print"
                  title="Printer & Format Struk"
                  description="Pengaturan printer dan format struk."
                  iconBackground="bg-[#e5eeff] dark:bg-[#183a2d]"
                />

                <div className="rounded-lg bg-[#eff4ff] p-3 dark:bg-[#17231e]">
                  <label className="mb-2 block text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                    Printer
                  </label>

                  <input
                    value={settings.printer}
                    onChange={(e) =>
                      updateSetting(
                        "printer",
                        e.target.value,
                      )
                    }
                    placeholder="Nama printer"
                    className="w-full rounded-lg bg-white px-3 py-2.5 text-[13px] text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#006948] dark:bg-[#1a2822] dark:text-[#edf7f1]"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg bg-[#eff4ff] p-3 dark:bg-[#17231e]">
                  <div>
                    <p className="text-[13px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Ukuran Kertas
                    </p>

                    <p className="text-[11px] text-[#3d4a42] dark:text-[#9eb2a7]">
                      Pilih ukuran thermal printer.
                    </p>
                  </div>

                  <select
                    value={
                      settings.ukuran_kertas
                    }
                    onChange={(e) =>
                      updateSetting(
                        "ukuran_kertas",
                        e.target.value,
                      )
                    }
                    className="rounded-lg bg-white px-3 py-2 text-[12px] font-semibold text-[#0b1c30] outline-none dark:bg-[#1a2822] dark:text-[#edf7f1]"
                  >
                    <option value="58mm">
                      58mm
                    </option>

                    <option value="80mm">
                      80mm
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("struk")
                  }
                  className="flex items-center justify-center gap-1 rounded-lg bg-[#006948] px-4 py-2.5 text-[13px] font-semibold text-white"
                >
                  <Icon
                    name="receipt_long"
                    className="text-[18px]"
                  />

                  Atur Struk
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "struk" && (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
                <SectionHeader
                  icon="receipt_long"
                  title="Struk & Printer Kasir"
                  description="Atur format dan informasi yang ditampilkan pada struk transaksi."
                />

                <div>
                  <label className="mb-2 block text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                    Ukuran Kertas
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {["58mm", "80mm"].map(
                      (size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            updateSetting(
                              "ukuran_kertas",
                              size,
                            )
                          }
                          className={`rounded-xl border-2 p-4 text-left ${
                            settings.ukuran_kertas ===
                            size
                              ? "border-[#006948] bg-[#006948]/10 dark:border-[#85f8c4] dark:bg-[#173a2b]"
                              : "border-transparent bg-[#eff4ff] dark:bg-[#17231e]"
                          }`}
                        >
                          <Icon
                            name="receipt"
                            className="mb-3 text-3xl text-[#006948] dark:text-[#85f8c4]"
                          />

                          <p className="text-[16px] font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                            {size}
                          </p>

                          <p className="mt-1 text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                            Thermal receipt
                          </p>
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {[
                  {
                    key: "tampil_nama" as const,
                    icon: "store",
                    title: "Tampilkan Nama Toko",
                    description:
                      "Nama toko tampil pada struk.",
                  },
                  {
                    key: "tampil_alamat" as const,
                    icon: "location_on",
                    title: "Tampilkan Alamat Toko",
                    description:
                      "Alamat toko tampil pada struk.",
                  },
                  {
                    key: "tampil_telepon" as const,
                    icon: "phone",
                    title: "Tampilkan Nomor Telepon",
                    description:
                      "Nomor telepon tampil pada struk.",
                  },
                  {
                    key: "tampil_tanggal" as const,
                    icon: "calendar_month",
                    title: "Tampilkan Tanggal & Waktu",
                    description:
                      "Tanggal transaksi tampil pada struk.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 rounded-lg bg-[#eff4ff] p-3 dark:bg-[#17231e]"
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        name={item.icon}
                        className="text-[22px] text-[#006948] dark:text-[#85f8c4]"
                      />

                      <div>
                        <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                          {item.title}
                        </p>

                        <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={
                        settings[item.key]
                      }
                      onChange={(value) =>
                        updateSetting(
                          item.key,
                          value,
                        )
                      }
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                    Footer Struk Kasir
                  </label>

                  <textarea
                    value={
                      settings.pesan_struk
                    }
                    onChange={(e) =>
                      updateSetting(
                        "pesan_struk",
                        e.target.value,
                      )
                    }
                    rows={3}
                    className="w-full rounded-lg bg-[#eff4ff] p-3 text-[14px] text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#006948] dark:bg-[#17231e] dark:text-[#edf7f1] dark:focus:bg-[#1a2822]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewModal(true)
                  }
                  className="flex items-center justify-center gap-1 rounded-lg bg-[#eff4ff] px-4 py-2.5 text-[14px] font-semibold text-[#0b1c30] dark:bg-[#17231e] dark:text-[#edf7f1]"
                >
                  <Icon
                    name="visibility"
                    className="text-[18px]"
                  />

                  Pratinjau Struk
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
                <SectionHeader
                  icon="print"
                  title="Printer Kasir"
                  description="Printer yang dipilih akan disimpan sebagai preferensi."
                />

                <div className="mt-4 rounded-lg bg-[#eff4ff] p-4 dark:bg-[#17231e]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006948] text-white">
                      <Icon name="print" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                        {settings.printer ||
                          "Belum dipilih"}
                      </p>

                      <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                        Ukuran{" "}
                        {settings.ukuran_kertas}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pajak" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
              <SectionHeader
                icon="percent"
                title="Pajak Daerah (PB1)"
                description="Pengaturan pajak yang digunakan dalam kalkulasi transaksi."
              />

              <div className="mt-5 flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg bg-[#eff4ff] p-3 dark:bg-[#17231e]">
                  <div>
                    <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Aktifkan Pajak PB1
                    </p>

                    <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                      Pajak akan digunakan oleh kalkulasi
                      transaksi yang mendukungnya.
                    </p>
                  </div>

                  <Switch
                    checked={
                      settings.pajak_aktif
                    }
                    onChange={(value) =>
                      updateSetting(
                        "pajak_aktif",
                        value,
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                    Persentase Pajak
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={
                        settings.pajak_persentase === 0
                          ? ""
                          : settings.pajak_persentase
                      }
                      onChange={(e) =>
                        updateSetting(
                          "pajak_persentase",
                          e.target.value === ""
                            ? 0
                            : Number(e.target.value),
                        )
                      }
                      className="w-full rounded-lg bg-[#eff4ff] px-3 py-2.5 pr-10 text-[14px] text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#006948] dark:bg-[#17231e] dark:text-[#edf7f1] dark:focus:bg-[#1a2822]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#3d4a42] dark:text-[#9eb2a7]">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
              <SectionHeader
                icon="payments"
                title="Biaya Layanan"
                description="Atur service charge yang digunakan oleh toko."
              />

              <div className="mt-5 flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg bg-[#eff4ff] p-3 dark:bg-[#17231e]">
                  <div>
                    <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Aktifkan Service Charge
                    </p>

                    <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                      Gunakan service charge pada transaksi.
                    </p>
                  </div>

                  <Switch
                    checked={
                      settings.service_aktif
                    }
                    onChange={(value) =>
                      updateSetting(
                        "service_aktif",
                        value,
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                    Persentase Service
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={
                        settings.service_persentase
                      }
                      onChange={(e) =>
                        updateSetting(
                          "service_persentase",
                          Number(
                            e.target.value,
                          ),
                        )
                      }
                      className="w-full rounded-lg bg-[#eff4ff] px-3 py-2.5 pr-10 text-[14px] text-[#0b1c30] outline-none focus:bg-white focus:ring-2 focus:ring-[#006948] dark:bg-[#17231e] dark:text-[#edf7f1] dark:focus:bg-[#1a2822]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#3d4a42] dark:text-[#9eb2a7]">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pembayaran" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
              <SectionHeader
                icon="payments"
                title="Metode Pembayaran"
                description="Tentukan metode pembayaran yang tersedia di kasir."
              />

              <div className="mt-5 flex flex-col gap-3">
                {[
                  {
                    key: "pembayaran_tunai" as const,
                    icon: "payments",
                    title: "Tunai",
                    description:
                      "Pembayaran menggunakan uang tunai.",
                  },
                  {
                    key: "pembayaran_qris" as const,
                    icon: "qr_code",
                    title: "QRIS",
                    description:
                      "Pembayaran menggunakan QRIS.",
                  },
                  {
                    key: "pembayaran_transfer" as const,
                    icon: "account_balance",
                    title: "Transfer Bank",
                    description:
                      "Pembayaran melalui transfer bank.",
                  },
                  {
                    key: "pembayaran_debit" as const,
                    icon: "credit_card",
                    title: "Debit",
                    description:
                      "Pembayaran menggunakan kartu debit.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-lg bg-[#eff4ff] p-4 dark:bg-[#17231e]"
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        name={item.icon}
                        className="text-[22px] text-[#006948] dark:text-[#85f8c4]"
                      />

                      <div>
                        <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                          {item.title}
                        </p>

                        <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={
                        settings[item.key]
                      }
                      onChange={(value) =>
                        updateSetting(
                          item.key,
                          value,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
              <SectionHeader
                icon="qr_code_scanner"
                title="QRIS"
                description="Preferensi QRIS untuk transaksi digital."
              />

              <div className="mt-5 rounded-xl bg-[#eff4ff] p-5 dark:bg-[#17231e]">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#006948] text-white">
                    <Icon name="qr_code_2" />
                  </div>

                  <div>
                    <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      QRIS aktif
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-[#3d4a42] dark:text-[#9eb2a7]">
                      Pengaturan ini mengaktifkan atau
                      menonaktifkan metode QRIS di level
                      toko.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-white p-3 text-[12px] leading-5 text-[#3d4a42] dark:bg-[#1a2822] dark:text-[#9eb2a7]">
                  Integrasi provider QRIS/Xendit tetap
                  menggunakan konfigurasi dan endpoint
                  pembayaran yang sudah ada pada sistem.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifikasi" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
              <SectionHeader
                icon="notifications"
                title="Notifikasi Aplikasi"
                description="Atur notifikasi yang ingin diterima oleh pemilik toko."
              />

              <div className="mt-5 flex flex-col gap-3">
                {[
                  {
                    key: "notifikasi_transaksi" as const,
                    icon: "receipt_long",
                    title: "Notifikasi Transaksi",
                    description:
                      "Berikan notifikasi saat transaksi berhasil.",
                  },
                  {
                    key: "notifikasi_shift" as const,
                    icon: "schedule",
                    title: "Notifikasi Shift",
                    description:
                      "Pengingat aktivitas pergantian shift.",
                  },
                  {
                    key: "notifikasi_stok" as const,
                    icon: "inventory_2",
                    title: "Notifikasi Stok",
                    description:
                      "Peringatan ketika stok perlu diperiksa.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-lg bg-[#eff4ff] p-4 dark:bg-[#17231e]"
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        name={item.icon}
                        className="text-[22px] text-[#006948] dark:text-[#85f8c4]"
                      />

                      <div>
                        <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                          {item.title}
                        </p>

                        <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={
                        settings[item.key]
                      }
                      onChange={(value) =>
                        updateSetting(
                          item.key,
                          value,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
              <SectionHeader
                icon="chat"
                title="WhatsApp"
                description="Preferensi notifikasi melalui WhatsApp."
              />

              <div className="mt-5 flex items-center justify-between rounded-lg bg-[#eff4ff] p-4 dark:bg-[#17231e]">
                <div className="flex items-center gap-3">
                  <Icon
                    name="whatsapp"
                    className="text-[24px] text-[#006948] dark:text-[#85f8c4]"
                  />

                  <div>
                    <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Notifikasi WhatsApp
                    </p>

                    <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                      Simpan preferensi notifikasi WhatsApp
                      toko.
                    </p>
                  </div>
                </div>

                <Switch
                  checked={
                    settings.whatsapp_notifikasi
                  }
                  onChange={(value) =>
                    updateSetting(
                      "whatsapp_notifikasi",
                      value,
                    )
                  }
                />
              </div>

              <div className="mt-4 rounded-lg bg-[#fff8e1] p-3 text-[12px] leading-5 text-[#5f4b00] dark:bg-[#3d3517] dark:text-[#f1d98a]">
                Mengaktifkan toggle ini menyimpan
                preferensi WhatsApp. Pengiriman pesan
                otomatis tetap membutuhkan provider/integrasi
                WhatsApp yang terhubung.
              </div>
            </div>
          </div>
        )}

        {activeTab === "keamanan" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
              <SectionHeader
                icon="security"
                title="Keamanan & Hak Akses PIN"
                description="Kelola preferensi keamanan transaksi dan otorisasi."
              />

              <div className="mt-5 flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-lg bg-[#eff4ff] p-4 dark:bg-[#17231e]">
                  <div className="flex items-center gap-3">
                    <Icon
                      name="pin"
                      className="text-[22px] text-[#006948] dark:text-[#85f8c4]"
                    />

                    <div>
                      <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                        PIN Keamanan
                      </p>

                      <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                        Aktifkan preferensi penggunaan PIN
                        otorisasi.
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={
                      settings.pin_keamanan
                    }
                    onChange={(value) =>
                      updateSetting(
                        "pin_keamanan",
                        value,
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
              <SectionHeader
                icon="lock"
                title="Kata Sandi"
                description="Lindungi akun owner dengan kata sandi."
              />

              <button
                type="button"
                onClick={() =>
                  setActiveTab("sandi")
                }
                className="mt-5 flex w-full items-center justify-between rounded-lg bg-[#eff4ff] p-4 dark:bg-[#17231e]"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name="key"
                    className="text-[22px] text-[#006948] dark:text-[#85f8c4]"
                  />

                  <div className="text-left">
                    <p className="text-[14px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                      Ubah Kata Sandi
                    </p>

                    <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                      Perbarui kata sandi akun owner.
                    </p>
                  </div>
                </div>

                <Icon
                  name="chevron_right"
                  className="text-[18px]"
                />
              </button>

              <div className="mt-4 rounded-lg bg-[#eff4ff] p-3 text-[12px] leading-5 text-[#3d4a42] dark:bg-[#17231e] dark:text-[#9eb2a7]">
                Pengaturan PIN di atas menyimpan status
                keamanan toko. Pengubahan angka PIN tetap
                mengikuti mekanisme autentikasi user yang
                tersedia pada backend.
              </div>
            </div>
          </div>
        )}

        {activeTab === "sandi" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <section className="rounded-2xl border border-[#dce4df] bg-white p-6 shadow-sm dark:border-[#24372f] dark:bg-[#101a16]">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                    Ubah Kata Sandi
                  </h2>

                  <p className="mt-1 text-sm text-[#3d4a42] dark:text-[#9eb2a7]">
                    Perbarui kata sandi akun pemilik toko.
                  </p>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      label: "Kata Sandi Lama",
                      value: passwordLama,
                      setter: setPasswordLama,
                      placeholder:
                        "Masukkan kata sandi lama",
                    },
                    {
                      label: "Kata Sandi Baru",
                      value: passwordBaru,
                      setter: setPasswordBaru,
                      placeholder:
                        "Masukkan kata sandi baru",
                    },
                    {
                      label: "Konfirmasi Kata Sandi Baru",
                      value: konfirmasiPassword,
                      setter: setKonfirmasiPassword,
                      placeholder:
                        "Ulangi kata sandi baru",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <label className="mb-2 block text-sm font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                        {item.label}
                      </label>

                      <input
                        type="password"
                        value={item.value}
                        onChange={(e) =>
                          item.setter(
                            e.target.value,
                          )
                        }
                        placeholder={
                          item.placeholder
                        }
                        className="w-full rounded-xl border border-[#cfd8d2] bg-white px-4 py-3 text-sm text-[#0b1c30] outline-none focus:border-[#006948] focus:ring-2 focus:ring-[#006948]/10 dark:border-[#24372f] dark:bg-[#17231e] dark:text-[#edf7f1] dark:placeholder:text-[#718a7d]"
                      />
                    </div>
                  ))}

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={
                        changePassword
                      }
                      disabled={saving}
                      className="rounded-xl bg-[#006948] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00563c] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving
                        ? "Menyimpan..."
                        : "Simpan Kata Sandi"}
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <div>
              <section className="rounded-2xl border border-[#dce4df] bg-white p-6 shadow-sm dark:border-[#24372f] dark:bg-[#101a16]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f5ee] text-[#006948] dark:bg-[#173a2b] dark:text-[#85f8c4]">
                  <Icon name="lock" />
                </div>

                <h3 className="text-base font-bold text-[#0b1c30] dark:text-[#edf7f1]">
                  Keamanan Akun
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#3d4a42] dark:text-[#9eb2a7]">
                  Gunakan kata sandi yang kuat dan jangan
                  membagikannya kepada orang lain.
                </p>
              </section>
            </div>
          </div>
        )}

        {activeTab === "tampilan" && (
          <div className="max-w-3xl">
            <div className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm dark:bg-[#101a16]">
              <SectionHeader
                icon="palette"
                title="Tampilan & Tema Antarmuka"
                description="Atur tema aplikasi dan keterbacaan antarmuka."
              />

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    value: "light",
                    icon: "light_mode",
                    title: "Mode Terang",
                    subtitle: "Siang",
                  },
                  {
                    value: "dark",
                    icon: "dark_mode",
                    title: "Mode Gelap",
                    subtitle: "Malam",
                  },
                  {
                    value: "system",
                    icon: "devices",
                    title: "Ikuti Sistem",
                    subtitle: "Otomatis",
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      handleThemeChange(
                        item.value,
                      )
                    }
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-4 transition ${
                      settings.tema ===
                      item.value
                        ? "border-[#006948] bg-[#006948]/10 text-[#006948] dark:border-[#85f8c4] dark:bg-[#173a2b] dark:text-[#85f8c4]"
                        : "border-transparent bg-[#eff4ff] text-[#3d4a42] dark:bg-[#17231e] dark:text-[#9eb2a7]"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-[#1a2822]">
                      <Icon
                        name={item.icon}
                        className="text-[22px]"
                      />
                    </div>

                    <span className="text-[12px] font-bold">
                      {item.title}
                    </span>

                    <span className="text-[11px]">
                      {item.subtitle}
                    </span>
                  </button>
                ))}
              </div>

              <div className="rounded-lg bg-[#eff4ff] p-4 dark:bg-[#17231e]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon
                      name="contrast"
                      className="text-[20px] text-[#006948] dark:text-[#85f8c4]"
                    />

                    <div>
                      <p className="text-[13px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                        Kontras Tinggi & Teks Lebih Terbaca
                      </p>

                      <p className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                        Optimalkan visibilitas angka dan
                        elemen antarmuka.
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={
                      settings.kontras_tinggi
                    }
                    onChange={
                      handleContrastChange
                    }
                  />
                </div>
              </div>

              <div className="rounded-lg border border-[#d3e4fe] bg-[#eff4ff] p-3 text-[12px] leading-5 text-[#3d4a42] dark:border-[#2a4036] dark:bg-[#17231e] dark:text-[#9eb2a7]">
                Tema disimpan pada pengaturan toko sehingga
                preferensi dapat digunakan oleh aplikasi yang
                membaca konfigurasi toko.
              </div>
            </div>
          </div>
        )}

        {logoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#213145]/50 p-4 backdrop-blur-sm dark:bg-black/60">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#101a16]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffdad6] text-[#ba1a1a] dark:bg-[#4a2420] dark:text-[#ffb4ab]">
                  <Icon
                    name="logout"
                    className="text-[26px]"
                  />
                </div>

                <div>
                  <h3 className="text-[22px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                    Konfirmasi Keluar Akun
                  </h3>

                  <span className="text-[12px] text-[#3d4a42] dark:text-[#9eb2a7]">
                    Portal Kasir POS
                  </span>
                </div>
              </div>

              <p className="mt-4 text-[14px] leading-5 text-[#3d4a42] dark:text-[#9eb2a7]">
                Apakah Anda yakin ingin keluar dari sesi
                portal Kasir POS?
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setLogoutModal(false)
                  }
                  className="rounded-lg bg-[#eff4ff] px-4 py-2.5 text-[14px] font-semibold text-[#0b1c30] dark:bg-[#17231e] dark:text-[#edf7f1]"
                >
                  Tetap di Sini
                </button>

                <button
                  type="button"
                  onClick={executeLogout}
                  className="flex items-center gap-1.5 rounded-lg bg-[#ba1a1a] px-4 py-2.5 text-[14px] font-semibold text-white"
                >
                  <Icon
                    name="arrow_forward"
                    className="text-[18px]"
                  />

                  Ya, Keluar Akun
                </button>
              </div>
            </div>
          </div>
        )}

        {previewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#213145]/50 p-4 backdrop-blur-sm dark:bg-black/60">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#101a16]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[18px] font-semibold text-[#0b1c30] dark:text-[#edf7f1]">
                  Pratinjau Struk
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewModal(false)
                  }
                  className="rounded-lg p-1 text-[#3d4a42] hover:bg-[#eff4ff] dark:text-[#9eb2a7] dark:hover:bg-[#17231e]"
                >
                  <Icon name="close" />
                </button>
              </div>

              <div
                className={`mx-auto border border-dashed border-[#bccac0] bg-white p-4 text-center text-black ${
                  settings.ukuran_kertas ===
                  "80mm"
                    ? "max-w-[320px]"
                    : "max-w-[250px]"
                }`}
              >
                {settings.tampil_nama && (
                  <p className="text-[13px] font-bold">
                    {settings.nama_toko ||
                      "Nama Toko"}
                  </p>
                )}

                {settings.tampil_alamat && (
                  <p className="mt-1 whitespace-pre-wrap text-[9px]">
                    {settings.alamat_toko ||
                      "Alamat toko"}
                  </p>
                )}

                {settings.tampil_telepon && (
                  <p className="mt-1 text-[9px]">
                    {settings.telepon_toko ||
                      "Nomor telepon"}
                  </p>
                )}

                <div className="my-3 border-t border-dashed border-black" />

                <div className="flex justify-between text-[9px]">
                  <span>
                    Produk Contoh x1
                  </span>

                  <span>
                    Rp10.000
                  </span>
                </div>

                <div className="my-3 border-t border-dashed border-black" />

                <div className="flex justify-between text-[10px] font-bold">
                  <span>TOTAL</span>

                  <span>
                    Rp10.000
                  </span>
                </div>

                {settings.tampil_tanggal && (
                  <p className="mt-3 text-[8px]">
                    Tanggal & waktu transaksi
                  </p>
                )}

                {settings.pesan_struk && (
                  <p className="mt-3 whitespace-pre-wrap text-[9px]">
                    {settings.pesan_struk}
                  </p>
                )}

                <p className="mt-3 text-[8px]">
                  — PRATINJAU —
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewModal(false)
                }
                className="mt-5 w-full rounded-lg bg-[#006948] px-4 py-2.5 text-[14px] font-semibold text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-2 rounded-xl bg-[#101a16] px-4 py-3 text-white shadow-lg dark:bg-[#edf7f1] dark:text-[#0b1411]">
            <Icon
              name={toastIcon}
              className="text-[20px] text-[#85f8c4] dark:text-[#006948]"
            />

            <span className="text-[14px] leading-5">
              {toast}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}