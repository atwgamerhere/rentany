# ❓ Jabalpur Rent — Open Business & Operational Decisions

> **Status**: Open for Founder Input. These are real-world operational, legal, and business decisions that require the founder's preference before production launch.

---

## 1. Unresolved Business & Financial Decisions

### Question 1: Security Deposit Pricing Strategy
- **Context**: A refurbished or display iPhone 14 Pro retails for ₹65,000 to ₹75,000. Renting it for ₹1,200/day requires a security deposit. If the deposit is too high (e.g., ₹25,000), normal customers in Jabalpur cannot afford the upfront block. If it is too low (e.g., ₹2,000), the theft risk increases.
- **Options**:
  1. **Option A (Fixed Moderate Deposit)**: ₹5,000 for standard flagships, ₹8,000 for Pro Max / Ultra models. Coupled with mandatory DigiLocker OKYC and local resident verification. (Recommended baseline for pilot).
  2. **Option B (Tiered by KYC Score)**: Jabalpur permanent residents with verified home address pay ₹3,000 deposit; out-of-town visitors pay ₹8,000 - ₹10,000 deposit.
  3. **Option C (Credit Card Pre-Authorization)**: Zero cash deposit upfront, but customer must hold a credit card with ₹40,000 available limit. (Limits market size significantly in Jabalpur).
- **Founder Decision**: *Pending founder feedback.*

---

### Question 2: Handling Device Damage & Repair Costs
- **Context**: If a customer drops an iPhone and cracks the back glass (repair cost: ₹4,000 - ₹8,000):
- **Options**:
  1. **Option A (Deposit Forfeiture)**: Deduct exact authorized service center repair estimate from the security deposit; refund the remainder.
  2. **Option B (Damage Waiver / Micro-Insurance)**: Add an optional or mandatory "Damage Protection Fee" of ₹99/day that covers accidental screen cracks with a flat ₹999 deductible.
- **Founder Decision**: *Pending founder feedback.*

---

### Question 3: Shop Partner Commission Split
- **Context**: What percentage of the rental fee does the platform retain versus what is remitted to the local shopkeeper?
- **Options**:
  1. **15% Platform Take-Rate**: Standard in equipment rental marketplaces (Shop gets 85%, Platform gets 15%).
  2. **Tiered Take-Rate**: 18% for single-listing shops, reduced to 12% for premier shops listing 5+ phones.
- **Founder Decision**: *Pending founder feedback.*

---

## 2. Unresolved Provider & Legal Requirements

### Question 4: Primary KYC Provider Selection
- **Context**: DigiLocker API integration is essential for extracting verified identity without storing illegal unmasked Aadhaar data.
- **Evaluated Providers**:
  - **Setu (Pine Labs)**: Excellent developer experience, DigiLocker sandbox ready, charges approx ₹5 - ₹12 per successful verification.
  - **Cashfree Verification Suite**: Integrated into Cashfree ecosystem (handles both Aadhaar OKYC and instant bank penny-drop for shopkeeper payouts).
  - **Decision Needed**: Do you prefer Cashfree as a unified gateway for both payments & KYC, or Razorpay + Setu?

---

### Question 5: TRAI DLT Registration for Transactional SMS
- **Context**: In India, sending transactional SMS (OTPs, booking confirmations) via Indian telecom networks legally requires **DLT Registration** (under TRAI Telecom Commercial Communications Customer Preference Regulations).
  - Requires a registered business entity (Proprietorship, Partnership, or Pvt Ltd), GSTIN/Udyam certificate, and a one-time fee of approx ₹2,500 - ₹5,000 paid to telecoms (Jio/Airtel DLT).
- **Workaround for Prototype / Sandbox**:
  - For Phase 1-6 testing, we use sandbox/mock OTPs or developer test routes (e.g., Fast2SMS test balance or Supabase development test mode).
  - **Decision Needed**: Will you register a formal business entity (e.g., Udyam / GSTIN in Jabalpur) before the Phase 7 live pilot, or will we pilot using WhatsApp Cloud API authentication messages?

---

## 3. Related Links
- Provider research: [[Provider-Research]]
- Business requirements: [[Business-Requirements]]
- Master roadmap: [[MASTER-PLAN]]
