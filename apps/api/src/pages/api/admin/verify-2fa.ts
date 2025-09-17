import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the request is a POST request
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Connect to the database
  await dbConnect();

  const { username, token } = req.body;

  // Validate input
  if (!username || !token) {
    return res.status(400).json({ message: "Username and token are required" });
  }

  try {
    // Find the admin user by their username
    const admin = await Admin.findOne({ username });
    if (!admin || !admin.twoFactorSecret) {
      return res
        .status(401)
        .json({ message: "2FA not set up for this user or user not found" });
    }

    // Verify the provided token against the stored secret
    const isVerified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 1, // Allows for a 30-second clock drift
    });

    if (!isVerified) {
      return res.status(401).json({ message: "Invalid 2FA token" });
    }

    // If this is the first time verifying, permanently enable 2FA
    if (!admin.isTwoFactorEnabled) {
      admin.isTwoFactorEnabled = true;
      await admin.save();
    }

    // If the token is valid, issue the final JSON Web Token (JWT)
    const authToken = jwt.sign(
      { adminId: admin._id, username: admin.username },
      process.env.JWT_SECRET || "your-default-secret",
      { expiresIn: "8h" }
    );

    return res.status(200).json({ token: authToken });
  } catch (error) {
    console.error("2FA verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
