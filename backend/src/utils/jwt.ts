import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { Role } from "@prisma/client";

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export const signAccessToken = (
  payload: Omit<JwtPayload, "iat" | "exp">,
): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

// export const signRefreshToken = (
//   payload: Omit<JwtPayload, "iat" | "exp">,
// ): string =>
//   jwt.sign(payload, env.JWT_REFRESH_SECRET, {
//     expiresIn: env.JWT_REFRESH_EXPIRES_IN,
//   } as jwt.SignOptions);

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;

// export const verifyRefreshToken = (token: string): JwtPayload =>
//   jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
