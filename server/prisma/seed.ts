import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  Priority,
  ComplaintStatus,
  MessageVisibility,
  Role,
} from "@prisma/client";
import { prisma } from "../src/lib/prisma";

export async function main() {
  console.log("🌱 Starting ResolvePay synthetic data seeding...");

  // Common demo password for synthetic testing
  const DEMO_PASSWORD = "ResolvePay2026!";
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ============================================================================
  // 1. Teams
  // ============================================================================
  console.log("📦 Seeding Teams...");
  const teamsData = [
    {
      name: "Payments Operations",
      description:
        "Handles card disputes, ACH reversals, failed payment authorizations, and settlement discrepancies.",
    },
    {
      name: "Refunds Team",
      description:
        "Manages merchant refund exceptions, duplicate charge credits, and return processing delays.",
    },
    {
      name: "Verification",
      description:
        "Oversees KYC identity document reviews, AML verification flags, and account tier upgrades.",
    },
    {
      name: "Account Security",
      description:
        "Specialized response unit for account takeovers, MFA compromises, and suspicious unauthorized logins.",
    },
  ];

  const teamsByName: Record<string, { id: string; name: string }> = {};
  for (const t of teamsData) {
    const team = await prisma.team.upsert({
      where: { name: t.name },
      update: { description: t.description, isActive: true },
      create: { name: t.name, description: t.description, isActive: true },
    });
    teamsByName[t.name] = team;
  }

  // ============================================================================
  // 2. Categories
  // ============================================================================
  console.log("📦 Seeding Categories...");
  const categoriesData = [
    {
      name: "Payments",
      defaultTeamName: "Payments Operations",
      defaultPriority: Priority.NORMAL,
    },
    {
      name: "Refund",
      defaultTeamName: "Refunds Team",
      defaultPriority: Priority.NORMAL,
    },
    {
      name: "KYC",
      defaultTeamName: "Verification",
      defaultPriority: Priority.HIGH,
    },
    {
      name: "Account Access",
      defaultTeamName: "Account Security",
      defaultPriority: Priority.HIGH,
    },
    {
      name: "General Inquiry",
      defaultTeamName: "Payments Operations",
      defaultPriority: Priority.LOW,
    },
  ];

  const categoriesByName: Record<string, { id: string; name: string }> = {};
  for (const c of categoriesData) {
    const defaultTeamId = teamsByName[c.defaultTeamName]?.id;
    const cat = await prisma.category.upsert({
      where: { name: c.name },
      update: {
        defaultTeamId,
        defaultPriority: c.defaultPriority,
        isActive: true,
      },
      create: {
        name: c.name,
        defaultTeamId,
        defaultPriority: c.defaultPriority,
        isActive: true,
      },
    });
    categoriesByName[c.name] = cat;
  }

  // ============================================================================
  // 3. Users (2 Customers, 2 Agents on different teams, 1 Team Lead, 1 Admin)
  // ============================================================================
  console.log("📦 Seeding Users...");
  const usersData = [
    {
      name: "Sophia Martinez",
      email: "sophia.martinez@demo.resolvepay.com",
      role: Role.CUSTOMER,
      teamName: null,
    },
    {
      name: "Marcus Vance",
      email: "marcus.vance@demo.resolvepay.com",
      role: Role.CUSTOMER,
      teamName: null,
    },
    {
      name: "Liam O'Connor",
      email: "liam.agent@demo.resolvepay.com",
      role: Role.AGENT,
      teamName: "Payments Operations",
    },
    {
      name: "Amina Patel",
      email: "amina.agent@demo.resolvepay.com",
      role: Role.AGENT,
      teamName: "Account Security",
    },
    {
      name: "Elena Rostova",
      email: "elena.lead@demo.resolvepay.com",
      role: Role.TEAM_LEAD,
      teamName: "Refunds Team",
    },
    {
      name: "David Sterling",
      email: "admin@demo.resolvepay.com",
      role: Role.ADMIN,
      teamName: null,
    },
  ];

  const usersByEmail: Record<string, { id: string; name: string; email: string }> = {};
  for (const u of usersData) {
    const teamId = u.teamName ? teamsByName[u.teamName]?.id : null;
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash,
        role: u.role,
        teamId,
        isActive: true,
      },
      create: {
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        teamId,
        isActive: true,
      },
    });
    usersByEmail[u.email] = user;
  }

  // ============================================================================
  // 4. SLA Policies (For each category across each priority level)
  // ============================================================================
  console.log("📦 Seeding SLA Policies...");
  const slaTiers = [
    {
      priority: Priority.URGENT,
      firstResponseMinutes: 30, // 30 minutes
      resolutionMinutes: 240, // 4 hours
    },
    {
      priority: Priority.HIGH,
      firstResponseMinutes: 60, // 1 hour
      resolutionMinutes: 480, // 8 hours
    },
    {
      priority: Priority.NORMAL,
      firstResponseMinutes: 240, // 4 hours
      resolutionMinutes: 1440, // 24 hours
    },
    {
      priority: Priority.LOW,
      firstResponseMinutes: 480, // 8 hours
      resolutionMinutes: 2880, // 48 hours
    },
  ];

  for (const catName of Object.keys(categoriesByName)) {
    const categoryId = categoriesByName[catName].id;
    for (const tier of slaTiers) {
      await prisma.slaPolicy.upsert({
        where: {
          categoryId_priority: {
            categoryId,
            priority: tier.priority,
          },
        },
        update: {
          firstResponseMinutes: tier.firstResponseMinutes,
          resolutionMinutes: tier.resolutionMinutes,
          isActive: true,
        },
        create: {
          categoryId,
          priority: tier.priority,
          firstResponseMinutes: tier.firstResponseMinutes,
          resolutionMinutes: tier.resolutionMinutes,
          isActive: true,
        },
      });
    }
  }

  // ============================================================================
  // 5. Seed 5 Realistic Complaints (RP-10452 to RP-10456)
  // ============================================================================
  console.log("📦 Seeding Complaints (RP-10452 through RP-10456)...");

  const sophia = usersByEmail["sophia.martinez@demo.resolvepay.com"];
  const marcus = usersByEmail["marcus.vance@demo.resolvepay.com"];
  const liam = usersByEmail["liam.agent@demo.resolvepay.com"];
  const amina = usersByEmail["amina.agent@demo.resolvepay.com"];
  const elena = usersByEmail["elena.lead@demo.resolvepay.com"];

  const complaintsData = [
    {
      publicRef: "RP-10452",
      customerId: sophia.id,
      categoryName: "Payments",
      teamName: "Payments Operations",
      assigneeId: null,
      priority: Priority.HIGH,
      status: ComplaintStatus.SUBMITTED,
      subject: "Unrecognized POS Debit of $184.20 at Merchant CloudMart",
      description:
        "I noticed an unexpected debit transaction of $184.20 on my account statement timestamped Friday at 2:15 PM from a merchant named CloudMart SF. I was in Chicago during this period and have never authorized this charge. My physical debit card has remained in my possession.",
      transactionReference: "TXN-849201-US",
      channel: "WEB",
      dueAt: new Date(Date.now() + 8 * 3600 * 1000),
      resolvedAt: null,
      resolutionCode: null,
      resolutionSummary: null,
      messages: [
        {
          authorId: sophia.id,
          body: "I can provide my airline boarding pass proving I was in Illinois at the exact time of the California POS swipe.",
          visibility: MessageVisibility.CUSTOMER_VISIBLE,
        },
      ],
      assignment: null,
      auditLog: {
        actorId: sophia.id,
        action: "COMPLAINT_CREATED",
        summary:
          "Dispute RP-10452 initiated by customer for unauthorized POS debit of $184.20.",
      },
    },
    {
      publicRef: "RP-10453",
      customerId: marcus.id,
      categoryName: "Refund",
      teamName: "Refunds Team",
      assigneeId: liam.id,
      priority: Priority.URGENT,
      status: ComplaintStatus.IN_PROGRESS,
      subject: "Approved merchant return of $450.00 not credited after 14 business days",
      description:
        "Merchant Apex Electronics approved a returned laptop accessory on Oct 4th and provided an acquirer Acquirer Reference Number (ARN). The 14-day turnaround window has passed and no pending or posted credit appears on my ResolvePay account balance.",
      transactionReference: "TXN-739104-RF",
      channel: "WEB",
      dueAt: new Date(Date.now() + 4 * 3600 * 1000),
      resolvedAt: null,
      resolutionCode: null,
      resolutionSummary: null,
      messages: [
        {
          authorId: marcus.id,
          body: "The merchant insists the funds were settled back to ResolvePay on Oct 6th with ARN 748392018471.",
          visibility: MessageVisibility.CUSTOMER_VISIBLE,
        },
        {
          authorId: liam.id,
          body: "Internal audit confirms ARN 748392018471 is located in our daily interchange clearing batch. Manual ledger credit required.",
          visibility: MessageVisibility.INTERNAL,
        },
        {
          authorId: liam.id,
          body: "Hello Marcus, our card operations team has successfully verified the settlement batch with the acquirer. We are processing an expedited credit to your available balance within 24 hours.",
          visibility: MessageVisibility.CUSTOMER_VISIBLE,
        },
      ],
      assignment: {
        teamName: "Refunds Team",
        assigneeId: liam.id,
        assignedById: elena.id,
        reason: "High-value refund escalation with valid ARN documentation.",
      },
      auditLog: {
        actorId: liam.id,
        action: "INVESTIGATION_STARTED",
        summary:
          "Agent Liam O'Connor assigned complaint RP-10453 and matched acquirer settlement ARN batch.",
      },
    },
    {
      publicRef: "RP-10454",
      customerId: sophia.id,
      categoryName: "KYC",
      teamName: "Verification",
      assigneeId: liam.id,
      priority: Priority.NORMAL,
      status: ComplaintStatus.WAITING_FOR_CUSTOMER,
      subject: "Tier 2 Remittance Limit Verification - Address Document Rejection",
      description:
        "Uploaded electric utility statement dated two weeks ago to unlock Tier 2 international remittance limits. The automated system flagged it as expired/invalid.",
      transactionReference: "KYC-DOC-9921",
      channel: "WEB",
      dueAt: new Date(Date.now() + 24 * 3600 * 1000),
      resolvedAt: null,
      resolutionCode: null,
      resolutionSummary: null,
      messages: [
        {
          authorId: liam.id,
          body: "Hi Sophia, the previous scan was tightly cropped and omitted the issuing utility's legal footer and issue date. Please upload an uncropped, high-resolution PDF.",
          visibility: MessageVisibility.CUSTOMER_VISIBLE,
        },
        {
          authorId: liam.id,
          body: "Document metadata indicates PDF is authentic. Awaiting full-border page scan before approving Tier 2 limits.",
          visibility: MessageVisibility.INTERNAL,
        },
      ],
      assignment: {
        teamName: "Verification",
        assigneeId: liam.id,
        assignedById: elena.id,
        reason: "Tier 2 KYC document appeal.",
      },
      auditLog: {
        actorId: liam.id,
        action: "STATUS_CHANGE",
        summary:
          "Status updated to WAITING_FOR_CUSTOMER awaiting uncropped utility statement upload.",
      },
    },
    {
      publicRef: "RP-10455",
      customerId: marcus.id,
      categoryName: "Payments",
      teamName: "Payments Operations",
      assigneeId: liam.id,
      priority: Priority.HIGH,
      status: ComplaintStatus.RESOLVED,
      subject: "Metro Station ATM #429 - $200 deducted without cash dispense",
      description:
        "Attempted $200 cash withdrawal at Metro Station ATM #429. The terminal encountered an unhandled mechanical timeout, displayed an out-of-order screen, but the $200 was immediately deducted from my checking balance.",
      transactionReference: "ATM-429-9481",
      channel: "MOBILE",
      dueAt: new Date(Date.now() - 12 * 3600 * 1000),
      resolvedAt: new Date(Date.now() - 2 * 3600 * 1000),
      resolutionCode: "AUTO_CREDIT_POSTED",
      resolutionSummary:
        "ATM electronic journal tape reconciled $200 physical cash retention. Full credit posted permanently to checking balance.",
      messages: [
        {
          authorId: marcus.id,
          body: "Please help, this was my primary grocery cash for the week.",
          visibility: MessageVisibility.CUSTOMER_VISIBLE,
        },
        {
          authorId: liam.id,
          body: "Switch journal analysis for Terminal #429 confirmed bill jam fault at 08:14 UTC. Reversal transaction authorized.",
          visibility: MessageVisibility.INTERNAL,
        },
        {
          authorId: liam.id,
          body: "Marcus, the terminal cash inventory verified the failed dispense. The full $200.00 has been credited back to your balance.",
          visibility: MessageVisibility.CUSTOMER_VISIBLE,
        },
      ],
      assignment: {
        teamName: "Payments Operations",
        assigneeId: liam.id,
        assignedById: elena.id,
        reason: "ATM physical hardware switch discrepancy.",
      },
      auditLog: {
        actorId: liam.id,
        action: "COMPLAINT_RESOLVED",
        summary:
          "Dispute RP-10455 marked RESOLVED with full $200 credit after switch journal validation.",
      },
    },
    {
      publicRef: "RP-10456",
      customerId: sophia.id,
      categoryName: "Account Access",
      teamName: "Account Security",
      assigneeId: amina.id,
      priority: Priority.HIGH,
      status: ComplaintStatus.TRIAGED,
      subject: "Multiple Unprompted SMS 2FA Security Codes at 3:00 AM",
      description:
        "Received four consecutive SMS one-time authentication codes within five minutes while asleep. No unrecognized sessions are currently active on my personal device, but I suspect an unauthorized actor has my password.",
      transactionReference: "AUTH-SEC-4410",
      channel: "WEB",
      dueAt: new Date(Date.now() + 6 * 3600 * 1000),
      resolvedAt: null,
      resolutionCode: null,
      resolutionSummary: null,
      messages: [
        {
          authorId: sophia.id,
          body: "I changed my personal email password as a precaution. Can your security team check where the login requests originated?",
          visibility: MessageVisibility.CUSTOMER_VISIBLE,
        },
        {
          authorId: elena.id,
          body: "Triage check: Inbound IP trace indicates automated credential-stuffing spray from known commercial VPN range. Account locked from further attempts; routing to Amina for forced password rotation.",
          visibility: MessageVisibility.INTERNAL,
        },
      ],
      assignment: {
        teamName: "Account Security",
        assigneeId: amina.id,
        assignedById: elena.id,
        reason: "Credential compromise assessment and session invalidation.",
      },
      auditLog: {
        actorId: elena.id,
        action: "TRIAGED_AND_ASSIGNED",
        summary:
          "Complaint RP-10456 triaged by Team Lead Elena Rostova and routed to Account Security specialist Amina Patel.",
      },
    },
  ];

  for (const c of complaintsData) {
    const categoryId = categoriesByName[c.categoryName]?.id;
    const teamId = c.teamName ? teamsByName[c.teamName]?.id : null;

    const complaint = await prisma.complaint.upsert({
      where: { publicRef: c.publicRef },
      update: {
        customerId: c.customerId,
        categoryId,
        teamId,
        assigneeId: c.assigneeId,
        priority: c.priority,
        status: c.status,
        subject: c.subject,
        description: c.description,
        transactionReference: c.transactionReference,
        channel: c.channel,
        dueAt: c.dueAt,
        resolvedAt: c.resolvedAt,
        resolutionCode: c.resolutionCode,
        resolutionSummary: c.resolutionSummary,
      },
      create: {
        publicRef: c.publicRef,
        customerId: c.customerId,
        categoryId,
        teamId,
        assigneeId: c.assigneeId,
        priority: c.priority,
        status: c.status,
        subject: c.subject,
        description: c.description,
        transactionReference: c.transactionReference,
        channel: c.channel,
        dueAt: c.dueAt,
        resolvedAt: c.resolvedAt,
        resolutionCode: c.resolutionCode,
        resolutionSummary: c.resolutionSummary,
      },
    });

    // Seed Messages (idempotent: check if message body already exists for complaint)
    for (const msg of c.messages) {
      const existing = await prisma.complaintMessage.findFirst({
        where: {
          complaintId: complaint.id,
          body: msg.body,
        },
      });

      if (!existing) {
        await prisma.complaintMessage.create({
          data: {
            complaintId: complaint.id,
            authorId: msg.authorId,
            body: msg.body,
            visibility: msg.visibility,
          },
        });
      }
    }

    // Seed Assignment if present
    if (c.assignment) {
      const assignmentTeamId = teamsByName[c.assignment.teamName]?.id;
      const existingAssignment = await prisma.assignment.findFirst({
        where: {
          complaintId: complaint.id,
          assigneeId: c.assignment.assigneeId,
          reason: c.assignment.reason,
        },
      });

      if (!existingAssignment && assignmentTeamId) {
        await prisma.assignment.create({
          data: {
            complaintId: complaint.id,
            teamId: assignmentTeamId,
            assigneeId: c.assignment.assigneeId,
            assignedById: c.assignment.assignedById,
            reason: c.assignment.reason,
          },
        });
      }
    }

    // Seed AuditLog entry (one per complaint)
    const existingAudit = await prisma.auditLog.findFirst({
      where: {
        entityType: "Complaint",
        entityId: complaint.id,
        action: c.auditLog.action,
      },
    });

    if (!existingAudit) {
      await prisma.auditLog.create({
        data: {
          entityType: "Complaint",
          entityId: complaint.id,
          actorId: c.auditLog.actorId,
          action: c.auditLog.action,
          summary: c.auditLog.summary,
        },
      });
    }
  }

  console.log("✅ Synthetic seeding completed successfully!");
  console.log("--------------------------------------------------");
  console.log("Demo Credentials (Password: ResolvePay2026!):");
  console.log("  - Admin:     admin@demo.resolvepay.com");
  console.log("  - Team Lead: elena.lead@demo.resolvepay.com (Refunds Team)");
  console.log("  - Agent 1:   liam.agent@demo.resolvepay.com (Payments Operations)");
  console.log("  - Agent 2:   amina.agent@demo.resolvepay.com (Account Security)");
  console.log("  - Customer:  sophia.martinez@demo.resolvepay.com");
  console.log("  - Customer:  marcus.vance@demo.resolvepay.com");
  console.log("--------------------------------------------------");
}

// Only execute directly if this script was invoked from CLI (not when imported)
const isDirectRun =
  !process.argv[1] ||
  process.argv[1].endsWith("seed.ts") ||
  process.argv[1].endsWith("seed.js");

if (isDirectRun) {
  main()
    .catch((e) => {
      console.error("❌ Seeding error:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
