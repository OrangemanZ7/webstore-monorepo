import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/middleware/auth";

const handler = async (req: any, res: NextApiResponse) => {
  const { method } = req;

  // Add this block to handle the CORS preflight request
  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const products = await Product.find({}).populate("category");
        return res.status(200).json({ success: true, data: products });
      } catch (error) {
        return res.status(400).json({ success: false });
      }
    case "POST":
      try {
        const product = await Product.create(req.body);
        return res.status(201).json({ success: true, data: product });
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, error: (error as Error).message });
      }
    default:
      res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default auth(handler);
