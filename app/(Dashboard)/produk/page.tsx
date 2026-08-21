"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";

export default function Produk() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
  nama: "",
  qty: "",
  id_kategori: "",
});

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("ISI PRODUK:", JSON.stringify(data.data, null, 2));

        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error("Gagal mengambil data:", error);
        setProducts([]);
      });

    fetch("http://localhost:3000/kategori", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("RESPONSE KATEGORI:", data);

        if (Array.isArray(data.data)) {
          setCategories(data.data);
        }
      })
      .catch((error) => {
        console.error("Gagal mengambil kategori:", error);
      });
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("RESPONSE DELETE:", data);

      if (!res.ok) {
        alert(data.pesan || "Gagal menghapus produk");
        return;
      }

      alert("Produk berhasil dihapus");

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct({
      id: product.id,
      nama: product.nama,
      qty: product.qty,
      id_kategori: product.id_kategori,
    });
  };

  const handleAddProduct = async () => {
  const token = localStorage.getItem("token");

  // Validasi nama
  if (newProduct.nama.trim() === "") {
    alert("Nama produk wajib diisi");
    return;
  }

  // Validasi qty
  if (newProduct.qty === "" || Number(newProduct.qty) <= 0) {
    alert("Qty harus lebih dari 0");
    return;
  }

  // Validasi kategori
  if (newProduct.id_kategori === "") {
    alert("Kategori wajib dipilih");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nama: newProduct.nama.trim(),
        qty: Number(newProduct.qty),
        id_kategori: Number(newProduct.id_kategori),
      }),
    });

    const data = await res.json();

    console.log("RESPONSE TAMBAH:", data);

    if (!res.ok) {
      alert(data.pesan || "Gagal menambahkan produk");
      return;
    }

    alert("Produk berhasil ditambahkan");

    // Ambil data terbaru supaya nama kategori langsung muncul
    const produkRes = await fetch("http://localhost:3000/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const produkData = await produkRes.json();

    if (Array.isArray(produkData.data)) {
      setProducts(produkData.data);
    }

    setNewProduct({
      nama: "",
      qty: "",
      id_kategori: "",
    });

    setShowAddForm(false);

  } catch (error) {
    console.error("Gagal menambahkan produk:", error);
  }
};

  const handleUpdate = async () => {
    if (!editingProduct) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:3000/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nama: editingProduct.nama,
            qty: editingProduct.qty,
            id_kategori: editingProduct.id_kategori,
          }),
        }
      );

      const data = await res.json();

      console.log("RESPONSE UPDATE:", data);

      if (!res.ok) {
        alert(data.pesan || "Gagal mengubah produk");
        return;
      }

      alert("Produk berhasil diubah");

      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                nama: data.data.nama,
                qty: data.data.qty,
                id_kategori: data.data.id_kategori,
              }
            : product
        )
      );

      setEditingProduct(null);
    } catch (error) {
      console.error("Gagal mengubah produk:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Produk
            </h1>

            <p className="mt-1 text-gray-500">
              Kelola data produk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Tambah Produk
          </button>

          <LogoutButton />
        </div>
      </div>

      {/* POPUP TAMBAH PRODUK */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">

            <h2 className="mb-5 text-xl font-bold">
              Tambah Produk
            </h2>

            <input
              type="text"
              placeholder="Nama Produk"
            value={newProduct.nama}
              onChange={(e) =>
             setNewProduct({
            ...newProduct,
            nama: e.target.value,
            })
          }
            className="mb-3 w-full rounded border p-2"
          />

           <input
                  type="number"
                   placeholder="Qty"
                  value={newProduct.qty}
                  onChange={(e) =>
                setNewProduct({
                  ...newProduct,
               qty: e.target.value,
              })
           }
             className="mb-3 w-full rounded border p-2"
              />

            <select
            value={newProduct.id_kategori}
              onChange={(e) =>
            setNewProduct({
              ...newProduct,
            id_kategori: e.target.value,
            })
          }
            className="mb-5 w-full rounded border p-2"
          >
              <option value="">Pilih Kategori</option>

          {categories.map((category) => (
        <option key={category.id} value={category.id}>
      {category.nama}
    </option>
  ))}
</select>

            <button
              onClick={handleAddProduct}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Tambah
            </button>

            <button
              onClick={() => setShowAddForm(false)}
              className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Batal
            </button>

          </div>
        </div>
      )}

      
      {/* EDIT PRODUK */}
{editingProduct && (
  <div className="mb-6 rounded-lg border bg-white p-4 shadow">
    <h2 className="mb-4 text-lg font-bold">
      Edit Produk
    </h2>

    {/* Nama Produk */}
    <input
      type="text"
      value={editingProduct.nama}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          nama: e.target.value,
        })
      }
      className="mb-3 w-full rounded border p-2"
      placeholder="Nama produk"
    />

    {/* Qty */}
    <input
      type="number"
      value={editingProduct.qty}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          qty: Number(e.target.value),
        })
      }
      className="mb-3 w-full rounded border p-2"
      placeholder="Qty"
    />

    {/* Kategori */}
    <select
      value={editingProduct.id_kategori}
      onChange={(e) =>
        setEditingProduct({
          ...editingProduct,
          id_kategori: Number(e.target.value),
        })
      }
      className="mb-3 w-full rounded border p-2"
    >
      <option value="">Pilih Kategori</option>

      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.nama}
        </option>
      ))}
    </select>

    {/* Tombol */}
    <button
      onClick={handleUpdate}
      className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
    >
      Simpan
    </button>

    <button
      onClick={() => setEditingProduct(null)}
      className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
    >
      Batal
    </button>
  </div>
)}

      {/* TABEL PRODUK */}
      <div className="rounded-xl bg-white p-6 shadow">

        <table className="w-full">

          <thead>
            <tr className="border-b text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">

                <td className="p-3">
                  {product.id}
                </td>

                <td className="p-3">
                  {product.nama}
                </td>

                <td className="p-3">
                  Rp {product.harga}
                </td>

                <td className="p-3">
                  {product.qty}
                </td>

                <td className="p-3">
                  {product.nama_kategori}
                </td>

                <td className="p-3">

                  <button
                    onClick={() => handleEdit(product)}
                    className="rounded bg-blue-600 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="ml-2 rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Hapus
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}