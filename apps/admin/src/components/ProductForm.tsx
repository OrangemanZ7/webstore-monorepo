"use client";

import { useState, useEffect } from "react";
import { IProduct } from "@/types";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import { useAuthStore } from "@/store/authStore";

interface ProductFormProps {
  productToEdit: IProduct | null;
  onComplete: () => void; // Used for save, update, delete, cancel
}

interface IFormData {
  name: string;
  description: string;
  price: number;
  purchasePrice: number;
  sku: string;
  stockQuantity: number;
  images: string[];
  category: string;
  subCategorySlug: string;
}

const initialState: IFormData = {
  name: "",
  description: "",
  price: 0,
  purchasePrice: 0,
  sku: "",
  stockQuantity: 0,
  images: [],
  category: "",
  subCategorySlug: "",
};

export default function ProductForm({
  productToEdit,
  onComplete,
}: ProductFormProps) {
  const [formData, setFormData] = useState<IFormData>(initialState);
  const { categories, fetchCategories } = useCategoryStore();
  const { addProduct, updateProduct, deleteProduct } = useProductStore();
  const { token: authToken } = useAuthStore();

  useEffect(() => {
    if (authToken) {
      fetchCategories(authToken);
    }
  }, [authToken, fetchCategories]);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        purchasePrice: productToEdit.purchasePrice || 0,
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
    const processedValue =
      name === "price" || name === "purchasePrice" || name === "stockQuantity"
        ? parseFloat(value) || 0
        : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
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

  const handleDelete = async () => {
    if (
      productToEdit &&
      window.confirm(
        "Are you sure you want to permanently delete this product?"
      )
    ) {
      if (!authToken) return;
      try {
        await deleteProduct(productToEdit._id, authToken);
        onComplete();
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };

  const selectedCategory = categories.find((c) => c._id === formData.category);

  const profit = formData.price - formData.purchasePrice;
  const margin = formData.price > 0 ? (profit / formData.price) * 100 : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-800">
            Purchase Price
          </label>
          <input
            type="number"
            step="0.01"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-800">
            Customer Price
          </label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
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
      {productToEdit && (
        <div className="p-3 mt-4 bg-gray-50 rounded-md border text-sm">
          <h3 className="font-semibold mb-2 text-gray-700">Profit Analysis</h3>
          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-gray-600">Profit per Unit:</span>
            <span
              className={`font-medium ${
                profit > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${profit.toFixed(2)}
            </span>
            <span className="text-gray-600">Profit Margin:</span>
            <span
              className={`font-medium ${
                margin > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {margin.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 text-white bg-green-600 rounded-md"
        >
          {productToEdit ? "Update Product" : "Save Product"}
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="flex-1 px-4 py-2 bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        {productToEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full px-4 py-2 mt-2 text-white bg-red-600 rounded-md"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
