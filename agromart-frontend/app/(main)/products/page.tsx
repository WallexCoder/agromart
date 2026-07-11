"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  category_id: number | null;
  seller_id: number;
  created_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-surface text-neutral-50">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-surface-border bg-surface/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4 lg:px-12">
          <Link href="/" className="text-lg font-bold text-primary-300">
            AgroMart
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-neutral-300 hover:text-primary-300">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <div className="px-6 py-12 lg:px-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Fertilizer Marketplace</h1>
          <p className="mt-1 text-neutral-400">
            Browse available fertilizer products from trusted sellers across Nigeria.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-lg border border-surface-border bg-surface-raised px-4 py-2.5 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-primary-500"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-neutral-400">Loading products...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl">🌱</p>
            <p className="mt-3 font-medium text-white">No products found</p>
            <p className="mt-1 text-sm text-neutral-400">
              {search
                ? "Try a different search term."
                : "No products have been listed yet. Check back soon."}
            </p>
          </div>
        )}

        {/* Product grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group overflow-hidden rounded-xl border border-surface-border bg-surface-raised transition hover:border-primary-700"
              >
                {/* Product image */}
                <div className="relative h-48 w-full overflow-hidden bg-primary-900/30">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      🌿
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white">{product.name}</h3>
                  {product.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-300">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        product.stock_quantity > 0
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      {product.stock_quantity > 0 ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
