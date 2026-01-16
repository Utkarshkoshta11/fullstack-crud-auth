"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const username = data.get("username") as string;
    const password = data.get("password") as string;

    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ username, password }),
      });

      router.push("/products");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-4"
        data-testid="login-form"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          name="username"
          placeholder="Username"
          required
          className="border p-2 w-full rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center">
          New user?{" "}
          <Link href="/register" className="text-blue-600 underline">
            Register here
          </Link>
        </p>
      </form>
    </main>
  );
}
