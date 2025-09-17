"use client";

import { IProduct } from "@/types";

interface ProductsTableProps {
  products: IProduct[];
  onRowClick: (product: IProduct) => void;
}

export default function ProductsTable({
  products,
  onRowClick,
}: ProductsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Product Name</th>
            <th className="p-3">SKU</th>
            <th className="p-3">Category</th>
            <th className="p-3">Sub-Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Cost</th>
            <th className="p-3">Profit</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Stock Value</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const customerPrice = product.price || 0;
            const purchasePrice = product.purchasePrice || 0;
            const stockQuantity = product.stockQuantity || 0;
            const stockValue = customerPrice * stockQuantity;
            const profit = customerPrice - purchasePrice;
            const margin =
              customerPrice > 0 ? (profit / customerPrice) * 100 : 0;

            return (
              <tr
                key={product._id}
                onClick={() => onRowClick(product)}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.sku}</td>
                <td className="p-3">{product.category.name}</td>
                <td className="p-3">{product.subCategorySlug}</td>
                <td className="p-3">${customerPrice.toFixed(2)}</td>
                <td className="p-3">
                  ${(product.purchasePrice || 0).toFixed(2)}
                </td>
                <td
                  className={`p-3 font-medium ${
                    profit > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {margin.toFixed(1)}%
                </td>
                <td className="p-3">{stockQuantity}</td>
                <td className="p-3">${stockValue.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
