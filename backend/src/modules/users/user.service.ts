import { prisma } from "../../utils/prisma";

export const userService = {
  async getAll() {
    // We intentionally use `select` here to ensure we NEVER accidentally leak passwords hashes
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarColor: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });
  },

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
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
