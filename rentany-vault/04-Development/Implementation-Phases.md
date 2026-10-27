# 🚀 Jabalpur Rent — Implementation Phases & Checklists

> **Guideline**: Each phase must be verified against its acceptance criteria before work begins on subsequent phases.

---

## Phase 1: Planning, Architecture, Database Design & Threat Model
- **Status**: 🟡 **Under Founder Review**
- **Objectives**:
  - [x] Inspect workspace and initialize clean monorepo.
  - [x] Create dedicated Obsidian knowledge vault (`rentany-vault/` and `knowledge-vault/`).
  - [x] Document system architecture, folder structure, and data flows.
  - [x] Define PostgreSQL relational schema with range exclusion constraints and audit fields.
  - [x] Construct granular User-Role & Permission Matrix (RBAC).
  - [x] Author comprehensive STRIDE Threat Model and prioritized security checklist.
  - [x] Research Indian fintech & KYC providers (Razorpay, Cashfree, Setu) and compile cost model.
  - [x] Initialize Git repository, `.gitignore`, and `.env.example`.
  - [ ] **Acceptance Gate**: Present Phase 1 documentation to founder and receive explicit approval to proceed.

---

## Phase 2: Frontend Prototype with Fictional Data
- **Status**: ⚪ **Queued (Pending Phase 1 Approval)**
- **Objectives**:
  - [ ] Build core Vanilla CSS design system (`variables.css`, `base.css`, `components.css`, `utilities.css`) with rich aesthetics, HSL color palette, modern typography, and glassmorphism.
  - [ ] Create Customer Portal:
    - [ ] Marketplace landing page (`customer/index.html`) with Jabalpur locality filter (Sadar, Gorakhpur, Russell Chowk).
    - [ ] Phone catalog page (`customer/catalog.html`) with brand, specs, and price filters.
    - [ ] Phone detail page (`customer/device.html`) with interactive date range picker, daily price calculator, and security deposit breakdown.
    - [ ] Checkout page (`customer/checkout.html`) with mock KYC trigger and deposit escrow summary.
    - [ ] Customer booking dashboard (`customer/bookings.html`) displaying active rentals and Pickup OTP card.
  - [ ] Create Shop Partner Portal:
    - [ ] Shopkeeper login and dashboard (`shop/dashboard.html`) showing active rentals and returns due.
    - [ ] Physical device inventory manager (`shop/inventory.html`) with condition grades (A/B/C) and status toggles.
    - [ ] In-person Handover & Return verification screen (`shop/handover.html`) with OTP validation inputs.
  - [ ] Create Admin Control Center:
    - [ ] Admin dashboard (`admin/dashboard.html`) with operational KPI counters.
    - [ ] Shop approval queue (`admin/shops.html`).
    - [ ] KYC audit inspection view (`admin/kyc.html`).
    - [ ] Dispute arbitration screen (`admin/disputes.html`).
  - [ ] Populate with realistic fictional Jabalpur shop data and phone models.
  - [ ] **Acceptance Gate**: Responsive across mobile, tablet, desktop; smooth micro-interactions; zero console errors; founder review.

---

## Phase 3: Database Migrations, Auth, RLS & Private Storage
- **Status**: ⚪ **Queued**
- **Objectives**:
  - [ ] Write SQL migrations in `database/migrations/` for extensions, enums, tables, and constraints.
  - [ ] Implement Supabase Auth (Mobile Phone SMS OTP & Magic Link).
  - [ ] Deploy and verify Row-Level Security (RLS) policies for all 10 tables.
  - [ ] Set up Supabase Storage buckets (`listing-images` public, `verification-documents-private` private).
  - [ ] Write automated integration tests verifying that customer cannot view another's KYC or escalate their role.
  - [ ] **Acceptance Gate**: Automated security test suite passes with zero RLS bypass vulnerabilities.

---

## Phase 4: Shop Approval, Phone Listings, Real Inventory & Categories
- **Status**: ⚪ **Queued**
- **Objectives**:
  - [ ] Build shop partner onboarding API and submission forms (capturing Jabalpur address, Gumasta/Trade License).
  - [ ] Build admin verification and approval workflow for shops.
  - [ ] Implement two-tier inventory system: generic catalog templates (`listings`) and physical serial/IMEI hardware units (`physical_devices`).
  - [ ] Implement real-time status transitions (`AVAILABLE` <-> `MAINTENANCE` <-> `RESERVED`).
  - [ ] **Acceptance Gate**: Unapproved shops cannot list devices; shopkeepers cannot inspect or edit other shops' inventory.

---

## Phase 5: Concurrency-Safe Booking, Pricing, Deposits, Handover & Returns
- **Status**: ⚪ **Queued**
- **Objectives**:
  - [ ] Implement atomic booking engine using PostgreSQL `tstzrange` exclusion constraints and transaction locks.
  - [ ] Implement pricing calculator (daily rate x duration, discount tiers, refundable deposit hold).
  - [ ] Build 15-minute temporary reservation lock during checkout.
  - [ ] Implement Two-Factor In-Person Handover:
    - [ ] Platform generates cryptographically random 6-digit Pickup OTP.
    - [ ] Shopkeeper verifies OTP, inspects physical IMEI, uploads condition photos, and confirms handover.
  - [ ] Implement Return & Deposit Release Protocol:
    - [ ] Shopkeeper verifies factory reset / iCloud logout and confirms clean return.
    - [ ] Customer provides Return OTP.
    - [ ] System automatically releases security deposit back to customer.
  - [ ] **Acceptance Gate**: Parallel automated test with 10 simultaneous booking attempts on same phone permits exactly 1 booking and rejects 9.

---

## Phase 6: KYC Verification & Payment Gateway Integrations (Sandbox Mode)
- **Status**: ⚪ **Queued**
- **Objectives**:
  - [ ] Implement DigiLocker OKYC integration (Setu / Cashfree sandbox):
    - [ ] Customer redirects to DigiLocker consent screen.
    - [ ] Webhook validates signature, extracts masked Aadhaar (`XXXX-XXXX-1234`), and verifies Jabalpur/MP residency.
  - [ ] Implement Payment Gateway Integration (Razorpay / Cashfree sandbox):
    - [ ] Server creates payment order for rental fee + security deposit.
    - [ ] Webhook verifies HMAC-SHA256 signature and performs idempotent credit in database.
    - [ ] Automated instant refund API call triggered on clean device return.
  - [ ] **Acceptance Gate**: Webhook replay attack rejected; tampering signature fails; sandbox payments and refunds successfully complete.

---

## Phase 7: Security Hardening, Backup Audits & Jabalpur Shop Pilot
- **Status**: ⚪ **Queued**
- **Objectives**:
  - [ ] Conduct end-to-end security audit (penetration testing for IDOR, CSRF, XSS, rate-limit bypass).
  - [ ] Execute database backup restoration drill from snapshot.
  - [ ] Configure custom domain (`jabalpurrent.in` / `rentany.in`) with SSL and security headers.
  - [ ] Conduct controlled pilot with 2 verified mobile retail shops in Sadar and Russell Chowk, Jabalpur.
  - [ ] Execute 5 test rentals with test users and document real-world feedback.
  - [ ] **Acceptance Gate**: Zero critical security vulnerabilities; written confirmation from pilot shopkeepers.

---

## 🔗 Related Links
- Master plan roadmap: [[MASTER-PLAN]]
- Current phase status: [[Current-Phase]]
- Next steps: [[Next-Steps]]
