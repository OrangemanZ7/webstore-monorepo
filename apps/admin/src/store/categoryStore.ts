import { create } from "zustand";
import axios from "axios";
import { ICategory } from "@api/models/Category";

interface CategoryState {
  categories: ICategory[];
  fetchCategories: () => Promise<void>;
  addCategory: (categoryData: any, authToken: string) => Promise<void>;
}

const API_URL = "http://localhost:3001/api";

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  fetchCategories: async () => {
    try {
      const response = await axios.get<{ data: ICategory[] }>(
        `${API_URL}/categories`
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
      await get().fetchCategories();
    } catch (error) {
      console.error("Failed to add category:", error);
      throw error;
    }
  },
}));
