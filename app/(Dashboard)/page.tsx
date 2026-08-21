'use client'

import LogoutButton from "../components/LogoutButton"

export default function Home() {
  return (
    <div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h2>

          <p className="mt-1 text-gray-500">
            Selamat datang di aplikasi kasir
          </p>
        </div>

        <LogoutButton />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Produk
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            0
          </h3>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Transaksi Hari Ini
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            0
          </h3>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Penjualan Hari Ini
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            Rp 0
          </h3>
        </div>

      </div>

      {/* Transaksi Terbaru */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-bold">
          Transaksi Terbaru
        </h3>

        <p className="text-gray-500">
          Belum ada transaksi.
        </p>
      </div>

    </div>
  );
}