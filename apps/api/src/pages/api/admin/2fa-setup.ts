import type { NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import auth from "@/middleware/auth";

const handler = async (req: any, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const { adminId } = req.admin; // Get adminId from the auth middleware

    const secret = speakeasy.generateSecret({
      name: `YourStore Admin (${req.body.username})`,
    });

    // Save the secret to the admin's document in the database
    await Admin.findByIdAndUpdate(adminId, { twoFactorSecret: secret.base32 });

    // Generate a QR code for the authenticator app
    qrcode.toDataURL(secret.otpauth_url!, (err, data_url) => {
      if (err) {
        return res.status(500).json({ message: "Error generating QR code" });
      }
      return res.status(200).json({ qrCodeUrl: data_url });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Wrap the handler with the auth middleware
export default auth(handler);
