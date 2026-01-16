"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  async function loadProducts() {
    const data = await apiFetch("/api/products", {
      auth: true, // ✅ REQUIRED
    });
    setProducts(data);
  }

  async function addProduct() {
    await apiFetch("/api/products", {
      method: "POST",
      auth: true, // ✅ REQUIRED
      body: JSON.stringify({
        name: "Sample Product",
        price: 1000,
        category: "General",
      }),
    });
    loadProducts();
  }

  async function deleteProduct(id: string) {
    await apiFetch(`/api/products/${id}`, {
      method: "DELETE",
      auth: true, // ✅ REQUIRED
    });
    loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Products</h1>

      <button
        onClick={addProduct}
        className="bg-green-600 text-white px-4 py-2 my-4"
      >
        Add Product
      </button>

      {products.map((product) => (
        <div key={product._id} className="flex gap-4 items-center">
          <span>{product.name}</span>
          <button
            onClick={() => deleteProduct(product._id)}
            className="text-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
