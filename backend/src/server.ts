import app from "./app";
import { env } from "./config/env";
import { prisma } from "./utils/prisma"; // Assumes you saved Claude's prisma.ts in utils

const startServer = async () => {
  try {
    // Test Database Connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(env.PORT, () => {
      console.log(
        `🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`,
      );
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
