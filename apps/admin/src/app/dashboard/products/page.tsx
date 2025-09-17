"use client";

import { useEffect, useState, useMemo } from "react";
import { useProductStore } from "@/store/productStore";
import { useAuthStore } from "@/store/authStore";
import { IProduct } from "@/types";
import ProductForm from "@/components/ProductForm";
import Pagination from "@/components/Pagination";
import ProductsTable from "@/components/ProductsTable";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { products, fetchProducts } = useProductStore();
  const authToken = useAuthStore((state) => state.token);

  useEffect(() => {
    if (authToken) {
      fetchProducts(authToken);
    }
  }, [authToken, fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
            onClick={handleFormComplete}
            className="mb-6 text-blue-600 hover:underline"
          >
            &larr; Back to Products List
          </button>
          <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
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
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <ProductsTable products={paginatedProducts} onRowClick={handleEdit} />

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
