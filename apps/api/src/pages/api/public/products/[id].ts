import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query; // Get the product ID from the URL

  await dbConnect();

  if (method === "GET") {
    try {
      if (!id || typeof id !== "string") {
        return res
          .status(400)
          .json({ success: false, message: "Product ID is required" });
      }

      const product = await Product.findById(id).populate("category");

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
