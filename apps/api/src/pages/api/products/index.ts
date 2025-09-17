import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/middleware/auth"; // Import the auth middleware

const handler = async (req: any, res: NextApiResponse) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const products = await Product.find({}).populate("category");
        res.status(200).json({ success: true, data: products });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, error: (error as Error).message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
};

// Wrap the entire handler with the auth middleware
export default auth(handler);
