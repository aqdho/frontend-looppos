"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      console.log("RESPONSE LOGIN:", data);

      if (!res.ok) {
        throw new Error(
          data.message ||
            data.pesan ||
            "Login gagal"
        );
      }

      // Simpan token
      localStorage.setItem("token", data.token);

      // Masuk ke halaman utama
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">

      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">

        <h1 className="mb-6 text-center text-2xl font-semibold text-zinc-900">
          Sign in
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
              placeholder="you@example.com"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
              placeholder="••••••••"
            />
          </div>

          {/* LOGIN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>

        </form>

        {/* REGISTER */}
        <p className="mt-6 text-center text-sm text-zinc-600">
          Don't have an account?{" "}

          <Link
            href="/register"
            className="font-medium text-zinc-900 underline underline-offset-4 hover:text-indigo-600"
          >
            Sign up
          </Link>

        </p>

      </div>
    </div>
  );
}