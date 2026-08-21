"use client";

import { useEffect, useState } from "react";

type Produk = {
  id: number;
  nama: string;
  qty: number;
  harga: number;
};

type Keranjang = Produk & {
  jumlah: number;
};

export default function TransaksiPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [keranjang, setKeranjang] = useState<Keranjang[]>([]);
  const [loading, setLoading] = useState(true);

  const total = keranjang.reduce(
    (total, item) => total + item.jumlah * item.harga,
    0
  );

  // Ambil data produk
  const getProduk = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("ISI PRODUK:", JSON.stringify(data.data, null, 2));

      setProduk(data.data || []);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduk();
  }, []);

  // Tambah produk ke keranjang
  const tambahKeKeranjang = (item: Produk) => {
    setKeranjang((prev) => {
      const sudahAda = prev.find((p) => p.id === item.id);

      if (sudahAda) {
        // Jangan melebihi stok
        if (sudahAda.jumlah >= item.qty) {
          return prev;
        }

        return prev.map((p) =>
          p.id === item.id
            ? { ...p, jumlah: p.jumlah + 1 }
            : p
        );
      }

      return [...prev, { ...item, jumlah: 1 }];
    });
  };

  // Tambah jumlah
  const tambahJumlah = (id: number) => {
    setKeranjang((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (item.jumlah >= item.qty) {
          return item;
        }

        return {
          ...item,
          jumlah: item.jumlah + 1,
        };
      })
    );
  };

  // Kurangi jumlah
  const kurangiJumlah = (id: number) => {
    setKeranjang((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, jumlah: item.jumlah - 1 }
            : item
        )
        .filter((item) => item.jumlah > 0)
    );
  };

  // Bayar
  const bayar = async () => {
    if (keranjang.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }

    try {
      // 1. Buat transaksi
      const resTransaksi = await fetch(
        "http://localhost:3000/transaksi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tanggal: new Date().toISOString(),
            total: total,
          }),
        }
      );

      const dataTransaksi = await resTransaksi.json();

      if (!resTransaksi.ok) {
        alert(dataTransaksi.pesan || "Gagal membuat transaksi");
        return;
      }

      const transaksiId = dataTransaksi.data.id;

      // 2. Simpan detail transaksi
      for (const item of keranjang) {
        const resDetail = await fetch(
          "http://localhost:3000/transaksi-detail",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transaksi_id: transaksiId,
              produk_id: item.id,
              qty: item.jumlah,
              harga: item.harga,
            }),
          }
        );

        const dataDetail = await resDetail.json();

        if (!resDetail.ok) {
          alert(
            dataDetail.pesan ||
              "Gagal menyimpan detail transaksi"
          );
          return;
        }
      }

      // 3. Transaksi berhasil
      alert("Transaksi berhasil!");

      // 4. Kosongkan keranjang
      setKeranjang([]);

      // 5. Ambil ulang produk
      // supaya stok langsung berubah tanpa refresh
      await getProduk();

    } catch (error) {
      console.error("ERROR BAYAR:", error);
      alert("Terjadi kesalahan saat melakukan transaksi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Transaksi
        </h1>

        <p className="mt-1 text-gray-500">
          Pilih produk untuk membuat transaksi
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* DAFTAR PRODUK */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">
              Daftar Produk
            </h2>

            {loading ? (
              <p className="text-gray-500">
                Memuat produk...
              </p>
            ) : produk.length === 0 ? (
              <p className="text-gray-500">
                Belum ada produk.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {produk.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.nama}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Stok: {item.qty}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      Harga: Rp {item.harga.toLocaleString("id-ID")}
                    </p>

                    <button
                      onClick={() => tambahKeKeranjang(item)}
                      disabled={item.qty <= 0}
                      className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      + Tambah
                    </button>
                  </div>
                ))}

              </div>
            )}

          </div>
        </div>

        {/* KERANJANG */}
        <div>
          <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">
              Keranjang
            </h2>

            {keranjang.length === 0 ? (
              <p className="text-gray-500">
                Belum ada produk.
              </p>
            ) : (
              <div className="space-y-4">

                {keranjang.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-200 pb-4"
                  >
                    <p className="font-semibold">
                      {item.nama}
                    </p>

                    <p className="text-sm text-gray-500">
                      Rp {item.harga.toLocaleString("id-ID")}
                    </p>

                    <div className="mt-2 flex items-center gap-3">

                      <button
                        onClick={() => kurangiJumlah(item.id)}
                        className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
                      >
                        -
                      </button>

                      <span>
                        {item.jumlah}
                      </span>

                      <button
                        onClick={() => tambahJumlah(item.id)}
                        disabled={item.jumlah >= item.qty}
                        className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
                      >
                        +
                      </button>

                    </div>
                  </div>
                ))}

                {/* TOTAL */}
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold">
                      Total
                    </span>

                    <span className="font-bold">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* BAYAR */}
                <button
                  onClick={bayar}
                  className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
                >
                  Bayar
                </button>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}