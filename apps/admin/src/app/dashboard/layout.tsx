"use client"; // 1. Convert to a Client Component

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  // 2. Add an effect to protect the dashboard routes
  useEffect(() => {
    // If the store is not authenticated, redirect to login page
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // 3. Render a loading state or null while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // 4. If authenticated, render the full layout and page content
  return (
    <section className="flex h-screen bg-gray-100">
      <aside className="w-64 flex flex-col p-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav className="flex flex-col space-y-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/categories"
            className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            Categories
          </Link>
          <Link
            href="/dashboard/products"
            className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            Products
          </Link>
          <Link
            href="/dashboard/security"
            className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            Security
          </Link>
        </nav>

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </section>
  );
}
