import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { unauthorized } from "../utils/apiResponse";
import { prisma } from "../utils/prisma";

// Extend Express Request to include our user object
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "ADMIN" | "MEMBER";
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    unauthorized(res, "Not authorized, no token provided");
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    // Verify the user hasn't been deleted since the token was issued
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      unauthorized(res, "User associated with this token no longer exists");
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    unauthorized(res, "Not authorized, invalid or expired token");
  }
};
