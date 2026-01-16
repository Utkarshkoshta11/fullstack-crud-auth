import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-10 w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold">Fullstack CRUD App</h1>

        <p className="text-gray-600">
          Manage products with secure authentication
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="border border-black py-2 rounded hover:bg-gray-100 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
