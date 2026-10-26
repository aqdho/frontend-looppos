"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import * as XLSX from "xlsx";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRouter } from "next/navigation";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

const API_URL = "/api";

/* ========================================================= */
/* ICON */
/* ========================================================= */

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4V19a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1A2 2 0 0 0 3.6 11H3.5a2 2 0 0 1 0-4h.2a2 2 0 0 0 1.4-3.4l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1A2 2 0 0 0 11.3 2h.2a2 2 0 0 1 4 0v.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1A2 2 0 0 0 20.4 10h.1a2 2 0 0 1 0 4h-.1a2 2 0 0 0-1 1Z" />
        </svg>
      );

    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 4v12" />
          <path d="m17 11-5 5-5-5" />
          <path d="M5 20h14" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "scan":
      return (
        <svg {...common}>
          <path d="M4 7V5a1 1 0 0 1 1-1h2" />
          <path d="M17 4h2a1 1 0 0 1 1 1v2" />
          <path d="M20 17v2a1 1 0 0 1-1 1h-2" />
          <path d="M7 20H5a1 1 0 0 1-1-1v-2" />
          <path d="M7 12h10" />
        </svg>
      );

    case "box":
      return (
        <svg {...common}>
          <path d="m21 8-9 5-9-5 9-5 9 5Z" />
          <path d="M3 8v8l9 5 9-5V8" />
          <path d="M12 13v8" />
        </svg>
      );

    case "alert":
      return (
        <svg {...common}>
          <path d="M10.3 3.7 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );

    case "wallet":
      return (
        <svg {...common}>
          <path d="M4 6h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
          <path d="M16 13h5" />
          <path d="M16 13a2 2 0 1 0 0 4h1" />
          <path d="M4 6V4h14" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
      );

    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M6 7l1 13h10l1-13" />
          <path d="M9 7V4h6v3" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "chevron-left":
      return (
        <svg {...common}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );

    case "chevron-right":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    case "chevron-up":
      return (
        <svg {...common}>
          <path d="m6 15 6-6 6 6" />
        </svg>
      );

    case "chevron-down":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "qr":
      return (
        <svg {...common}>
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
          <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" />
        </svg>
      );

    case "folder":
      return (
        <svg {...common}>
          <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
        </svg>
      );

    case "image":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="m21 15-5-5L5 20" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

/* ========================================================= */
/* CUSTOM CHECKBOX */
/* ========================================================= */

function CustomCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all ${
        checked
          ? "border-[#006948] bg-[#006948] text-white"
          : "border-[#6d7a72] bg-white text-transparent hover:border-[#006948]"
      }`}
    >
      {checked && (
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      )}
    </button>
  );
}

/* ========================================================= */
/* MAIN */
/* ========================================================= */

export default function Produk() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] =
    useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] =
    useState(false);
  const [showImportForm, setShowImportForm] =
    useState(false);
  const [showStockHistory, setShowStockHistory] =
    useState(false);
  const [stockMovements, setStockMovements] =
    useState<any[]>([]);
  const [loadingStockMovements, setLoadingStockMovements] =
    useState(false);
  const [importFile, setImportFile] =
    useState<File | null>(null);
  const [importData, setImportData] =
    useState<any[]>([]);
  const [importErrors, setImportErrors] =
    useState<string[]>([]);
  const [currentPage, setCurrentPage] =
    useState(1);
  const productPage = 10;
  const [searchQuery, setSearchQuery] =
    useState("");
  const [stockFilter, setStockFilter] =
    useState<"all" | "low" | "out">("all");
  const [categoryFilter, setCategoryFilter] =
    useState<number | "all">("all");
  const [selectedProducts, setSelectedProducts] =
    useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nama: "",
    qty: "",
    harga: "",
    harga_modal: "",
    id_kategori: "",
    gambar: null as File | null,
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadStockMovements = async () => {
    setLoadingStockMovements(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/products/stock-movements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.pesan || "Gagal mengambil riwayat stok."
        );
      }

      setStockMovements(
        Array.isArray(result.data) ? result.data : []
      );
    } catch (error) {
      console.error("Gagal mengambil riwayat stok:", error);
      alert("Riwayat stok gagal dimuat. Periksa koneksi server.");
    } finally {
      setLoadingStockMovements(false);
    }
  };

  /* ========================================================= */
  /* LOAD PRODUCTS */
  /* ========================================================= */

  const loadProducts = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setProducts([]);
    }
  };

  /* ========================================================= */
  /* LOAD CATEGORIES */
  /* ========================================================= */

  const loadCategories = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/kategori`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    }
  };

  /* ========================================================= */
  /* IMPORT FILE */
  /* ========================================================= */

  const handleImportFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data, {
        type: "array",
      });

      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        setImportData([]);
        return;
      }

      const worksheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(worksheet);

      setImportData(rows);
      setImportErrors([]);
    } catch (error) {
      console.error("GAGAL MEMBACA FILE:", error);

      setImportData([]);
      setImportErrors([
        "File tidak dapat dibaca. Pastikan format Excel atau CSV benar.",
      ]);
    }
  };

  const validateImportData = (data: any[]) => {
    const errors: string[] = [];

    if (data.length === 0) {
      errors.push("File tidak memiliki data produk.");
      return errors;
    }

    data.forEach((item, index) => {
      const row = index + 2;

      if (
        !item["Nama Produk"] ||
        String(item["Nama Produk"]).trim() === ""
      ) {
        errors.push(`Baris ${row}: Nama Produk kosong`);
      }

      if (
        item["Stok"] === undefined ||
        item["Stok"] === "" ||
        isNaN(Number(item["Stok"]))
      ) {
        errors.push(`Baris ${row}: Stok tidak valid`);
      }

      if (
        item["Harga"] === undefined ||
        item["Harga"] === "" ||
        isNaN(Number(item["Harga"]))
      ) {
        errors.push(`Baris ${row}: Harga tidak valid`);
      }

      const categoryName = String(item["Kategori"] ?? "")
        .trim()
        .toLowerCase();

      const matchedCategory = categories.find(
        (cat) =>
          String(cat.nama).trim().toLowerCase() ===
          categoryName
      );

      if (!matchedCategory) {
        errors.push(`Baris ${row}: Kategori tidak ditemukan`);
      }
    });

    return errors;
  };

  const handleImport = async () => {
    const errors = validateImportData(importData);

    setImportErrors(errors);

    if (errors.length > 0) {
      return;
    }

    const dataToImport = importData.map((item) => {
      const category = categories.find(
        (category) =>
          String(category.nama).trim().toLowerCase() ===
          String(item["Kategori"] ?? "")
            .trim()
            .toLowerCase()
      );

      return {
        nama: String(item["Nama Produk"]).trim(),
        qty: Number(item["Stok"]),
        harga: Number(item["Harga"]),
        harga_modal:
          item["Harga Modal"] === undefined ||
          item["Harga Modal"] === ""
            ? 0
            : Number(item["Harga Modal"]),
        id_kategori: category.id,
      };
    });

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/products/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: dataToImport,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.pesan || "Gagal mengimport produk");
        return;
      }

      alert("Produk berhasil diimport");

      setImportFile(null);
      setImportData([]);
      setImportErrors([]);
      setShowImportForm(false);

      await loadProducts();
      setCurrentPage(1);
    } catch (error) {
      console.error("GAGAL IMPORT:", error);

      alert("Terjadi kesalahan saat import produk");
    }
  };

  /* ========================================================= */
  /* DELETE */
  /* ========================================================= */

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.pesan || "Gagal menghapus produk");
        return;
      }

      alert("Produk berhasil dihapus");

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );

      setSelectedProducts((prev) =>
        prev.filter((productId) => productId !== id)
      );

      setCurrentPage((prev) => {
        const newTotalPages = Math.ceil(
          Math.max(products.length - 1, 0) / productPage
        );

        return Math.min(
          prev,
          Math.max(newTotalPages, 1)
        );
      });
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  };

  /* ========================================================= */
  /* EDIT */
  /* ========================================================= */

  const handleEdit = (product: any) => {
    setEditingProduct({
      id: product.id,
      nama: product.nama,
      qty: product.qty,
      harga_modal: Number(product.harga_modal ?? 0),
      id_kategori: product.id_kategori,
      gambar: null,
      gambarLama: product.gambar || null,
    });
  };

  /* ========================================================= */
  /* FORMAT */
  /* ========================================================= */

  const formatHarga = (value: string) => {
    const angka = value.replace(/\D/g, "");

    if (!angka) {
      return "";
    }

    return Number(angka).toLocaleString("id-ID");
  };

  /* ========================================================= */
  /* ADD PRODUCT */
  /* ========================================================= */

  const handleAddProduct = async () => {
    const token = localStorage.getItem("token");

    if (newProduct.nama.trim() === "") {
      alert("Nama produk wajib diisi");
      return;
    }

    if (
      newProduct.qty === "" ||
      Number(newProduct.qty) <= 0
    ) {
      alert("Qty harus lebih dari 0");
      return;
    }

    if (
      newProduct.harga === "" ||
      Number(newProduct.harga.replace(/\./g, "")) <= 0
    ) {
      alert("Harga harus lebih dari 0");
      return;
    }

    if (newProduct.harga_modal === "") {
      alert("Harga modal / HPP wajib diisi");
      return;
    }

    if (
      Number(
        newProduct.harga_modal.replace(/\./g, "")
      ) < 0
    ) {
      alert("Harga modal tidak boleh kurang dari 0");
      return;
    }

    if (newProduct.id_kategori === "") {
      alert("Kategori wajib dipilih");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "nama",
        newProduct.nama.trim()
      );

      formData.append(
        "qty",
        String(Number(newProduct.qty))
      );

      formData.append(
        "harga",
        String(
          Number(
            newProduct.harga.replace(/\./g, "")
          )
        )
      );

      formData.append(
        "harga_modal",
        String(
          Number(
            newProduct.harga_modal.replace(/\./g, "")
          )
        )
      );

      formData.append(
        "id_kategori",
        String(
          Number(newProduct.id_kategori)
        )
      );

      if (newProduct.gambar) {
        formData.append(
          "gambar",
          newProduct.gambar
        );
      }

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.pesan ||
            "Gagal menambahkan produk"
        );
        return;
      }

      alert("Produk berhasil ditambahkan");

      await loadProducts();
      setCurrentPage(1);

      setNewProduct({
        nama: "",
        qty: "",
        harga: "",
        harga_modal: "",
        id_kategori: "",
        gambar: null,
      });

      setShowAddForm(false);
    } catch (error) {
      console.error(
        "Gagal menambahkan produk:",
        error
      );
    }
  };

  /* ========================================================= */
  /* UPDATE */
  /* ========================================================= */

  const handleUpdate = async () => {
    if (!editingProduct) {
      return;
    }

    if (
      String(editingProduct.nama || "").trim() === ""
    ) {
      alert("Nama produk wajib diisi");
      return;
    }

    if (Number(editingProduct.qty) <= 0) {
      alert("Qty harus lebih dari 0");
      return;
    }

    if (
      editingProduct.harga_modal === undefined ||
      editingProduct.harga_modal === null ||
      String(editingProduct.harga_modal).trim() === ""
    ) {
      alert("Harga modal / HPP wajib diisi");
      return;
    }

    if (
      Number(
        String(editingProduct.harga_modal).replace(
          /\./g,
          ""
        )
      ) < 0
    ) {
      alert(
        "Harga modal tidak boleh kurang dari 0"
      );
      return;
    }

    if (!editingProduct.id_kategori) {
      alert("Kategori wajib dipilih");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append(
      "nama",
      String(editingProduct.nama).trim()
    );

    formData.append(
      "qty",
      String(editingProduct.qty)
    );

    formData.append(
      "harga_modal",
      String(
        Number(
          String(editingProduct.harga_modal).replace(
            /\./g,
            ""
          )
        )
      )
    );

    formData.append(
      "id_kategori",
      String(editingProduct.id_kategori)
    );

    if (editingProduct.gambar) {
      formData.append(
        "gambar",
        editingProduct.gambar
      );
    }

    try {
      const res = await fetch(
        `${API_URL}/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.pesan ||
            "Gagal mengubah produk"
        );
        return;
      }

      alert("Produk berhasil diubah");

      await loadProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error(
        "Gagal mengubah produk:",
        error
      );
    }
  };

  /* ========================================================= */
  /* FILTER */
  /* ========================================================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        query === "" ||
        String(product.nama || "")
          .toLowerCase()
          .includes(query) ||
        String(product.id || "")
          .toLowerCase()
          .includes(query) ||
        String(product.nama_kategori || "")
          .toLowerCase()
          .includes(query);

      const qty = Number(product.qty || 0);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" &&
          qty > 0 &&
          qty <= 5) ||
        (stockFilter === "out" &&
          qty <= 0);

      const matchesCategory =
        categoryFilter === "all" ||
        Number(product.id_kategori) ===
          Number(categoryFilter);

      return (
        matchesSearch &&
        matchesStock &&
        matchesCategory
      );
    });
  }, [
    products,
    searchQuery,
    stockFilter,
    categoryFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    stockFilter,
    categoryFilter,
  ]);

  /* ========================================================= */
  /* PAGINATION */
  /* ========================================================= */

  const totalPages = Math.ceil(
    filteredProducts.length / productPage
  );

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const startIndex =
    (safeCurrentPage - 1) *
    productPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productPage
    );

  /* ========================================================= */
  /* STATISTICS */
  /* ========================================================= */

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.qty || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) => {
      const qty = Number(product.qty || 0);

      return qty > 0 && qty <= 5;
    }
  );

  const outOfStockProducts = products.filter(
    (product) =>
      Number(product.qty || 0) <= 0
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total +
      Number(product.harga || 0) *
        Number(product.qty || 0),
    0
  );

  /* ========================================================= */
  /* SELECT */
  /* ========================================================= */

  const toggleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter(
            (productId) =>
              productId !== id
          )
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const visibleIds =
      currentProducts.map(
        (product) => product.id
      );

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) =>
        selectedProducts.includes(id)
      );

    if (allSelected) {
      setSelectedProducts((prev) =>
        prev.filter(
          (id) =>
            !visibleIds.includes(id)
        )
      );
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        ...visibleIds.filter(
          (id) => !prev.includes(id)
        ),
      ]);
    }
  };

  const allCurrentSelected =
    currentProducts.length > 0 &&
    currentProducts.every((product) =>
      selectedProducts.includes(
        product.id
      )
    );

  /* ========================================================= */
  /* CATEGORY */
  /* ========================================================= */

  const getCategoryName = (product: any) => {
    if (product.nama_kategori) {
      return product.nama_kategori;
    }

    const category = categories.find(
      (cat) =>
        Number(cat.id) ===
        Number(product.id_kategori)
    );

    return category?.nama || "-";
  };

  /* ========================================================= */
  /* STOCK STATUS */
  /* ========================================================= */

  const getStockStatus = (qty: number) => {
    if (qty <= 0) {
      return {
        label: "Habis",
        text: "Stok Habis",
        className:
          "bg-[#ffdad6] text-[#ba1a1a]",
        bar: "bg-[#ba1a1a]",
      };
    }

    if (qty <= 5) {
      return {
        label: "Rendah",
        text: `Tersisa ${qty} Unit`,
        className:
          "bg-[#ffdad6] text-[#ba1a1a]",
        bar: "bg-[#ba1a1a]",
      };
    }

    return {
      label: "Aman",
      text: `${qty} Unit`,
      className:
        "bg-[#d8f8e7] text-[#006948]",
      bar: "bg-[#00855d]",
    };
  };

  const formatRupiah = (value: number) => {
    return `Rp ${Number(
      value || 0
    ).toLocaleString("id-ID")}`;
  };

  /* ========================================================= */
  /* EXPORT */
  /* ========================================================= */

  const exportExcel = () => {
    const rows = filteredProducts.map(
      (product) => ({
        "Nama Produk":
          product.nama || "",
        "ID Produk":
          product.id || "",
        Kategori:
          getCategoryName(product),
        Stok: Number(
          product.qty || 0
        ),
        Harga: Number(
          product.harga || 0
        ),
        "Harga Modal":
          Number(
            product.harga_modal || 0
          ),
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Produk"
    );

    XLSX.writeFile(
      workbook,
      "data-produk.xlsx"
    );
  };

  /* ========================================================= */
  /* RENDER */
  /* ========================================================= */

  return (
    <main
      className={`${plusJakarta.className} min-h-screen bg-[#f8f9ff] text-[#0b1c30]`}
    >
      <div className="w-full px-3 py-4 sm:px-5 sm:py-5 lg:px-6 xl:px-8">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4 sm:gap-5">

         {/* HEADER */}
<section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">

  {/* TITLE */}
  <div className="min-w-0">
    <div className="mb-2 flex flex-wrap items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#6d7a72] sm:text-[10px]">
      <span>
        Inventaris Master
      </span>

      <span className="text-[#bccac0]">
        /
      </span>

      <span className="text-[#006948]">
        Katalog Produk POS
      </span>
    </div>

    <h1 className="text-[23px] font-extrabold leading-tight tracking-[-0.03em] text-[#0b1c30] sm:text-[28px] lg:text-[32px]">
      Produk & Manajemen
      Kategori
    </h1>

    <p className="mt-2 max-w-3xl text-[11px] font-medium leading-5 text-[#6d7a72] sm:text-[13px]">
      Kelola produk, harga jual,
      kategori, dan pantau
      persediaan toko secara
      realtime.
    </p>
  </div>

  {/* ACTION BUTTONS */}
  <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:w-auto xl:flex-row xl:flex-wrap xl:items-center xl:justify-end">

    {/* RIWAYAT STOK */}
    <button
      type="button"
      onClick={() => {
        setShowStockHistory(true);
        void loadStockMovements();
      }}
      className="order-0 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#cfe5d8] bg-[#eff8f2] px-3.5 text-[11px] font-extrabold text-[#006948] transition hover:bg-[#e2f3e9] sm:w-auto sm:justify-self-end"
    >
      <Icon name="clock" size={15}/>
      Riwayat Pergerakan Stok
    </button>

    {/* TAMBAH PRODUK */}
    <button
      type="button"
      onClick={() =>
        setShowAddForm(true)
      }
      className="order-1 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#006948] px-4 text-[11px] font-extrabold text-white shadow-[0_5px_14px_rgba(0,105,72,0.22)] transition hover:bg-[#00583d] active:scale-[0.98] sm:col-span-2 sm:justify-self-end sm:w-auto xl:order-3 xl:col-span-1"
    >
      <PlusIcon />

      Tambah Produk Baru
    </button>

    {/* IMPORT CSV */}
    <button
      type="button"
      onClick={() =>
        setShowImportForm(true)
      }
      className="order-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#e1e8e3] bg-white px-3.5 text-[11px] font-extrabold text-[#3d4a42] shadow-[0_2px_8px_rgba(11,28,48,0.04)] transition hover:border-[#a9c7b7] hover:bg-[#f5faf7] sm:w-auto sm:justify-self-end xl:order-2"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#eff7f2] text-[#006948]">
        <Icon
          name="upload"
          size={14}
        />
      </span>

      Import Data CSV
    </button>

    {/* KELOLA KATEGORI */}
    <button
      type="button"
      onClick={() =>
        router.push("/kategori")
      }
      className="order-3 group flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#dce8e1] bg-white px-3.5 text-[11px] font-extrabold text-[#3d4a42] shadow-[0_2px_8px_rgba(11,28,48,0.04)] transition hover:border-[#8fbea6] hover:bg-[#f3faf6] hover:text-[#006948] sm:w-auto sm:justify-self-end xl:order-1"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#e8f7ef] text-[#006948] transition group-hover:bg-[#d8f1e4]">
        <Icon
          name="settings"
          size={14}
        />
      </span>

      Kelola Kategori

      <Icon
        name="chevron-right"
        size={13}
        className="text-[#8a9790] transition group-hover:translate-x-0.5 group-hover:text-[#006948]"
      />
    </button>

  </div>
</section>

          {/* SUMMARY */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard
              label="Total SKU Terdaftar"
              value={products.length}
              suffix="Produk Aktif"
              badge={`${totalStock} unit stok`}
              badgeText="Terdaftar"
              icon="box"
              tone="green"
            />

            <SummaryCard
              label="Perlu Restok Segera"
              value={
                lowStockProducts.length +
                outOfStockProducts.length
              }
              suffix="Item Kritis"
              badge={`${outOfStockProducts.length} habis`}
              badgeText={`${lowStockProducts.length} menipis`}
              icon="alert"
              tone="red"
            />

            <SummaryCard
              label="Total Nilai Aset Inventaris"
              value={formatRupiah(
                inventoryValue
              )}
              suffix=""
              badge="Berdasarkan harga jual"
              badgeText=""
              icon="wallet"
              tone="green"
              large
            />
          </section>

          {/* SEARCH */}
          <section className="rounded-xl border border-[#e3eaf0] bg-white p-3 shadow-[0_3px_12px_rgba(11,28,48,0.035)] sm:p-3.5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="relative w-full xl:max-w-[620px]">
                  <Icon
                    name="search"
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718078]"
                  />

                  <input
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(
                        e.target.value
                      )
                    }
                    placeholder="Cari SKU, nama produk, atau barcode..."
                    className="h-10 w-full rounded-lg border border-transparent bg-[#eff4ff] pl-10 pr-16 text-[11px] font-semibold text-[#0b1c30] outline-none transition placeholder:text-[#87949e] focus:border-[#8bc5a9] focus:bg-white focus:ring-4 focus:ring-[#006948]/5"
                  />
                </div>

                <div className="hidden h-10 shrink-0 items-center gap-2 rounded-lg bg-[#eff4ff] px-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#59675f] lg:flex">
                  <Icon
                    name="scan"
                    size={16}
                    className="text-[#006948]"
                  />

                  <span>
                    Scan Aktif
                  </span>

                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10a66e] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10a66e]" />
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center xl:w-auto">
                <div className="flex h-9 w-full items-center overflow-x-auto rounded-lg bg-[#eff4ff] p-1 sm:w-auto">
                  <StockFilterButton
                    active={
                      stockFilter === "all"
                    }
                    onClick={() =>
                      setStockFilter("all")
                    }
                  >
                    Semua
                  </StockFilterButton>

                  <StockFilterButton
                    active={
                      stockFilter === "low"
                    }
                    onClick={() =>
                      setStockFilter("low")
                    }
                  >
                    Stok Rendah
                    <span className="ml-1 text-[#ba1a1a]">
                      (
                      {
                        lowStockProducts.length
                      }
                      )
                    </span>
                  </StockFilterButton>

                  <StockFilterButton
                    active={
                      stockFilter === "out"
                    }
                    onClick={() =>
                      setStockFilter("out")
                    }
                  >
                    Habis
                    <span className="ml-1 text-[#ba1a1a]">
                      (
                      {
                        outOfStockProducts.length
                      }
                      )
                    </span>
                  </StockFilterButton>
                </div>

                <button
                  type="button"
                  onClick={exportExcel}
                  className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#dfe7e3] bg-white px-3 text-[10px] font-extrabold text-[#3d4a42] transition hover:bg-[#f5faf7] sm:w-auto"
                >
                  <Icon
                    name="download"
                    size={15}
                    className="text-[#006948]"
                  />

                  <span>
                    Download Excel
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* CATEGORY */}
          <section className="flex items-center gap-2 overflow-x-auto pb-1">
            <CategoryPill
              active={
                categoryFilter === "all"
              }
              count={products.length}
              onClick={() =>
                setCategoryFilter("all")
              }
            >
              Semua Kategori
            </CategoryPill>

            {categories.map(
              (category) => {
                const categoryCount =
                  products.filter(
                    (product) =>
                      Number(
                        product.id_kategori
                      ) ===
                      Number(
                        category.id
                      )
                  ).length;

                return (
                  <CategoryPill
                    key={category.id}
                    active={
                      Number(
                        categoryFilter
                      ) ===
                      Number(
                        category.id
                      )
                    }
                    count={categoryCount}
                    onClick={() =>
                      setCategoryFilter(
                        category.id
                      )
                    }
                  >
                    {category.nama}
                  </CategoryPill>
                );
              }
            )}

            <button
              type="button"
              onClick={() =>
                router.push("/kategori")
              }
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-[#a9c7b7] bg-[#f5faf7] px-3.5 text-[9px] font-extrabold text-[#006948] transition hover:border-[#006948] hover:bg-[#eaf6ef]"
            >
              <PlusIcon />
              Kelola
            </button>
          </section>

          {/* MAIN CONTENT */}
          <section className="flex flex-col items-stretch gap-4 xl:flex-row xl:items-start">

            {/* LEFT CONTENT */}
            <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-[#e2e9ee] bg-white shadow-[0_3px_14px_rgba(11,28,48,0.035)] dark:border-[#26382f] dark:bg-[#101a16]">

              {/* TABLE HEADER */}
              <div className="flex flex-col justify-between gap-3 border-b border-[#e4e9ed] bg-[#eff4ff]/70 px-3 py-3 sm:flex-row sm:items-center sm:px-4 dark:border-[#26382f] dark:bg-[#17231e]">
                <div className="flex items-center gap-3">
                  

                  <div>
                    <p className="text-[11px] font-extrabold text-[#0b1c30] dark:text-[#e7f1ec]">
                      Produk & Persediaan
                    </p>

                    <p className="text-[9px] font-semibold text-[#718078] dark:text-[#9eb2a7]">
                      {currentProducts.length} item ditampilkan
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  {selectedProducts.length > 0 && (
                    <span className="rounded-md bg-[#d8f8e7] px-2 py-1 text-[9px] font-extrabold text-[#006948] dark:bg-[#183c2d] dark:text-[#55c99b]">
                      {selectedProducts.length} dipilih
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => { 
                      setSelectionMode((prev) => !prev);
                      setSelectedProducts([]);
                    }}
                    className="rounded-md border border-[#dce4e8] bg-white px-3 py-1.5 text-[9px] font-extrabold text-[#006948] transition hover:bg-[#f0f8f4] dark:border-[#30463b] dark:bg-[#1a2822] dark:text-[#55c99b]"
                  >
                    {selectionMode ? "Batal" : "Pilih"}
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <div className="w-full overflow-x-auto bg-white dark:bg-[#101a16]">
                <table className="w-full min-w-[980px] border-collapse bg-white text-left dark:bg-[#101a16]">
                  <thead>
                    <tr className="border-b border-[#e4e9ed] bg-[#f7f9fc] text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#718078] dark:border-[#26382f] dark:bg-[#1a2822] dark:text-[#9eb2a7]">
                      <th
                        className={`overflow-hidden text-center align-middle transition-all duration-300 ${
                          selectionMode
                            ? "w-12 px-3 py-3"
                            : "w-0 px-0 py-0"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center transition-all duration-300 ${
                            selectionMode
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-3 opacity-0"
                          }`}
                        >
                          {selectionMode && (
                            <CustomCheckbox
                              checked={allCurrentSelected}
                              onChange={toggleSelectAll}
                            />
                          )}
                        </div>
                      </th>

                      <th className="bg-[#f7f9fc] px-3 py-3 dark:bg-[#1a2822]">
                        Gambar & Nama Produk
                      </th>

                      <th className="bg-[#f7f9fc] px-3 py-3 text-center dark:bg-[#1a2822]">
                        ID Produk
                      </th>

                      <th className="bg-[#f7f9fc] px-3 py-3 dark:bg-[#1a2822]">
                        Kategori
                      </th>

                      <th className="bg-[#f7f9fc] px-3 py-3 text-right dark:bg-[#1a2822]">
                        Harga Jual
                      </th>

                      <th className="bg-[#f7f9fc] px-3 py-3 text-center dark:bg-[#1a2822]">
                        Stok Aktif
                      </th>

                      <th className="bg-[#f7f9fc] px-3 py-3 text-center dark:bg-[#1a2822]">
                        Status
                      </th>

                      <th className="bg-[#f7f9fc] px-3 py-3 text-center dark:bg-[#1a2822]">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#edf1f3] bg-white dark:divide-[#24362e] dark:bg-[#101a16]">
                    {currentProducts.length === 0 ? (
                      <tr className="bg-white dark:bg-[#101a16]">
                        <td
                          colSpan={7}
                          className="bg-white py-20 text-center dark:bg-[#101a16]"
                        >
                          <div className="mx-auto flex max-w-xs flex-col items-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#718078] dark:bg-[#17231e] dark:text-[#9eb2a7]">
                              <Icon
                                name="box"
                                size={30}
                              />
                            </div>

                            <p className="text-[12px] font-extrabold text-[#0b1c30] dark:text-[#e7f1ec]">
                              Produk tidak ditemukan
                            </p>

                            <p className="mt-1 text-[10px] font-medium text-[#718078] dark:text-[#9eb2a7]">
                              Coba ubah pencarian atau filter.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentProducts.map(
                        (product) => {
                          const qty =
                            Number(
                              product.qty ||
                                0
                            );

                          const status =
                            getStockStatus(
                              qty
                            );

                          const stockPercent =
                            Math.min(
                              Math.max(
                                qty * 5,
                                qty > 0
                                  ? 8
                                  : 0
                              ),
                              100
                            );

                          const categoryName =
                            getCategoryName(
                              product
                            );

                          const isSelected =
                            selectedProducts.includes(
                              product.id
                            );

                          return (
                            <tr
                              key={
                                product.id
                              }
                              className="group bg-white transition-colors hover:bg-[#f7faf9] dark:bg-[#101a16] dark:hover:bg-[#17231e]"
                            >
                              
                              {/* CHECKBOX SELEKSI */}
                                <td
                                  className={`overflow-hidden text-center align-middle transition-all duration-300 ${
                                    selectionMode
                                      ? "w-12 px-3 py-3"
                                      : "w-0 px-0 py-0"
                                  }`}
                                >
                                  <div
                                    className={`flex items-center justify-center transition-all duration-300 ${
                                      selectionMode
                                        ? "translate-x-0 opacity-100"
                                        : "-translate-x-3 opacity-0"
                                    }`}
                                  >
                                    {selectionMode && (
                                      <CustomCheckbox
                                        checked={isSelected}
                                        onChange={() =>
                                          toggleSelectProduct(product.id)
                                        }
                                      />
                                    )}
                                  </div>
                                </td>

                              {/* PRODUK */}
                              <td className="bg-white px-3 py-3 dark:bg-[#101a16]">
                                <div className="flex min-w-0 items-center gap-3">
                                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[#dfe8e3] bg-[#eff4ff] dark:border-[#30463b] dark:bg-[#17231e]">
                                    {product.gambar ? (
                                      <img
                                        src={`/api${product.gambar}`}
                                        alt={product.nama}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e7f5ef] to-[#d9ebff] text-[#006948] dark:from-[#1a3026] dark:to-[#172a24] dark:text-[#55c99b]">
                                        <Icon
                                          name="box"
                                          size={21}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate text-[11px] font-extrabold text-[#0b1c30] group-hover:text-[#006948] dark:text-[#e7f1ec] dark:group-hover:text-[#55c99b]">
                                      {
                                        product.nama
                                      }
                                    </p>

                                    <p className="mt-1 truncate text-[9px] font-semibold text-[#87939a] dark:text-[#8fa59a]">
                                      {qty <= 0
                                        ? "Stok habis"
                                        : qty <=
                                          5
                                        ? "Perlu restok segera"
                                        : "Produk aktif"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* ID */}
                              <td className="bg-white px-3 py-3 text-center dark:bg-[#101a16]">
                                <span className="font-mono text-[10px] font-extrabold text-[#3d4a42] dark:text-[#b8c9c0]">
                                  #{product.id}
                                </span>
                              </td>

                              {/* KATEGORI */}
                              <td className="bg-white px-3 py-3 dark:bg-[#101a16]">
                                <span className="inline-flex max-w-full truncate rounded-md bg-[#eff4ff] px-2.5 py-1.5 text-[9px] font-extrabold text-[#56645d] dark:bg-[#1a2822] dark:text-[#b8c9c0]">
                                  {
                                    categoryName
                                  }
                                </span>
                              </td>

                              {/* HARGA */}
                              <td className="bg-white px-3 py-3 text-right dark:bg-[#101a16]">
                                <span className="whitespace-nowrap text-[11px] font-extrabold text-[#006948] dark:text-[#55c99b]">
                                  {formatRupiah(
                                    Number(
                                      product.harga ||
                                        0
                                    )
                                  )}
                                </span>
                              </td>

                              {/* STOK */}
                              <td className="bg-white px-3 py-3 dark:bg-[#101a16]">
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <span
                                      className={`text-[10px] font-extrabold ${
                                        qty <=
                                        5
                                          ? "text-[#ba1a1a] dark:text-[#ff8a80]"
                                          : "text-[#3d4a42] dark:text-[#b8c9c0]"
                                      }`}
                                    >
                                      {
                                        status.text
                                      }
                                    </span>

                                    <span className="whitespace-nowrap text-[9px] font-bold text-[#718078] dark:text-[#8fa59a]">
                                      {
                                        qty
                                      }{" "}
                                      Unit
                                    </span>
                                  </div>

                                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#dce9ff] dark:bg-[#263b32]">
                                    <div
                                      className={`h-full rounded-full transition-all ${status.bar}`}
                                      style={{
                                        width: `${stockPercent}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* STATUS */}
                              <td className="bg-white px-3 py-3 text-center dark:bg-[#101a16]">
                                <span
                                  className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-extrabold ${status.className}`}
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                  {
                                    status.label
                                  }
                                </span>
                              </td>

                              {/* AKSI */}
                              <td className="bg-white px-3 py-3 dark:bg-[#101a16]">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEdit(
                                        product
                                      )
                                    }
                                    title="Edit Produk"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#718078] transition hover:bg-[#eff4ff] hover:text-[#006948] dark:text-[#8fa59a] dark:hover:bg-[#1a2822] dark:hover:text-[#55c99b]"
                                  >
                                    <Icon
                                      name="edit"
                                      size={15}
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDelete(
                                        product.id
                                      )
                                    }
                                    title="Hapus Produk"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#718078] transition hover:bg-[#fff0ee] hover:text-[#ba1a1a] dark:text-[#8fa59a] dark:hover:bg-[#30201e] dark:hover:text-[#ff8a80]"
                                  >
                                    <Icon
                                      name="trash"
                                      size={15}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e4e9ed] bg-[#fbfcfe] px-3 py-3 sm:flex-row sm:px-4 dark:border-[#26382f] dark:bg-[#101a16]">
                <span className="text-center text-[9px] font-semibold text-[#718078] sm:text-left dark:text-[#9eb2a7]">
                  Menampilkan{" "}
                  <strong className="font-extrabold text-[#0b1c30] dark:text-[#e7f1ec]">
                    {filteredProducts.length ===
                    0
                      ? 0
                      : startIndex + 1}
                    -
                    {Math.min(
                      startIndex +
                        productPage,
                      filteredProducts.length
                    )}
                  </strong>{" "}
                  dari{" "}
                  <strong className="font-extrabold text-[#0b1c30] dark:text-[#e7f1ec]">
                    {
                      filteredProducts.length
                    }
                  </strong>{" "}
                  produk
                </span>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          (prev) =>
                            Math.max(
                              prev - 1,
                              1
                            )
                        )
                      }
                      disabled={
                        safeCurrentPage ===
                        1
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e0e7eb] bg-white text-[#68766f] transition hover:border-[#a8c8b7] hover:text-[#006948] disabled:opacity-30 dark:border-[#30463b] dark:bg-[#1a2822] dark:text-[#9eb2a7]"
                    >
                      <Icon
                        name="chevron-left"
                        size={14}
                      />
                    </button>

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map((page) => (
                      <button
                        type="button"
                        key={page}
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                        className={`flex h-7 w-7 items-center justify-center rounded-md text-[9px] font-extrabold transition ${
                          safeCurrentPage ===
                          page
                            ? "bg-[#006948] text-white shadow-sm"
                            : "text-[#526057] hover:bg-[#eaf2ed] dark:text-[#b8c9c0] dark:hover:bg-[#1a2822]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          (prev) =>
                            Math.min(
                              prev + 1,
                              totalPages
                            )
                        )
                      }
                      disabled={
                        safeCurrentPage ===
                        totalPages
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e0e7eb] bg-white text-[#68766f] transition hover:border-[#a8c8b7] hover:text-[#006948] disabled:opacity-30 dark:border-[#30463b] dark:bg-[#1a2822] dark:text-[#9eb2a7]"
                    >
                      <Icon
                        name="chevron-right"
                        size={14}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="flex w-full shrink-0 flex-col gap-4 xl:w-[280px] 2xl:w-[300px]">

              {/* SYNC */}
              <div className="rounded-xl border border-[#e2e9ee] bg-white p-4 shadow-[0_3px_14px_rgba(11,28,48,0.035)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[11px] font-extrabold text-[#0b1c30]">
                    Status Batch
                    Sinkron
                  </h3>

                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#e5f8ee] px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide text-[#006948]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-[#10a66e]" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-[#10a66e]" />
                    </span>

                    Realtime POS
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-2.5">
                  <SyncRow label="Terminal Kasir 1" />
                  <SyncRow label="Terminal Kasir 2" />
                  <SyncRow label="Data Produk" />
                </div>

                <div className="mt-4 rounded-lg bg-[#eff4ff] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#718078]">
                      Ringkasan Stok
                    </span>

                    <span className="text-[9px] font-bold text-[#006948]">
                      Live
                    </span>
                  </div>

                  <div className="mt-2 flex items-end justify-between">
                    <span className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">
                      {totalStock}
                    </span>

                    <span className="text-[9px] font-bold text-[#718078]">
                      Total Unit
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#dce9ff]">
                    <div
                      className="h-full rounded-full bg-[#006948]"
                      style={{
                        width:
                          products.length >
                          0
                            ? `${Math.min(
                                (products.filter(
                                  (p) =>
                                    Number(
                                      p.qty ||
                                        0
                                    ) >
                                    5
                                ).length /
                                  products.length) *
                                  100,
                                100
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RESTOCK */}
              <div className="rounded-xl border border-[#e2e9ee] bg-white p-4 shadow-[0_3px_14px_rgba(11,28,48,0.035)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[11px] font-extrabold text-[#0b1c30]">
                    Perlu Restok
                    Cepat
                  </h3>

                  <span className="shrink-0 text-[9px] font-extrabold text-[#ba1a1a]">
                    {lowStockProducts.length +
                      outOfStockProducts.length}{" "}
                    Item
                  </span>
                </div>

                <p className="mt-2 text-[9px] font-medium leading-4 text-[#718078]">
                  Daftar produk dengan
                  persediaan di bawah
                  batas minimum.
                </p>

                <div className="mt-3 flex flex-col gap-2">
                  {[
                    ...outOfStockProducts,
                    ...lowStockProducts,
                  ]
                    .slice(0, 3)
                    .map((product) => {
                      const qty =
                        Number(
                          product.qty ||
                            0
                        );

                      return (
                        <div
                          key={
                            product.id
                          }
                          className={`flex items-center gap-2 rounded-lg p-2 ${
                            qty <= 0
                              ? "bg-[#fff1ef]"
                              : "bg-[#eff4ff]"
                          }`}
                        >
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white">
                            {product.gambar ? (
                              <img
                                src={`/api${product.gambar}`}
                                alt={
                                  product.nama
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#006948]">
                                <Icon
                                  name="box"
                                  size={17}
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[9px] font-extrabold text-[#0b1c30]">
                              {product.nama}
                            </p>

                            <p
                              className={`mt-0.5 text-[8px] font-bold ${
                                qty <= 0
                                  ? "text-[#ba1a1a]"
                                  : "text-[#718078]"
                              }`}
                            >
                              {qty <= 0
                                ? "Habis (0 unit)"
                                : `Sisa ${qty} unit`}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                product
                              )
                            }
                            className={`shrink-0 rounded-md px-2 py-1.5 text-[8px] font-extrabold transition ${
                              qty <= 0
                                ? "bg-[#ba1a1a] text-white hover:bg-[#a71717]"
                                : "bg-white text-[#3d4a42] hover:bg-[#e8eee9]"
                            }`}
                          >
                            Restok
                          </button>
                        </div>
                      );
                    })}

                  {lowStockProducts.length ===
                    0 &&
                    outOfStockProducts.length ===
                      0 && (
                      <div className="rounded-lg bg-[#e8f8ef] p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[9px] font-extrabold text-[#006948]">
                          <Icon
                            name="check"
                            size={13}
                          />

                          Semua stok aman
                        </div>
                      </div>
                    )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setStockFilter("low")
                  }
                  className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#eff4ff] text-[9px] font-extrabold text-[#3d4a42] transition hover:bg-[#e2ebfa]"
                >
                  Lihat Produk Perlu Restok

                  <Icon
                    name="chevron-right"
                    size={13}
                  />
                </button>
              </div>

              {/* ONLINE CATALOG */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#006948] via-[#007a52] to-[#00855d] p-5 text-white shadow-[0_8px_22px_rgba(0,105,72,0.18)]">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-white/5" />

                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                      <Icon
                        name="qr"
                        size={17}
                      />
                    </div>

                    <span className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#b8f5d5]">
                      Katalog Menu Online
                    </span>
                  </div>

                  <h3 className="mt-4 text-[14px] font-extrabold tracking-tight">
                    Sinkronkan Menu Produk
                  </h3>

                  <p className="mt-1.5 text-[9px] font-medium leading-4 text-[#dcffec]">
                    Perubahan produk,
                    harga, dan stok akan
                    langsung tersedia pada
                    sistem kasir.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery("")
                    }
                    className="mt-4 flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-[9px] font-extrabold text-[#006948] shadow-sm transition hover:bg-[#edfff5]"
                  >
                    Lihat Semua Produk

                    <Icon
                      name="chevron-right"
                      size={13}
                    />
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </div>

      {/* ===================================================== */}
      {/* MODAL TAMBAH PRODUK */}
      {/* ===================================================== */}

      {showAddForm && (
        <ModalShell
          title="Tambah Produk Baru"
          description="Lengkapi informasi produk yang akan ditambahkan ke inventaris."
          icon="box"
          onClose={() =>
            setShowAddForm(false)
          }
        >
          <div className="space-y-4">
            <FormField label="Nama Produk">
              <input
                value={
                  newProduct.nama
                }
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    nama: e.target.value,
                  })
                }
                placeholder="Contoh: Kopi Susu Aren"
                className="input-style"
              />
            </FormField>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField label="Stok">
                <StockNumberInput
                  value={
                    newProduct.qty
                  }
                  onChange={(value) =>
                    setNewProduct({
                      ...newProduct,
                      qty: value,
                    })
                  }
                />
              </FormField>

              <FormField label="Harga Jual">
                <PriceInput
                  value={
                    newProduct.harga
                  }
                  onChange={(value) =>
                    setNewProduct({
                      ...newProduct,
                      harga:
                        formatHarga(value),
                    })
                  }
                />
              </FormField>
            </div>

            <FormField label="Harga Modal / HPP">
              <PriceInput
                value={
                  newProduct.harga_modal
                }
                onChange={(value) =>
                  setNewProduct({
                    ...newProduct,
                    harga_modal:
                      formatHarga(value),
                  })
                }
              />
            </FormField>

            <FormField label="Kategori">
              <div className="space-y-2">
                <select
                  value={
                    newProduct.id_kategori
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      id_kategori:
                        e.target.value,
                    })
                  }
                  className="input-style"
                >
                  <option value="">
                    {categories.length ===
                    0
                      ? "Belum ada kategori"
                      : "Pilih kategori"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.nama
                        }
                      </option>
                    )
                  )}
                </select>

                {categories.length ===
                  0 && (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/kategori"
                      )
                    }
                    className="flex w-full items-center justify-between rounded-lg border border-dashed border-[#a9c7b7] bg-[#f5faf7] px-3 py-2.5 text-left transition hover:border-[#006948] hover:bg-[#eaf6ef]"
                  >
                    <span className="flex items-center gap-2 text-[9px] font-bold text-[#59675f]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#dff7e9] text-[#006948]">
                        <Icon
                          name="folder"
                          size={13}
                        />
                      </span>

                      Belum ada kategori
                    </span>

                    <span className="flex items-center gap-1 text-[9px] font-extrabold text-[#006948]">
                      Buat kategori

                      <Icon
                        name="chevron-right"
                        size={12}
                      />
                    </span>
                  </button>
                )}
              </div>
            </FormField>

            <FormField label="Gambar Produk">
              <FileUploadBox
                accept="image/*"
                selectedFile={
                  newProduct.gambar
                }
                onChange={(file) =>
                  setNewProduct({
                    ...newProduct,
                    gambar: file,
                  })
                }
              />
            </FormField>
          </div>

          <ModalActions
            onCancel={() =>
              setShowAddForm(false)
            }
            actionLabel="Simpan Produk"
            onAction={
              handleAddProduct
            }
          />
        </ModalShell>
      )}

      {/* ===================================================== */}
      {/* MODAL IMPORT */}
      {/* ===================================================== */}

      {showImportForm && (
        <ModalShell
          title="Import Produk"
          description="Masukkan file Excel atau CSV untuk menambahkan banyak produk sekaligus."
          icon="upload"
          maxWidth="max-w-4xl"
          onClose={() =>
            setShowImportForm(false)
          }
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-dashed border-[#b8cec0] bg-[#f7fbf8] p-5">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f8ee] text-[#006948]">
                  <Icon
                    name="upload"
                    size={22}
                  />
                </div>

                <p className="mt-3 text-[11px] font-extrabold text-[#0b1c30]">
                  Pilih file data produk
                </p>

                <p className="mt-1 max-w-sm text-[9px] font-medium leading-4 text-[#718078]">
                  Format yang didukung:
                  .xlsx, .xls, dan .csv
                </p>

                <label className="mt-4 cursor-pointer rounded-lg bg-[#006948] px-4 py-2.5 text-[9px] font-extrabold text-white shadow-[0_4px_12px_rgba(0,105,72,0.18)] transition hover:bg-[#00583d]">
                  Pilih File

                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => {
                      const file =
                        e.target.files?.[0];

                      if (file) {
                        setImportFile(file);
                        handleImportFile(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {importFile && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#cce9d8] bg-[#eefaf3] p-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d9f4e5] text-[#006948]">
                    <Icon
                      name="check"
                      size={15}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[8px] font-extrabold uppercase tracking-wide text-[#718078]">
                      File dipilih
                    </p>

                    <p className="truncate text-[10px] font-extrabold text-[#006948]">
                      {importFile.name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setImportFile(null);
                    setImportData([]);
                    setImportErrors([]);
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#718078] transition hover:bg-white hover:text-[#ba1a1a]"
                >
                  <Icon
                    name="close"
                    size={14}
                  />
                </button>
              </div>
            )}

            {importErrors.length > 0 && (
              <div className="rounded-xl border border-[#ffd5d0] bg-[#fff4f2] p-4">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 text-[#ba1a1a]">
                    <Icon
                      name="alert"
                      size={15}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#ba1a1a]">
                      Data belum dapat diimport
                    </p>

                    <div className="mt-2 space-y-1">
                      {importErrors.map(
                        (
                          error,
                          index
                        ) => (
                          <p
                            key={
                              index
                            }
                            className="text-[9px] font-semibold leading-4 text-[#8e3030]"
                          >
                            {error}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {importData.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-[#dce5e1]">
                <div className="flex items-center justify-between border-b border-[#e1e8e4] bg-[#f7faf8] px-4 py-3">
                  <div>
                    <p className="text-[10px] font-extrabold text-[#0b1c30]">
                      Preview Data
                    </p>

                    <p className="mt-0.5 text-[8px] font-medium text-[#718078]">
                      Menampilkan maksimal
                      5 baris pertama
                    </p>
                  </div>

                  <span className="rounded-full bg-[#e5f8ee] px-2.5 py-1 text-[8px] font-extrabold text-[#006948]">
                    {importData.length}{" "}
                    baris
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
                    <thead>
                      <tr className="bg-[#eff4ff]">
                        {Object.keys(
                          importData[0]
                        ).map((key) => (
                          <th
                            key={key}
                            className="border-b border-[#dce5e1] px-3 py-2.5 text-[8px] font-extrabold uppercase tracking-wide text-[#718078]"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {importData
                        .slice(0, 5)
                        .map(
                          (
                            row,
                            index
                          ) => (
                            <tr
                              key={
                                index
                              }
                              className="border-b border-[#edf1ef] last:border-b-0"
                            >
                              {Object.values(
                                row
                              ).map(
                                (
                                  value: any,
                                  cellIndex
                                ) => (
                                  <td
                                    key={
                                      cellIndex
                                    }
                                    className="px-3 py-2.5 text-[9px] font-medium text-[#3d4a42]"
                                  >
                                    {String(
                                      value
                                    )}
                                  </td>
                                )
                              )}
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <ModalActions
            onCancel={() =>
              setShowImportForm(false)
            }
            actionLabel="Import Produk"
            onAction={handleImport}
          />
        </ModalShell>
      )}

      {/* ===================================================== */}
      {/* MODAL EDIT */}
      {/* ===================================================== */}

      {editingProduct && (
        <ModalShell
          title="Edit Produk"
          description="Perbarui informasi produk yang sudah tersimpan."
          icon="edit"
          onClose={() =>
            setEditingProduct(null)
          }
        >
          <div className="space-y-4">
            <FormField label="Nama Produk">
              <input
                value={
                  editingProduct.nama
                }
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    nama: e.target.value,
                  })
                }
                placeholder="Nama produk"
                className="input-style"
              />
            </FormField>

            <FormField label="Stok">
              <StockNumberInput
                value={
                  editingProduct.qty
                }
                onChange={(value) =>
                  setEditingProduct({
                    ...editingProduct,
                    qty: value,
                  })
                }
              />
            </FormField>

            <FormField label="Harga Modal / HPP">
              <PriceInput
                value={String(
                  editingProduct?.harga_modal ?? 0
                ).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                onChange={(value) =>
                  setEditingProduct({
                    ...editingProduct,
                    harga_modal: formatHarga(value),
                  })
                }
              />
            </FormField>

            <FormField label="Kategori">
              <select
                value={
                  editingProduct.id_kategori ??
                  ""
                }
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    id_kategori:
                      e.target.value,
                  })
                }
                className="input-style"
              >
                {categories.length ===
                0 ? (
                  <option value="">
                    Belum ada kategori
                  </option>
                ) : (
                  <>
                    <option value="">
                      Pilih kategori
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {
                            category.nama
                          }
                        </option>
                      )
                    )}
                  </>
                )}
              </select>

              {categories.length ===
                0 && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/kategori"
                    )
                  }
                  className="mt-2 flex w-full items-center justify-between rounded-lg border border-dashed border-[#a9c7b7] bg-[#f5faf7] px-3 py-2.5 text-left transition hover:border-[#006948] hover:bg-[#eaf6ef] dark:border-[#29483c] dark:bg-[#14221d] dark:hover:border-[#00855d] dark:hover:bg-[#1a2c25]"
                >
                  <span className="flex items-center gap-2 text-[9px] font-bold text-[#59675f]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#dff7e9] text-[#006948]">
                      <Icon
                        name="folder"
                        size={13}
                      />
                    </span>

                    Buat kategori terlebih dahulu
                  </span>

                  <Icon
                    name="chevron-right"
                    size={12}
                    className="text-[#006948]"
                  />
                </button>
              )}
            </FormField>

            <FormField label="Ganti Gambar">
              <FileUploadBox
                accept="image/*"
                selectedFile={
                  editingProduct.gambar
                }
                onChange={(file) =>
                  setEditingProduct({
                    ...editingProduct,
                    gambar: file,
                  })
                }
              />
            </FormField>

            {editingProduct.gambarLama && (
              <div className="rounded-xl border border-[#e1e8e4] bg-[#f8faf9] p-3 dark:border-[#29483c] dark:bg-[#14221d]">
                <p className="mb-2 text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#718078]">
                  Gambar Saat Ini
                </p>

                <div className="flex items-center gap-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#dbe4df] bg-white shadow-sm dark:border-[#29483c] dark:bg-[#101a16]">
                    <img
                      src={`/api${editingProduct.gambarLama}`}
                      alt={
                        editingProduct.nama
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold text-[#3d4a42] dark:text-[#d7e5de]">
                      Foto produk saat ini
                    </p>

                    <p className="mt-1 max-w-[220px] text-[8px] font-medium leading-4 text-[#87939a] dark:text-[#8fa49a]">
                      Pilih gambar baru di
                      atas jika ingin
                      mengganti foto produk.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <ModalActions
            onCancel={() =>
              setEditingProduct(null)
            }
            actionLabel="Simpan Perubahan"
            onAction={handleUpdate}
          />
        </ModalShell>
      )}

      {/* ===================================================== */}
      {/* GLOBAL STYLE */}
      {/* ===================================================== */}

      <style jsx global>{`
        /* =====================================================
           DARK MODE
           Hanya mengubah warna visual.
           Logic, layout, API, dan fungsi tidak diubah.
           ===================================================== */

        .dark [class~="bg-white"],
        .dark [class~="!bg-white"],
        .dark table td[class*="!bg-white"] {
          background-color: #101a16 !important;
        }

        .dark [class*="bg-[#f8f9ff]"] {
          background-color: #0b1210 !important;
        }

        .dark [class*="bg-[#eff4ff]"] {
          background-color: #17231e !important;
        }

        .dark [class*="bg-[#f7f9fc]"] {
          background-color: #1a2822 !important;
        }

        .dark [class*="bg-[#f5faf7]"],
        .dark [class*="bg-[#f3faf6]"],
        .dark [class*="bg-[#eaf6ef]"] {
          background-color: #1d3028 !important;
        }

        .dark [class*="bg-[#e8f7ef]"],
        .dark [class*="bg-[#eff7f2]"],
        .dark [class*="bg-[#e7f5ef]"],
        .dark [class*="bg-[#e5f8ee]"],
        .dark [class*="bg-[#dff7e9]"],
        .dark [class*="bg-[#d8f8e7]"] {
          background-color: #173a2e !important;
        }

        .dark [class*="bg-[#dce9ff]"],
        .dark [class*="bg-[#d9ebff]"] {
          background-color: #1b2c26 !important;
        }

        .dark [class*="bg-[#ffdad6]"] {
          background-color: #4b2928 !important;
        }

        .dark [class*="text-[#0b1c30]"] {
          color: #f1f5f3 !important;
        }

        .dark [class*="text-[#3d4a42]"],
        .dark [class*="text-[#56645d]"],
        .dark [class*="text-[#58655e]"],
        .dark [class*="text-[#59675f]"],
        .dark [class*="text-[#68766f]"] {
          color: #b8c5be !important;
        }

        .dark [class*="text-[#718078]"],
        .dark [class*="text-[#6d7a72]"] {
          color: #91a29a !important;
        }

        .dark [class*="text-[#87939a]"],
        .dark [class*="text-[#87949e]"] {
          color: #879b94 !important;
        }

        .dark [class*="text-[#006948]"],
        .dark [class*="text-[#00855d]"] {
          color: #28b987 !important;
        }

        .dark [class*="text-[#ba1a1a]"] {
          color: #ff9b9b !important;
        }

        .dark [class*="border-[#dce8e1]"],
        .dark [class*="border-[#e1e8e3]"],
        .dark [class*="border-[#dfe7e3]"],
        .dark [class*="border-[#e2e9ee]"],
        .dark [class*="border-[#e3eaf0]"],
        .dark [class*="border-[#e4e9ed]"],
        .dark [class*="border-[#dfe8e3]"],
        .dark [class*="border-[#dce4e8]"],
        .dark [class*="border-[#e7ece9]"],
        .dark [class*="border-[#dbe4df]"],
        .dark [class*="border-[#dce5e1]"] {
          border-color: #2a3a33 !important;
        }

        .dark [class*="border-[#a9c7b7]"] {
          border-color: #3d6553 !important;
        }

        .dark [class*="divide-[#edf1f3]"],
        .dark [class*="divide-[#edf1ef]"] {
          border-color: #26332e !important;
        }

        .dark [class*="hover:bg-[#f6f9f7]"]:hover,
        .dark [class*="hover:bg-[#f5faf7]"]:hover,
        .dark [class*="hover:bg-[#f7faf9]"]:hover,
        .dark [class*="hover:bg-[#eff4ff]"]:hover {
          background-color: #1d3028 !important;
        }

        .dark [class*="hover:border-[#8fbea6]"]:hover,
        .dark [class*="hover:border-[#a9c7b7]"]:hover {
          border-color: #4f8b70 !important;
        }

        .dark [class*="hover:text-[#006948]"]:hover {
          color: #28b987 !important;
        }

        .dark [class*="from-[#e7f5ef]"] {
          --tw-gradient-from: #173a2e var(--tw-gradient-from-position) !important;
        }

        .dark [class*="to-[#d9ebff]"] {
          --tw-gradient-to: #1b2c26 var(--tw-gradient-to-position) !important;
        }

        .dark .input-style {
          border-color: #2a3a33;
          background: #17231e;
          color: #f1f5f3;
        }

        .dark .input-style::placeholder {
          color: #7f9087;
        }

        .dark .input-style:hover {
          border-color: #3d6553;
        }

        .dark .input-style:focus {
          border-color: #28b987;
          background: #17231e;
          box-shadow:
            0 0 0 4px
            rgba(40, 185, 135, 0.12);
        }

        .dark select.input-style {
          color-scheme: dark;
        }

        .dark input,
        .dark textarea,
        .dark select {
          color-scheme: dark;
        }

        .dark ::-webkit-scrollbar-thumb {
          background: #3a4d44;
        }

        .dark ::-webkit-scrollbar-thumb:hover {
          background: #4d655a;
        }

        .input-style {
          width: 100%;
          min-height: 42px;
          border-radius: 10px;
          border: 1px solid #dbe4df;
          background: #ffffff;
          color: #0b1c30;
          padding: 10px 13px;
          font-size: 11px;
          font-weight: 600;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .input-style::placeholder {
          color: #9aa59f;
        }

        .input-style:hover {
          border-color: #b9cfc2;
        }

        .input-style:focus {
          border-color: #69b58f;
          background: #ffffff;
          box-shadow:
            0 0 0 4px
            rgba(0, 105, 72, 0.06);
        }

        select.input-style {
          cursor: pointer;
          appearance: auto;
        }

        ::-webkit-scrollbar {
          width: 7px;
          height: 7px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: #c9d5cf;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #9eafa5;
        }
      `}</style>

        {/* MODAL RIWAYAT STOK */}
        {showStockHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-6">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="stock-history-title"
              className="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <header className="flex items-center justify-between gap-3 border-b border-[#e5ece7] p-4 sm:p-5">
                <div>
                  <h2 id="stock-history-title" className="text-base font-extrabold text-[#0b1c30]">
                    Riwayat Pergerakan Stok
                  </h2>
                  <p className="mt-1 text-xs text-[#718078]">
                    Catatan stok masuk, stok keluar, dan penyesuaian.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStockHistory(false)}
                  className="rounded-lg border border-[#dfe7e3] px-3 py-2 text-sm font-bold text-[#59675f] hover:bg-[#f3f8f5]"
                >
                  Tutup
                </button>
              </header>

              <div className="overflow-auto">
                {loadingStockMovements ? (
                  <p className="p-10 text-center text-sm text-[#718078]">
                    Memuat riwayat stok...
                  </p>
                ) : stockMovements.length === 0 ? (
                  <p className="p-10 text-center text-sm text-[#718078]">
                    Belum ada riwayat pergerakan stok.
                  </p>
                ) : (
                  <table className="w-full min-w-[850px] text-left text-xs">
                    <thead className="sticky top-0 bg-[#f4f8f6] text-[10px] uppercase text-[#59675f]">
                      <tr>
                        <th className="px-4 py-3">Waktu</th>
                        <th className="px-4 py-3">Produk</th>
                        <th className="px-4 py-3">Jenis</th>
                        <th className="px-4 py-3 text-right">Jumlah</th>
                        <th className="px-4 py-3 text-right">Stok Sebelum</th>
                        <th className="px-4 py-3 text-right">Stok Sesudah</th>
                        <th className="px-4 py-3">Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf1ee]">
                      {stockMovements.map((item, index) => {
                        const type = String(item.movement_type || "").toLowerCase();
                        const incoming = type === "stock_in";
                        const outgoing = type === "stock_out";

                        return (
                          <tr key={item.id ?? `${item.product_id}-${item.created_at}-${index}`}>
                            <td className="whitespace-nowrap px-4 py-3">
                              {item.created_at
                                ? new Date(item.created_at).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td className="px-4 py-3 font-semibold">
                              {item.nama_produk || item.product_name || item.nama || "-"}
                              <span className="mt-1 block text-[10px] text-[#87938a]">
                                ID: {item.product_id ?? "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                                incoming
                                  ? "bg-[#d8f8e7] text-[#006948]"
                                  : outgoing
                                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                                    : "bg-[#eff4ff] text-[#455b85]"
                              }`}>
                                {incoming ? "Stok Masuk" : outgoing ? "Stok Keluar" : "Penyesuaian"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-bold">
                              {incoming ? "+" : outgoing ? "−" : ""}
                              {Math.abs(Number(item.quantity ?? 0)).toLocaleString("id-ID")}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {Number(item.stock_before ?? 0).toLocaleString("id-ID")}
                            </td>
                            <td className="px-4 py-3 text-right font-bold">
                              {Number(item.stock_after ?? 0).toLocaleString("id-ID")}
                            </td>
                            <td className="px-4 py-3 text-[#718078]">
                              {item.note || item.source_type || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <footer className="flex items-center justify-between border-t border-[#e5ece7] p-4">
                <span className="text-xs text-[#718078]">
                  {stockMovements.length} catatan
                </span>
                <button
                  type="button"
                  disabled={loadingStockMovements}
                  onClick={() => void loadStockMovements()}
                  className="rounded-lg border border-[#cfe5d8] px-3 py-2 text-xs font-bold text-[#006948] hover:bg-[#eff8f2] disabled:opacity-50"
                >
                  Muat Ulang
                </button>
              </footer>
            </section>
          </div>
        )}

    </main>
  );
}

/* ========================================================= */
/* PLUS ICON */
/* ========================================================= */

function PlusIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

/* ========================================================= */
/* SUMMARY CARD */
/* ========================================================= */

function SummaryCard({
  label,
  value,
  suffix,
  badge,
  badgeText,
  icon,
  tone,
  large = false,
}: {
  label: string;
  value: any;
  suffix: string;
  badge: string;
  badgeText: string;
  icon: string;
  tone: "green" | "red";
  large?: boolean;
}) {
  const green = tone === "green";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#e2e9ee] bg-white p-3.5 shadow-[0_3px_14px_rgba(11,28,48,0.035)] transition hover:-translate-y-[1px] hover:shadow-[0_7px_22px_rgba(11,28,48,0.06)] sm:p-4">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <span
            className={`text-[9px] font-extrabold sm:text-[10px] ${
              green
                ? "text-[#718078]"
                : "text-[#ba1a1a]"
            }`}
          >
            {label}
          </span>

          <div className="mt-1 flex min-w-0 items-baseline gap-2">
            <span
              className={`truncate font-extrabold tracking-[-0.04em] ${
                large
                  ? "text-[20px] sm:text-[25px]"
                  : "text-[25px] sm:text-[28px]"
              } ${
                green
                  ? "text-[#0b1c30]"
                  : "text-[#ba1a1a]"
              }`}
            >
              {value}
            </span>

            {suffix && (
              <span className="shrink-0 text-[8px] font-semibold text-[#87939a] sm:text-[9px]">
                {suffix}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-[8px] font-extrabold ${
                green
                  ? "bg-[#dff7e9] text-[#006948]"
                  : "bg-[#ffdad6] text-[#ba1a1a]"
              }`}
            >
              {badge}
            </span>

            {badgeText && (
              <span className="text-[8px] font-semibold text-[#87939a] sm:text-[9px]">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
            green
              ? "bg-[#e5f8ee] text-[#006948]"
              : "bg-[#fff0ee] text-[#ba1a1a]"
          }`}
        >
          <Icon
            name={icon}
            size={20}
          />
        </div>
      </div>

      <div
        className={`absolute -bottom-8 -right-8 h-20 w-20 rounded-full opacity-50 ${
          green
            ? "bg-[#dff7e9]"
            : "bg-[#ffdad6]"
        }`}
      />
    </div>
  );
}

/* ========================================================= */
/* STOCK FILTER */
/* ========================================================= */

function StockFilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-7 shrink-0 rounded-md px-2.5 text-[9px] font-extrabold transition ${
        active
          ? "bg-white text-[#0b1c30] shadow-[0_2px_6px_rgba(11,28,48,0.08)]"
          : "text-[#718078] hover:text-[#3d4a42]"
      }`}
    >
      {children}
    </button>
  );
}

/* ========================================================= */
/* CATEGORY PILL */
/* ========================================================= */

function CategoryPill({
  active,
  count,
  children,
  onClick,
}: {
  active: boolean;
  count: number;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[9px] font-extrabold transition ${
        active
          ? "bg-[#006948] text-white shadow-[0_4px_10px_rgba(0,105,72,0.15)]"
          : "border border-[#e1e8e3] bg-white text-[#66736c] hover:border-[#a9c7b7] hover:text-[#006948]"
      }`}
    >
      <span>
        {children}
      </span>

      <span
        className={`rounded-full px-1.5 py-0.5 text-[8px] ${
          active
            ? "bg-white/15 text-white"
            : "bg-[#eff4ff] text-[#68766f]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* ========================================================= */
/* SYNC ROW */
/* ========================================================= */

function SyncRow({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[9px] font-semibold text-[#718078]">
        {label}
      </span>

      <span className="flex items-center gap-1 text-[8px] font-extrabold text-[#006948]">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#dff7e9]">
          <Icon
            name="check"
            size={10}
          />
        </span>

        Tersinkron
      </span>
    </div>
  );
}

/* ========================================================= */
/* STOCK NUMBER INPUT */
/* ========================================================= */

function StockNumberInput({
  value,
  onChange,
  min = 1,
}: {
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
}) {
  const getNumber = () => {
    const cleaned = String(value).replace(
      /\D/g,
      ""
    );

    return Number(cleaned) || 0;
  };

  const increment = () => {
    onChange(
      String(getNumber() + 1)
    );
  };

  const decrement = () => {
    onChange(
      String(
        Math.max(
          min,
          getNumber() - 1
        )
      )
    );
  };

  return (
    <div className="flex h-[42px] w-full overflow-hidden rounded-[10px] border border-[#dbe4df] bg-white transition focus-within:border-[#69b58f] focus-within:ring-4 focus-within:ring-[#006948]/5 dark:border-[#29483c] dark:bg-[#101a16]">
      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value.replace(
              /\D/g,
              ""
            )
          )
        }
        placeholder="0"
        inputMode="numeric"
        className="min-w-0 flex-1 bg-transparent px-3 text-[11px] font-semibold text-[#0b1c30] outline-none placeholder:text-[#9aa59f] dark:text-[#e2eee8] dark:placeholder:text-[#718078]"
      />

      <div className="flex w-[36px] shrink-0 flex-col border-l border-[#e7ece9] bg-[#f7faf8] dark:border-[#29483c] dark:bg-[#172820]">
        <button
          type="button"
          onClick={increment}
          aria-label="Tambah stok"
          className="flex flex-1 items-center justify-center border-b border-[#e7ece9] text-[#718078] transition hover:bg-[#e8f7ef] hover:text-[#006948] active:bg-[#dff5e9] dark:border-[#29483c] dark:text-[#9aafa5] dark:hover:bg-[#1d3a2e] dark:hover:text-[#54c596] dark:active:bg-[#244536]"
        >
          <Icon
            name="chevron-up"
            size={12}
          />
        </button>

        <button
          type="button"
          onClick={decrement}
          aria-label="Kurangi stok"
          className="flex flex-1 items-center justify-center text-[#718078] transition hover:bg-[#e8f7ef] hover:text-[#006948] active:bg-[#dff5e9] dark:text-[#9aafa5] dark:hover:bg-[#1d3a2e] dark:hover:text-[#54c596] dark:active:bg-[#244536]"
        >
          <Icon
            name="chevron-down"
            size={12}
          />
        </button>
      </div>

      <div className="flex w-[42px] shrink-0 items-center justify-center border-l border-[#e7ece9] bg-[#fbfcfb] text-[8px] font-extrabold uppercase tracking-wide text-[#87939a] dark:border-[#29483c] dark:bg-[#172820] dark:text-[#8fa49a]">
        Unit
      </div>
    </div>
  );
}

/* ========================================================= */
/* PRICE INPUT */
/* ========================================================= */

function PriceInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex h-[42px] w-full overflow-hidden rounded-[10px] border border-[#dbe4df] bg-white transition focus-within:border-[#69b58f] focus-within:ring-4 focus-within:ring-[#006948]/5 dark:border-[#29483c] dark:bg-[#101a16]">
     <div className="flex w-[42px] shrink-0 items-center justify-center border-r border-[#e7ece9] bg-[#f7faf8] text-[10px] font-extrabold text-[#006948] dark:border-[#29483c] dark:bg-[#172820] dark:text-[#54c596]">
        Rp
      </div>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="0"
        inputMode="numeric"
        className="min-w-0 flex-1 bg-transparent px-3 text-[11px] font-semibold text-[#0b1c30] outline-none placeholder:text-[#9aa59f]"
      />
    </div>
  );
}

/* ========================================================= */
/* FORM FIELD */
/* ========================================================= */

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#59675f]">
        {label}
      </label>

      {children}
    </div>
  );
}

/* ========================================================= */
/* FILE UPLOAD */
/* ========================================================= */

function FileUploadBox({
  accept,
  selectedFile,
  onChange,
}: {
  accept: string;
  selectedFile: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#c9d9d0] bg-[#f8faf9] p-3 transition hover:border-[#8dbca2] hover:bg-[#f5faf7]">
      <label className="flex cursor-pointer items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#006948] shadow-[0_2px_8px_rgba(11,28,48,0.04)]">
          <Icon
            name="image"
            size={18}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[9px] font-extrabold text-[#3d4a42]">
            {selectedFile
              ? selectedFile.name
              : "Pilih gambar produk"}
          </p>

          <p className="mt-0.5 text-[8px] font-medium text-[#87939a]">
            JPG, PNG, WEBP
          </p>
        </div>

        <span className="shrink-0 rounded-md bg-[#006948] px-2.5 py-1.5 text-[8px] font-extrabold text-white">
          Pilih
        </span>

        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) =>
            onChange(
              e.target.files?.[0] || null
            )
          }
        />
      </label>

      {selectedFile && (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-white px-2.5 py-2">
          <span className="max-w-[80%] truncate text-[8px] font-semibold text-[#718078]">
            {selectedFile.name}
          </span>

          <button
            type="button"
            onClick={() =>
              onChange(null)
            }
            className="text-[8px] font-extrabold text-[#ba1a1a] hover:underline"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================= */
/* MODAL */
/* ========================================================= */

function ModalShell({
  title,
  description,
  icon = "box",
  children,
  onClose,
  maxWidth = "max-w-md",
}: {
  title: string;
  description: string;
  icon?: string;
  children: ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06100b]/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className={`flex max-h-[94vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl border border-white/70 bg-white text-[#0b1c30] shadow-[0_25px_80px_rgba(0,0,0,0.22)] dark:border-[#29483c] dark:bg-[#101a16] dark:text-[#e2eee8]`}
      >
        <div className="shrink-0 border-b border-gray-200 bg-gray-50 px-4 py-4 dark:border-[#263b32] dark:bg-[#14221d] sm:px-5">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e5f8ee] text-[#006948] dark:bg-[#1d3a2e] dark:text-[#54c596]">
                <Icon
                  name={icon}
                  size={19}
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-[14px] font-extrabold tracking-tight text-[#0b1c30] dark:text-[#e2eee8] sm:text-[15px]">
                  {title}
                </h2>

                <p className="mt-1 text-[9px] font-medium leading-4 text-gray-500 dark:text-[#9aafa5]">
                  {description}
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Tutup"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-[#718078] transition hover:border-[#385247] hover:bg-[#1d2d26] hover:text-[#e2eee8] dark:text-[#9aafa5]"
            >
              <Icon
                name="close"
                size={16}
              />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* MODAL ACTIONS */
/* ========================================================= */

function ModalActions({
  onCancel,
  onAction,
  actionLabel,
}: {
  onCancel: () => void;
  onAction: () => void;
  actionLabel: string;
}) {
  return (

    <div className="mt-6 flex shrink-0 justify-end gap-2 border-t border-[#edf1ef] dark:border-[#263b32] pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-[#dce5e1] bg-white px-4 py-2.5 text-[10px] font-extrabold text-[#59675f] transition hover:bg-[#f6f9f7] hover:text-[#3d4a42]"
      >
        Batal
      </button>

      <button
        type="button"
        onClick={onAction}
        className="rounded-lg bg-[#006948] px-5 py-2.5 text-[10px] font-extrabold text-white shadow-[0_4px_12px_rgba(0,105,72,0.18)] transition hover:bg-[#00583d] active:scale-[0.98]"
      >
        {actionLabel}
      </button>
    </div>
  );
}

