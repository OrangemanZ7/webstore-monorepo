import { create } from "zustand";
import axios from "axios";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (values: any) => Promise<{ twoFactorRequired?: boolean }>;
  verifyTwoFactor: (values: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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

      // If 2FA is NOT required, token is returned directly
      if (response.data.token) {
        const token = response.data.token;
        set({ token, isAuthenticated: true, isLoading: false });
        // In a real app, you'd save the token to localStorage
      }

      set({ isLoading: false });
      return response.data; // e.g., { twoFactorRequired: true }
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
      const errorMsg = err.response?.data?.message || "2FA verification failed";
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  logout: () => {
    set({ token: null, isAuthenticated: false });
    // Clear token from localStorage
  },
}));
