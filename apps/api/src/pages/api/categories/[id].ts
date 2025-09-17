import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/middleware/auth";

const handler = async (req: any, res: NextApiResponse) => {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const category = await Category.findById(id);
        if (!category) {
          return res
            .status(404)
            .json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: category });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const category = await Category.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!category) {
          return res
            .status(404)
            .json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: category });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedCategory = await Category.deleteOne({ _id: id });
        if (!deletedCategory.deletedCount) {
          return res
            .status(404)
            .json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
};

// We wrap the handler with auth middleware to protect these routes
export default auth(handler);
