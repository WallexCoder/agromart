"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  created_at: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!stored || !token) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(stored);

    if (parsedUser.role !== "seller") {
      router.push("/products");
      return;
    }

    setUser(parsedUser);

    // Fetch seller's products
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(productId: number) {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleteId(productId);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-neutral-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface text-neutral-50">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-surface-border bg-surface/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4 lg:px-12">
          <Link href="/" className="text-lg font-bold text-primary-300">
            AgroMart
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">
              {user?.first_name} {user?.last_name}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-surface-border px-4 py-2 text-sm text-neutral-300 transition hover:border-error hover:text-error"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 py-12 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
            <p className="mt-1 text-neutral-400">
              Manage your fertilizer listings.
            </p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-500"
          >
            + Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-surface-border bg-surface-raised p-6">
            <p className="text-sm text-neutral-400">Total Products</p>
            <p className="mt-1 text-3xl font-bold text-white">{products.length}</p>
          </div>
          <div className="rounded-xl border border-surface-border bg-surface-raised p-6">
            <p className="text-sm text-neutral-400">In Stock</p>
            <p className="mt-1 text-3xl font-bold text-success">
              {products.filter((p) => p.stock_quantity > 0).length}
            </p>
          </div>
          <div className="rounded-xl border border-surface-border bg-surface-raised p-6">
            <p className="text-sm text-neutral-400">Out of Stock</p>
            <p className="mt-1 text-3xl font-bold text-error">
              {products.filter((p) => p.stock_quantity === 0).length}
            </p>
          </div>
        </div>

        {/* Products table */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-surface-border bg-surface-raised py-20 text-center">
            <p className="text-4xl">🌱</p>
            <p className="mt-3 font-medium text-white">No products yet</p>
            <p className="mt-1 text-sm text-neutral-400">
              Add your first fertilizer listing to get started.
            </p>
            <Link
              href="/dashboard/products/new"
              className="mt-5 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
            >
              + Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-surface-border">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-border bg-surface-raised">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {products.map((product) => (
                  <tr key={product.id} className="bg-surface transition hover:bg-surface-raised">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-primary-900/40">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <span>🌿</span>
                          )}
                        </div>
                        <span className="font-medium text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-primary-300 font-medium">
                      ₦{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {product.stock_quantity} units
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        product.stock_quantity > 0
                          ? "bg-success/10 text-success"
                          : "bg-error/10 text-error"
                      }`}>
                        {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/products/${product.id}`}
                          className="text-xs text-primary-300 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteId === product.id}
                          className="text-xs text-error hover:underline disabled:opacity-50"
                        >
                          {deleteId === product.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
