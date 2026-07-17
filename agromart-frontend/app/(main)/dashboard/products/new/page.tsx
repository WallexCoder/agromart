"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    image_url: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          price: parseFloat(form.price),
          stock_quantity: parseInt(form.stock_quantity),
          image_url: form.image_url || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to create product");
      }

      setSuccess("Product added successfully! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface text-neutral-50">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-surface-border bg-surface/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4 lg:px-12">
          <Link href="/" className="text-lg font-bold text-primary-300">
            AgroMart
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-neutral-300 hover:text-primary-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-xl">
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
          <p className="mt-1 text-neutral-400">
            Fill in the details below to list your fertilizer product.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-medium text-neutral-300">
                Product Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. NPK Fertilizer 50kg"
                className="mt-1 w-full rounded-lg border border-surface-border bg-surface-raised px-3 py-2.5 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your product..."
                className="mt-1 w-full rounded-lg border border-surface-border bg-surface-raised px-3 py-2.5 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-neutral-300">
                  Price (₦) *
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 25000"
                  className="mt-1 w-full rounded-lg border border-surface-border bg-surface-raised px-3 py-2.5 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-300">
                  Stock Quantity *
                </label>
                <input
                  name="stock_quantity"
                  type="number"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 100"
                  className="mt-1 w-full rounded-lg border border-surface-border bg-surface-raised px-3 py-2.5 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300">
                Image URL
              </label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="mt-1 w-full rounded-lg border border-surface-border bg-surface-raised px-3 py-2.5 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-primary-500"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Paste a direct image link. Leave blank to use default icon.
              </p>
            </div>

            {success && (
              <p className="rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success">
                ✓ {success}
              </p>
            )}

            {error && (
              <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-700 py-3 text-sm font-medium text-white transition hover:bg-primary-500 disabled:opacity-60"
            >
              {loading ? "Adding product..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
