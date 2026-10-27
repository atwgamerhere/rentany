# 🔍 Jabalpur Rent — Security Findings & Vulnerability Ledger

> **Policy**: Every vulnerability discovered during design reviews, automated scans, or penetration tests is recorded with severity, proof of concept, remediation, and verification status.

---

## 1. Vulnerability Ledger

| Finding ID | Date | Component | Vulnerability Title | Severity | Status | Remediated In |
| :--- | :---: | :--- | :--- | :---: | :---: | :---: |
| **SEC-FIND-001** | 2026-10-27 | Architecture / Privacy | Raw Aadhaar Number Storage Regulatory Liability | **Critical** | 🟢 Remediated (By Design) | [[Architecture-Decisions#ADR-006]] |
| **SEC-FIND-002** | 2026-10-27 | Architecture / Payments | Direct Client-to-DB Webhook Handling Risk | **Critical** | 🟢 Remediated (By Design) | [[Architecture-Decisions#ADR-004]] |
| **SEC-FIND-003** | 2026-10-27 | Database / Concurrency | Race Condition Double Booking on Hardware Assets | **High** | 🟢 Remediated (By Design) | [[Database-Schema]] (`tstzrange`) |

---

## 2. Detailed Findings Analysis

### SEC-FIND-001: Raw Aadhaar Number Storage Regulatory Liability
- **Date**: 2026-10-27 (Design Audit)
- **Severity**: **Critical** (Legal & Compliance Risk under Aadhaar Act 2016)
- **Problem**: Original concept assumed customers could upload unredacted physical photos of their Aadhaar cards. Storing raw 12-digit Aadhaar numbers and biometric data without UIDAI authorization exposes the founder to severe regulatory penalties and criminal liability.
- **Remediation**: Implemented [[Architecture-Decisions#ADR-006]]. The application strictly consumes DigiLocker OKYC payloads, validates that only masked Aadhaar (`XXXX-XXXX-1234`) is persisted, and enforces a regex check constraint at the database table level.

---

### SEC-FIND-002: Direct Client-to-DB Webhook Handling Risk
- **Date**: 2026-10-27 (Architecture Audit)
- **Severity**: **Critical** (Financial Tampering)
- **Problem**: In naive serverless architectures, developers sometimes attempt to verify payment status directly in the browser or via unauthenticated client API calls. An attacker could craft fake payment success payloads and mark bookings as confirmed without paying.
- **Remediation**: Implemented a dedicated modular TypeScript backend service ([[Architecture-Decisions#ADR-004]]). Webhook callbacks terminate on private backend endpoints, verifying HMAC-SHA256 signatures using server-held secret keys with constant-time equality checks.

---

### SEC-FIND-003: Race Condition Double Booking on Hardware Assets
- **Date**: 2026-10-27 (Database Audit)
- **Severity**: **High** (Operational Failure)
- **Problem**: If two users attempt to book the exact same iPhone in Russell Chowk for the same weekend, simple `SELECT` followed by `INSERT` queries allow both transactions to succeed due to read-commit concurrency gaps.
- **Remediation**: Designed the `bookings` table with PostgreSQL `tstzrange` column type and an exclusion constraint using the `btree_gist` extension:
  ```sql
  EXCLUDE USING gist (device_id WITH =, rental_period WITH &&) WHERE (status NOT IN ('CANCELLED'))
  ```
  The database engine rejects overlapping reservations at the physical storage engine level with absolute mathematical certainty.

---

## 3. Related Links
- STRIDE threat model: [[Threat-Model]]
- Security checklist: [[Security-Checklist]]
- Database schema: [[Database-Schema]]
