"use client";

import { useState, useEffect } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/authStore";
// BEFORE: import { ICategory } from '@api/models/Category';
// AFTER: Import from the new local types file
import { ICategory } from "@/types";

// Helper function to create a URL-friendly slug
const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

interface CategoryFormProps {
  categoryToEdit: ICategory | null;
  onComplete: () => void;
}

export default function CategoryForm({
  categoryToEdit,
  onComplete,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [subCategories, setSubCategories] = useState<
    { name: string; slug: string }[]
  >([{ name: "", slug: "" }]);
  const { addCategory, updateCategory } = useCategoryStore();
  const { token: authToken } = useAuthStore();

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setSubCategories(categoryToEdit.subCategories);
    } else {
      setName("");
      setSubCategories([{ name: "", slug: "" }]);
    }
  }, [categoryToEdit]);

  const handleSubCategoryChange = (
    index: number,
    field: "name" | "slug",
    value: string
  ) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[index][field] = value;
    if (field === "name") {
      updatedSubCategories[index].slug = generateSlug(value);
    }
    setSubCategories(updatedSubCategories);
  };

  const addSubCategoryField = () => {
    setSubCategories([...subCategories, { name: "", slug: "" }]);
  };

  const removeSubCategoryField = (index: number) => {
    const updatedSubCategories = subCategories.filter((_, i) => i !== index);
    setSubCategories(updatedSubCategories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !categoryToEdit?._id) return; // Guard against missing auth token or id

    const payload = {
      name,
      slug: generateSlug(name),
      subCategories,
    };

    try {
      if (categoryToEdit) {
        await updateCategory(categoryToEdit._id, payload, authToken);
      } else {
        await addCategory(payload, authToken);
      }
      onComplete(); // Signal completion to the parent component
    } catch (error) {
      console.error("Failed to save category");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Sub-categories</label>
        {subCategories.map((sub, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Sub-category Name"
              value={sub.name}
              onChange={(e) =>
                handleSubCategoryChange(index, "name", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <button
              type="button"
              onClick={() => removeSubCategoryField(index)}
              className="px-2 py-1 text-white bg-red-500 rounded"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSubCategoryField}
          className="w-full px-3 py-2 mt-2 text-sm text-blue-600 border border-blue-600 rounded"
        >
          + Add Sub-category
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-2 text-white bg-green-600 rounded-md"
      >
        {categoryToEdit ? "Update Category" : "Save Category"}
      </button>
      {categoryToEdit && (
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
