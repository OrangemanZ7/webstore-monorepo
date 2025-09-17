import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  purchasePrice: number;
  sku: string;
  stockQuantity: number;
  images: string[];
  category: Schema.Types.ObjectId;
  subCategorySlug: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    stockQuantity: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // This creates the reference to the Category model
      required: true,
    },
    subCategorySlug: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
