"use client";

import { useEffect, useState, useMemo } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/authStore";
import { ICategory } from "@/types";
import CategoryForm from "@/components/categoryForm";
import Pagination from "@/components/Pagination";
import CategoryListItem from "@/components/CategoryListItem";

const ITEMS_PER_PAGE = 5;

export default function CategoriesPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { categories, fetchCategories, deleteCategory } = useCategoryStore();
  const authToken = useAuthStore((state) => state.token);

  useEffect(() => {
    if (authToken) {
      fetchCategories(authToken);
    }
  }, [authToken, fetchCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;

    const term = searchTerm.toLowerCase();

    return categories.filter((category) => {
      const nameMatch = category.name.toLowerCase().includes(term);
      const subCategoryMatch = category.subCategories.some((sub) =>
        sub.name.toLowerCase().includes(term)
      );
      return nameMatch || subCategoryMatch;
    });
  }, [categories, searchTerm]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, currentPage]);

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      if (!authToken) return;
      deleteCategory(id, authToken);
    }
  };

  const handleFormComplete = () => {
    setEditingCategory(null);
    setView("list");
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setView("form");
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setView("form");
  };

  return (
    <div>
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

      {/* This is the corrected block with the full JSX */}
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

      {view === "list" && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-4">
            {paginatedCategories.length > 0 ? (
              paginatedCategories.map((cat) => (
                <CategoryListItem
                  key={cat._id}
                  category={cat}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-gray-500">No categories found.</p>
            )}
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
