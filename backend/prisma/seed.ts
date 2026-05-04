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

  // Create users
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const memberPassword = await bcrypt.hash("Member@123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "admin@demo.com",
      password: adminPassword,
      role: Role.ADMIN,
      avatarColor: AVATAR_COLORS[0],
    },
  });

  const member1 = await prisma.user.create({
    data: {
      name: "Jordan Kim",
      email: "member@demo.com",
      password: memberPassword,
      role: Role.MEMBER,
      avatarColor: AVATAR_COLORS[1],
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: "Sam Chen",
      email: "sam@demo.com",
      password: await bcrypt.hash("Member@123", 12),
      role: Role.MEMBER,
      avatarColor: AVATAR_COLORS[2],
    },
  });

  const member3 = await prisma.user.create({
    data: {
      name: "Priya Nair",
      email: "priya@demo.com",
      password: await bcrypt.hash("Member@123", 12),
      role: Role.MEMBER,
      avatarColor: AVATAR_COLORS[3],
    },
  });

  console.log("✅ Users created");

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: "Platform Redesign",
      description:
        "Complete overhaul of the user-facing platform with new design system.",
      color: "#6ee7b7",
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id, role: "ADMIN" },
          { userId: member1.id, role: "MEMBER" },
          { userId: member2.id, role: "MEMBER" },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "API Gateway v2",
      description:
        "Rebuild the API gateway with rate limiting, caching and better observability.",
      color: "#818cf8",
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id, role: "ADMIN" },
          { userId: member2.id, role: "MEMBER" },
          { userId: member3.id, role: "MEMBER" },
        ],
      },
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "Mobile App Launch",
      description: "iOS and Android app launch preparation and QA.",
      color: "#f87171",
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id, role: "ADMIN" },
          { userId: member1.id, role: "MEMBER" },
          { userId: member3.id, role: "MEMBER" },
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

  // Tasks for project1 - Platform Redesign
  await prisma.task.createMany({
    data: [
      {
        title: "Audit existing design tokens",
        description:
          "Document all current colors, spacing, and typography used across the platform.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        dueDate: pastDate(10),
        projectId: project1.id,
        assignedToId: member1.id,
        createdById: admin.id,
      },
      {
        title: "Build component library",
        description:
          "Create Storybook with all base UI components following new design system.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: futureDate(5),
        projectId: project1.id,
        assignedToId: member2.id,
        createdById: admin.id,
      },
      {
        title: "Migrate dashboard to new components",
        description:
          "Replace all legacy components in dashboard with new design system components.",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: futureDate(14),
        projectId: project1.id,
        assignedToId: member1.id,
        createdById: admin.id,
      },
      {
        title: "Accessibility audit",
        description: "WCAG 2.1 AA compliance check across all new components.",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: futureDate(20),
        projectId: project1.id,
        assignedToId: null,
        createdById: admin.id,
      },
      {
        title: "Dark mode implementation",
        description:
          "CSS variable based dark mode with system preference detection.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.LOW,
        dueDate: pastDate(2), // OVERDUE
        projectId: project1.id,
        assignedToId: member2.id,
        createdById: admin.id,
      },
    ],
  });

  // Tasks for project2 - API Gateway v2
  await prisma.task.createMany({
    data: [
      {
        title: "Design rate limiting strategy",
        description:
          "Define per-endpoint rate limits, sliding window algorithm.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        dueDate: pastDate(15),
        projectId: project2.id,
        assignedToId: member2.id,
        createdById: admin.id,
      },
      {
        title: "Implement Redis caching layer",
        description:
          "Add Redis for response caching with configurable TTL per route.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: pastDate(3), // OVERDUE
        projectId: project2.id,
        assignedToId: member3.id,
        createdById: admin.id,
      },
      {
        title: "Set up distributed tracing",
        description:
          "OpenTelemetry integration with Jaeger for request tracing.",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: futureDate(7),
        projectId: project2.id,
        assignedToId: member2.id,
        createdById: admin.id,
      },
      {
        title: "Load testing suite",
        description: "k6 scripts for load testing all gateway endpoints.",
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        dueDate: futureDate(21),
        projectId: project2.id,
        assignedToId: null,
        createdById: admin.id,
      },
    ],
  });

  // Tasks for project3 - Mobile App Launch
  await prisma.task.createMany({
    data: [
      {
        title: "App Store submission checklist",
        description:
          "Complete all required assets and metadata for App Store review.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        dueDate: pastDate(5),
        projectId: project3.id,
        assignedToId: member1.id,
        createdById: admin.id,
      },
      {
        title: "Push notification infrastructure",
        description:
          "FCM and APNs setup for cross-platform push notifications.",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        dueDate: pastDate(8),
        projectId: project3.id,
        assignedToId: member3.id,
        createdById: admin.id,
      },
      {
        title: "Beta testing with 50 users",
        description:
          "TestFlight and Play Console beta program with internal users.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.MEDIUM,
        dueDate: futureDate(3),
        projectId: project3.id,
        assignedToId: member1.id,
        createdById: admin.id,
      },
      {
        title: "Crash reporting integration",
        description: "Sentry SDK integration for both iOS and Android builds.",
        status: TaskStatus.TODO,
        priority: Priority.HIGH,
        dueDate: pastDate(1), // OVERDUE
        projectId: project3.id,
        assignedToId: member3.id,
        createdById: admin.id,
      },
      {
        title: "Marketing landing page",
        description:
          "App store optimized landing page with screenshots and feature highlights.",
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        dueDate: futureDate(10),
        projectId: project3.id,
        assignedToId: null,
        createdById: admin.id,
      },
    ],
  });

  console.log("✅ Tasks created");
  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Demo accounts:");
  console.log("  Admin:  admin@demo.com  / Admin@123");
  console.log("  Member: member@demo.com / Member@123");
  console.log("  Sam:    sam@demo.com    / Member@123");
  console.log("  Priya:  priya@demo.com  / Member@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
