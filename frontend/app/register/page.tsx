"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const username = data.get("username") as string;
    const password = data.get("password") as string;

    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      setSuccess("Registration successful. You can login now.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-4"
        data-testid="register-form"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {success && (
          <p className="text-green-600 text-sm text-center">{success}</p>
        )}

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
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already registered?{" "}
          <Link href="/login" className="text-blue-600 underline">
            Login here
          </Link>
        </p>
      </form>
    </main>
  );
}
