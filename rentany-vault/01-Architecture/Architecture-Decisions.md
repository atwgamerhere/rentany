# 🏛️ Jabalpur Rent — Architecture Decision Records (ADRs)

> This document maintains the permanent chronological record of architectural choices, trade-offs, evaluated alternatives, and consequences.

---

## Index of Architecture Decision Records

| ADR ID | Title | Date | Status |
| :--- | :--- | :--- | :--- |
| [[#ADR-001]] | Separation of Obsidian Knowledge Vault from Application Code | 2026-10-27 | 🟢 Accepted |
| [[#ADR-002]] | Vanilla HTML5/CSS3/JavaScript for Frontend | 2026-10-27 | 🟢 Accepted |
| [[#ADR-003]] | Managed PostgreSQL & Supabase with Row-Level Security | 2026-10-27 | 🟢 Accepted |
| [[#ADR-004]] | Dedicated Modular TypeScript Backend for Sensitive Gateways | 2026-10-27 | 🟢 Accepted |
| [[#ADR-005]] | Two-Tier Inventory Model: Listing Templates vs Physical Devices | 2026-10-27 | 🟢 Accepted |
| [[#ADR-006]] | DigiLocker OKYC & Masked Aadhaar Storage Strategy | 2026-10-27 | 🟢 Accepted |
| [[#ADR-007]] | Upfront Charge + Automated Deposit Refund vs Card Pre-Auth Holds | 2026-10-27 | 🟢 Accepted |
| [[#ADR-008]] | Business & Provider Parameters (20% Take-Rate, Tiered Deposits, Razorpay+Setu) | 2026-10-27 | 🟢 Accepted |

---

### ADR-001: Separation of Obsidian Knowledge Vault from Application Code
- **Date**: 2026-10-27
- **Context**: The project requires extensive documentation, security modeling, regulatory logging, and architecture decision tracking that must remain accessible to the founder, AI agents, and future developers without polluting application bundle sizes or deployment build pipelines.
- **Decision**: Store all documentation in a dedicated Obsidian vault directory (`rentany-vault/` with junction `knowledge-vault/`) inside the project root, keeping code strictly separate (`frontend/`, `backend/`, `database/`, `tests/`).
- **Alternatives Considered**:
  - *Inline documentation in code comments*: Insufficient for business workflows, threat models, and cross-cutting requirements.
  - *External wiki (Notion/Confluence)*: Disconnected from git version control, prone to becoming stale, requires external accounts.
- **Consequences**:
  - Positive: Complete architectural second brain directly inside the git repo, browsable offline via Obsidian.
  - Negative: Must maintain discipline to update Markdown files at the end of every development session.

---

### ADR-002: Vanilla HTML5/CSS3/JavaScript for Frontend
- **Date**: 2026-10-27
- **Context**: The application serves customers, local shopkeepers, and administrators in Jabalpur, often on mobile 4G connections. The founder is a beginner who needs maintainable, readable code without massive dependency trees.
- **Decision**: Build the frontend with semantic HTML5, modern Vanilla CSS (design tokens and CSS variables), and clean Vanilla ES modules.
- **Alternatives Considered**:
  - *React / Next.js*: High build complexity, large bundle size, fast deprecation cycles, heavy memory footprint on lower-end shopkeeper devices.
  - *Flutter / React Native*: Adds app store publishing friction and approval delays; web-first PWA approach enables instant updates and frictionless QR code access in physical shops.
- **Consequences**:
  - Positive: Instant page loads, zero build step for client code, 100% standard web compatibility, beginner-friendly maintainability.
  - Negative: Manual DOM updates for complex state (mitigated by clean helper patterns in `api.js` and `auth.js`).

---

### ADR-003: Managed PostgreSQL & Supabase with Row-Level Security
- **Date**: 2026-10-27
- **Context**: The platform needs relational integrity (foreign keys, check constraints, dates), integrated identity/auth, file storage, and bulletproof security rules.
- **Decision**: Use PostgreSQL managed via Supabase, enforcing PostgreSQL Row-Level Security (RLS) on all user-facing tables.
- **Alternatives Considered**:
  - *MongoDB / Document Store*: Weak transactional guarantees for inventory booking concurrency; prone to race conditions and phantom double bookings.
  - *Self-hosted PostgreSQL on VPS*: High maintenance overhead (backups, patches, connection pooling).
- **Consequences**:
  - Positive: Battle-tested relational engine, automatic connection pooling, built-in phone authentication, generous free tier ($0/mo) and predictable growth tier ($25/mo).
  - Negative: Requires writing SQL RLS policies carefully to avoid performance degradation.

---

### ADR-004: Dedicated Modular TypeScript Backend for Sensitive Gateways
- **Date**: 2026-10-27
- **Context**: While Supabase allows direct client-to-database queries via RLS, critical operations (verifying payment webhook HMAC signatures, parsing DigiLocker KYC payloads, managing atomic reservation locks, issuing OTPs) cannot be safely trusted to client-side code.
- **Decision**: Implement a lightweight, modular TypeScript backend service.
- **Alternatives Considered**:
  - *Pure Client + Supabase Edge Functions (Deno)*: Edge functions are good for small tasks but complicate local testing, debugging, and mock integrations.
  - *Full monolithic Django/Spring backend*: Overly heavy and slow to iterate for an early-stage Jabalpur marketplace.
- **Consequences**:
  - Positive: Clear security perimeter, centralized logging, standard Node.js ecosystem, easy local testing.
  - Negative: Requires hosting an API service (easily handled on Render/Railway free/starter tier).

---

### ADR-005: Two-Tier Inventory Model: Listing Templates vs Physical Devices
- **Date**: 2026-10-27
- **Context**: A mobile shop may possess three units of "iPhone 15 Pro 128GB Black", but each unit has an individual physical history (battery health: 98% vs 91%, minor scratch on bezel vs pristine, individual IMEI).
- **Decision**: Decouple the catalog into `listings` (the model/variant metadata) and `physical_devices` (the individual hardware asset with IMEI, serial number, and live status).
- **Alternatives Considered**:
  - *Single table with quantity integer*: Fails catastrophically for rental businesses because you cannot track which customer has which physical IMEI or verify damage on return.
- **Consequences**:
  - Positive: Accurate asset tracking, physical IMEI auditing, exact return inspection logging.
  - Negative: Slightly more normalized database queries.

---

### ADR-006: DigiLocker OKYC & Masked Aadhaar Storage Strategy
- **Date**: 2026-10-27
- **Context**: Under UIDAI regulations and India's Aadhaar Act 2016, private commercial entities are legally prohibited from storing unredacted 12-digit Aadhaar numbers and biometric records.
- **Decision**: Integrate DigiLocker via Setu/Cashfree API. Capture verified name, date of birth, photo, and **masked Aadhaar** (`XXXX-XXXX-1234`). Discard raw XML, store verified status and audit hash in `user_verifications`.
- **Alternatives Considered**:
  - *Manual customer photo upload of physical Aadhaar card*: Highly vulnerable to Photoshop forgery; legally risky if raw Aadhaar images are stored unmasked.
- **Consequences**:
  - Positive: 100% legal compliance with UIDAI and DPDP Act 2023; zero liability from storing sensitive biometric or identity secrets.
  - Negative: Requires small per-verification fee (~₹5 - ₹10) via KYC gateway provider.

---

### ADR-007: Upfront Charge + Automated Deposit Refund vs Card Pre-Auth Holds
- **Date**: 2026-10-27
- **Context**: Renting physical phones requires a refundable security deposit (₹3,000 to ₹10,000). While credit card pre-authorization holds exist, Reserve Bank of India (RBI) regulations strictly cap pre-auth validity (usually 5 to 7 days max) and customer adoption of credit cards in Jabalpur is low (~15-20% vs 80%+ UPI adoption).
- **Decision**: Charge Rental Fee + Security Deposit upfront via standard Indian checkout (UPI, debit card, netbanking). Upon clean device return, the backend automatically issues an instant refund of the security deposit amount to the original payment source.
- **Alternatives Considered**:
  - *Credit Card Pre-Auth only*: Excludes 80%+ of Jabalpur customers who only use UPI (Google Pay, PhonePe, Paytm).
  - *Cash Deposit at Shop*: Completely bypasses the platform, eliminates dispute escrow, and enables shop-customer collusion.
- **Consequences**:
  - Positive: Works universally with UPI, debit cards, and netbanking; guarantees dispute leverage and customer commitment.
  - Negative: Payment gateway processing fee applies to deposit transaction (can be absorbed into platform fee or passed as nominal handling fee).

---

### ADR-008: Business & Provider Parameters (20% Take-Rate, Tiered Deposits, Razorpay + Setu)
- **Date**: 2026-10-27
- **Context**: Operational economics, dispute liability, deposit pricing, and vendor selection were presented to the founder in Phase 1 review.
- **Decision**:
  1. **Platform Take-Rate**: Fixed at 20% platform commission (Shop receives 80% payout).
  2. **Security Deposits**: Tiered by verified residence (Tier 1 Jabalpur residents pay ₹3,000 for standard flagships; outstation/tourists pay ₹8,000 - ₹10,000).
  3. **Damage Liability**: Authorized service center estimate deducted directly from the security deposit; remainder refunded.
  4. **Primary Gateways**: Razorpay for Checkout & Instant Refunds API; Setu for DigiLocker OKYC consent flow.
- **Consequences**:
  - Positive: Increases gross margin per 3-day rental from ₹540 to ₹720 (+33% profitability); lowers local barrier to entry while protecting against outstation flight risk; unifies best-in-class developer APIs (Razorpay + Setu).
  - Negative: Higher deposit on tourists may slightly reduce outstation bookings; shopkeeper payout model requires clean return sign-off.
