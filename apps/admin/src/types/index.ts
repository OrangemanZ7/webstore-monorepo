// This file defines the shape of our data for the admin frontend

export interface ISubCategory {
  name: string;
  slug: string;
}

export interface ICategory {
  _id: string; // Explicitly define _id as a string
  name: string;
  slug: string;
  subCategories: ISubCategory[];
}
