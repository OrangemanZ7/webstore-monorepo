"use client";

import { useState, useEffect } from "react";
import { IProduct } from "@/types";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import { useAuthStore } from "@/store/authStore";

interface ProductFormProps {
  productToEdit: IProduct | null;
  onComplete: () => void;
}

// Define an interface for the form's state shape
interface IFormData {
  name: string;
  description: string;
  price: number;
  sku: string;
  stockQuantity: number;
  images: string[]; // Explicitly type images as an array of strings
  category: string;
  subCategorySlug: string;
}

// Initial state for a blank form
const initialState = {
  name: "",
  description: "",
  price: 0,
  sku: "",
  stockQuantity: 0,
  images: [],
  category: "", // This will be the category ID
  subCategorySlug: "",
};

export default function ProductForm({
  productToEdit,
  onComplete,
}: ProductFormProps) {
  const [formData, setFormData] = useState<IFormData>(initialState);

  const { categories, fetchCategories } = useCategoryStore();
  const { addProduct, updateProduct } = useProductStore();
  const { token: authToken } = useAuthStore();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Populate form if we are editing
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        sku: productToEdit.sku,
        stockQuantity: productToEdit.stockQuantity,
        images: productToEdit.images,
        category: productToEdit.category._id,
        subCategorySlug: productToEdit.subCategorySlug,
      });
    } else {
      setFormData(initialState);
    }
  }, [productToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    try {
      if (productToEdit) {
        await updateProduct(productToEdit._id, formData, authToken);
      } else {
        await addProduct(formData, authToken);
      }
      onComplete();
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  const selectedCategory = categories.find((c) => c._id === formData.category);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name, SKU, Description */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-800">
          Product Name
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-800">
          SKU
        </label>
        <input
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-800">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Price and Stock */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-800">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-800">
            Stock
          </label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      </div>

      {/* Category and Sub-category */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-800">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-800">
            Sub-category
          </label>
          <select
            name="subCategorySlug"
            value={formData.subCategorySlug}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={!selectedCategory}
          >
            <option value="">Select Sub-category</option>
            {selectedCategory?.subCategories.map((sub) => (
              <option key={sub.slug} value={sub.slug}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 text-white bg-green-600 rounded-md"
      >
        {productToEdit ? "Update Product" : "Save Product"}
      </button>
      {productToEdit && (
        <button
          type="button"
          onClick={onComplete}
          className="w-full py-2 mt-2 bg-gray-200 rounded-md"
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
}
