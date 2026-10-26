
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  IconRefresh,
  IconCheck,
  IconCreditCard,
  IconClock,
  IconAlertCircle,
  IconCloudCheck,
  IconShieldCheck,
  IconHeadset,
  IconLock,
  IconSparkles,
  IconBuildingStore,
  IconUsers,
  IconChartBar,
  IconPackage,
  IconArrowRight,
  IconX,
  IconCalendarCheck,
  IconCircleCheck,
} from "@tabler/icons-react";

type Plan = {
  id: string;
  name: string;
  price: number;
  duration_days: number;
};

type Subscription = {
  owner_id: number;
  plan: string;
  status: string;
  started_at: string;
  expires_at: string;
  is_current: boolean;
};

const API_URL = "/api";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatTanggal = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Tanggal tidak tersedia";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const planFeatures: Record<string, string[]> = {
  starter: [
    "1 akun kasir",
    "Hingga 500 produk",
    "Pencatatan transaksi",
    "Laporan penjualan",
    "Sinkronisasi cloud",
    "Dukungan standar",
  ],
  pro: [
    "Multiuser dan manajemen kasir",
    "Manajemen shift",
    "Analitik penjualan",
    "Manajemen inventori",
    "Laporan usaha lebih lengkap",
    "Sinkronisasi cloud",
  ],
  enterprise: [
    "Dukungan multi-outlet",
    "Manajemen pengguna terpusat",
    "Pemantauan operasional",
    "Analitik dan laporan usaha",
    "Sinkronisasi cloud",
    "Dukungan prioritas",
  ],
};

const planDescriptions: Record<string, string> = {
  starter: "Semua kebutuhan dasar untuk mulai mengelola usaha.",
  pro: "Kontrol lebih lengkap untuk usaha yang terus berkembang.",
  enterprise: "Pengelolaan operasional untuk bisnis dengan banyak outlet.",
};

const planIcons: Record<string, typeof IconPackage> = {
  starter: IconPackage,
  pro: IconChartBar,
  enterprise: IconBuildingStore,
};

export default function LanggananPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [trialDays, setTrialDays] = useState(14);
  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentPlan, setPaymentPlan] = useState<Plan | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Sesi login tidak ditemukan. Silakan login kembali.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [plansResponse, subscriptionResponse] = await Promise.all([
        fetch(`${API_URL}/subscription/plans`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${API_URL}/subscription/me`, {
          headers,
          cache: "no-store",
        }),
      ]);

      if (!plansResponse.ok) {
        throw new Error("Gagal mengambil daftar paket langganan.");
      }

      const plansData = await plansResponse.json();

      setPlans(Array.isArray(plansData.plans) ? plansData.plans : []);
      setTrialDays(
        Number(plansData.trial?.duration_days) > 0
          ? Number(plansData.trial.duration_days)
          : 14
      );

      if (subscriptionResponse.ok) {
        const data = await subscriptionResponse.json();
        setSubscription(data.subscription ?? null);
      } else if (subscriptionResponse.status === 404) {
        setSubscription(null);
      } else {
        throw new Error("Gagal mengambil status langganan.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil data langganan."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const statusLabel = () => {
    if (!subscription) return "Belum terdaftar";
    if (subscription.status === "trialing") return "Masa trial";
    if (subscription.status === "active") return "Aktif";
    if (subscription.status === "pending") return "Menunggu pembayaran";
    if (subscription.status === "expired") return "Kedaluwarsa";

    return subscription.status;
  };

  const statusColor = () => {
    if (!subscription) {
      return "border-slate-200 bg-slate-100 text-slate-600";
    }

    if (subscription.status === "active") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (subscription.status === "trialing") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (subscription.status === "pending") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-red-200 bg-red-50 text-red-700";
  };

  const remainingDays = subscription
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription.expires_at).getTime() - Date.now()) /
            86_400_000
        )
      )
    : null;

  const isTrial = subscription?.status === "trialing";
  const isSubscriptionCurrent =
    subscription?.is_current &&
    (subscription.status === "active" ||
      subscription.status === "trialing");

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-5 text-slate-900 sm:px-6 sm:py-7 lg:px-8 dark:bg-[#0b1410] dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                <IconCloudCheck size={15} />
                Cloud Aktif
              </span>
              <span className="text-xs font-medium text-slate-400">
                LOOPPOS ENTERPRISE
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Langganan LoopPOS
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Kelola paket, pantau masa aktif, dan pilih layanan yang sesuai
              dengan kebutuhan operasional usaha kamu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center dark:border-[#293b32] dark:bg-[#111d17] dark:text-slate-200 dark:hover:bg-[#193126]"
          >
            <IconRefresh
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Menyinkronkan..." : "Sinkronkan Status"}
          </button>
        </section>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          >
            <IconAlertCircle size={21} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Data langganan belum dapat dimuat</p>
              <p className="mt-1 leading-6">{error}</p>
              <button
                type="button"
                onClick={() => void loadData()}
                className="mt-2 font-bold underline underline-offset-4"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {/* Subscription status */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-[#293b32] dark:bg-[#111d17]">
          <div className="flex flex-col justify-between gap-5 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7 dark:border-[#25372d]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <IconCalendarCheck size={25} stroke={1.8} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold">
                  Status Langganan
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Informasi terbaru dari sistem LoopPOS.
                </p>
              </div>
            </div>

            {!loading && (
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold ${statusColor()}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {statusLabel()}
              </span>
            )}
          </div>

          <div className="p-5 sm:p-7">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-[#1b2a21]"
                  />
                ))}
              </div>
            ) : subscription ? (
              <>
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Paket yang digunakan
                    </p>
                    <h3 className="mt-1 text-2xl font-extrabold capitalize tracking-tight">
                      {subscription.plan}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {isTrial
                        ? "Kamu sedang menggunakan masa percobaan LoopPOS."
                        : subscription.status === "active"
                          ? "Paket langganan kamu telah aktif."
                          : subscription.status === "pending"
                            ? "Status pembayaran masih menunggu konfirmasi."
                            : "Periksa masa berlaku paket kamu."}
                    </p>
                  </div>

                  {isSubscriptionCurrent && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <IconCircleCheck size={19} />
                      {isTrial ? "Trial berjalan" : "Paket berjalan"}
                    </div>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5 dark:border-[#293b32] dark:bg-[#17231c]">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <IconCalendarCheck size={17} />
                      <p className="text-xs font-semibold">
                        Tanggal mulai
                      </p>
                    </div>
                    <p className="mt-3 text-sm font-bold sm:text-base">
                      {formatTanggal(subscription.started_at)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5 dark:border-[#293b32] dark:bg-[#17231c]">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <IconClock size={17} />
                      <p className="text-xs font-semibold">
                        {isSubscriptionCurrent
                          ? "Sisa masa aktif"
                          : "Status masa aktif"}
                      </p>
                    </div>
                    <p className="mt-3 text-sm font-bold sm:text-base">
                      {isSubscriptionCurrent
                        ? `${remainingDays} hari lagi`
                        : "Masa aktif berakhir"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5 dark:border-[#293b32] dark:bg-[#17231c]">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <IconShieldCheck size={17} />
                      <p className="text-xs font-semibold">
                        Berlaku sampai
                      </p>
                    </div>
                    <p className="mt-3 text-sm font-bold sm:text-base">
                      {formatTanggal(subscription.expires_at)}
                    </p>
                  </div>
                </div>

                {isTrial && isSubscriptionCurrent && (
                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/25">
                    <IconSparkles
                      size={20}
                      className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-300"
                    />
                    <div>
                      <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
                        Nikmati trial gratis LoopPOS
                      </p>
                      <p className="mt-1 text-sm leading-6 text-blue-800/80 dark:text-blue-200/80">
                        Masa percobaan kamu masih berjalan. Pilih paket yang
                        sesuai untuk merencanakan kelanjutan penggunaan
                        layanan.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-[#34483b] dark:bg-[#17231c]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <IconClock size={27} />
                </div>
                <h3 className="mt-4 text-base font-extrabold">
                  Belum ada data langganan
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Trial gratis {trialDays} hari tersedia sesuai ketentuan
                  layanan. Status trial akan ditampilkan di sini setelah
                  datanya tersedia dari backend.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Plans heading */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                Paket untuk bisnis kamu
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Pilih paket yang tepat
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Mulai dari kebutuhan dasar hingga pengelolaan banyak outlet.
                Pilih layanan sesuai skala usahamu.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-[#293b32] dark:bg-[#111d17]">
              <span className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm">
                Bulanan
              </span>
              <span
                title="Paket tahunan belum tersedia"
                className="cursor-not-allowed rounded-lg px-4 py-2 text-xs font-semibold text-slate-400"
              >
                Tahunan
                <span className="ml-1.5 text-[10px]">Segera hadir</span>
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[440px] animate-pulse rounded-3xl border border-slate-200 bg-white dark:border-[#293b32] dark:bg-[#111d17]"
                />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-[#293b32] dark:bg-[#111d17] dark:text-slate-400">
              Belum ada paket yang tersedia. Coba sinkronkan data kembali.
            </div>
          ) : (
            <div className="grid items-stretch gap-5 lg:grid-cols-3">
              {plans.map((plan) => {
                const normalizedId = plan.id.toLowerCase();
                const isPopular = normalizedId === "pro";
                const PlanIcon =
                  planIcons[normalizedId] ?? IconPackage;
                const features =
                  planFeatures[normalizedId] ?? [
                    `Akses paket ${plan.name}`,
                    `Masa aktif ${plan.duration_days} hari`,
                    "Sinkronisasi cloud",
                    "Pengelolaan data usaha",
                  ];

                const isCurrent =
                  subscription?.plan.toLowerCase() === normalizedId &&
                  subscription?.status === "active" &&
                  subscription?.is_current;

                const isTrialPlan =
                  subscription?.plan.toLowerCase() === normalizedId &&
                  subscription?.status === "trialing" &&
                  subscription?.is_current;

                return (
                  <article
                    key={plan.id}
                    className={`relative flex min-w-0 flex-col rounded-3xl border bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-6 dark:bg-[#111d17] ${
                      isPopular
                        ? "border-emerald-500 shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-500/20 dark:border-emerald-700"
                        : "border-slate-200 shadow-sm hover:border-emerald-200 dark:border-[#293b32] dark:hover:border-emerald-900"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white shadow-md">
                        Paling populer
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          isPopular
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        <PlanIcon size={25} stroke={1.8} />
                      </div>

                      {(isCurrent || isTrialPlan) && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          <IconCheck size={13} />
                          {isTrialPlan ? "Trial kamu" : "Paket aktif"}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold">
                      {plan.name}
                    </h3>
                    <p className="mt-2 min-h-[44px] text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {planDescriptions[normalizedId] ??
                        `Solusi LoopPOS untuk kebutuhan usaha dengan paket ${plan.name}.`}
                    </p>

                    <div className="mt-5">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                          {formatRupiah(plan.price)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        per {plan.duration_days} hari
                      </p>
                    </div>

                    <div className="my-6 h-px bg-slate-100 dark:bg-[#293b32]" />

                    <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Fitur paket
                    </p>

                    <ul className="flex-1 space-y-3.5">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm leading-5 text-slate-600 dark:text-slate-300"
                        >
                          <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <IconCheck size={13} stroke={2.5} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => setPaymentPlan(plan)}
                      disabled={Boolean(isCurrent || isTrialPlan)}
                      className={`mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        isPopular
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/15 hover:bg-emerald-700"
                          : "border border-slate-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50 dark:border-[#34483b] dark:bg-[#17231c] dark:text-slate-100 dark:hover:bg-[#1b3024]"
                      }`}
                    >
                      {isCurrent || isTrialPlan ? (
                        <>
                          <IconCheck size={18} />
                          {isTrialPlan ? "Trial berjalan" : "Paket aktif"}
                        </>
                      ) : (
                        <>
                          Pilih paket
                          <IconArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Trust and benefits */}
        <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-5 sm:p-7 dark:border-emerald-950 dark:from-[#14281d] dark:via-[#111d17] dark:to-[#111d17]">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold">
              Bisnis lebih tenang dengan LoopPOS
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Dirancang untuk mendukung pengelolaan usaha sehari-hari.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm dark:bg-[#1b3024] dark:text-emerald-300">
                <IconLock size={21} />
              </div>
              <div>
                <p className="text-sm font-bold">Data terlindungi</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Data dikelola melalui layanan backend LoopPOS.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm dark:bg-[#1b3024] dark:text-emerald-300">
                <IconCalendarCheck size={21} />
              </div>
              <div>
                <p className="text-sm font-bold">Masa aktif transparan</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Pantau status dan tanggal berakhir paket.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm dark:bg-[#1b3024] dark:text-emerald-300">
                <IconCloudCheck size={21} />
              </div>
              <div>
                <p className="text-sm font-bold">Sinkronisasi cloud</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Status langganan diambil langsung dari server.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm dark:bg-[#1b3024] dark:text-emerald-300">
                <IconHeadset size={21} />
              </div>
              <div>
                <p className="text-sm font-bold">Bantuan pelanggan</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Hubungi admin LoopPOS untuk bantuan langganan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-5 text-center text-xs text-slate-400 sm:flex-row sm:text-left dark:border-[#293b32]">
          <p>© {new Date().getFullYear()} LoopPOS. POS Enterprise.</p>
          <p className="flex items-center gap-1.5">
            <IconShieldCheck size={15} />
            Informasi paket mengikuti data server
          </p>
        </footer>
      </div>

      {/* Payment information modal */}
      {paymentPlan && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setPaymentPlan(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-[#293b32] dark:bg-[#111d17]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-6 dark:border-[#293b32]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <IconCreditCard size={25} />
              </div>

              <button
                type="button"
                aria-label="Tutup dialog"
                onClick={() => setPaymentPlan(null)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#1b3024] dark:hover:text-white"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">
                Pilihan paket kamu
              </p>

              <h2
                id="payment-title"
                className="mt-2 text-2xl font-extrabold"
              >
                Paket {paymentPlan.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Kamu memilih paket {paymentPlan.name} seharga{" "}
                <strong className="text-slate-900 dark:text-white">
                  {formatRupiah(paymentPlan.price)}
                </strong>{" "}
                untuk {paymentPlan.duration_days} hari.
              </p>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                <div className="flex items-start gap-3">
                  <IconAlertCircle
                    size={21}
                    className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300"
                  />
                  <div>
                    <p className="text-sm font-extrabold text-amber-900 dark:text-amber-200">
                      Pembayaran belum tersedia
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-900/80 dark:text-amber-200/80">
                      Metode pembayaran belum dikonfigurasi. Belum ada
                      transaksi yang dibuat dan status langganan belum
                      berubah. Hubungi admin LoopPOS untuk memperoleh
                      instruksi pembayaran resmi.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPaymentPlan(null)}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-700"
              >
                <IconCheck size={18} />
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
