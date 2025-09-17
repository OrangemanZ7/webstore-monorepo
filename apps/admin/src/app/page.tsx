"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");

  // Get functions and state from our Zustand store
  const { login, verifyTwoFactor, isLoading, error, isAuthenticated } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // This effect will run whenever isAuthenticated changes
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      if (response.twoFactorRequired) {
        setStep("2fa"); // Move to the next step
      }
    } catch (err) {
      console.error(err); // Error is already set in the store
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyTwoFactor({ username, token: twoFactorToken });
      // On success, the store's state will change, and the useEffect will redirect
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="mb-6 text-2xl font-bold text-center">Admin Login</h1>

        {step === "credentials" && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        )}

        {step === "2fa" && (
          <form onSubmit={handleVerify2FA}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Authentication Code
              </label>
              <input
                type="text"
                value={twoFactorToken}
                onChange={(e) => setTwoFactorToken(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 text-sm text-center text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
