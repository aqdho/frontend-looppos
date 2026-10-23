
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  IconRefresh,
  IconCheck,
  IconCreditCard,
  IconClock,
  IconAlertCircle,
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
        // Belum ada data langganan di backend.
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
    if (!subscription) return "bg-slate-100 text-slate-600";
    if (subscription.status === "active") {
      return "bg-emerald-100 text-emerald-800";
    }
    if (subscription.status === "trialing") {
      return "bg-blue-100 text-blue-800";
    }
    if (subscription.status === "pending") {
      return "bg-amber-100 text-amber-800";
    }

    return "bg-red-100 text-red-800";
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

  return (
    <div className="min-h-screen p-4 text-[#0b1c30] sm:p-6 lg:p-8 dark:text-[#f1f5f3]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Langganan LoopPOS
            </h1>
            <p className="mt-1 text-sm text-[#64746b] dark:text-[#a7b8af]">
              Kelola masa trial dan paket langganan usaha kamu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#dce5df] bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[#eff4ff] disabled:opacity-50 dark:border-[#293b32] dark:bg-[#101a16] dark:hover:bg-[#1d3028]"
          >
            <IconRefresh size={18} />
            Muat ulang
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          >
            <IconAlertCircle size={20} className="shrink-0" />
            <div>
              <p className="font-semibold">Data langganan belum dapat dimuat</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={() => void loadData()}
                className="mt-2 font-semibold underline"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-[#e1e8e3] bg-white p-10 text-center text-sm text-[#64746b] dark:border-[#293b32] dark:bg-[#101a16] dark:text-[#a7b8af]">
            Memuat informasi langganan...
          </div>
        ) : (
          <>
            <section className="rounded-2xl border border-[#dce9e1] bg-white p-5 shadow-sm dark:border-[#293b32] dark:bg-[#101a16] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f4ec] text-[#006948] dark:bg-[#163026] dark:text-[#28b987]">
                    <IconClock size={25} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      Status langganan
                    </h2>
                    <p className="mt-1 text-sm text-[#64746b] dark:text-[#a7b8af]">
                      Informasi berdasarkan data yang tersimpan di backend.
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor()}`}
                >
                  {statusLabel()}
                </span>
              </div>

              {subscription ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-[#f8f9ff] p-4 dark:bg-[#17231e]">
                    <p className="text-xs text-[#64746b] dark:text-[#a7b8af]">
                      Paket saat ini
                    </p>
                    <p className="mt-2 text-lg font-bold capitalize">
                      {subscription.plan}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f8f9ff] p-4 dark:bg-[#17231e]">
                    <p className="text-xs text-[#64746b] dark:text-[#a7b8af]">
                      Mulai berlangganan
                    </p>
                    <p className="mt-2 font-semibold">
                      {formatTanggal(subscription.started_at)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f8f9ff] p-4 dark:bg-[#17231e]">
                    <p className="text-xs text-[#64746b] dark:text-[#a7b8af]">
                      {subscription.is_current
                        ? "Berlaku sampai"
                        : "Kedaluwarsa pada"}
                    </p>
                    <p className="mt-2 font-semibold">
                      {formatTanggal(subscription.expires_at)}
                    </p>
                    <p className="mt-1 text-xs text-[#64746b] dark:text-[#a7b8af]">
                      {subscription.is_current
                        ? `${remainingDays} hari tersisa`
                        : "Masa berlaku telah berakhir"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-[#f8f9ff] p-5 dark:bg-[#17231e]">
                  <p className="font-semibold">
                    Belum ada data langganan untuk usaha ini.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#64746b] dark:text-[#a7b8af]">
                    Trial gratis {trialDays} hari tersedia sesuai ketentuan
                    paket, tetapi masa trial belum dapat ditampilkan sebelum
                    data langganan dibuat oleh backend.
                  </p>
                </div>
              )}
            </section>

            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold">Pilih paket</h2>
                <p className="mt-1 text-sm text-[#64746b] dark:text-[#a7b8af]">
                  Harga per periode sesuai informasi dari server.
                </p>
              </div>

              {plans.length === 0 ? (
                <div className="rounded-xl border border-[#e1e8e3] bg-white p-6 text-sm dark:border-[#293b32] dark:bg-[#101a16]">
                  Belum ada paket yang tersedia.
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-3">
                  {plans.map((plan) => {
                    const isCurrent =
                      subscription?.plan === plan.id &&
                      subscription?.status === "active";

                    return (
                      <article
                        key={plan.id}
                        className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#101a16] ${
                          plan.id === "pro"
                            ? "border-[#00855d] ring-1 ring-[#00855d]/20"
                            : "border-[#e1e8e3] dark:border-[#293b32]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-bold">{plan.name}</h3>
                          {plan.id === "pro" && (
                            <span className="rounded-full bg-[#e5f4ec] px-2.5 py-1 text-[11px] font-bold text-[#006948] dark:bg-[#163026] dark:text-[#28b987]">
                              Populer
                            </span>
                          )}
                        </div>

                        <div className="mt-4">
                          <p className="text-2xl font-bold tracking-tight">
                            {formatRupiah(plan.price)}
                          </p>
                          <p className="mt-1 text-xs text-[#64746b] dark:text-[#a7b8af]">
                            per {plan.duration_days} hari
                          </p>
                        </div>

                        <div className="my-5 h-px bg-[#e1e8e3] dark:bg-[#293b32]" />

                        <ul className="flex-1 space-y-3 text-sm text-[#3d4a42] dark:text-[#c7d3cd]">
                          <li className="flex items-center gap-2">
                            <IconCheck
                              size={18}
                              className="shrink-0 text-[#00855d]"
                            />
                            Akses sesuai paket {plan.name}
                          </li>
                          <li className="flex items-center gap-2">
                            <IconCheck
                              size={18}
                              className="shrink-0 text-[#00855d]"
                            />
                            Masa aktif {plan.duration_days} hari
                          </li>
                        </ul>

                        <button
                          type="button"
                          onClick={() => setPaymentPlan(plan)}
                          disabled={isCurrent}
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#00855d] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#006948] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <IconCreditCard size={18} />
                          {isCurrent ? "Paket aktif" : "Pilih paket"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {paymentPlan && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPaymentPlan(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#101a16]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f4ec] text-[#006948] dark:bg-[#163026] dark:text-[#28b987]">
              <IconCreditCard size={25} />
            </div>

            <h2 id="payment-title" className="mt-4 text-xl font-bold">
              Informasi pembayaran manual
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#64746b] dark:text-[#a7b8af]">
              Kamu memilih paket {paymentPlan.name} seharga{" "}
              <strong>{formatRupiah(paymentPlan.price)}</strong> untuk{" "}
              {paymentPlan.duration_days} hari.
            </p>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              Instruksi rekening atau metode pembayaran belum dikonfigurasi.
              Belum ada transaksi yang dibuat dan status langganan belum
              berubah. Hubungi admin LoopPOS untuk mendapatkan instruksi
              pembayaran resmi.
            </div>

            <button
              type="button"
              onClick={() => setPaymentPlan(null)}
              className="mt-5 w-full rounded-lg bg-[#00855d] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#006948]"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
