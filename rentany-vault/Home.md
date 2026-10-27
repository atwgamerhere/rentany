# 🧭 Jabalpur Rent Knowledge Vault (Second Brain)

Welcome to the central knowledge repository for **Jabalpur Rent**, a trusted hyperlocal mobile-phone rental marketplace for Jabalpur, Madhya Pradesh, India.

---

## ⚡ Quick Navigation

| Document | Purpose | Status |
| :--- | :--- | :--- |
| [[PROJECT-STATUS]] | Real-time project heartbeat, blockers & current state | 🟢 Active |
| [[PROJECT-OVERVIEW]] | Core vision, business model, customer & shop persona | 📘 Reference |
| [[MASTER-PLAN]] | End-to-end 7-phase roadmap from prototype to pilot | 🗺️ Roadmap |
| [[Current-Phase]] | Deep-dive into what is happening right now (Phase 1) | 🔨 In Progress |
| [[Next-Steps]] | Immediate tactical actions queued up | ⏩ Queued |

---

## 📂 Vault Sections

### 01. Architecture & Design
- [[System-Architecture]] — High-level architecture, modular frontend/backend split, Supabase foundation
- [[Folder-Structure]] — Monorepo layout, clear separation between code and documentation
- [[Data-Flow]] — End-to-end sequences: browsing, KYC verification, checkout, handover, return
- [[Architecture-Decisions]] — Formal Architecture Decision Records (ADRs) with rationale and trade-offs

### 02. Product Requirements & Scope
- [[Business-Requirements]] — Jabalpur market dynamics, unit economics, security deposits, dispute resolution
- [[User-Roles-and-Permissions]] — Role-based access control (RBAC): Customer, Shop Partner, Admin
- [[MVP-Scope]] — What is in Phase 1-5 MVP vs. Post-MVP enhancements
- [[Open-Questions]] — Critical business and regulatory decisions awaiting founder input

### 03. Database & Storage
- [[Entity-Relationship-Diagram]] — Visual data model and foreign key topology
- [[Database-Schema]] — Production PostgreSQL DDL with strict types, constraints, and audit fields
- [[Migrations-Log]] — Chronological log of applied and planned database migrations
- [[Access-Policies]] — PostgreSQL Row-Level Security (RLS) policies and private storage rules

### 04. Development & Progress Tracking
- [[Implementation-Phases]] — Detailed breakdown of Phases 1 through 7 with acceptance criteria
- [[Current-Phase]] — Granular status of Phase 1 (Planning & Architecture)
- [[Change-Log]] — Chronological ledger of all modifications
- [[Known-Issues]] — Active bugs, technical debt, and operational risks
- [[Next-Steps]] — Immediate sequence of actions

### 05. Security, Privacy & Compliance
- [[Threat-Model]] — STRIDE threat analysis (theft, spoofing, tampering, privilege escalation)
- [[Security-Checklist]] — Prioritized security gates for authentication, data, payments, and storage
- [[Security-Findings]] — Vulnerabilities discovered, audited, and resolved
- [[Secrets-and-Configuration]] — Key management hierarchy and `.env` hygiene
- [[Privacy-and-Data-Retention]] — UIDAI Aadhaar masking compliance, DPDP Act 2023 alignment

### 06. Integrations & Third-Party Services
- [[Payment-Integration]] — Razorpay / Cashfree pre-authorization, capture, and instant refunds
- [[Verification-Provider]] — DigiLocker / Aadhaar OKYC / Setu API identity verification
- [[Notifications]] — Transactional SMS (TRAI DLT compliant) and WhatsApp Business API
- [[Provider-Research]] — Verifiable comparison of Indian fintech and KYC providers

### 07. Testing & Quality Assurance
- [[Test-Strategy]] — Unit, integration, security, and manual acceptance testing approach
- [[Test-Results]] — Verified test execution logs and validation artifacts
- [[Regression-Checklist]] — Pre-deploy safety checks
- [[Release-Checklist]] — Gate checklist for staged deployments

### 08. Operations, Infrastructure & Costs
- [[Deployment-Guide]] — Staging and production deployment guides (Vercel + Supabase)
- [[Backup-and-Recovery]] — Database backup routines, PITR, and disaster recovery protocol
- [[Monitoring-and-Incidents]] — Health checks, error logging, and emergency incident protocol
- [[Cost-Tracking]] — Current, verifiable monthly operating costs in Indian Rupees (INR)

### 09. Session Logs & Audit Trail
- [[09-Session-Logs/README|Session Logs Index]] — Historical ledger of all development and architectural sessions
- [[2026-10-27-Session-01]] — Session 01: Initial inspection, architecture blueprint & knowledge vault initialization

### 10. Reference
- [[Glossary]] — Domain terminology (IMEI, OKYC, Escrow, Pre-Auth, RLS, DLT)
- [[External-References]] — Official documentation links, regulatory acts, and SDK guides

---

## 🛡️ The Golden Rules of Jabalpur Rent
1. **Never prioritize coding speed over security, correctness or maintainability.**
2. **Never expose privileged keys (e.g., `SUPABASE_SERVICE_ROLE_KEY`) to browser code.**
3. **Never store raw 12-digit Aadhaar numbers — enforce UIDAI masking.**
4. **Never trust frontend assertions — validate all permissions, prices, and booking slots on the server/database.**
5. **Keep documentation and code strictly synchronized at the start and end of every session.**
