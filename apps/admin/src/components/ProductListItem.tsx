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
  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-bold">{product.name}</h3>
      <p className="text-sm text-gray-800">
        {product.category.name} &gt; {product.subCategorySlug}
      </p>
      <p className="text-lg font-semibold">${product.price}</p>
      <p className="text-sm">Stock: {product.stockQuantity}</p>
      <div className="mt-3 space-x-2">
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
