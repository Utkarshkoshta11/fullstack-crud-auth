"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: (form as any).username.value,
        password: (form as any).password.value
      })
    });

    router.push("/login");
  }

  return (
    <form onSubmit={handleRegister} className="p-8 space-y-4">
      <h1 className="text-xl font-bold">Register</h1>

      <input
        name="username"
        placeholder="Username"
        className="border p-2 block"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border p-2 block"
      />

      <button className="bg-black text-white px-4 py-2">
        Register
      </button>
    </form>
  );
}
