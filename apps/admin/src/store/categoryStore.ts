import { create } from "zustand";
import axios from "axios";
import { ICategory } from "@/types";

interface CategoryState {
  categories: ICategory[];
  fetchCategories: (authToken: string) => Promise<void>;
  addCategory: (categoryData: any, authToken: string) => Promise<void>;
  updateCategory: (
    id: string,
    categoryData: any,
    authToken: string
  ) => Promise<void>;
  deleteCategory: (id: string, authToken: string) => Promise<void>;
}

const API_URL = "http://localhost:3001/api";

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  fetchCategories: async (authToken) => {
    try {
      const response = await axios.get<{ data: ICategory[] }>(
        `${API_URL}/categories`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      set({ categories: response.data.data });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },
  addCategory: async (categoryData, authToken) => {
    try {
      await axios.post(`${API_URL}/categories`, categoryData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await get().fetchCategories(authToken);
    } catch (error) {
      console.error("Failed to add category:", error);
      throw error;
    }
  },
  updateCategory: async (id, categoryData, authToken) => {
    try {
      await axios.put(`${API_URL}/categories/${id}`, categoryData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await get().fetchCategories(authToken);
    } catch (error) {
      console.error("Failed to update category:", error);
      throw error;
    }
  },
  deleteCategory: async (id, authToken) => {
    try {
      await axios.delete(`${API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await get().fetchCategories(authToken);
    } catch (error) {
      console.error("Failed to delete category:", error);
      throw error;
    }
  },
}));
