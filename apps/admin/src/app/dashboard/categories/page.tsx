"use client";

import { useEffect, useState, useMemo } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/authStore";
import { ICategory } from "@/types";
import CategoryForm from "@/components/categoryForm";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 5;

export default function CategoriesPage() {
  // 1. State to manage the current view ('list' or 'form')
  const [view, setView] = useState<"list" | "form">("list");
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { categories, fetchCategories, deleteCategory } = useCategoryStore();
  const authToken = useAuthStore((state) => state.token);

  useEffect(() => {
    if (authToken) {
      fetchCategories(authToken);
    }
  }, [authToken, fetchCategories]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return categories.slice(startIndex, endIndex);
  }, [categories, currentPage]);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      if (!authToken) return;
      deleteCategory(id, authToken);
    }
  };

  // When the form is submitted or cancelled, return to the list view
  const handleFormComplete = () => {
    setEditingCategory(null);
    setView("list");
  };

  // Handler for the "Edit" button
  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setView("form");
  };

  // Handler for the "Add New" button
  const handleAddNew = () => {
    setEditingCategory(null); // Ensure we're not editing
    setView("form");
  };

  return (
    <div>
      {/* 2. Conditionally render the title and Add New button */}
      {view === "list" && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Categories</h1>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + Add New Category
          </button>
        </div>
      )}

      {/* 3. Conditionally render the form view */}
      {view === "form" && (
        <div>
          <button
            onClick={() => setView("list")}
            className="mb-6 text-blue-600 hover:underline"
          >
            &larr; Back to Categories List
          </button>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <CategoryForm
              categoryToEdit={editingCategory}
              onComplete={handleFormComplete}
            />
          </div>
        </div>
      )}

      {/* 4. Conditionally render the list view */}
      {view === "list" && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="space-y-4">
            {paginatedCategories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 border rounded-md flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{cat.name}</h3>
                  <ul className="pl-4 mt-2 list-disc">
                    {cat.subCategories.map((sub, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
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
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
