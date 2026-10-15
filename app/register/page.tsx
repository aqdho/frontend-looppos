"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "/api";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [terms, setTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!terms) {
      alert("Silakan setujui Syarat & Ketentuan terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          storeName,
          kategori: category,
          email,
          phone,
          password,
          pin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.pesan || "Register gagal");
        return;
      }

      alert("Registrasi berhasil. Silakan login.");

      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#f8f9ff] font-['Plus_Jakarta_Sans'] text-[#0b1c30] antialiased">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <button
          type="button"
          onClick={() => router.push("/KasirApp")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#3d4a42] transition-colors hover:text-[#0b1c30] sm:text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>

          <span>Kembali ke Halaman Utama</span>
        </button>

        <div className="flex items-center gap-2 rounded-full bg-[#e5eeff] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#006948] sm:text-[11px]">
          <span className="material-symbols-outlined text-[14px]">
            lock
          </span>

          <span>SSL 256-bit Terenkripsi</span>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="flex w-full flex-1 flex-col items-center px-4 py-8">
        <div className="w-full">
          <div className="mx-auto w-full max-w-7xl px-2 py-2 sm:px-4 sm:py-6">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              {/* =================================================
                  LEFT COLUMN
              ================================================= */}

              <div className="flex flex-col gap-6 lg:col-span-5 lg:sticky lg:top-8">
                {/* Brand Badge */}

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full bg-[#e5eeff] px-3.5 py-1.5 text-xs font-semibold text-[#006948] shadow-sm">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#006948]" />

                    <span>KasirKilat POS Enterprise</span>
                  </div>

                  <span className="rounded-full bg-[#dae2fd] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5c647a]">
                    v3.4 Production
                  </span>
                </div>

                {/* Headline */}

                <div className="flex flex-col gap-3">
                  <h1 className="text-[30px] font-bold leading-tight tracking-[-0.02em] text-[#0b1c30] sm:text-[36px] sm:leading-[44px]">
                    Mulai Transformasi Digital Usaha Anda dalam{" "}
                    <span className="font-extrabold text-[#006948] underline decoration-[#85f8c4] decoration-2 underline-offset-4 [text-decoration-style:wavy]">
                      2 Menit
                    </span>
                  </h1>

                  <p className="text-base leading-6 text-[#3d4a42]">
                    Akun yang Anda buat sekarang langsung menjadi akun{" "}
                    <span className="font-semibold text-[#0b1c30]">
                      Owner / Pemilik Utama
                    </span>{" "}
                    dengan wewenang penuh atas kelola multi-kasir, master
                    katalog, dan laporan settlement harian.
                  </p>
                </div>

                {/* Benefits */}

                <div className="flex flex-col gap-3.5">
                  {/* Benefit 1 */}

                  <div className="flex items-start gap-3.5 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#e5eeff] text-[#006948]">
                      <span className="material-symbols-outlined text-[22px]">
                        verified
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-base font-semibold leading-[22px] text-[#0b1c30]">
                        Gratis 14 Hari Uji Coba Penuh
                      </span>

                      <span className="text-sm leading-5 text-[#3d4a42]">
                        Akses tanpa syarat kartu kredit, otomatis sinkron cloud
                        register.
                      </span>
                    </div>
                  </div>

                  {/* Benefit 2 */}

                  <div className="flex items-start gap-3.5 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#e5eeff] text-[#006948]">
                      <span className="material-symbols-outlined text-[22px]">
                        admin_panel_settings
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-base font-semibold leading-[22px] text-[#0b1c30]">
                        Hak Akses Owner Instan
                      </span>

                      <span className="text-sm leading-5 text-[#3d4a42]">
                        Setup kasir cabang, shift staff, dan limit diskon tanpa
                        batas.
                      </span>
                    </div>
                  </div>

                  {/* Benefit 3 */}

                  <div className="flex items-start gap-3.5 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#e5eeff] text-[#006948]">
                      <span className="material-symbols-outlined text-[22px]">
                        qr_code_scanner
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-base font-semibold leading-[22px] text-[#0b1c30]">
                        Integrasi QRIS Dinamis
                      </span>

                      <span className="text-sm leading-5 text-[#3d4a42]">
                        Langsung aktif di terminal kasir, terima GoPay, OVO,
                        BCA, &amp; Livin.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Preview */}

                <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl bg-white p-5 shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#006948]" />

                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3d4a42]">
                        Preview Dashboard Pemilik
                      </span>
                    </div>

                    <span className="rounded-full bg-[#85f8c4] px-2 py-0.5 text-[10px] font-bold text-[#005137]">
                      Live Settlement
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 rounded-lg bg-[#eff4ff] p-3">
                      <span className="text-[10px] font-bold text-[#3d4a42]">
                        Omset Hari Ini
                      </span>

                      <span className="text-lg font-bold tracking-tight text-[#006948]">
                        Rp 4.820.000
                      </span>

                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#00855b]">
                        <span className="material-symbols-outlined text-[14px]">
                          trending_up
                        </span>

                        +18.4% vs kemarin
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-lg bg-[#eff4ff] p-3">
                      <span className="text-[10px] font-bold text-[#3d4a42]">
                        Transaksi Kasir
                      </span>

                      <span className="text-lg font-bold tracking-tight text-[#0b1c30]">
                        142 Struk
                      </span>

                      <span className="text-[10px] font-semibold text-[#565e74]">
                        Rata-rata Rp 33.900
                      </span>
                    </div>
                  </div>

                  {/* Sparkline */}

                  <div className="h-8 w-full pt-1">
                    <svg
                      className="h-full w-full text-[#006948]"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 240 32"
                    >
                      <path
                        d="M0 24 Q30 28 60 16 T120 18 T180 8 T240 4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                      />

                      <path
                        d="M0 24 Q30 28 60 16 T120 18 T180 8 T240 4 L240 32 L0 32 Z"
                        fill="currentColor"
                        fillOpacity="0.08"
                      />
                    </svg>
                  </div>
                </div>

                {/* Social Proof */}

                <div className="flex items-center gap-3 rounded-xl bg-[#eff4ff] px-4 py-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#006948] text-[10px] font-bold text-white ring-2 ring-[#f8f9ff]">
                      KT
                    </span>

                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#565e74] text-[10px] font-bold text-white ring-2 ring-[#f8f9ff]">
                      RM
                    </span>

                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#006947] text-[10px] font-bold text-white ring-2 ring-[#f8f9ff]">
                      BM
                    </span>
                  </div>

                  <span className="text-xs leading-4 text-[#3d4a42]">
                    Dipercaya lebih dari{" "}
                    <span className="font-semibold text-[#0b1c30]">
                      38.000+ merchant
                    </span>{" "}
                    &amp; kafe di 74 kota Indonesia.
                  </span>
                </div>
              </div>

              {/* =================================================
                  RIGHT COLUMN / REGISTER CARD
              ================================================= */}

              <div className="w-full lg:col-span-7">
                <div className="flex w-full flex-col gap-6 rounded-xl bg-white p-6 shadow-xl sm:p-8">
                  {/* Stepper */}

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#e5eeff] px-3 py-1 text-[10px] font-bold tracking-wide text-[#006948] sm:text-[11px]">
                        Langkah 1 dari 2: Informasi Pemilik &amp; Toko
                      </span>

                      <span className="whitespace-nowrap text-[10px] font-bold text-[#3d4a42] sm:text-[11px]">
                        50% Selesai
                      </span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5eeff]">
                      <div className="h-full w-1/2 rounded-full bg-[#006948] transition-all duration-300" />
                    </div>

                    <div className="flex flex-col gap-1 pt-1">
                      <h2 className="text-[24px] font-bold leading-8 tracking-tight text-[#0b1c30]">
                        Buat Akun Pemilik (Owner)
                      </h2>

                      <p className="text-sm leading-5 text-[#3d4a42]">
                        Lengkapi identitas penanggung jawab bisnis untuk
                        membuka akses operasional kasir.
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      FORM
                  ================================================= */}

                  <form
                    onSubmit={handleRegister}
                    className="flex flex-col gap-5"
                  >
                    {/* OWNER + STORE */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Nama Owner */}

                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center justify-between text-xs font-semibold text-[#0b1c30]">
                          <span>Nama Lengkap Pemilik</span>
                          <span className="text-red-600">*</span>
                        </label>

                        <div className="relative">
                          <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#565e74]">
                            person
                          </span>

                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Budi Santoso"
                            required
                            className="h-11 w-full rounded-lg bg-[#eff4ff] pl-10 pr-3.5 text-sm text-[#0b1c30] placeholder:text-[#6d7a72] shadow-sm outline-none focus:ring-2 focus:ring-[#006948]"
                          />
                        </div>
                      </div>

                      {/* Store */}

                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center justify-between text-xs font-semibold text-[#0b1c30]">
                          <span>Nama Bisnis / Outlet Utama</span>
                          <span className="text-red-600">*</span>
                        </label>

                        <div className="relative">
                          <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#565e74]">
                            storefront
                          </span>

                          <input
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="Kopi & Mart Barokah"
                            required
                            className="h-11 w-full rounded-lg bg-[#eff4ff] pl-10 pr-3.5 text-sm text-[#0b1c30] placeholder:text-[#6d7a72] shadow-sm outline-none focus:ring-2 focus:ring-[#006948]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* CATEGORY + PHONE */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Category */}

                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center justify-between text-xs font-semibold text-[#0b1c30]">
                          <span>Kategori Usaha</span>
                          <span className="text-red-600">*</span>
                        </label>

                        <div className="relative">
                          <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#565e74]">
                            category
                          </span>

                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="h-11 w-full cursor-pointer appearance-none rounded-lg bg-[#eff4ff] pl-10 pr-8 text-sm text-[#0b1c30] shadow-sm outline-none focus:ring-2 focus:ring-[#006948]"
                          >
                            <option value="" disabled>
                              Pilih Kategori Bisnis
                            </option>

                            <option value="fnb">
                              Makanan &amp; Minuman / Cafe
                            </option>

                            <option value="retail">
                              Retail / Minimarket / Kelontong
                            </option>

                            <option value="fashion">
                              Fashion &amp; Aksesoris
                            </option>

                            <option value="barbershop">
                              Barbershop &amp; Salon
                            </option>

                            <option value="services">
                              Jasa &amp; Perawatan
                            </option>

                            <option value="other">
                              Kategori Lainnya
                            </option>
                          </select>

                          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[#565e74]">
                            expand_more
                          </span>
                        </div>
                      </div>

                      {/* Phone */}

                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center justify-between text-xs font-semibold text-[#0b1c30]">
                          <span>Nomor WhatsApp Aktif</span>
                          <span className="text-red-600">*</span>
                        </label>

                        <div className="relative flex items-center">
                          <div className="pointer-events-none absolute left-3 flex items-center gap-1.5 text-xs font-semibold text-[#0b1c30]">
                            <span className="relative inline-block h-3 w-4 overflow-hidden rounded-[1px] bg-red-600">
                              <span className="absolute bottom-0 h-1.5 w-full bg-white" />
                            </span>

                            <span>+62</span>
                          </div>

                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="812-3456-7890"
                            required
                            className="h-11 w-full rounded-lg bg-[#eff4ff] pl-16 pr-3.5 text-sm text-[#0b1c30] placeholder:text-[#6d7a72] shadow-sm outline-none focus:ring-2 focus:ring-[#006948]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* EMAIL */}

                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center justify-between text-xs font-semibold text-[#0b1c30]">
                        <span>Email Bisnis / Akun Utama</span>
                        <span className="text-red-600">*</span>
                      </label>

                      <div className="relative">
                        <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#565e74]">
                          mail
                        </span>

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="owner@tokobarokah.com"
                          required
                          className="h-11 w-full rounded-lg bg-[#eff4ff] pl-10 pr-3.5 text-sm text-[#0b1c30] placeholder:text-[#6d7a72] shadow-sm outline-none focus:ring-2 focus:ring-[#006948]"
                        />
                      </div>

                      <span className="text-xs leading-4 text-[#3d4a42]">
                        Laporan harian PDF, token QRIS, dan invoice penagihan
                        akan dikirim ke alamat ini.
                      </span>
                    </div>

                    {/* PASSWORD + PIN */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Password */}

                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center justify-between text-xs font-semibold text-[#0b1c30]">
                          <span>Kata Sandi Dashboard</span>
                          <span className="text-red-600">*</span>
                        </label>

                        <div className="relative">
                          <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#565e74]">
                            lock
                          </span>

                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimal 8 karakter"
                            required
                            className="h-11 w-full rounded-lg bg-[#eff4ff] pl-10 pr-10 text-sm text-[#0b1c30] placeholder:text-[#6d7a72] shadow-sm outline-none focus:ring-2 focus:ring-[#006948]"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((current) => !current)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565e74] transition-colors hover:text-[#0b1c30]"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {showPassword
                                ? "visibility_off"
                                : "visibility"}
                            </span>
                          </button>
                        </div>

                        {/* Strength */}

                        <div className="flex items-center gap-1.5 pt-1">
                          <div className="h-1.5 flex-1 rounded-full bg-[#006948]" />
                          <div className="h-1.5 flex-1 rounded-full bg-[#006948]" />
                          <div className="h-1.5 flex-1 rounded-full bg-[#006948]" />
                          <div className="h-1.5 flex-1 rounded-full bg-[#006948]" />

                          <span className="pl-1 text-[10px] font-bold text-[#006948]">
                            Sangat Kuat
                          </span>
                        </div>
                      </div>

                      {/* PIN */}

                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center justify-between text-xs font-semibold text-[#0b1c30]">
                          <span>PIN Otorisasi Owner (6 Digit)</span>
                          <span className="text-red-600">*</span>
                        </label>

                        <div className="relative">
                          <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#565e74]">
                            pin
                          </span>

                          <input
                            type={showPin ? "text" : "password"}
                            value={pin}
                            onChange={(e) =>
                              setPin(
                                e.target.value.replace(/\D/g, "").slice(0, 6)
                              )
                            }
                            maxLength={6}
                            inputMode="numeric"
                            placeholder="Contoh: 889922"
                            required
                            className="h-11 w-full rounded-lg bg-[#eff4ff] pl-10 pr-10 text-sm tracking-widest text-[#0b1c30] placeholder:text-[#6d7a72] shadow-sm outline-none focus:ring-2 focus:ring-[#006948]"
                          />

                          <button
                            type="button"
                            onClick={() => setShowPin((current) => !current)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565e74] transition-colors hover:text-[#0b1c30]"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {showPin ? "visibility_off" : "visibility"}
                            </span>
                          </button>
                        </div>

                        <span className="text-xs leading-4 text-[#3d4a42]">
                          Digunakan untuk void transaksi kasir, refund, dan
                          ubah harga jual.
                        </span>
                      </div>
                    </div>

                    {/* TERMS */}

                    <div className="mt-1 flex items-start gap-3 rounded-lg bg-[#eff4ff] p-3.5">
                      <input
                        type="checkbox"
                        checked={terms}
                        onChange={(e) => setTerms(e.target.checked)}
                        required
                        className="mt-1 h-4 w-4 cursor-pointer accent-[#006948]"
                      />

                      <label
                        htmlFor="termsCheck"
                        className="cursor-pointer select-none text-sm leading-5 text-[#0b1c30]"
                      >
                        Saya menyetujui{" "}
                        <button
                          type="button"
                          className="font-semibold text-[#006948] hover:underline"
                        >
                          Syarat &amp; Ketentuan
                        </button>
                        ,{" "}
                        <button
                          type="button"
                          className="font-semibold text-[#006948] hover:underline"
                        >
                          Kebijakan Privasi
                        </button>
                        , dan ketentuan settlement Merchant QRIS KasirKilat
                        POS.
                      </label>
                    </div>

                    {/* SUBMIT */}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#006948] text-sm font-semibold text-white shadow-md transition-all hover:bg-[#006947] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[20px]">
                            progress_activity
                          </span>

                          <span>Mempersiapkan Toko Anda...</span>
                        </>
                      ) : (
                        <>
                          <span>Daftar &amp; Buat Toko Saya Gratis</span>

                          <span className="material-symbols-outlined text-[20px]">
                            arrow_forward
                          </span>
                        </>
                      )}
                    </button>

                    {/* LOGIN */}

                    <div className="flex items-center justify-center gap-2 pt-1 text-center text-sm text-[#3d4a42]">
                      <span>Sudah memiliki akun merchant kasir?</span>

                      <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="flex items-center gap-1 font-semibold text-[#006948] hover:underline"
                      >
                        <span>Masuk di sini</span>

                        <span className="material-symbols-outlined text-[16px]">
                          login
                        </span>
                      </button>
                    </div>
                  </form>

                  {/* SECURITY FOOTER */}

                  <div className="flex flex-wrap items-center justify-center gap-5 pt-4 text-[10px] font-bold text-[#3d4a42] sm:gap-6 sm:text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#006948]">
                        security
                      </span>

                      <span>ISO 27001 Data Certified</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#006948]">
                        verified_user
                      </span>

                      <span>Bank Indonesia QRIS Compliant</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#006948]">
                        cloud_done
                      </span>

                      <span>Daily Auto Backup</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-[#3d4a42] sm:flex-row sm:text-sm">
        <p>© 2025 KasirKilat POS. Hak Cipta Dilindungi.</p>

        <div className="flex items-center gap-5">
          <button
            type="button"
            className="flex items-center gap-1 transition-colors hover:text-[#0b1c30]"
          >
            <span className="material-symbols-outlined text-[16px]">
              support_agent
            </span>

            <span>Pusat Bantuan KasirKilat</span>
          </button>

          <button
            type="button"
            className="transition-colors hover:text-[#0b1c30]"
          >
            Keamanan
          </button>
        </div>
      </footer>

      {/* =====================================================
          GLOBAL STYLE
      ===================================================== */}

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200");

        html,
        body {
          margin: 0;
          padding: 0;
        }

        body {
          overscroll-behavior: none;
        }

        main > :first-child {
          margin-top: 0 !important;
        }

        main > :last-child {
          margin-bottom: 0 !important;
        }

        ::-webkit-scrollbar {
          display: none;
        }

        * {
          box-sizing: border-box;
        }

        button,
        input,
        select {
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        select {
          color-scheme: light;
        }

        @media (max-width: 640px) {
          header {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }

          header > div:last-child {
            padding-left: 0.6rem;
            padding-right: 0.6rem;
          }

          header > div:last-child span:last-child {
            display: none;
          }

          footer {
            text-align: center;
          }

          footer > div {
            justify-content: center;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          main {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }

          main > div > div {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          h1 {
            font-size: 26px !important;
            line-height: 34px !important;
          }

          h2 {
            font-size: 21px !important;
            line-height: 28px !important;
          }

          .grid {
            gap: 1.25rem;
          }
        }
      `}</style>
    </main>
  );
}