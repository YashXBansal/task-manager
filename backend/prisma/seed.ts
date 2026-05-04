import { PrismaClient, Role, Priority, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const AVATAR_COLORS = [
  "#6ee7b7",
  "#818cf8",
  "#f87171",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#f472b6",
  "#a78bfa",
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clean slate
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash("Password@123", 12);

  // Core Team Profiles
  const yash = await prisma.user.create({
    data: {
      name: "Yash Bansal",
      email: "yash@demo.com",
      password: defaultPassword,
      role: Role.ADMIN,
      avatarColor: AVATAR_COLORS[0],
    },
  });

  const yogesh = await prisma.user.create({
    data: {
      name: "Yogesh Bansal",
      email: "yogesh@demo.com",
      password: defaultPassword,
      role: Role.MEMBER,
      avatarColor: AVATAR_COLORS[1],
    },
  });

  const sniper = await prisma.user.create({
    data: {
      name: "Sniper (K9 Unit)",
      email: "sniper@demo.com",
      password: defaultPassword,
      role: Role.MEMBER,
      avatarColor: AVATAR_COLORS[3],
    },
  });

  const guest = await prisma.user.create({
    data: {
      name: "Guest Reviewer",
      email: "guest@demo.com",
      password: defaultPassword,
      role: Role.MEMBER,
      avatarColor: AVATAR_COLORS[5],
    },
  });

  console.log("✅ Users created");

  // Engineering Projects
  const shardFS = await prisma.project.create({
    data: {
      name: "ShardFS Architecture",
      description:
        "Backend architecture for distributed file system. Sharding and replication logic.",
      color: "#818cf8",
      createdById: yash.id,
      members: {
        create: [
          { userId: yash.id, role: "ADMIN" },
          { userId: yogesh.id, role: "MEMBER" },
          { userId: guest.id, role: "MEMBER" },
        ],
      },
    },
  });

  const meloSynthia = await prisma.project.create({
    data: {
      name: "MeloSynthiaAI",
      description:
        "AI-powered music NFT platform. Award-winning Web3 integration.",
      color: "#6ee7b7",
      createdById: yash.id,
      members: {
        create: [
          { userId: yash.id, role: "ADMIN" },
          { userId: guest.id, role: "MEMBER" },
        ],
      },
    },
  });

  const pdfSaaS = await prisma.project.create({
    data: {
      name: "AI PDF Summarizer",
      description:
        "Next.js, LangChain, and PostgreSQL SaaS platform deployments.",
      color: "#f87171",
      createdById: yash.id,
      members: {
        create: [
          { userId: yash.id, role: "ADMIN" },
          { userId: sniper.id, role: "MEMBER" },
          { userId: guest.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log("✅ Projects created");

  const now = new Date();
  const pastDate = (daysAgo: number) =>
    new Date(now.getTime() - daysAgo * 86400000);
  const futureDate = (daysAhead: number) =>
    new Date(now.getTime() + daysAhead * 86400000);

  // Tasks for ShardFS
  await prisma.task.createMany({
    data: [
      {
        title: "Design sharding algorithm",
        description:
          "Implement core sharding logic. Exclude consistent hashing for the initial phase.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        dueDate: pastDate(5),
        projectId: shardFS.id,
        assignedToId: yash.id,
        createdById: yash.id,
      },
      {
        title: "Setup MongoDB Atlas",
        description: "Configure replica sets and cluster monitoring.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: pastDate(1), // OVERDUE
        projectId: shardFS.id,
        assignedToId: yogesh.id,
        createdById: yash.id,
      },
      {
        title: "Kafka event integration",
        description: "Establish pub/sub message brokers for system events.",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: futureDate(7),
        projectId: shardFS.id,
        assignedToId: guest.id,
        createdById: yash.id,
      },
    ],
  });

  // Tasks for MeloSynthiaAI
  await prisma.task.createMany({
    data: [
      {
        title: "Integrate SynthID watermarks",
        description:
          "Ensure all AI-generated tracks include traceable audio watermarks.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        dueDate: pastDate(10),
        projectId: meloSynthia.id,
        assignedToId: yash.id,
        createdById: yash.id,
      },
      {
        title: "Smart Contract deployment",
        description: "Deploy finalized NFT minting contracts to mainnet.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: futureDate(2),
        projectId: meloSynthia.id,
        assignedToId: guest.id,
        createdById: yash.id,
      },
    ],
  });

  // Tasks for PDF SaaS
  await prisma.task.createMany({
    data: [
      {
        title: "LangChain Vector Embeddings",
        description: "Setup Postgres pgvector for document querying.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        dueDate: pastDate(15),
        projectId: pdfSaaS.id,
        assignedToId: yash.id,
        createdById: yash.id,
      },
      {
        title: "Procure Pedigree inventory",
        description: "Order Chicken & Veg wet food and joint supplements.",
        status: TaskStatus.TODO,
        priority: Priority.HIGH,
        dueDate: futureDate(1),
        projectId: pdfSaaS.id,
        assignedToId: sniper.id,
        createdById: yash.id,
      },
      {
        title: "Vercel Pipeline Config",
        description: "Update CI/CD production deployment settings.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.LOW,
        dueDate: pastDate(3), // OVERDUE
        projectId: pdfSaaS.id,
        assignedToId: guest.id,
        createdById: yash.id,
      },
    ],
  });

  console.log("✅ Tasks created");
  console.log("\n🎉 Portfolio Seed Complete!");
  console.log("\n📋 Login Credentials:");
  console.log("  Admin: yash@demo.com   / Password@123");
  console.log("  Team:  guest@demo.com  / Password@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
