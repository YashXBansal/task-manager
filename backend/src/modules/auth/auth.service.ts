import { prisma } from "../../utils/prisma";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signAccessToken } from "../../utils/jwt";
import { z } from "zod";
import { signupSchema, loginSchema } from "./auth.schema";

type SignupInput = z.infer<typeof signupSchema>["body"];
type LoginInput = z.infer<typeof loginSchema>["body"];

export const authService = {
  async signup(data: SignupInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const hashedPassword = await hashPassword(data.password);

    // The first user created will automatically be an ADMIN, others will be MEMBER
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "ADMIN" : "MEMBER";

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role,
      },
    });

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken };
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken };
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarColor: true,
        createdAt: true,
      },
    });

    if (!user) throw new Error("User not found");
    return user;
  },
};
