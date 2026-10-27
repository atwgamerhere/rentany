# 📁 Jabalpur Rent — Folder & Repository Structure

> **Principle**: Clean separation of concerns. Documentation must never be intermingled with application code, and every module must have a single, unambiguous responsibility.

---

## 1. Top-Level Repository Layout

```
d:\RENTANY/
├── rentany-vault/               # The Obsidian Knowledge Vault (Documentation & Second Brain)
│   ├── .obsidian/               # Obsidian settings (wikilinks, view config)
│   ├── Home.md                  # Central vault index and navigation map
│   ├── PROJECT-OVERVIEW.md      # Business vision, economics, and market context
│   ├── PROJECT-STATUS.md        # Current heartbeat, blocker tracking, next actions
│   ├── MASTER-PLAN.md           # Master roadmap across all 7 development phases
│   ├── 01-Architecture/         # Technical architecture, folder structure, ADRs
│   ├── 02-Requirements/         # Business requirements, RBAC matrix, MVP scope
│   ├── 03-Database/             # ERD, SQL schema, migrations, RLS security policies
│   ├── 04-Development/          # Phase status, changelog, known issues, next steps
│   ├── 05-Security/             # Threat model, security checklist, data privacy
│   ├── 06-Integrations/         # Indian payment gateways, KYC, notifications research
│   ├── 07-Testing/              # Test strategy, execution results, release checklists
│   ├── 08-Operations/           # Deployment guides, backups, incident plans, costs
│   ├── 09-Session-Logs/         # Permanent chronological session audit trail
│   └── 10-Reference/            # Glossary, external links, Indian fintech regulations
├── knowledge-vault -> rentany-vault (NTFS Directory Junction for alias compatibility)
├── frontend/                    # Customer, Shop & Admin Portals (Pure HTML/CSS/JS)
│   ├── public/                  # Static assets (favicons, logos, mock images)
│   │   ├── images/              # Device photos, hero graphics, badges
│   │   └── icons/               # SVG UI icons
│   ├── src/
│   │   ├── css/                 # Modern Vanilla CSS design system
│   │   │   ├── variables.css    # Colors (HSL palette), typography, spacing tokens
│   │   │   ├── base.css         # Reset, typography, body layout
│   │   │   ├── components.css   # Cards, modals, badges, inputs, buttons, tables
│   │   │   └── utilities.css    # Responsive helper classes, animations
│   │   ├── js/                  # Reusable client JavaScript modules
│   │   │   ├── api.js           # Fetch wrapper with error handling & auth header
│   │   │   ├── auth.js          # Client auth state management & token storage
│   │   │   └── utils.js         # Currency (INR) formatting, date helpers
│   │   ├── customer/            # Customer web application
│   │   │   ├── index.html       # Marketplace home & search
│   │   │   ├── catalog.html     # Phone catalog with filters
│   │   │   ├── device.html      # Phone detail & date booking calculator
│   │   │   ├── checkout.html    # Order summary, KYC trigger & deposit breakdown
│   │   │   └── bookings.html    # Customer rental history & active OTPs
│   │   ├── shop/                # Shop partner portal
│   │   │   ├── login.html       # Shop partner authentication
│   │   │   ├── dashboard.html   # Active rentals, returns, revenue summary
│   │   │   ├── inventory.html   # Physical device management & status toggling
│   │   │   └── handover.html    # In-person pickup & return OTP validation screen
│   │   └── admin/               # Platform administrator portal
│   │       ├── login.html       # Admin login with multi-factor check
│   │       ├── dashboard.html   # Operational overview & key platform metrics
│   │       ├── shops.html       # Shop application review & approval queue
│   │       ├── kyc.html         # Customer KYC manual review (if flagged)
│   │       └── disputes.html    # Damage disputes & deposit forfeiture arbitration
│   └── index.html               # Main root landing redirect
├── backend/                     # Modular TypeScript Backend Service
│   ├── src/
│   │   ├── config/              # Validated environment configuration (Zod / dotenv)
│   │   │   └── env.ts
│   │   ├── middleware/          # Security, auth, and validation middleware
│   │   │   ├── auth.middleware.ts       # Supabase JWT verification
│   │   │   ├── role.middleware.ts       # RBAC guards (Customer, Shop, Admin)
│   │   │   ├── rate-limit.middleware.ts # IP & user rate limiting
│   │   │   └── error.middleware.ts      # Global sanitized error handler
│   │   ├── modules/             # Modular domain slices
│   │   │   ├── auth/            # Auth helpers, registration hooks
│   │   │   ├── shops/           # Shop management & approvals
│   │   │   ├── listings/        # Catalog & physical device management
│   │   │   ├── bookings/        # Concurrency-safe reservation engine
│   │   │   ├── payments/        # Razorpay/Cashfree webhook handlers & refunds
│   │   │   ├── verification/    # DigiLocker KYC API integrations
│   │   │   └── audit/           # Immutable audit logging service
│   │   ├── utils/               # Shared helpers (date overlap, crypto, OTP)
│   │   └── server.ts            # Express/Fastify application entrypoint
│   ├── package.json
│   └── tsconfig.json
├── database/                    # Database Migrations, Seeds & Policies
│   ├── migrations/              # Incremental, reversible SQL migration files
│   ├── seeds/                   # Realistic test data (Jabalpur shops & phones)
│   └── rls-policies/            # Standalone Row-Level Security policy definitions
├── tests/                       # Automated Verification Suites
│   ├── unit/                    # Unit tests (pricing algorithms, OTP validation)
│   ├── integration/             # Integration tests (booking concurrency, webhooks)
│   └── security/                # Security tests (privilege escalation, RLS leaks)
├── .env.example                 # Verified configuration template with placeholders
├── .gitignore                   # Exclusions for secrets, build artifacts, node_modules
└── README.md                    # Project overview & developer onboarding guide
```

---

## 2. File & Directory Naming Conventions

- **Directories**: `kebab-case` (e.g., `rls-policies`, `listing-images`).
- **Markdown Documentation**: `PascalCase` or `UPPER-CASE` for core indexes (e.g., `PROJECT-STATUS.md`, `System-Architecture.md`).
- **JavaScript/TypeScript**:
  - Modules and files: `kebab-case.ts` (e.g., `auth.middleware.ts`, `booking-engine.ts`).
  - Classes: `PascalCase` (e.g., `BookingService`).
  - Functions and variables: `camelCase` (e.g., `verifyWebhookSignature`).
- **SQL Files**: `YYYYMMDDHHMMSS_action_name.sql` (e.g., `20261027000001_create_core_schema.sql`).
- **CSS Files**: `kebab-case.css` (e.g., `variables.css`, `components.css`).

---

## 3. Related Links
- High-level system architecture: [[System-Architecture]]
- Architecture decision records: [[Architecture-Decisions]]
- Master roadmap: [[MASTER-PLAN]]
