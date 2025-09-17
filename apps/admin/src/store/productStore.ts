import { create } from "zustand";
import axios from "axios";
import { IProduct } from "@/types";

interface ProductState {
  products: IProduct[];
  fetchProducts: () => Promise<void>;
  addProduct: (productData: any, authToken: string) => Promise<void>;
  updateProduct: (
    id: string,
    productData: any,
    authToken: string
  ) => Promise<void>;
  deleteProduct: (id: string, authToken: string) => Promise<void>;
}

const API_URL = "http://localhost:3001/api";

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  fetchProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      set({ products: response.data.data });
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  },
  addProduct: async (productData, authToken) => {
    try {
      await axios.post(`${API_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await get().fetchProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
      throw error;
    }
  },
  updateProduct: async (id, productData, authToken) => {
    try {
      await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await get().fetchProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  },
  deleteProduct: async (id, authToken) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await get().fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  },
}));
