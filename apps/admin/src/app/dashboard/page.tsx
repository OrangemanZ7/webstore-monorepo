"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use navigation for App Router
import { useEffect } from "react";

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <p>Redirecting to login...</p>; // Or a loading spinner
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, admin!</p>

      <div className="mt-8">
        <Link
          href="/dashboard/security"
          className="text-blue-600 hover:underline"
        >
          Go to Security Settings (2FA Setup)
        </Link>
        <Link
          href="/dashboard/categories"
          className="block text-blue-600 hover:underline"
        >
          Manage Categories
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-8 text-white bg-red-600 rounded"
      >
        Logout
      </button>
    </div>
  );
}
