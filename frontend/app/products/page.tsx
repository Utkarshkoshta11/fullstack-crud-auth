"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  async function loadProducts() {
    const data = await apiFetch<Product[]>("/api/products", { auth: true });
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.name || !form.price) {
      alert("Name and price are required");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
    };

    try {
      if (editingId) {
        await apiFetch(`/api/products/${editingId}`, {
          method: "PUT",
          auth: true,
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/api/products", {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        });
      }

      setForm({ name: "", description: "", price: "", category: "" });
      setEditingId(null);
      loadProducts();
    } catch (err) {
      alert("This product no longer exists.");
      setEditingId(null);
      setForm({ name: "", description: "", price: "", category: "" });
      loadProducts();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;

    await apiFetch(`/api/products/${id}`, {
      method: "DELETE",
      auth: true,
    });

    // ✅ IMPORTANT FIX
    if (editingId === id) {
      setEditingId(null);
      setForm({ name: "", description: "", price: "", category: "" });
      alert("The product you were editing was deleted.");
    }

    loadProducts();
  }

  function handleEdit(product: Product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      category: product.category || "",
    });
  }

  async function handleLogout() {
    await apiFetch("/api/auth/logout", {
      method: "POST",
      auth: true,
    });

    router.push("/login");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Add / Edit Form */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mb-8 bg-green-600 text-white px-4 py-2 rounded"
      >
        {editingId ? "Update Product" : "Add Product"}
      </button>

      {/* Products Table */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Price</th>
            <th className="border p-2 text-left">Category</th>
            <th className="border p-2 text-center">Edit</th>
            <th className="border p-2 text-center">Delete</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.description || "-"}</td>
              <td className="border p-2">₹{product.price}</td>
              <td className="border p-2">{product.category || "-"}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-blue-600"
                >
                  Edit
                </button>
              </td>

              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
