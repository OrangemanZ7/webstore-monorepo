import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      // Code to get a single category by ID will go here
      break;
    case "PUT":
      // Code to update a category will go here
      break;
    case "DELETE":
      // Code to delete a category will go here
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
