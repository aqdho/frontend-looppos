"use client";

import { useState } from "react";

const segmentData = {
  cafe: {
    badge: "Spesialis Kedai Kopi & Casual Dining",
    title:
      "Kendalikan Antrean Jam Sibuk Tanpa Melewatkan Add-On & Modifiers",
    desc:
      "Dukung custom syrup, level gula, oat milk substitute, hingga open bill meja dengan integrasi cetak tiket ke kitchen & bar station secara simultan.",
    imgAlt:
      "Modern barista operating high tech cloud POS tablet terminal at minimalist specialty coffee bar with customers ordering in background",
  },
  resto: {
    badge: "Manajemen Restoran, Waralaba & Meja",
    title:
      "Peta Denah Meja Visual & Integrasi Cetak Barcode Dapur Instan",
    desc:
      "Lacak status meja terisi, pesanan sedang dimasak di dapur, reservasi rombongan, serta split pembayaran tagihan antar tamu tanpa kekeliruan nota.",
    imgAlt:
      "Head chef and restaurant cashier checking kitchen order tickets on cloud display screen inside modern Indonesian fine dining kitchen",
  },
  retail: {
    badge: "Minimarket, Toko Kelontong & Grosir",
    title:
      "Scan Barcode Cepat Kilat, Multi-Satuan & Stok Multi-Gudang",
    desc:
      "Mendukung barcode scanner laser genggam, penjualan rentengan/lusinan (multi-UOM), peringatan produk hampir kedaluwarsa, dan pencatatan supplier PO.",
    imgAlt:
      "Cashier scanning grocery items barcode using hand terminal in bright well organized Indonesian supermarket store",
  },
  bakery: {
    badge: "Toko Roti, Kue & Patisserie",
    title:
      "Manajemen Batch Produksi Harian & Paket Parsel Hampers",
    desc:
      "Pantau waktu pemanggangan roti, diskon sore otomatis untuk produk mudah kedaluwarsa (perishable), dan bundling paket gift box perayaan secara praktis.",
    imgAlt:
      "Display of assorted artisan breads and fresh cakes in a boutique bakery with digital touchscreen cashier station in foreground",
  },
};

type SegmentKey = keyof typeof segmentData;

const logo = "/logo-LoopPOS.svg";

const productImages = {
  coffee:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCqTbyxllvXgUPmwLUxikBkhXBbLd8Wk2oehW4CToBIUc08vAoXEgxeGYinyklhs01f67ABdQ7FLeHBUYMAAR-y0a2aIIenJxJXb5xWZM29p85J3UCelBJfk50xh5BY96cL5Zi58hmPvbhJoS6ZYOklaix9fRG0ED1uB6OW9qjhT6ikH7fHHFX0UcNIYyauPOW_3TwdHgEYfYIDM8AV0KuWSW24TAXlQ_J3Fi8oTcIwk9-9JdFzs8RP",
  matcha:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2NiRw3dwwV5O-rvLVVKhh8NZgKhcMO7-HdHQ5Ay7LkCrIinYeEYNw1kHNppRfW_sVE2pdJl_h8I0OLMVx3YFNet9gM0IsX9H6z3xgFsZN5MPD118mrZFkJZtjapIp2_0F4z7DOEYoTRGIwaKlW38ygguW3X8cRJ6frwEpSZ07hfelRPdSdyOCro_J2seraRBGigr2J6b2KZgrLVQPBDvx2oN2S2le3XCEt1dxO7dX1kRtxg2b4oF",
  croissant:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCDsqyWyEVHdi9AnGcTbmeefrcsXbGsUJpFNjLpfkE6Gtj5ShqirIfUPDpUhVgwLRMszaNhuL1DHL8xiULqEaVBA4mPugID0S4nJUfHywf756P3-X26cthIIVi4TcJItJA-Jr8RX__FB6iF4n2FA-7EwVdNk5k56Tal-3sGhqrPlvVbmGJBQw1IGLCXYTfUps-hR_nVzHl8ccyRXRSoJFhnEVH0XsyxgO-sp9GAWC1K0yrvEAdA7OEZ",
};

const segmentImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDP026hUPkSQVsqkiSjs_npyzLWlFppzPF9QjEQZKtA5xjrpX5NdQfn3OTa992KvQTK-qvfuw7uJ8sG-m83dofJzRcIgmLKx_ze2gS9Cn06V5e9v4mh4q-w8SkL5GXJTlD3kLe2TyeAJhxWNVeXh21WecQhY072SH6T35qYpIqAAxPiwQMGauH4quo02syO6TYeIXdBEJW7uG-z_IdvxM0debc5SKyyhgNr7Do_KqKRIH7kkYfPBxUR";

export default function HomePage() {
  const [segment, setSegment] = useState<SegmentKey>("cafe");

  const activeSegment = segmentData[segment];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200");
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
          background: #f8f9ff;
          color: #0b1c30;
          font-family: "Plus Jakarta Sans", sans-serif;
          overscroll-behavior: none;
        }

        * {
          box-sizing: border-box;
        }

        ::-webkit-scrollbar {
          display: none;
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
          font-feature-settings: "liga";
          font-variation-settings:
            "FILL" 0,
            "wght" 400,
            "GRAD" 0,
            "opsz" 24;
        }

        .landing {
          --primary: #006948;
          --primary-container: #00855d;
          --primary-fixed: #85f8c4;
          --primary-fixed-dim: #68dba9;
          --surface: #f8f9ff;
          --surface-low: #eff4ff;
          --surface-container: #e5eeff;
          --surface-high: #dce9ff;
          --surface-highest: #d3e4fe;
          --surface-lowest: #ffffff;
          --on-surface: #0b1c30;
          --on-surface-variant: #3d4a42;
          --error: #ba1a1a;
        }

        .landing .display-lg {
          font-size: 36px;
          line-height: 44px;
          letter-spacing: -0.02em;
          font-weight: 700;
        }

        .landing .headline-lg {
          font-size: 28px;
          line-height: 36px;
          letter-spacing: -0.02em;
          font-weight: 700;
        }

        .landing .headline-md {
          font-size: 22px;
          line-height: 28px;
          letter-spacing: -0.01em;
          font-weight: 600;
        }

        .landing .title-lg {
          font-size: 18px;
          line-height: 24px;
          letter-spacing: -0.005em;
          font-weight: 600;
        }

        .landing .title-md {
          font-size: 16px;
          line-height: 22px;
          font-weight: 600;
        }

        .landing .body-lg {
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
        }

        .landing .body-md {
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
        }

        .landing .body-sm {
          font-size: 12px;
          line-height: 16px;
          font-weight: 400;
        }

        .landing .label-lg {
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.01em;
          font-weight: 600;
        }

        .landing .label-md {
          font-size: 12px;
          line-height: 16px;
          letter-spacing: 0.02em;
          font-weight: 600;
        }

        .landing .label-sm {
          font-size: 11px;
          line-height: 14px;
          letter-spacing: 0.04em;
          font-weight: 700;
        }

        .landing .currency {
          font-size: 32px;
          line-height: 40px;
          letter-spacing: -0.03em;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .landing .display-lg {
            font-size: 28px;
            line-height: 36px;
          }

          .landing .headline-lg {
            font-size: 24px;
            line-height: 32px;
          }
        }
      `}</style>

      <div className="landing min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
        {/* HEADER */}
        <header className="fixed left-0 right-0 top-0 z-50 w-full bg-[#f8f9ff]/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-12">
            <div className="flex shrink-0 items-center gap-3">
              <img
                alt="LoopPOS Logo"
                className="h-14 w-auto object-contain"
                src={logo}
              />

              <div className="flex flex-col">
                <span className="title-lg font-bold leading-none tracking-tight">
                  LoopPOS
                </span>
                <span className="label-sm uppercase tracking-widest text-[#006948]">
                  POS Enterprise
                </span>
              </div>
            </div>

            <nav className="hidden items-center gap-8 lg:flex">
              <a
                href="#"
                className="title-md text-[#006948]"
              >
                Beranda
              </a>

              <button
                onClick={() => scrollTo("fitur")}
                className="body-md text-[#3d4a42] transition-colors hover:text-[#0b1c30]"
              >
                Fitur
              </button>

              <button
                onClick={() => scrollTo("solusi-bisnis")}
                className="body-md text-[#3d4a42] transition-colors hover:text-[#0b1c30]"
              >
                Solusi Bisnis
              </button>

              <button
                onClick={() => scrollTo("harga")}
                className="body-md text-[#3d4a42] transition-colors hover:text-[#0b1c30]"
              >
                Harga
              </button>

              <button
                onClick={() => scrollTo("testimoni")}
                className="body-md text-[#3d4a42] transition-colors hover:text-[#0b1c30]"
              >
                Testimoni
              </button>

              <button
                onClick={() => scrollTo("bantuan")}
                className="body-md text-[#3d4a42] transition-colors hover:text-[#0b1c30]"
              >
                Bantuan
              </button>
            </nav>

            <div className="flex shrink-0 items-center gap-4">
              <div className="hidden items-center gap-1.5 rounded-lg bg-[#eff4ff] px-3 py-1.5 text-[#3d4a42] sm:flex">
                <span className="material-symbols-outlined text-[16px]">
                  language
                </span>
                <span className="label-md">ID</span>
              </div>

              <a
                href="/login"
                className="label-lg hidden px-3 py-2 text-[#3d4a42] transition-colors hover:text-[#0b1c30] md:inline-flex"
              >
                Masuk
              </a>

              <a
                href="/register"
                className="label-lg inline-flex h-11 items-center justify-center rounded-lg bg-[#006948] px-5 tracking-wide text-white shadow-[0_1px_3px_0_rgba(15,23,42,0.08)] transition-all hover:bg-[#00855d] active:scale-95"
              >
                Coba Gratis 14 Hari
              </a>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006948]">
                <span className="material-symbols-outlined text-[18px] text-white">
                  person
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full bg-[#f8f9ff] pt-20">
          {/* HERO */}
          <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-6 pb-20 pt-8 lg:px-12">
            <div className="pointer-events-none absolute -left-1/2 -top-32 z-0 h-[340px] w-[850px] rounded-full bg-[#85f8c4]/30 blur-[120px]" />

            <div className="pointer-events-none absolute -right-32 top-72 z-0 h-[400px] w-[400px] rounded-full bg-[#dce9ff]/60 blur-[90px]" />

            <div className="relative z-10 mx-auto mb-14 flex max-w-4xl flex-col items-center text-center">
              <div className="label-md mb-6 inline-flex items-center gap-2 rounded-full bg-[#e5eeff] px-4 py-1.5 text-[#006948] shadow-sm">
                <span className="inline-block h-2 w-2 animate-ping rounded-full bg-[#006948]" />
                <span className="font-bold tracking-wide">
                  ⚡ Kasir POS Cloud Generasi Baru #1 di Indonesia
                </span>
                <span className="material-symbols-outlined text-[16px]">
                  bolt
                </span>
              </div>

              <h1 className="display-lg mb-6 max-w-3xl font-extrabold leading-[1.18] tracking-tight">
                Kelola Transaksi, Inventaris, dan Tim Kasir{" "}
                <span className="text-[#006948] underline decoration-[#85f8c4] decoration-4 underline-offset-8">
                  Lebih Cepat & Akurat
                </span>
              </h1>

              <p className="body-lg mb-9 max-w-2xl leading-relaxed text-[#3d4a42]">
                Solusi kasir web pintar dengan integrasi QRIS dinamis instan,
                sinkronisasi stok realtime antar cabang, dan laporan analitik
                laba bersih otomatis tanpa setup rumit.
              </p>

              <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
                <a
                  href="/register"
                  className="label-lg group inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-lg bg-[#006948] px-8 font-bold tracking-wide text-white shadow-md transition-all hover:bg-[#00855d] hover:shadow-lg active:scale-95 sm:w-auto"
                >
                  <span>Coba Gratis 14 Hari</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </a>

                <button
                  onClick={() => scrollTo("fitur")}
                  className="label-lg inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-lg bg-[#e5eeff] px-7 font-semibold text-[#0b1c30] transition-all hover:bg-[#dce9ff] sm:w-auto"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#006948]">
                    play_circle
                  </span>
                  <span>Jadwalkan Demo / Live POS</span>
                </button>
              </div>

              <div className="label-sm mt-6 flex flex-wrap items-center justify-center gap-6 text-[#3d4a42]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006948]">
                    verified
                  </span>
                  Tanpa Kartu Kredit
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006948]">
                    bolt
                  </span>
                  Setup Kurang dari 3 Menit
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006948]">
                    cloud_done
                  </span>
                  Multi-Perangkat (Laptop, Tablet, HP)
                </span>
              </div>
            </div>

            {/* POS MOCKUP */}
            <div className="relative mx-auto w-full max-w-6xl rounded-xl bg-white p-3 shadow-xl sm:p-5">
              <div className="absolute -left-0 -top-5 z-20 hidden items-center gap-2.5 rounded-full bg-white px-4 py-2 text-[#0b1c30] shadow-md md:flex">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#006948]" />
                <span className="label-md">
                  <strong className="text-[#006948]">+42%</strong> Efisiensi
                  Kecepatan Antrean
                </span>
              </div>

              <div className="absolute -right-0 -top-5 z-20 hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-[#0b1c30] shadow-md md:flex">
                <span className="material-symbols-outlined text-[18px] text-[#006948]">
                  qr_code_2
                </span>
                <span className="label-md font-semibold">
                  QRIS Dinamis BI Terverifikasi
                </span>
              </div>

              <div className="absolute -bottom-6 right-16 z-20 hidden items-center gap-3 rounded-xl bg-[#006948] px-5 py-3 text-white shadow-xl lg:flex">
                <span className="material-symbols-outlined text-[24px]">
                  sync
                </span>
                <div className="flex flex-col text-left">
                  <span className="label-sm uppercase text-[#85f8c4]">
                    Sinkronisasi Cloud
                  </span>
                  <span className="label-md font-bold">
                    12 Cabang Terhubung Aktif
                  </span>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between rounded-lg bg-[#eff4ff] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ba1a1a]" />
                  <span className="h-3 w-3 rounded-full bg-[#d3e4fe]" />
                  <span className="h-3 w-3 rounded-full bg-[#85f8c4]" />

                  <span className="label-sm ml-3 text-[#3d4a42]">
                    KasirKilat POS — Register Terminal #01 (Shift Siang)
                  </span>
                </div>

                <div className="hidden items-center gap-3 sm:flex">
                  <span className="label-sm flex items-center gap-1 rounded bg-[#d3e4fe] px-2.5 py-1 text-[#0b1c30]">
                    <span className="material-symbols-outlined text-[14px]">
                      wifi
                    </span>
                    Online
                  </span>

                  <span className="label-sm font-semibold text-[#006948]">
                    Kasir: Rina Melati [ID-044]
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                {/* PRODUCT SIDE */}
                <div className="flex flex-col gap-4 lg:col-span-7">
                  <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <div className="relative w-full flex-1">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-[#3d4a42]">
                        search
                      </span>

                      <input
                        readOnly
                        value="Kopi Susu Aren"
                        className="body-md w-full rounded-lg bg-[#eff4ff] py-2.5 pl-10 pr-4 text-[#0b1c30] outline-none"
                      />

                      <span className="label-sm absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[#e5eeff] px-2 py-0.5 text-[#3d4a42]">
                        F2 Scan
                      </span>
                    </div>

                    <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
                      <button className="label-md whitespace-nowrap rounded-lg bg-[#006948] px-3 py-1.5 text-white">
                        Semua
                      </button>
                      <button className="label-md whitespace-nowrap rounded-lg bg-[#e5eeff] px-3 py-1.5 text-[#0b1c30]">
                        Minuman
                      </button>
                      <button className="label-md whitespace-nowrap rounded-lg bg-[#e5eeff] px-3 py-1.5 text-[#0b1c30]">
                        Makanan
                      </button>
                      <button className="label-md whitespace-nowrap rounded-lg bg-[#e5eeff] px-3 py-1.5 text-[#0b1c30]">
                        Pastry
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {/* PRODUCT 1 */}
                    <div className="group relative cursor-pointer rounded-lg bg-[#eff4ff] p-3 transition-all hover:bg-[#e5eeff]">
                      <div className="relative mb-2 h-24 w-full overflow-hidden rounded-lg bg-[#d3e4fe]">
                        <img
                          src={productImages.coffee}
                          alt="Kopi Susu Aren"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        <span className="label-sm absolute right-1.5 top-1.5 rounded-full bg-[#006948] px-2 py-0.5 text-white">
                          Stok: 48
                        </span>
                      </div>

                      <h4 className="title-md truncate font-bold">
                        Kopi Susu Aren
                      </h4>

                      <p className="label-sm mb-2 text-[#3d4a42]">
                        Double shot espresso
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="title-lg font-extrabold text-[#006948]">
                          Rp 22.000
                        </span>

                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#006948] text-[12px] font-bold text-white">
                          +1
                        </span>
                      </div>
                    </div>

                    {/* PRODUCT 2 */}
                    <div className="group relative cursor-pointer rounded-lg bg-[#eff4ff] p-3 transition-all hover:bg-[#e5eeff]">
                      <div className="relative mb-2 h-24 w-full overflow-hidden rounded-lg bg-[#d3e4fe]">
                        <img
                          src={productImages.matcha}
                          alt="Matcha Oat Latte"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        <span className="label-sm absolute right-1.5 top-1.5 rounded-full bg-[#006948] px-2 py-0.5 text-white">
                          Stok: 26
                        </span>
                      </div>

                      <h4 className="title-md truncate font-bold">
                        Matcha Oat Latte
                      </h4>

                      <p className="label-sm mb-2 text-[#3d4a42]">
                        Pure Uji matcha
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="title-lg font-extrabold text-[#006948]">
                          Rp 28.000
                        </span>

                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dce9ff] text-[12px] font-bold text-[#0b1c30]">
                          +
                        </span>
                      </div>
                    </div>

                    {/* PRODUCT 3 */}
                    <div className="group relative cursor-pointer rounded-lg bg-[#eff4ff] p-3 transition-all hover:bg-[#e5eeff]">
                      <div className="relative mb-2 h-24 w-full overflow-hidden rounded-lg bg-[#d3e4fe]">
                        <img
                          src={productImages.croissant}
                          alt="Butter Croissant"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        <span className="label-sm absolute right-1.5 top-1.5 rounded-full bg-[#ba1a1a] px-2 py-0.5 text-white">
                          Sisa 3
                        </span>
                      </div>

                      <h4 className="title-md truncate font-bold">
                        Butter Croissant
                      </h4>

                      <p className="label-sm mb-2 text-[#3d4a42]">
                        French butter flake
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="title-lg font-extrabold text-[#006948]">
                          Rp 25.000
                        </span>

                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dce9ff] text-[12px] font-bold text-[#0b1c30]">
                          +
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="label-sm flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#eff4ff] p-3 text-[#3d4a42]">
                    <span className="flex items-center gap-1.5">
                      <kbd className="rounded bg-[#e5eeff] px-1.5 py-0.5 font-mono text-[#0b1c30]">
                        F1
                      </kbd>
                      Cari Menu
                    </span>

                    <span className="flex items-center gap-1.5">
                      <kbd className="rounded bg-[#e5eeff] px-1.5 py-0.5 font-mono text-[#0b1c30]">
                        F4
                      </kbd>
                      Diskon Member
                    </span>

                    <span className="flex items-center gap-1.5">
                      <kbd className="rounded bg-[#e5eeff] px-1.5 py-0.5 font-mono text-[#0b1c30]">
                        F8
                      </kbd>
                      Buka Drawer Cash
                    </span>

                    <span className="flex items-center gap-1.5">
                      <kbd className="rounded bg-[#e5eeff] px-1.5 py-0.5 font-mono text-[#0b1c30]">
                        F12
                      </kbd>
                      Bayar Cepat
                    </span>
                  </div>
                </div>

                {/* BILL SIDE */}
                <div className="flex flex-col justify-between rounded-xl bg-[#f8f9ff] p-4 shadow-inner lg:col-span-5">
                  <div>
                    <div className="mb-3 flex items-center justify-between pb-3">
                      <div>
                        <h3 className="title-md font-bold">
                          Pesanan Meja #07
                        </h3>

                        <span className="label-sm text-[#3d4a42]">
                          Dine-In • 2 Pelanggan
                        </span>
                      </div>

                      <span className="label-sm rounded-full bg-[#dce9ff] px-2.5 py-1 font-bold text-[#006948]">
                        #ORD-8829
                      </span>
                    </div>

                    <div className="mb-4 space-y-2.5">
                      <div className="flex items-center justify-between rounded bg-white px-2.5 py-1.5">
                        <div>
                          <div className="label-md font-bold">
                            2x Kopi Susu Aren
                          </div>
                          <div className="label-sm text-[#3d4a42]">
                            Less Sweet • Ice Normal
                          </div>
                        </div>

                        <div className="label-md font-bold">
                          Rp 44.000
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded bg-white px-2.5 py-1.5">
                        <div>
                          <div className="label-md font-bold">
                            1x Butter Croissant
                          </div>
                          <div className="label-sm text-[#3d4a42]">
                            Hangatkan
                          </div>
                        </div>

                        <div className="label-md font-bold">
                          Rp 25.000
                        </div>
                      </div>
                    </div>

                    <div className="body-sm space-y-1.5 pb-3 pt-2 text-[#3d4a42]">
                      <div className="flex justify-between">
                        <span>Subtotal (3 item)</span>
                        <span>Rp 69.000</span>
                      </div>

                      <div className="flex justify-between">
                        <span>PB1 Resto (10%)</span>
                        <span>Rp 6.900</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Diskon Member Promo (5%)</span>
                        <span className="font-semibold text-[#006948]">
                          - Rp 3.450
                        </span>
                      </div>

                      <div className="title-lg flex justify-between pt-2 font-extrabold text-[#0b1c30]">
                        <span>Total Akhir</span>
                        <span className="text-[#006948]">Rp 72.450</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2.5 pt-3">
                    <div className="grid grid-cols-3 gap-2">
                      <button className="label-md flex items-center justify-center gap-1 rounded-lg bg-[#e5eeff] py-2 font-semibold">
                        <span className="material-symbols-outlined text-[16px]">
                          payments
                        </span>
                        Tunai
                      </button>

                      <button className="label-md flex items-center justify-center gap-1 rounded-lg bg-[#68dba9] py-2 font-bold text-[#002113] shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">
                          qr_code_scanner
                        </span>
                        QRIS
                      </button>

                      <button className="label-md flex items-center justify-center gap-1 rounded-lg bg-[#e5eeff] py-2 font-semibold">
                        <span className="material-symbols-outlined text-[16px]">
                          credit_card
                        </span>
                        EDC Debit
                      </button>
                    </div>

                    <button className="title-md flex w-full items-center justify-center gap-2 rounded-lg bg-[#006948] py-3.5 font-bold text-white shadow-md hover:bg-[#00855d]">
                      <span className="material-symbols-outlined text-[20px]">
                        print
                      </span>
                      Proses Pembayaran & Cetak Struk
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TRUST BAR */}
            <div className="mt-16 text-center">
              <p className="label-sm mb-6 uppercase tracking-widest text-[#3d4a42]">
                Dipercaya lebih dari 15.000+ merchant F&B & ritel terdepan di
                Indonesia
              </p>

              <div className="flex flex-wrap items-center justify-center gap-8 opacity-75 grayscale transition-all duration-300 hover:grayscale-0 lg:gap-14">
                <div className="headline-md flex items-center gap-2 font-black tracking-tighter">
                  <span className="material-symbols-outlined text-[28px] text-[#006948]">
                    local_cafe
                  </span>
                  KopiKenangan
                </div>

                <div className="headline-md flex items-center gap-2 font-black tracking-tighter">
                  <span className="material-symbols-outlined text-[28px] text-[#006948]">
                    favorite
                  </span>
                  JanjiJiwa
                </div>

                <div className="headline-md flex items-center gap-2 font-black tracking-tighter">
                  <span className="material-symbols-outlined text-[28px] text-[#006948]">
                    coffee
                  </span>
                  KopiBarokah
                </div>

                <div className="headline-md flex items-center gap-2 font-black tracking-tighter">
                  <span className="material-symbols-outlined text-[28px] text-[#006948]">
                    bakery_dining
                  </span>
                  RotiMandiri
                </div>

                <div className="headline-md flex items-center gap-2 font-black tracking-tighter">
                  <span className="material-symbols-outlined text-[28px] text-[#006948]">
                    restaurant
                  </span>
                  MartabakSultan
                </div>
              </div>
            </div>
          </section>

          {/* FITUR */}
          <section
            id="fitur"
            className="w-full bg-[#eff4ff] px-6 py-20 lg:px-12"
          >
            <div className="mx-auto max-w-7xl">
              <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <div className="label-md mb-2 font-bold uppercase tracking-widest text-[#006948]">
                    Fitur Unggulan Enterprise
                  </div>

                  <h2 className="display-lg font-bold tracking-tight">
                    Dirancang Khusus Menghadapi Rush Hour
                  </h2>
                </div>

                <p className="body-lg max-w-md text-[#3d4a42]">
                  Sistem kasir yang tidak pernah lemot saat antrean memanjang.
                  Mengeliminasi selisih kas, kesalahan dapur, dan kehabisan
                  stok tanpa peringatan.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: "keyboard_command_key",
                    title: "Kasir POS Super Cepat",
                    text:
                      "Antarmuka keyboard shortcut F-keys, scan barcode instan, cetak thermal bill tanpa jeda detik, dan simpan antrean pesanan sementara (split bill).",
                    bottom: "SLA Checkout < 8 Detik",
                    bottomIcon: "speed",
                  },
                  {
                    icon: "badge",
                    title: "Multi-Kasir & Proteksi PIN",
                    text:
                      "Pengaturan hak akses bertingkat kasir vs supervisor. Shift kasir otomatis dengan rekonsiliasi uang laci fisik vs mutasi QRIS/debit.",
                    bottom: "Proteksi Void Anti-Fraud",
                    bottomIcon: "security",
                  },
                  {
                    icon: "inventory_2",
                    title: "Inventaris & Alert Stok Kritis",
                    text:
                      "Pelacakan modal bahan baku (COGS/HPP) hingga gramatur terkecil. Pengurangan stok otomatis per menu laku dan pengingat restock WhatsApp.",
                    bottom: "Auto-Deduct Formula",
                    bottomIcon: "notifications_active",
                  },
                  {
                    icon: "query_stats",
                    title: "Laporan & QRIS Terintegrasi",
                    text:
                      "Rekapitulasi omzet live di HP pemilik, hitungan pajak daerah PB1 otomatis, ekspor file akuntansi Excel/Jurnal/Mekari, dan QRIS settlement langsung.",
                    bottom: "100% Sesuai Regulasi BI",
                    bottomIcon: "account_balance",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col justify-between rounded-xl bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div>
                      <div className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-[#e5eeff] text-[#006948]">
                        <span className="material-symbols-outlined text-[32px]">
                          {item.icon}
                        </span>
                      </div>

                      <h3 className="title-lg mb-3 font-bold">
                        {item.title}
                      </h3>

                      <p className="body-md mb-4 leading-relaxed text-[#3d4a42]">
                        {item.text}
                      </p>
                    </div>

                    <div className="label-sm flex items-center gap-2 pt-4 font-bold text-[#006948]">
                      <span className="material-symbols-outlined text-[16px]">
                        {item.bottomIcon}
                      </span>
                      {item.bottom}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SOLUSI BISNIS */}
          <section
            id="solusi-bisnis"
            className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-12"
          >
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="label-md mb-2 font-bold uppercase tracking-widest text-[#006948]">
                Fleksibilitas Vertikal
              </div>

              <h2 className="display-lg mb-4 font-bold tracking-tight">
                Solusi Teruji untuk Segala Karakter Usaha
              </h2>

              <p className="body-lg text-[#3d4a42]">
                Pilih skenario operasional yang sesuai dengan alur meja,
                dapur, kasir, atau etalase toko Anda.
              </p>
            </div>

            <div className="mx-auto mb-10 flex max-w-3xl items-center gap-2 overflow-x-auto rounded-xl bg-[#eff4ff] p-1.5">
              {[
                ["cafe", "local_cafe", "Coffee Shop & Cafe"],
                ["resto", "restaurant", "Restoran & Kuliner"],
                ["retail", "storefront", "Retail & Minimarket"],
                ["bakery", "cake", "Bakery & Cake Shop"],
              ].map(([key, icon, label]) => {
                const active = segment === key;

                return (
                  <button
                    key={key}
                    onClick={() => setSegment(key as SegmentKey)}
                    className={`label-md flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 transition-all ${
                      active
                        ? "bg-white font-bold text-[#0b1c30] shadow-sm"
                        : "font-semibold text-[#3d4a42] hover:text-[#0b1c30]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {icon}
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-[#eff4ff] p-8 shadow-sm lg:p-12">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-6">
                  <div className="label-sm inline-flex items-center gap-2 rounded-full bg-[#d3e4fe] px-3 py-1 font-bold text-[#006948]">
                    <span className="material-symbols-outlined text-[16px]">
                      coffee_maker
                    </span>

                    <span>{activeSegment.badge}</span>
                  </div>

                  <h3 className="headline-lg font-bold">
                    {activeSegment.title}
                  </h3>

                  <p className="body-lg leading-relaxed text-[#3d4a42]">
                    {activeSegment.desc}
                  </p>

                  <div className="space-y-3 pt-2">
                    {[
                      "Kitchen Display System (KDS) realtime layar sentuh dapur",
                      "Split bill per orang atau gabung meja dalam hitungan detik",
                      "Kalkulasi otomatis HPP biji kopi (espresso yield per kg)",
                    ].map((text) => (
                      <div
                        key={text}
                        className="title-md flex items-center gap-3"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#006948] text-[14px] font-bold text-white">
                          ✓
                        </span>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="relative overflow-hidden rounded-xl bg-white p-2 shadow-lg">
                    <img
                      src={segmentImage}
                      alt={activeSegment.imgAlt}
                      className="h-80 w-full rounded-lg object-cover"
                    />

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-lg bg-white/90 p-4 shadow-md backdrop-blur">
                      <div>
                        <span className="label-sm block text-[#3d4a42]">
                          Rata-rata waktu transaksi
                        </span>

                        <span className="title-lg font-extrabold text-[#006948]">
                          6.4 Detik / Konsumen
                        </span>
                      </div>

                      <span className="label-md rounded bg-[#006948] px-3 py-1.5 font-bold text-white">
                        Tercepat di Kelasnya
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HARGA */}
          <section
            id="harga"
            className="w-full bg-[#eff4ff] px-6 py-20 lg:px-12"
          >
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto mb-14 max-w-2xl text-center">
                <div className="label-md mb-2 font-bold uppercase tracking-widest text-[#006948]">
                  Transparan & Terjangkau
                </div>

                <h2 className="display-lg mb-4 font-bold tracking-tight">
                  Investasi Terukur untuk Akselerasi Usaha
                </h2>

                <p className="body-lg text-[#3d4a42]">
                  Pilih paket fleksibel tanpa biaya tersembunyi. Termasuk
                  pembaruan fitur gratis berkala dan dukungan 24/7.
                </p>
              </div>

              <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
                {/* STARTER */}
                <div className="flex flex-col justify-between rounded-xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                  <div>
                    <div className="title-lg mb-2 font-bold">
                      Starter Kasir
                    </div>

                    <p className="body-sm mb-6 text-[#3d4a42]">
                      Cocok untuk gerai tunggal, booth pameran, dan UMKM
                      berkembang.
                    </p>

                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="currency font-extrabold">
                        Rp 99.000
                      </span>
                      <span className="body-sm text-[#3d4a42]">
                        / bulan
                      </span>
                    </div>

                    <div className="mb-8 space-y-3.5">
                      {[
                        "1 Outlet & 2 Akun Kasir Aktif",
                        "Transaksi Kasir & Barcode Tanpa Batas",
                        "QRIS Dinamis Instan (MDR Rendah)",
                        "Cetak Struk Bluetooth & USB Thermal",
                      ].map((text) => (
                        <div
                          key={text}
                          className="body-md flex items-center gap-3"
                        >
                          <span className="material-symbols-outlined text-[20px] text-[#006948]">
                            check_circle
                          </span>
                          <span>{text}</span>
                        </div>
                      ))}

                      <div className="body-md flex items-center gap-3 text-[#3d4a42] opacity-60">
                        <span className="material-symbols-outlined text-[20px]">
                          remove
                        </span>
                        <span>Laporan HPP Bahan Baku Resep</span>
                      </div>
                    </div>
                  </div>

                  <button className="label-lg w-full rounded-lg bg-[#e5eeff] py-3 font-bold transition-all hover:bg-[#dce9ff]">
                    Pilih Paket Starter
                  </button>
                </div>

                {/* PRO */}
                <div className="relative flex -translate-y-0 flex-col justify-between rounded-xl bg-white p-8 shadow-xl lg:-translate-y-3">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#006948] px-4 py-1 shadow">
                    <span className="label-sm font-bold uppercase tracking-wider text-white">
                      Paling Populer
                    </span>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="title-lg font-bold">
                        Pro Merchant
                      </div>

                      <span className="label-sm rounded-full bg-[#85f8c4] px-2.5 py-0.5 font-bold text-[#002114]">
                        Best ROI
                      </span>
                    </div>

                    <p className="body-sm mb-6 text-[#3d4a42]">
                      Pilihan favorit kafe ramai, resto dine-in, dan
                      minimarket lokal.
                    </p>

                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="currency font-extrabold text-[#006948]">
                        Rp 199.000
                      </span>
                      <span className="body-sm text-[#3d4a42]">
                        / bulan
                      </span>
                    </div>

                    <div className="mb-8 space-y-3.5">
                      {[
                        "Hingga 3 Outlet & Kasir Unlimited",
                        "Kitchen Display System (KDS) & Bar Station",
                        "Manajemen HPP, Resep & Bahan Baku Baku",
                        "Manajemen Meja, Open Bill & Split Pesanan",
                        "Rekonsiliasi Shift Kasir & Hak Akses PIN",
                      ].map((text, index) => (
                        <div
                          key={text}
                          className="body-md flex items-center gap-3"
                        >
                          <span className="material-symbols-outlined text-[20px] text-[#006948]">
                            check_circle
                          </span>

                          <span className={index === 0 ? "font-bold" : ""}>
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="label-lg w-full rounded-lg bg-[#006948] py-3.5 font-bold text-white shadow-md transition-all hover:bg-[#00855d]">
                    Mulai Uji Coba Pro Gratis
                  </button>
                </div>

                {/* ENTERPRISE */}
                <div className="flex flex-col justify-between rounded-xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                  <div>
                    <div className="title-lg mb-2 font-bold">
                      Enterprise Multi-Outlet
                    </div>

                    <p className="body-sm mb-6 text-[#3d4a42]">
                      Dirancang untuk waralaba, chain store, dan skala bisnis
                      multi-kota.
                    </p>

                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="currency font-extrabold">
                        Rp 449.000
                      </span>

                      <span className="body-sm text-[#3d4a42]">
                        / bulan
                      </span>
                    </div>

                    <div className="mb-8 space-y-3.5">
                      {[
                        "Unlimited Cabang / Outlet Nasional",
                        "Central Kitchen & Warehouse Transfer PO",
                        "Akses Open API ERP & Akuntansi Korporat",
                        "Dedicated Account Manager & SLA 99.98%",
                        "Training On-Site & Setup Perangkat POS",
                      ].map((text, index) => (
                        <div
                          key={text}
                          className="body-md flex items-center gap-3"
                        >
                          <span className="material-symbols-outlined text-[20px] text-[#006948]">
                            check_circle
                          </span>

                          <span className={index === 0 ? "font-bold" : ""}>
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="label-lg w-full rounded-lg bg-[#e5eeff] py-3 font-bold transition-all hover:bg-[#dce9ff]">
                    Konsultasi Enterprise
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONI */}
          <section
            id="testimoni"
            className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-12"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg lg:p-14">
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#85f8c4]/40 blur-[80px]" />

              <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                <div className="flex flex-col items-center sm:items-start lg:col-span-4">
                  <div className="relative mb-4 h-36 w-36 overflow-hidden rounded-2xl shadow-md">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2dQ9tNYsEOAQCOUXR4_ky_Y4doXHpoGT0X3cVWGGVwWeusUUUCDvj-DAMz5vt2z4VrvGRWf9EyTooRU5xgpH9kTkBcZ1a7Ol-LfhJm4VzDGWvJMwoCw5sNebzQ15mpHC5R3SqRkYO_ULtUDJ6fkYFfjyKq20bNYJ_IjdryLu1LF86zZeJtP-faJGrvC1cheIUVEU8Vlb3s7iIuUSASQFex0IqSKfbHGlqNJoVUlpmhDWRsyBD_YRO"
                      alt="Pak Budi Santoso"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <h4 className="title-lg font-bold">
                    Pak Budi Santoso
                  </h4>

                  <p className="body-md text-[#3d4a42]">
                    Owner Kopi & Mart Barokah (7 Cabang)
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-[#006948]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className="material-symbols-outlined text-[20px]"
                        style={{
                          fontVariationSettings: "'FILL' 1",
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-center lg:col-span-8">
                  <span className="material-symbols-outlined mb-2 text-[48px] text-[#006948] opacity-40">
                    format_quote
                  </span>

                  <blockquote className="headline-md mb-6 font-bold leading-snug">
                    “Sebelumnya kami pusing tiap tutup shift kasir selalu ada
                    selisih uang puluhan ribu. Sejak pakai KasirKilat,
                    rekonsiliasi QRIS instan dan pembatalan pesanan wajib PIN
                    manajer. Omzet bersih naik 35% dalam 3 bulan karena
                    kebocoran bahan baku langsung terdeteksi.”
                  </blockquote>

                  <div className="grid grid-cols-2 gap-6 border-t-0 pt-4 sm:grid-cols-3">
                    <div>
                      <div className="currency font-extrabold text-[#006948]">
                        +35%
                      </div>
                      <div className="label-sm uppercase text-[#3d4a42]">
                        Kenaikan Laba Bersih
                      </div>
                    </div>

                    <div>
                      <div className="currency font-extrabold text-[#006948]">
                        0 Menit
                      </div>
                      <div className="label-sm uppercase text-[#3d4a42]">
                        Selisih Rekonsiliasi Kas
                      </div>
                    </div>

                    <div>
                      <div className="currency font-extrabold text-[#006948]">
                        7 Cabang
                      </div>
                      <div className="label-sm uppercase text-[#3d4a42]">
                        Tersinkronisasi Realtime
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="mx-auto mb-12 w-full max-w-7xl px-6 py-16 lg:px-12">
            <div className="relative flex flex-col items-center overflow-hidden rounded-2xl bg-[#006948] p-10 text-center text-white shadow-xl lg:p-16">
              <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 flex max-w-3xl flex-col items-center">
                <span className="label-sm mb-6 inline-flex items-center gap-1.5 rounded-full bg-[#00855d] px-3 py-1 font-bold uppercase tracking-widest text-white">
                  Akselerasi Merchant 2025
                </span>

                <h2 className="display-lg mb-6 font-extrabold tracking-tight">
                  Siap Tingkatkan Omzet & Ketepatan Toko Anda Hari Ini?
                </h2>

                <p className="body-lg mb-10 max-w-xl leading-relaxed text-[#85f8c4]">
                  Bergabunglah dengan belasan ribu pemilik usaha sukses. Mulai
                  gratis dalam 3 menit, tanpa kontrak mengikat, dan dapatkan
                  pendampingan teknisi kasir.
                </p>

                <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
                  <a
                    href="/register"
                    className="label-lg inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 font-bold text-[#006948] shadow-lg transition-all hover:bg-[#f8f9ff] active:scale-95 sm:w-auto"
                  >
                    <span>Mulai Uji Coba Gratis Tanpa Kartu Kredit</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </a>

                  <a
                    href="#bantuan"
                    className="label-lg inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#00855d] px-7 py-4 font-semibold text-white transition-all hover:bg-[#68dba9] sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      support_agent
                    </span>
                    <span>Hubungi Tim Penjualan</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer
          id="bantuan"
          className="w-full bg-white shadow-[0_-1px_8px_rgba(0,0,0,0.03)]"
        >
          <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-12">
            <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
              <div className="flex flex-col gap-4 lg:col-span-2">
                <div className="flex items-center gap-3">
                  <img
                    alt="LoopPOS Logo"
                    className="h-12 w-auto object-contain"
                    src={logo}
                  />

                  <span className="title-lg font-bold">
                    LoopPOS
                  </span>
                </div>

                <p className="body-md max-w-sm text-[#3d4a42]">
                  Sistem kasir awan (cloud POS) terintegrasi untuk akselerasi
                  bisnis ritel, F&B, dan waralaba modern di Indonesia. Cepat,
                  aman, dan siap QRIS nasional.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="label-sm flex items-center gap-2 rounded-lg bg-[#e5eeff] px-3 py-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#006948]">
                      verified_user
                    </span>
                    <span>ISO 27001 Certified</span>
                  </div>

                  <div className="label-sm flex items-center gap-2 rounded-lg bg-[#e5eeff] px-3 py-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#006948]">
                      qr_code_scanner
                    </span>
                    <span>Standar QRIS BI</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="title-md mb-4 font-semibold">
                  Produk & Fitur
                </div>

                <ul className="space-y-2.5">
                  {[
                    "Kasir Point of Sale",
                    "Kitchen Display (KDS)",
                    "Manajemen Inventori",
                    "Laporan Pajak & PB1",
                    "Multi-Outlet Sync",
                  ].map((item) => (
                    <li
                      key={item}
                      className="body-md text-[#3d4a42] transition-colors hover:text-[#0b1c30]"
                    >
                      <a href="#fitur">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="title-md mb-4 font-semibold">
                  Solusi Bisnis
                </div>

                <ul className="space-y-2.5">
                  {[
                    "Kafe & Coffee Shop",
                    "Restoran & Waralaba",
                    "Minimarket & Retail",
                    "Salon & Kecantikan",
                    "Usaha Mikro (UMKM)",
                  ].map((item) => (
                    <li
                      key={item}
                      className="body-md text-[#3d4a42] transition-colors hover:text-[#0b1c30]"
                    >
                      <a href="#solusi-bisnis">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="title-md mb-4 font-semibold">
                  Dukungan
                </div>

                <ul className="space-y-2.5">
                  {[
                    "Pusat Bantuan",
                    "Status Sistem",
                    "Integrasi EDC & Thermal",
                    "Dokumentasi API",
                    "Hubungi Sales",
                  ].map((item) => (
                    <li
                      key={item}
                      className="body-md text-[#3d4a42] transition-colors hover:text-[#0b1c30]"
                    >
                      <a href="#bantuan">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="title-md mb-4 font-semibold">
                  Keamanan Finansial
                </div>

                <p className="body-sm mb-3 leading-relaxed text-[#3d4a42]">
                  Seluruh data transaksi dienkripsi 256-bit SSL dan terhubung
                  dengan switching pembayaran berlisensi Bank Indonesia.
                </p>

                <div className="flex flex-col gap-2">
                  <div className="label-sm flex items-center gap-1.5 font-semibold text-[#006948]">
                    <span className="material-symbols-outlined text-[16px]">
                      lock
                    </span>
                    <span>Enkripsi End-to-End</span>
                  </div>

                  <div className="label-sm flex items-center gap-1.5 font-semibold text-[#006948]">
                    <span className="material-symbols-outlined text-[16px]">
                      speed
                    </span>
                    <span>SLA 99.98% High Availability</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="body-sm flex flex-col items-center justify-between gap-4 border-t border-[#e5eeff] pt-8 text-[#3d4a42] md:flex-row">
              <p>
                © 2025 PT Kasir Kilat Nusantara. Hak Cipta Dilindungi
                Undang-Undang.
              </p>

              <div className="flex items-center gap-6">
                <a
                  href="#"
                  className="transition-colors hover:text-[#0b1c30]"
                >
                  Kebijakan Privasi
                </a>

                <a
                  href="#"
                  className="transition-colors hover:text-[#0b1c30]"
                >
                  Syarat & Ketentuan
                </a>

                <a
                  href="#"
                  className="transition-colors hover:text-[#0b1c30]"
                >
                  Pusat Keamanan
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}