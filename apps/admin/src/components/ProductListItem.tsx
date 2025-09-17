"use client";

import { IProduct } from "@/types";

interface ProductListItemProps {
  product: IProduct;
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}

export default function ProductListItem({
  product,
  onEdit,
  onDelete,
}: ProductListItemProps) {
  // Use a fallback of 0 if purchasePrice is missing
  const purchasePrice = product.purchasePrice || 0;
  const customerPrice = product.price || 0;
  const stockQuantity = product.stockQuantity || 0;

  // Calculate profit and margin safely
  const profit = customerPrice - purchasePrice;
  const margin = customerPrice > 0 ? (profit / customerPrice) * 100 : 0;
  const stockValue = customerPrice * stockQuantity;

  return (
    <div className="p-4 border rounded-md flex justify-between items-start">
      <div>
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
        <p className="text-sm text-gray-800">
          {product.category.name} &gt; {product.subCategorySlug}
        </p>

        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="font-semibold">Customer Price:</span>
          <span>${customerPrice.toFixed(2)}</span>

          <span className="font-semibold">Cost:</span>
          {/* Use the safe purchasePrice variable */}
          <span>${purchasePrice.toFixed(2)}</span>

          <span className="font-semibold">Profit:</span>
          <span className={profit > 0 ? "text-green-600" : "text-red-600"}>
            ${profit.toFixed(2)} ({margin.toFixed(1)}%)
          </span>

          <span className="font-semibold">Stock:</span>
          <span>{product.stockQuantity} units</span>

          <span className="font-semibold">Stock Value:</span>
          <span>${stockValue.toFixed(2)}</span>
        </div>
      </div>
      <div className="space-x-2 flex-shrink-0 ml-4">
        <button
          onClick={() => onEdit(product)}
          className="px-3 py-1 text-sm text-white bg-blue-500 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="px-3 py-1 text-sm text-white bg-red-500 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
