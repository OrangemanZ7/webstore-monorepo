import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { username, token } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !admin.twoFactorSecret) {
      return res
        .status(401)
        .json({ message: "2FA not set up or invalid user" });
    }

    const isVerified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: "base32",
      token: token,
    });

    if (!isVerified) {
      return res.status(401).json({ message: "Invalid 2FA token" });
    }

    // If token is valid, issue the final JWT
    const authToken = jwt.sign(
      { adminId: admin._id, username: admin.username },
      process.env.JWT_SECRET || "your-default-secret",
      { expiresIn: "8h" }
    );

    return res.status(200).json({ token: authToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
