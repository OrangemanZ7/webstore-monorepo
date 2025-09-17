import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // This block handles the CORS preflight request sent by the browser.
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // We only allow POST requests for the actual login.
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If 2FA is enabled for this admin, signal to the frontend
    // that the next step is required. Do not issue a token yet.
    if (admin.isTwoFactorEnabled) {
      return res.status(200).json({ twoFactorRequired: true });
    }

    // If 2FA is not enabled, sign and return the JWT immediately.
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      process.env.JWT_SECRET || "your-default-secret",
      { expiresIn: "8h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login API Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
