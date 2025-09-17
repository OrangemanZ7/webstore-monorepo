"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/"); // Redirect to login page after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 mt-auto text-left text-red-200 hover:bg-red-700 hover:text-white rounded-md"
    >
      Logout
    </button>
  );
}
