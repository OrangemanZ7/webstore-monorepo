"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function SecurityPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [token, setToken] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const { token: authToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/admin/2fa-setup",
          { username: "admin" }, // Pass username for the QR label
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setQrCodeUrl(response.data.qrCodeUrl);
      } catch (err) {
        setFormError("Could not generate QR Code. Please try again.");
      }
    };
    if (authToken) {
      generateQrCode();
    }
  }, [authToken]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/admin/verify-2fa", {
        username: "admin",
        token,
      });
      setSuccess("2FA has been successfully enabled!");
      setFormError("");
      setTimeout(() => router.push("/dashboard"), 2000); // Redirect on success
    } catch (err) {
      setFormError("Invalid token. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="mb-4 text-2xl font-bold text-center">
          Set Up Two-Factor Authentication
        </h1>
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center">
            Scan the QR code with your authenticator app (like Google
            Authenticator).
          </p>
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="2FA QR Code" />
          ) : (
            <p>Loading QR Code...</p>
          )}
          <form onSubmit={handleVerify} className="w-full mt-6">
            <label className="block mb-2 text-sm font-medium">
              Verification Code
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 text-center border rounded-md"
              placeholder="123456"
              required
            />
            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md"
            >
              Enable 2FA
            </button>
            {formError && (
              <p className="mt-4 text-sm text-center text-red-500">
                {formError}
              </p>
            )}
            {success && (
              <p className="mt-4 text-sm text-center text-green-500">
                {success}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
