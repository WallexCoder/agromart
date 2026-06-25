"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "buyer" as "buyer" | "seller",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await registerUser(form);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel — farm illustration, dimmed */}
      <div className="relative hidden overflow-hidden lg:block">
        <svg
          viewBox="0 0 800 1000"
          className="absolute inset-0 h-full w-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Sky */}
          <rect width="800" height="1000" fill="#A8D5E8" />
          {/* Sun glow */}
          <circle cx="620" cy="160" r="90" fill="#FCE9B8" opacity="0.8" />
          {/* Distant hills */}
          <path d="M0,420 Q200,360 400,400 T800,380 L800,520 L0,520 Z" fill="#C9D98A" />
          {/* Wheat field */}
          <path d="M0,480 L800,460 L800,620 L0,640 Z" fill="#E0B84A" />
          <g stroke="#C99B2E" strokeWidth="3" opacity="0.5">
            {Array.from({ length: 40 }).map((_, i) => (
              <line key={i} x1={i * 22} y1={500 + (i % 3) * 6} x2={i * 22} y2={460 + (i % 3) * 6} />
            ))}
          </g>
          {/* Farmhouse */}
          <g transform="translate(560,360)">
            <rect x="0" y="40" width="110" height="80" fill="#8C5A3A" />
            <polygon points="-10,40 55,0 120,40" fill="#5E3A24" />
            <rect x="45" y="70" width="22" height="50" fill="#3E2A1A" />
            <rect x="14" y="58" width="16" height="16" fill="#CFE7F2" />
          </g>
          {/* Pond */}
          <ellipse cx="330" cy="560" rx="80" ry="26" fill="#6FA8C9" opacity="0.85" />
          {/* Grazing field */}
          <rect x="0" y="600" width="800" height="120" fill="#86A93E" />
          {/* Cows / sheep (simple blobs) */}
          <g fill="#F4F1EA">
            <ellipse cx="470" cy="500" rx="20" ry="13" />
            <ellipse cx="510" cy="510" rx="18" ry="12" />
            <ellipse cx="610" cy="495" rx="16" ry="11" />
          </g>
          {/* Crop rows */}
          <rect x="0" y="700" width="800" height="300" fill="#3F6B2E" />
          {Array.from({ length: 6 }).map((_, row) => (
            <g key={row} transform={`translate(0, ${720 + row * 45})`}>
              {Array.from({ length: 18 }).map((_, i) => (
                <circle
                  key={i}
                  cx={20 + i * 44}
                  cy={0}
                  r="14"
                  fill={row % 2 === 0 ? "#4F8A3D" : "#5DA14A"}
                />
              ))}
            </g>
          ))}
          {/* Tomatoes / crates accent */}
          <g transform="translate(60,920)">
            <rect width="90" height="40" rx="4" fill="#7A4A2A" />
            {Array.from({ length: 5 }).map((_, i) => (
              <circle key={i} cx={14 + i * 16} cy={18} r="9" fill="#C0392B" />
            ))}
          </g>
          {/* Hen */}
          <g transform="translate(220,940)">
            <ellipse cx="0" cy="0" rx="22" ry="16" fill="#F5F5F0" />
            <circle cx="20" cy="-10" r="9" fill="#F5F5F0" />
            <polygon points="28,-10 40,-7 28,-4" fill="#E0A030" />
          </g>
        </svg>

        {/* Dim overlay */}
        <div className="absolute inset-0 bg-primary-900/55" />

        {/* Overlay content */}
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <span className="text-lg font-bold tracking-tight">AgroMart</span>
          <div>
            <p className="max-w-sm text-2xl font-medium leading-snug">
              Fertilizer, sourced and sold the way farmers actually work —
              one WhatsApp message away.
            </p>
            <p className="mt-4 text-sm text-primary-100">
              Built for farmers, distributors, and sellers across Nigeria.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
            Join AgroMart
          </p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary-700 hover:underline">
              Log in
            </a>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-neutral-700">First name</label>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-700">Last name</label>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700">Email address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700">Phone number</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700">I am a</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              >
                <option value="buyer">Buyer (farmer / distributor)</option>
                <option value="seller">Seller (fertilizer supplier)</option>
              </select>
            </div>

            {error && (
              <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-700 py-2.5 text-sm font-medium text-white transition hover:bg-primary-900 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create My Account"}
            </button>

            <p className="text-center text-xs text-neutral-400">
              Your information is kept private and is never sold to third parties.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}