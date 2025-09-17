import mongoose, { Document, Schema, model, models } from "mongoose";

export interface ISubCategory {
  name: string;
  slug: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  subCategories: ISubCategory[];
}

const SubCategorySchema = new Schema<ISubCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subCategories: [SubCategorySchema],
  },
  { timestamps: true }
);

export default models.Category || model<ICategory>("Category", CategorySchema);
