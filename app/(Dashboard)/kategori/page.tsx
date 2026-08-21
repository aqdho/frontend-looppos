"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";

export default function Kategori() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // GET KATEGORI
  const getCategories = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/kategori", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("DATA KATEGORI:", data);

      if (Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // TAMBAH KATEGORI
  const handleAddCategory = async () => {
    const token = localStorage.getItem("token");

    if (newCategory.trim() === "") {
      alert("Nama kategori harus diisi");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/kategori", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: newCategory.trim(),
        }),
      });

      const data = await res.json();

      console.log("RESPONSE TAMBAH KATEGORI:", data);

      if (!res.ok) {
        alert(data.pesan || "Gagal menambahkan kategori");
        return;
      }

      alert("Kategori berhasil ditambahkan");

      setCategories((prev) => [...prev, data.data]);

      setNewCategory("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Gagal menambahkan kategori:", error);
    }
  };

  // HAPUS KATEGORI
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");

    if (!confirm("Yakin ingin menghapus kategori ini?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/kategori/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("RESPONSE DELETE KATEGORI:", data);

      if (!res.ok) {
        alert(data.pesan || "Gagal menghapus kategori");
        return;
      }

      alert("Kategori berhasil dihapus");

      setCategories((prev) =>
        prev.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
    }
  };

  // EDIT KATEGORI
  const handleEdit = (category: any) => {
    setEditingCategory({
      id: category.id,
      nama: category.nama,
    });
  };

  // UPDATE KATEGORI
  const handleUpdate = async () => {
    if (!editingCategory) return;

    const token = localStorage.getItem("token");

    if (editingCategory.nama.trim() === "") {
      alert("Nama kategori harus diisi");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/kategori/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nama: editingCategory.nama.trim(),
          }),
        }
      );

      const data = await res.json();

      console.log("RESPONSE UPDATE KATEGORI:", data);

      if (!res.ok) {
        alert(data.pesan || "Gagal mengubah kategori");
        return;
      }

      alert("Kategori berhasil diubah");

      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id
            ? data.data
            : category
        )
      );

      setEditingCategory(null);
    } catch (error) {
      console.error("Gagal mengubah kategori:", error);
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
              Kategori
            </h1>

            <p className="mt-1 text-gray-500">
              Kelola data kategori produk
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
            Tambah Kategori
          </button>

          <LogoutButton />
        </div>
      </div>

      {/* POPUP TAMBAH */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">

            <h2 className="mb-5 text-xl font-bold">
              Tambah Kategori
            </h2>

            <input
              type="text"
              placeholder="Nama Kategori"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mb-5 w-full rounded border p-2"
            />

            <button
              onClick={handleAddCategory}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Tambah
            </button>

            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCategory("");
              }}
              className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Batal
            </button>

          </div>
        </div>
      )}

      {/* EDIT KATEGORI */}
      {editingCategory && (
        <div className="mb-6 rounded-lg border bg-white p-4 shadow">

          <h2 className="mb-4 text-lg font-bold">
            Edit Kategori
          </h2>

          <input
            type="text"
            value={editingCategory.nama}
            onChange={(e) =>
              setEditingCategory({
                ...editingCategory,
                nama: e.target.value,
              })
            }
            className="mb-3 w-full rounded border p-2"
            placeholder="Nama kategori"
          />

          <button
            onClick={handleUpdate}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Simpan
          </button>

          <button
            onClick={() => setEditingCategory(null)}
            className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Batal
          </button>

        </div>
      )}

      {/* TABEL */}
      <div className="rounded-xl bg-white p-6 shadow">

        <table className="w-full">

          <thead>
            <tr className="border-b text-left">

              <th className="p-3">
                ID
              </th>

              <th className="p-3">
                Nama Kategori
              </th>

              <th className="p-3">
                Aksi
              </th>

            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b"
              >

                <td className="p-3">
                  {category.id}
                </td>

                <td className="p-3">
                  {category.nama}
                </td>

                <td className="p-3">

                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded bg-blue-600 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(category.id)}
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