"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginMode = "owner" | "kasir";

export default function LoginPage() {
  const router = useRouter();

  const [loginMode, setLoginMode] = useState<LoginMode>("owner");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [outletCode, setOutletCode] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  // ==========================================================
  // LOGIN OWNER
  // ==========================================================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMode === "kasir") {
      await handleKasirLogin(e);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.pesan || "Login gagal");
        return;
      }

      localStorage.setItem("token", data.token);

      router.push("/dashboard");
    } catch (error) {
      console.error("ERROR LOGIN OWNER:", error);
      alert("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOGIN KASIR DENGAN ID KASIR + PIN
  // ==========================================================

  const handleKasirLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullPin = pin.join("");

    if (!outletCode.trim()) {
      alert("Masukkan ID Kasir.");
      return;
    }

    if (!/^KSR-\d{5}$/i.test(outletCode.trim())) {
      alert("Format ID Kasir harus seperti KSR-00032.");
      return;
    }

    if (fullPin.length !== 6) {
      alert("PIN Kasir harus terdiri dari 6 digit.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idKasir: outletCode.trim().toUpperCase(),
          pin: fullPin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.pesan || "Login Kasir gagal");
        return;
      }

      // Simpan token login
      localStorage.setItem("token", data.token);

      // Simpan identitas user jika diperlukan halaman lain
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Kasir langsung masuk ke POS
      router.push("/transaksi");

    } catch (error) {
      console.error("ERROR LOGIN KASIR:", error);
      alert("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // SWITCH LOGIN MODE
  // ==========================================================

  const switchLoginMode = (mode: LoginMode) => {
    setLoginMode(mode);

    if (mode === "kasir") {
      setTimeout(() => {
        document.getElementById("outlet-code")?.focus();
      }, 50);
    }
  };

  // ==========================================================
  // PIN INPUT
  // ==========================================================

  const handlePinChange = (value: string, index: number) => {
    const numericValue = value.replace(/\D/g, "").slice(-1);

    const newPin = [...pin];
    newPin[index] = numericValue;
    setPin(newPin);

    if (numericValue && index < 5) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handlePinKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  // ==========================================================
  // SUBMIT KASIR
  // ==========================================================

  const handleKasirSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleKasirLogin(e);
  };

  return (
    <main className="min-h-screen bg-[#f8f9ff] font-['Plus_Jakarta_Sans'] text-[#0b1c30] antialiased">
      <div className="flex min-h-screen flex-col justify-between">

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

          <div className="flex items-center gap-2 rounded-full bg-[#e5eeff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.04em] text-[#006948] sm:text-[11px]">
            <span className="material-symbols-outlined text-[14px]">
              lock
            </span>

            <span>SSL 256-bit Terenkripsi</span>
          </div>
        </header>

        {/* =====================================================
            MAIN
        ===================================================== */}

        <main className="flex w-full flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="flex w-full flex-col">
            <div className="mx-auto my-auto w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-xl">

              <div className="grid grid-cols-1 lg:grid-cols-12">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#006948] via-[#00855d] to-[#00855b] p-8 text-white sm:p-10 lg:col-span-5">

                  <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

                  <div className="pointer-events-none absolute -bottom-16 -right-16 h-60 w-60 rounded-full bg-[#85f8c4]/10 blur-3xl" />

                  <div className="relative z-10 flex flex-col gap-1">

                    <div className="flex items-center gap-2 px-0 pb-0">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                        <img
                          src="/logo-LoopPOS.svg"
                          alt="LoopPOS Logo"
                          className="h-12 w-12 object-contain"
                        />
                      </div>

                      <div>
                        <span className="block text-[22px] font-semibold leading-none tracking-tight">
                          LoopPOS
                        </span>

                        <span className="mt-1 block text-[11px] font-bold uppercase tracking-wider text-[#85f8c4]">
                          Enterprise POS Solution
                        </span>
                      </div>

                    </div>

                    <div className="pt-4">

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold tracking-[0.04em] text-[#85f8c4] backdrop-blur-sm">

                        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#85f8c4]" />

                        Sistem Aktif • Versi 3.8.4

                      </span>

                      <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight">
                        Masuk ke Portal Pemilik Toko &amp; Kasir
                      </h1>

                      <p className="mt-2 text-sm leading-5 text-[#f5fff6]/90">
                        Kelola pesanan dine-in, take-away, stok bahan baku,
                        hingga settlement QRIS instan dalam hitungan detik.
                      </p>

                    </div>

                    <div className="flex flex-col gap-3.5 pt-2">

                      <div className="flex items-start gap-3 rounded-lg bg-white/10 p-3 backdrop-blur-sm">

                        <div className="mt-0.5 flex shrink-0 items-center justify-center rounded bg-[#85f8c4] p-1 text-[#002114]">
                          <span className="material-symbols-outlined text-[16px]">
                            verified_user
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-semibold leading-snug">
                            Data Terenkripsi 256-bit SSL
                          </p>

                          <p className="mt-1 text-xs leading-4 text-[#f5fff6]/80">
                            Kepatuhan standar audit perbankan &amp; Bank Indonesia.
                          </p>
                        </div>

                      </div>

                      <div className="flex items-start gap-3 rounded-lg bg-white/10 p-3 backdrop-blur-sm">

                        <div className="mt-0.5 flex shrink-0 items-center justify-center rounded bg-[#85f8c4] p-1 text-[#002114]">
                          <span className="material-symbols-outlined text-[16px]">
                            sync
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-semibold leading-snug">
                            Sinkronisasi Multi-Terminal POS
                          </p>

                          <p className="mt-1 text-xs leading-4 text-[#f5fff6]/80">
                            Data meja kasir, dapur (KDS), dan gudang tetap akurat
                            tanpa jeda.
                          </p>
                        </div>

                      </div>

                      <div className="flex items-start gap-3 rounded-lg bg-white/10 p-3 backdrop-blur-sm">

                        <div className="mt-0.5 flex shrink-0 items-center justify-center rounded bg-[#85f8c4] p-1 text-[#002114]">
                          <span className="material-symbols-outlined text-[16px]">
                            admin_panel_settings
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-semibold leading-snug">
                            Akses Pemilik Otomatis (Owner)
                          </p>

                          <p className="mt-1 text-xs leading-4 text-[#f5fff6]/80">
                            Pendaftar akun pertama langsung mengontrol laporan
                            omzet dan tim.
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="relative z-10 mt-6 rounded-xl bg-white/10 p-4 pt-6 backdrop-blur-sm">

                    <div className="mb-2 flex items-center gap-1 text-[#85f8c4]">

                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className="material-symbols-outlined text-[18px]"
                          style={{
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          star
                        </span>
                      ))}

                      <span className="ml-1 text-[11px] font-bold text-white/80">
                        5.0 / 5.0
                      </span>

                    </div>

                    <p className="text-xs italic leading-5 text-white/90">
                      “Antrean rush hour kopi pagi kami 3x lebih cepat terlayani
                      sejak pakai PIN Kasir Cepat KasirKilat.”
                    </p>

                    <div className="mt-3 flex items-center gap-3">

                      <img
                        className="h-9 w-9 rounded-full object-cover shadow-inner"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA23Zmg4xdkMYV0JvzM-t4iFAiUHess4Wd-wWrw41vtjBt2mLNJx-FBs_pwT-3X_UHrCuALV1tu6gtYYlW-98mMEYRyzpwWTv7szcUSfPlgYREmwmhYPTIiykAT8oc7mmG6TraF0KCv1oo6p8s_UFJjgCjXnYBTNnHW1cSKwH6t2ZXZeSIwSLyZC1PmeifIm544gidjXLiuH-5A1rvY6Ykd5uSP9mOxnywWLsvRDfBjoA0L_raP_xvd"
                        alt="Bagus Wibisono"
                      />

                      <div>
                        <p className="text-xs font-semibold leading-none text-white">
                          Bagus Wibisono
                        </p>

                        <p className="mt-1 text-[11px] leading-tight text-[#85f8c4]">
                          Founder, Kopi Sore Selaras (4 Cabang)
                        </p>
                      </div>

                    </div>

                  </div>

                </section>

                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <section className="flex flex-col justify-between bg-white p-6 sm:p-10 lg:col-span-7">

                  <div>

                    <div className="mb-6 flex flex-col gap-1">

                      <div className="flex items-center justify-between gap-4">

                        <h2 className="text-[22px] font-semibold leading-7 tracking-tight text-[#0b1c30]">
                          Selamat Datang Kembali 👋
                        </h2>

                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#e5eeff] px-2.5 py-0.5 text-[11px] font-bold text-[#006948]">

                          <span className="h-1.5 w-1.5 rounded-full bg-[#006948]" />

                          Cloud Online

                        </span>

                      </div>

                      <p className="text-sm leading-5 text-[#565e74]">
                        Silakan masukkan kredensial akun merchant atau nomor
                        PIN kasir Anda.
                      </p>

                    </div>

                    {/* =================================================
                        TABS
                    ================================================= */}

                    <div className="mb-6 flex items-center rounded-xl bg-[#e5eeff] p-1">

                      <button
                        type="button"
                        onClick={() => switchLoginMode("owner")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                          loginMode === "owner"
                            ? "bg-white text-[#006948] shadow-sm"
                            : "text-[#565e74] hover:text-[#0b1c30]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          storefront
                        </span>

                        <span className="truncate">
                          Pemilik Toko (Email / Ponsel)
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => switchLoginMode("kasir")}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                          loginMode === "kasir"
                            ? "bg-white text-[#006948] shadow-sm"
                            : "text-[#565e74] hover:text-[#0b1c30]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          dialpad
                        </span>

                        <span className="truncate">
                          Kasir Cepat (PIN 6-Digit)
                        </span>
                      </button>

                    </div>

                    {/* =================================================
                        OWNER FORM
                    ================================================= */}

                    {loginMode === "owner" && (
                      <form
                        onSubmit={handleLogin}
                        className="flex flex-col gap-4"
                      >

                        <div className="flex flex-col gap-1.5">

                          <label
                            htmlFor="owner-identity"
                            className="flex items-center justify-between text-xs font-semibold text-[#0b1c30]"
                          >
                            <span>Email Toko atau Nomor WhatsApp</span>

                            <span className="hidden text-xs font-normal text-[#565e74] sm:inline">
                              Contoh: budi@tokokilat.id
                            </span>
                          </label>

                          <div className="relative flex items-center">

                            <span className="material-symbols-outlined pointer-events-none absolute left-3.5 text-[20px] text-[#565e74]">
                              mail
                            </span>

                            <input
                              id="owner-identity"
                              type="email"
                              value={email}
                              onChange={(e) =>
                                setEmail(e.target.value)
                              }
                              placeholder="nama@outlet.id atau 08123456789"
                              required
                              className="h-11 w-full rounded-lg bg-[#f8f9ff] pl-10 pr-4 text-sm text-[#0b1c30] outline-none placeholder:text-[#6d7a72] focus:bg-[#eff4ff] focus:outline-none"
                            />

                          </div>

                        </div>

                        <div className="flex flex-col gap-1.5">

                          <div className="flex items-center justify-between">

                            <label
                              htmlFor="owner-password"
                              className="text-xs font-semibold text-[#0b1c30]"
                            >
                              Kata Sandi Akun
                            </label>

                            <button
                              type="button"
                              className="text-xs font-semibold text-[#006948] transition-all hover:underline"
                              onClick={() =>
                                alert(
                                  "Fitur Lupa Kata Sandi belum diaktifkan."
                                )
                              }
                            >
                              Lupa Kata Sandi?
                            </button>

                          </div>

                          <div className="relative flex items-center">

                            <span className="material-symbols-outlined pointer-events-none absolute left-3.5 text-[20px] text-[#565e74]">
                              lock
                            </span>

                            <input
                              id="owner-password"
                              type={
                                showPassword
                                  ? "text"
                                  : "password"
                              }
                              value={password}
                              onChange={(e) =>
                                setPassword(e.target.value)
                              }
                              placeholder="••••••••••••"
                              required
                              className="h-11 w-full rounded-lg bg-[#f8f9ff] pl-10 pr-12 text-sm text-[#0b1c30] outline-none placeholder:text-[#6d7a72] focus:bg-[#eff4ff] focus:outline-none"
                            />

                            <button
                              type="button"
                              aria-label="Tampilkan sandi"
                              onClick={() =>
                                setShowPassword(!showPassword)
                              }
                              className="absolute right-3 rounded p-1 text-[#565e74] transition-colors hover:text-[#0b1c30]"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {showPassword
                                  ? "visibility_off"
                                  : "visibility"}
                              </span>
                            </button>

                          </div>

                        </div>

                        <div className="flex items-center justify-between pt-1">

                          <label className="flex cursor-pointer select-none items-center gap-2">

                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 cursor-pointer accent-[#006948]"
                            />

                            <span className="text-sm text-[#0b1c30]">
                              Ingat saya di perangkat ini
                            </span>

                          </label>

                          <span className="flex items-center gap-1 text-xs text-[#565e74]">

                            <span className="material-symbols-outlined text-[15px]">
                              location_on
                            </span>

                            Outlet Utama

                          </span>

                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#006948] text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#00855d] disabled:cursor-not-allowed disabled:opacity-60"
                        >

                          {loading ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span>Memverifikasi Kredensial...</span>
                            </>
                          ) : (
                            <>
                              <span>Masuk ke Dashboard / POS</span>

                              <span className="material-symbols-outlined text-[18px]">
                                arrow_forward
                              </span>
                            </>
                          )}

                        </button>

                      </form>
                    )}

                    {/* =================================================
                        KASIR FORM
                    ================================================= */}

                    {loginMode === "kasir" && (
                      <form
                        onSubmit={handleKasirSubmit}
                        className="flex flex-col gap-4"
                      >

                        <div className="flex items-center gap-3 rounded-lg bg-[#e5eeff] p-3.5">

                          <span className="material-symbols-outlined text-[24px] text-[#006948]">
                            terminal
                          </span>

                          <div className="flex-1">

                            <p className="text-sm font-semibold text-[#0b1c30]">
                              Mode Cepat Kasir / Kassa 01
                            </p>

                            <p className="mt-1 text-xs text-[#565e74]">
                              Login menggunakan ID Kasir dan PIN 6 digit.
                            </p>

                          </div>

                        </div>

                        {/* ID KASIR */}

                        <div className="flex flex-col gap-1.5">

                          <label
                            htmlFor="outlet-code"
                            className="text-xs font-semibold text-[#0b1c30]"
                          >
                            ID Kasir
                          </label>

                          <div className="relative flex items-center">

                            <span className="material-symbols-outlined pointer-events-none absolute left-3.5 text-[20px] text-[#565e74]">
                              badge
                            </span>

                            <input
                              id="outlet-code"
                              type="text"
                              value={outletCode}
                              onChange={(e) =>
                                setOutletCode(
                                  e.target.value.toUpperCase()
                                )
                              }
                              placeholder="Contoh: KSR-00032"
                              autoComplete="username"
                              className="h-11 w-full rounded-lg bg-[#f8f9ff] pl-10 pr-4 text-sm text-[#0b1c30] outline-none placeholder:text-[#6d7a72] focus:bg-[#eff4ff]"
                            />

                          </div>

                        </div>

                        {/* PIN */}

                        <div className="flex flex-col gap-1.5">

                          <label className="text-xs font-semibold text-[#0b1c30]">
                            PIN Kasir (6 Digit)
                          </label>

                          <div className="grid grid-cols-6 gap-2">

                            {pin.map((value, index) => (
                              <input
                                key={index}
                                id={`pin-${index}`}
                                type="password"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={value}
                                onChange={(e) =>
                                  handlePinChange(
                                    e.target.value,
                                    index
                                  )
                                }
                                onKeyDown={(e) =>
                                  handlePinKeyDown(e, index)
                                }
                                className="h-12 w-full rounded-lg bg-[#f8f9ff] text-center text-[22px] font-semibold text-[#0b1c30] outline-none focus:bg-[#eff4ff] focus:ring-2 focus:ring-[#006948]/20"
                              />
                            ))}

                          </div>

                        </div>

                        {/* KASIR BUTTON */}

                        <button
                          type="submit"
                          disabled={loading}
                          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#006948] text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#00855d] disabled:cursor-not-allowed disabled:opacity-60"
                        >

                          {loading ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              <span>Memverifikasi PIN...</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[18px]">
                                lock_open
                              </span>

                              <span>Buka Terminal Kasir</span>
                            </>
                          )}

                        </button>

                      </form>
                    )}

                    {/* =================================================
                        ALTERNATIVE LOGIN
                    ================================================= */}

                    <div className="relative my-6 flex items-center justify-center">

                      <div className="h-px w-full bg-[#e5eeff]" />

                      <span className="absolute bg-white px-3 text-[11px] font-bold tracking-[0.04em] text-[#565e74]">
                        ATAU MASUK LEWAT
                      </span>

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            "Login Google Workspace belum diaktifkan."
                          )
                        }
                        className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#f8f9ff] px-3 text-xs font-semibold text-[#0b1c30] transition-colors hover:bg-[#e5eeff]"
                      >

                        <svg
                          className="h-4 w-4 shrink-0"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                            fill="#4285F4"
                          />

                          <path
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                            fill="#34A853"
                          />

                          <path
                            d="M5.28 14.27a7.11 7.11 0 0 1 0-4.54V6.58H1.25a11.96 11.96 0 0 0 0 10.84l4.03-3.15 0 0z"
                            fill="#FBBC05"
                          />

                          <path
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                            fill="#EA4335"
                          />
                        </svg>

                        <span className="truncate">
                          Google Workspace
                        </span>

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            "Arahkan kamera tablet/smartphone kasir ke QR Badge ID staf untuk login kilat."
                          )
                        }
                        className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#f8f9ff] px-3 text-xs font-semibold text-[#0b1c30] transition-colors hover:bg-[#e5eeff]"
                      >

                        <span className="material-symbols-outlined text-[18px] text-[#006948]">
                          qr_code_scanner
                        </span>

                        <span className="truncate">
                          Scan QR Staf
                        </span>

                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      BOTTOM AREA
                  ================================================= */}

                  <div className="mt-4 flex flex-col gap-3 pt-6">

                    <div className="flex items-start gap-2.5 rounded-lg bg-[#e5eeff] p-3">

                      <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-[#006948]">
                        lightbulb
                      </span>

                      <p className="text-xs leading-relaxed text-[#3d4a42]">

                        <strong className="font-semibold text-[#0b1c30]">
                          Tips Hak Akses:
                        </strong>{" "}

                        Pembuat akun pertama otomatis terdaftar sebagai{" "}

                        <strong className="font-semibold text-[#0b1c30]">
                          Owner (Pemilik Utama)
                        </strong>{" "}

                        dengan wewenang penuh konfigurasi pajak, cetak struk
                        bluetooth, dan laporan komisi kasir.

                      </p>

                    </div>

                    <div className="text-center text-sm text-[#565e74]">

                      Belum memiliki lisensi outlet?

                      <button
                        type="button"
                        onClick={() => router.push("/register")}
                        className="ml-1 font-semibold text-[#006948] hover:underline"
                      >
                        Daftar Akun Baru Sekarang →
                      </button>

                    </div>

                  </div>

                </section>

              </div>

            </div>
          </div>
        </main>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-[#3d4a42] sm:flex-row">

          <p>
            © 2025 KasirKilat POS. Hak Cipta Dilindungi.
          </p>

          <div className="flex items-center gap-5">

            <button
              type="button"
              onClick={() =>
                alert("Pusat Bantuan KasirKilat belum tersedia.")
              }
              className="flex items-center gap-1 transition-colors hover:text-[#0b1c30]"
            >
              <span className="material-symbols-outlined text-[16px]">
                support_agent
              </span>

              <span>Pusat Bantuan KasirKilat</span>
            </button>

            <button
              type="button"
              onClick={() =>
                alert("Halaman keamanan belum tersedia.")
              }
              className="transition-colors hover:text-[#0b1c30]"
            >
              Keamanan
            </button>

          </div>

        </footer>

        {/* =====================================================
            GOOGLE FONT + MATERIAL SYMBOLS
        ===================================================== */}

        <style jsx global>{`

          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

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

          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
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
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
            font-feature-settings: 'liga';
          }

          @media (max-width: 767px) {

            .material-symbols-outlined {
              font-size: 22px;
            }

          }

        `}</style>

      </div>
    </main>
  );
}