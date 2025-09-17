"use client";

import { useEffect, useState, useMemo } from "react";
import { useProductStore } from "@/store/productStore";
import { useAuthStore } from "@/store/authStore";
import { IProduct } from "@/types";
import ProductForm from "@/components/ProductForm";
import Pagination from "@/components/Pagination";
import ProductListItem from "@/components/ProductListItem";

const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { products, fetchProducts, deleteProduct } = useProductStore();
  const authToken = useAuthStore((state) => state.token);

  useEffect(() => {
    if (authToken) {
      fetchProducts(authToken);
    }
  }, [authToken, fetchProducts]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      if (!authToken) return;
      deleteProduct(id, authToken);
    }
  };

  const handleFormComplete = () => {
    setEditingProduct(null);
    setView("list");
  };

  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
    setView("form");
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setView("form");
  };

  return (
    <div>
      {view === "list" && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + Add New Product
          </button>
        </div>
      )}

      {view === "form" && (
        <div>
          <button
            onClick={() => setView("list")}
            className="mb-6 text-blue-600 hover:underline"
          >
            &larr; Back to Products List
          </button>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <ProductForm
              productToEdit={editingProduct}
              onComplete={handleFormComplete}
            />
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="space-y-4">
            {paginatedProducts.map((product) => (
              <ProductListItem
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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
