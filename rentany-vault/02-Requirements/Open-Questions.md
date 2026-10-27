# ❓ Jabalpur Rent — Open Business & Operational Decisions

> **Status**: Open for Founder Input. These are real-world operational, legal, and business decisions that require the founder's preference before production launch.

---

## 1. Resolved Business & Financial Decisions (Founder Approved)

### Question 1: Security Deposit Pricing Strategy
- **Decision**: **Option B (Tiered by KYC & Residency)** — Verified Jabalpur residents (with permanent local address on DigiLocker) pay a reduced security deposit of **₹3,000** for standard flagships; outstation visitors / tourists pay **₹8,000 - ₹10,000**.
- **Rationale**: Lowers the barrier to entry for Jabalpur locals while mitigating absconding risk for transient tourists.
- **Status**: 🟢 **Decided (Option 1B)**

---

### Question 2: Handling Device Damage & Repair Costs
- **Decision**: **Option A (Deposit Forfeiture for Exact Repairs)** — In case of accidental damage or cracks upon return, the authorized service center repair estimate is deducted directly from the security deposit; the remaining balance is refunded to the customer.
- **Status**: 🟢 **Decided (Option 2A)**

---

### Question 3: Primary Gateway Pairing & KYC Provider
- **Decision**: **Option A (Razorpay + Setu)** — **Razorpay** as the primary payment gateway (utilizing Razorpay Checkout and Instant Refunds API) paired with **Setu** (Pine Labs) for the official DigiLocker KYC consent flow.
- **Status**: 🟢 **Decided (Option 3A)**

---

### Question 4: Platform Commission Take-Rate
- **Decision**: **20% Platform Take-Rate** — Platform retains 20% of the gross rental fee; the partner shop receives 80% upon clean return and verification.
- **Economics Impact**: On a 3-day iPhone 15 Pro rental (₹1,200/day x 3 = ₹3,600), Jabalpur Rent earns **₹720 gross profit** per rental (up from ₹540 in the preliminary 15% projection).
- **Status**: 🟢 **Decided (20% Take-Rate)**

---

## 2. Unresolved Provider & Legal Requirements

### Question 5: TRAI DLT Registration for Transactional SMS
- **Context**: In India, sending transactional SMS (OTPs, booking confirmations) via Indian telecom networks legally requires **DLT Registration** (under TRAI regulations).
- **Phasing**:
  - In Phases 2-6: Use simulated sandbox OTPs and WhatsApp Business Cloud API (which offers 1,000 free service conversations per month without DLT friction).
  - Prior to Phase 7 Live Pilot: Register entity on Jio/Airtel DLT portal with Udyam / GSTIN certificate.
- **Status**: 🟡 **Planned for Phase 7**

---

## 3. Related Links
- Provider research: [[Provider-Research]]
- Business requirements: [[Business-Requirements]]
- Master roadmap: [[MASTER-PLAN]]
