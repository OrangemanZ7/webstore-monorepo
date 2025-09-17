import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// Extend the NextApiRequest type to include our custom admin property
interface AuthenticatedRequest extends NextApiRequest {
  admin?: { adminId: string; username: string };
}

type Handler = (req: AuthenticatedRequest, res: NextApiResponse) => void;

const auth = (handler: Handler) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Authentication token missing or malformed" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-default-secret"
      ) as { adminId: string; username: string };

      req.admin = decoded; // Attach admin info to the request object
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export default auth;
