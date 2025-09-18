import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { category: categorySlug } = req.query; // Get category slug from query params

  await dbConnect();

  if (method === "GET") {
    try {
      const filter: any = {};

      // If a category slug is provided, find the category's ID and add it to the filter
      if (categorySlug) {
        const category = await Category.findOne({
          slug: categorySlug as string,
        });
        if (category) {
          filter.category = category._id;
        } else {
          // If category not found, return empty array as no products can match
          return res.status(200).json({ success: true, data: [] });
        }
      }

      // Use the filter object in the find query. If empty, it returns all products.
      const products = await Product.find(filter).populate("category");
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
