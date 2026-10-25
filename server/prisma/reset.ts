import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { main as seed } from "./seed";

async function resetDemoData() {
  console.log("⚠️  Resetting all ResolvePay demo data...");

  // Delete records in reverse dependency order
  console.log("🧹 Clearing existing data...");
  await prisma.complaintMessage.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.slaPolicy.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.team.deleteMany({});

  console.log("✨ All tables emptied. Re-seeding baseline synthetic data...");
  await seed();
}

resetDemoData()
  .catch((e) => {
    console.error("❌ Reset error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
