"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "@/store/productStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types";
import ProductForm from "@/components/ProductForm";
import axios from "axios"; // Add this import

export default function ProductsPage() {
  const { products, fetchProducts, deleteProduct } = useProductStore();
  const { isAuthenticated, token: authToken } = useAuthStore();
  const router = useRouter();

  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      fetchProducts();
    }
  }, [isAuthenticated, router, authToken, fetchProducts]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      if (!authToken) return;
      deleteProduct(id, authToken);
    }
  };

  const handleFormComplete = () => {
    setEditingProduct(null);
  };

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Manage Products</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-1">
          <h2 className="mb-4 text-xl font-semibold">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <ProductForm
            productToEdit={editingProduct}
            onComplete={handleFormComplete}
          />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Existing Products</h2>
          <div className="space-y-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="p-4 border rounded-md">
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-800">
                    {product.category.name} &gt; {product.subCategorySlug}
                  </p>
                  <p className="text-lg font-semibold">${product.price}</p>
                  <p className="text-sm">Stock: {product.stockQuantity}</p>
                  <div className="mt-3 space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="px-3 py-1 text-sm text-white bg-blue-500 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found. Add one to get started!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
