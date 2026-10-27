# 🧭 RENTANY — Chronological Reading & Audit Guide

> **Purpose**: This guide outlines the exact chronological order and logical sequence in which to read and audit every document, architecture record, database migration, API handler, frontend screen, and test file in the RENTANY project.

---

## 🗺️ Visual Reading Roadmap

```
1. Vision & Problem Statement (PROJECT-OVERVIEW.md)
   ↓
2. Scope & Boundaries (02-Requirements/MVP-Scope.md)
   ↓
3. Architectural Decision Records (01-Architecture/Architecture-Decisions.md)
   ↓
4. Relational Data Model (03-Database/Database-Schema.md)
   ↓
5. STRIDE Threat Model & UIDAI Compliance (05-Security/Threat-Model.md)
   ↓
6. Brand Identity & Natural Asset Palette (08-Operations/Brand-Identity.md)
   ↓
7. Frontend User Experience (Customer, Shopkeeper, Admin Portals)
   ↓
8. Database Migrations & RLS Engine (database/migrations/)
   ↓
9. Backend API & Concurrency Lock Core (backend/src/)
   ↓
10. Test Verification Suite & Session Logs (tests/ & 09-Session-Logs/)
```

---

## 📖 Step-by-Step Reading Order

### Step 1: Foundations & The Core Business Problem
Start here to understand why RENTANY exists, who the stakeholders are in Jabalpur, and what value proposition it creates for local electronics merchants.
1. [[PROJECT-OVERVIEW]] — High-level marketplace overview, Jabalpur market characteristics, and core personas.
2. [[02-Requirements/MVP-Scope|MVP-Scope.md]] — Must-have features vs deferred features (YAGNI principle).
3. [[02-Requirements/User-Stories|User-Stories.md]] — Acceptance criteria for Customers, Shopkeepers, and Platform Admins.

### Step 2: Architecture & Decision Records (ADRs)
Read why specific architectural choices were made instead of generic alternatives.
1. [[01-Architecture/Architecture-Decisions|Architecture-Decisions.md]] — Formal ADRs 001 through 009:
   - **ADR-001**: Hyperlocal Retail Inventory Model (No warehouse holding).
   - **ADR-002**: Pure Vanilla Web Tech Stack (Zero framework bloat).
   - **ADR-003**: Supabase / PostgreSQL with AWS Mumbai Region (`ap-south-1`).
   - **ADR-004**: Government DigiLocker OKYC with UIDAI Aadhaar Masking.
   - **ADR-005**: Upfront Deposit with Automated Razorpay Instant Refund.
   - **ADR-006**: Engine-Level Range Exclusion Constraints (`btree_gist` + `tstzrange`).
   - **ADR-007**: 2-Factor Store Pickup OTP Verification.
   - **ADR-008**: 20% Platform Commission Split (80% Shop Payout).
   - **ADR-009**: Obsidian Vault as Living Second Brain.

### Step 3: Database & Security Architecture
Examine how hardware concurrency and data privacy are enforced at the database level.
1. [[03-Database/Database-Schema|Database-Schema.md]] — The 10 core PostgreSQL tables, relational keys, and check constraints.
2. [[03-Database/Row-Level-Security|Row-Level-Security.md]] — Multi-tenant tenant isolation and admin privilege rules.
3. [[05-Security/Threat-Model|Threat-Model.md]] — STRIDE threat analysis and anti-theft defense.
4. [[05-Security/Security-Checklist|Security-Checklist.md]] — Prioritized security verification matrix.

### Step 4: Brand Identity & Natural Aesthetic Design System
Understand the visual language, bespoke color tokens, and organic assets from `d:\RENTANY\ASSETS\`.
1. [[08-Operations/Brand-Identity|Brand-Identity.md]] — Color palette: Royal Crimson (`#B21F3A`), Champagne Gold (`#EDC79B`), Deep Espresso (`#3D250B`), and companion bronze/mocha.
2. Asset inventory: `fl.png` (Lotus crest), `fl-filled.png` (Trust watermark), and `ingredient1.svg` through `ingredient14.svg` (Tactile botanicals & stipple texture).

### Step 5: Frontend Interactive Portals (Source Code Audit)
Review the HTML5, CSS3, and ES modules in `frontend/`:
1. `frontend/src/css/variables.css` — CSS design tokens, HSL surfaces, typography.
2. `frontend/src/css/base.css` — Reset, typography, stippled background texture.
3. `frontend/src/css/components.css` — Buttons, cards, modals, floating botanicals, flourish dividers.
4. `frontend/src/js/mock-data.js` — Realistic Jabalpur dataset (Sadar, Russell Chowk, Gorakhpur, Wright Town).
5. `frontend/src/js/utils.js` — Pricing calculator, duration discounts (10% & 20%), toast engine.
6. Customer Experience:
   - `frontend/index.html` — Homepage, hero landscape, locality filters, phone cards, Jabalpur stories.
   - `frontend/src/customer/catalog.html` — Multi-facet catalog with search and brand filters.
   - `frontend/src/customer/device.html` — Live duration slider, resident vs outstation deposit calculator.
   - `frontend/src/customer/checkout.html` — DigiLocker KYC badge, simulated Razorpay checkout.
   - `frontend/src/customer/bookings.html` — Digital Pickup Pass with 6-digit OTP `849 201` and refund receipt.
7. Partner & Admin Portals:
   - `frontend/src/shop/dashboard.html` — Store owner metrics, active rentals, 80% payout revenue.
   - `frontend/src/shop/inventory.html` — Physical inventory list, IMEI hashes, battery health status.
   - `frontend/src/shop/handover.html` — Counter terminal for entering Pickup OTP and triggering deposit refunds.
   - `frontend/src/admin/dashboard.html` — 20% platform profit tracker, shop approval queue.

### Step 6: Backend Engine & Production Database Migrations
Review the executable database migrations in `database/migrations/`:
1. `20261027000001_extensions_and_enums.sql` — PostgreSQL extensions (`uuid-ossp`, `btree_gist`) and custom enums.
2. `20261027000002_core_tables.sql` — DDL for profiles, shops, listings, devices, bookings, payments, inspections, disputes, audit logs.
3. `20261027000003_constraints_and_indexes.sql` — Overlapping booking exclusion constraint.
4. `20261027000004_row_level_security.sql` — RLS policies for tenant isolation.
5. `20261027000005_storage_buckets.sql` — S3 bucket permissions and signed URLs.
6. `20261027000006_audit_triggers.sql` — Automated timestamp triggers and tamper-proof audit logger.
7. `20261027000007_seed_data.sql` — Initial seed data for Jabalpur shops and admin profile.

### Step 7: Integrations & Third-Party Gateways
Review integration guides and payloads for external Indian infrastructure:
1. [[06-Integrations/DigiLocker-OKYC|DigiLocker-OKYC.md]] — Setu API flow, Aadhaar OTP, masked XML.
2. [[06-Integrations/Razorpay-Escrow|Razorpay-Escrow.md]] — Order capture, instant refund API, webhook HMAC verification.

### Step 8: Testing Suite & Quality Assurance
Review automated verification scripts and test runs:
1. `tests/unit/pricing.test.ts` — Pricing engine math and duration discount tiers.
2. `tests/integration/concurrency.test.ts` — Range exclusion double-booking prevention.
3. `tests/security/rls.test.ts` — Row-level security boundary testing.
4. `rentany-vault/07-Testing/` — Test logs and acceptance test run summaries.

### Step 9: Project Status & Session History
Review the chronological audit logs recording every step of development:
1. [[PROJECT-STATUS]] — Live heartbeat and phase status.
2. [[09-Session-Logs/2026-10-27-Session-01|Session-01.md]] — Repository setup, architecture, and threat model.
3. [[09-Session-Logs/2026-10-27-Session-02|Session-02.md]] — Phase 2 prototype implementation.
4. [[09-Session-Logs/2026-10-27-Session-03|Session-03.md]] — Bespoke brand asset overhaul and natural luxury design.
5. Successive session logs as phases complete.
