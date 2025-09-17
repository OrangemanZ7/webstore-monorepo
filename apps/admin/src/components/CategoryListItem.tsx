"use client";

import { ICategory } from "@/types";

interface CategoryListItemProps {
  category: ICategory;
  onEdit: (category: ICategory) => void;
  onDelete: (id: string) => void;
}

export default function CategoryListItem({
  category,
  onEdit,
  onDelete,
}: CategoryListItemProps) {
  return (
    <div className="p-4 border rounded-md flex justify-between items-center">
      <div>
        <h3 className="font-bold">{category.name}</h3>
        <ul className="pl-4 mt-2 list-disc">
          {category.subCategories.map((sub, index) => (
            <li key={index} className="text-sm text-gray-600">
              {sub.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onEdit(category)}
          className="px-3 py-1 text-sm text-white bg-blue-500 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(category._id)}
          className="px-3 py-1 text-sm text-white bg-red-500 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
