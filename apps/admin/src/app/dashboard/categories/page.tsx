"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { ICategory } from "@/types";
import CategoryForm from "@/components/categoryForm";

export default function CategoriesPage() {
  // Add deleteCategory here
  const { categories, fetchCategories, deleteCategory } = useCategoryStore();
  const { isAuthenticated, token: authToken } = useAuthStore();
  const router = useRouter();

  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else {
      fetchCategories();
    }
  }, [isAuthenticated, router, fetchCategories]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      if (!authToken) return;
      deleteCategory(id, authToken);
    }
  };

  const handleFormComplete = () => {
    setEditingCategory(null);
  };

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Manage Categories</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-1">
          <h2 className="mb-4 text-xl font-semibold">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <CategoryForm
            categoryToEdit={editingCategory}
            onComplete={handleFormComplete}
          />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Existing Categories</h2>
          <div className="space-y-4">
            {(categories as ICategory[]).length > 0 ? (
              (categories as ICategory[]).map((cat) => (
                <div key={cat._id} className="p-4 border rounded-md">
                  <h3 className="font-bold">{cat.name}</h3>
                  <ul className="pl-4 mt-2 list-disc">
                    {cat.subCategories.map((sub, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 space-x-2">
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="px-3 py-1 text-sm text-white bg-blue-500 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No categories found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
