import { create } from "zustand";
import axios from "axios";
import { persist } from "zustand/middleware"; // 1. Import the persist middleware

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (values: any) => Promise<{ twoFactorRequired?: boolean }>;
  verifyTwoFactor: (values: any) => Promise<void>;
  logout: () => void;
}

// 2. Wrap the store definition with the persist middleware
export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async ({ username, password }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            "http://localhost:3001/api/admin/login",
            {
              username,
              password,
            }
          );

          if (response.data.token) {
            const token = response.data.token;
            set({ token, isAuthenticated: true, isLoading: false });
          }

          set({ isLoading: false });
          return response.data;
        } catch (err: any) {
          const errorMsg = err.response?.data?.message || "Login failed";
          set({ error: errorMsg, isLoading: false });
          throw new Error(errorMsg);
        }
      },

      verifyTwoFactor: async ({ username, token }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            "http://localhost:3001/api/admin/verify-2fa",
            {
              username,
              token,
            }
          );

          if (response.data.token) {
            const authToken = response.data.token;
            set({ token: authToken, isAuthenticated: true, isLoading: false });
          }
        } catch (err: any) {
          const errorMsg =
            err.response?.data?.message || "2FA verification failed";
          set({ error: errorMsg, isLoading: false });
          throw new Error(errorMsg);
        }
      },

      logout: () => {
        set({ token: null, isAuthenticated: false });
      },
    }),
    {
      // 3. Configure the middleware
      name: "auth-storage", // Name for the storage item in localStorage
      onRehydrateStorage: (state) => {
        // This function runs when the state is restored from storage
        if (state.token) {
          // If a token is restored, update the isAuthenticated flag
          state.isAuthenticated = true;
        }
      },
    }
  )
);
