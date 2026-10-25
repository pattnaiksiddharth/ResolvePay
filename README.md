# ResolvePay

> **Financial Complaint & Dispute Management System**  
> *A full-stack student portfolio project demonstrating enterprise software design patterns, server-side authorization, and end-to-end type safety.*

---

> [!IMPORTANT]
> ### ⚠️ Synthetic & Demo Data Notice
> **ResolvePay operates STRICTLY on synthetic, mock, and randomly generated demo data.**  
> - No real consumer financial records, credit reports, payment details, or PII (Personally Identifiable Information) are stored, processed, or collected.
> - All accounts, dispute cases, transaction logs, and customer profiles are purely fictional for educational and portfolio demonstration purposes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Client** | React 18, TypeScript, Tailwind CSS, Lucide React, Vite (with dev proxy) |
| **Server** | Node.js, Express, TypeScript, Zod (fail-fast validation), `tsx` (hot reload) |
| **Data Layer** | PostgreSQL, Prisma ORM, Synthetic Seed Data |
| **Testing** | Vitest, Supertest *(in development)* |
| **Code Quality** | ESLint 9 (flat config), Prettier |

---

## 🏛️ Monorepo Architecture

The repository enforces strict separation of concerns across the client, routing, business logic, and data access layers:

```text
ResolvePay/
├── client/                      # Frontend SPA (React + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, HealthStatusCard)
│   │   ├── hooks/               # Custom hooks (useHealthCheck)
│   │   ├── lib/                 # Client utilities and type-safe API fetchers
│   │   ├── pages/               # Application view pages (HomePage)
│   │   ├── App.tsx              # Main layout shell
│   │   └── main.tsx             # React DOM entrypoint
│   ├── vite.config.ts           # Vite config with /api dev proxy to port 5000
│   └── package.json
│
├── server/                      # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/              # Environment parsing & Zod fail-fast validation
│   │   ├── controllers/         # HTTP request/response handlers
│   │   ├── routes/              # Express route definitions
│   │   ├── middleware/          # Security (Helmet, CORS) and error handling
│   │   ├── services/            # Business logic and server-side authorization
│   │   ├── lib/                 # Shared server singletons (Prisma client)
│   │   ├── app.ts               # Express application configuration
│   │   └── server.ts            # HTTP server listener and graceful shutdown
│   ├── .env.example             # Template for required environment variables
│   └── package.json
│
├── package.json                 # Monorepo coordinator scripts
└── .gitignore                   # Root-level ignore rules for node_modules, .env, and dist
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/ResolvePay.git
cd ResolvePay

# Install monorepo dependencies
npm install

# Install server & client dependencies
npm install --prefix server
npm install --prefix client
```

### 2. Environment Setup

Create local `.env` files from the provided examples (never commit secrets):

```bash
# Copy server environment template
cp server/.env.example server/.env
```

### 3. Running Locally

#### Option A: Run Both Together (Recommended)
From the root directory:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

#### Option B: Run in Separate Terminals
```bash
# Terminal 1 - Backend Server
cd server
npm run dev

# Terminal 2 - Frontend Client
cd client
npm run dev
```

---

## 📡 API Health Endpoint

Verify backend health by navigating to:
- Direct backend: `http://localhost:5000/api/health`
- Via Vite proxy: `http://localhost:5173/api/health`

Expected response:
```json
{
  "status": "ok"
}
```

---

## 🗄️ Database & Demo Data (Neon PostgreSQL)

ResolvePay includes idempotent Prisma seed scripts providing 100% synthetic financial operations data for testing.

### Demo User Accounts

All demo users are pre-configured with the password: **`ResolvePay2026!`**

| Role | Name | Email | Assigned Team |
| :--- | :--- | :--- | :--- |
| **ADMIN** | David Sterling | `admin@demo.resolvepay.com` | *Platform-wide access* |
| **TEAM_LEAD** | Elena Rostova | `elena.lead@demo.resolvepay.com` | Refunds Team |
| **AGENT** | Liam O'Connor | `liam.agent@demo.resolvepay.com` | Payments Operations |
| **AGENT** | Amina Patel | `amina.agent@demo.resolvepay.com` | Account Security |
| **CUSTOMER** | Sophia Martinez | `sophia.martinez@demo.resolvepay.com` | *Customer Portal* |
| **CUSTOMER** | Marcus Vance | `marcus.vance@demo.resolvepay.com` | *Customer Portal* |

### Seeded Dispute Complaints

| Reference | Category | Priority | Status | Description |
| :--- | :--- | :--- | :--- | :--- |
| **RP-10452** | Payments | HIGH | `SUBMITTED` | Unrecognized POS debit of $184.20 while out of state |
| **RP-10453** | Refund | URGENT | `IN_PROGRESS` | Approved return of $450.00 not credited after 14 days |
| **RP-10454** | KYC | NORMAL | `WAITING_FOR_CUSTOMER` | Address document rejection for Tier 2 limits |
| **RP-10455** | Payments | HIGH | `RESOLVED` | ATM cash withdrawal failure — $200 deducted without dispense |
| **RP-10456** | Account Access | HIGH | `TRIAGED` | Multiple unprompted SMS 2FA security codes at 3:00 AM |

### Database Commands

From the monorepo root:

```bash
# Seed or re-seed synthetic data (Idempotent: safe to run multiple times)
npm run db:seed

# Reset demo data (clears all operational records and re-seeds fresh synthetic baseline)
npm run db:reset

# Open Prisma Studio to browse database records visually
npm run prisma:studio

# Run Prisma migrations
npm run prisma:migrate
```

---

## 🔒 Security & Best Practices

- **Zero Hardcoded Secrets**: All credentials are read through `server/src/config/env.ts` and validated with Zod at boot.
- **Server-Side Enforcement**: All authorization, validation, and dispute state transitions happen strictly on the server.
- **Fail-Fast Validation**: The server terminates with descriptive errors if required environment variables are missing or malformed.
- **Safe Demo Resets**: Database reset scripts operate solely on test/demo databases.

