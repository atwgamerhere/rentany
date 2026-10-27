# 📋 Jabalpur Rent — Business Requirements Document (BRD)

> **Document Version**: 1.0 (Phase 1 Baseline)  
> **Target Market**: Jabalpur Municipal Area & Surrounding Mahakoshal Region, Madhya Pradesh, India.

---

## 1. Business Context & Objectives

Jabalpur Rent is established to unlock liquidity from high-value mobile phone inventory resting in local retail shops by creating a secure, legally-compliant peer-to-business-to-consumer (B2B2C) rental network.

### Primary Objectives
1. **Enable frictionless short-term rentals** (1 to 30 days) of flagship smartphones (iPhone, Samsung Galaxy, OnePlus) for local Jabalpur citizens, students, tourists, and professionals.
2. **Eliminate asset loss and theft risk** for local partner shops through automated DigiLocker identity verification and refundable escrow deposits.
3. **Establish a repeatable, profitable unit economics model** (12-18% platform commission take-rate).

---

## 2. Stakeholder Profiles

| Stakeholder | Role | Primary Needs |
| :--- | :--- | :--- |
| **Customer (Renter)** | End user renting a smartphone | Affordable access, verified working phone, instant deposit refund, no hidden charges. |
| **Shop Partner (Lender)** | Local mobile phone retail shopkeeper | Guaranteed return of hardware, high asset utilization, timely weekly payouts, protection against theft/damage. |
| **Platform Administrator** | Marketplace operator (You) | Operational oversight, shop onboarding approval, dispute arbitration, payment monitoring, fraud alerts. |
| **Law Enforcement / Legal** | MP Police & Cyber Cell (if escalation occurs) | Audit trail of physical IMEI, verified Aadhaar records, timestamped pickup photos in case of theft. |

---

## 3. Functional Requirements

### 3.1 Catalog & Search (Public / Customer)
- **FR-01**: Browse phones by Brand (Apple, Samsung, Google, OnePlus), Category (Flagship, Vlogging, Budget), and Price range.
- **FR-02**: Filter by Jabalpur Shop Location (e.g., *Sadar*, *Russell Chowk*, *Gorakhpur*, *Wright Town*, *Adhartal*).
- **FR-03**: Dynamic Date Range Picker calculating exact rental days and tiered discounts.
- **FR-04**: Transparent breakdown before checkout showing:
  - Base Rental Fee (e.g., ₹1,200/day x 3 = ₹3,600)
  - Platform / Insurance Service Fee (e.g., ₹200)
  - 100% Refundable Security Deposit (e.g., ₹5,000)
  - **Total Amount Payable at Checkout** (e.g., ₹8,800)

### 3.2 Customer Identity & KYC Verification
- **FR-05**: Mandatory mobile phone OTP verification during registration.
- **FR-06**: Digital KYC via DigiLocker API (or government-approved Aadhaar OKYC):
  - Must verify Full Legal Name, Date of Birth (must be 18+ years), and Permanent Address.
  - Automatically extract masked Aadhaar (`XXXX-XXXX-1234`).
  - Flag customers with out-of-state addresses for manual admin risk assessment or higher deposit tier.
- **FR-07**: Tiered KYC verification badges (e.g., Tier 1: Verified Local Resident; Tier 2: Verified Student / Corporate).

### 3.3 Concurrency & Booking Engine
- **FR-08**: Guarantee that a specific physical device (`physical_devices.id`) cannot be booked by two customers for overlapping time intervals.
- **FR-09**: Temporary 15-minute reservation hold while the customer completes online payment. If payment fails or times out, the hold is automatically released.
- **FR-10**: Generation of a cryptographically secure 6-digit **Pickup OTP** sent to the customer upon payment confirmation.

### 3.4 Physical Handover at Shop
- **FR-11**: Customer must physically visit the assigned Jabalpur shop.
- **FR-12**: Shopkeeper enters the customer's Pickup OTP into the Shop Portal to authorize handover.
- **FR-13**: Digital Condition Checklist:
  - Verify physical IMEI matches database record.
  - Record battery health percentage.
  - Shopkeeper takes 4 photos (front, back, sides) of current cosmetic condition directly into portal.
  - Customer signs digital handover acknowledgement on screen.

### 3.5 Device Return & Settlement
- **FR-14**: Customer returns device to shop before the agreed cutoff time.
- **FR-15**: Return Checklist:
  - Customer must log out of Apple ID / iCloud / Google Account and demonstrate factory reset.
  - Shopkeeper verifies screen and camera integrity.
- **FR-16**: Customer provides a **Return OTP** to the shopkeeper.
- **FR-17**: Instant Deposit Refund:
  - If returned in clean condition, backend initiates instant automated refund of the ₹5,000 security deposit via payment gateway refund API.
  - If damaged, shopkeeper flags damage with photo proof, triggering admin arbitration review.
- **FR-18**: Automated late fee calculation (e.g., ₹100 per hour delayed beyond 2-hour grace period, deducted from deposit).

### 3.6 Shop Onboarding & Management
- **FR-19**: Shop registration form capturing Shop Name, Owner Name, Physical Address in Jabalpur, Contact, GSTIN (or Trade License / Gumasta), and Bank Account / UPI details for payouts.
- **FR-20**: Admin approval gate: Shop cannot publish inventory until manually verified and approved by Platform Administrator.
- **FR-21**: Inventory management: Shop can add physical devices with IMEI, condition grade, and status toggles.

### 3.7 Administration & Audit
- **FR-22**: Unified dashboard showing active rentals, pending pickups, returns due today, and dispute queue.
- **FR-23**: Immutable audit log of all financial events, state transitions, and sensitive document access.

---

## 4. Non-Functional Requirements

### 4.1 Security & Compliance
- **NFR-01**: Zero storage of raw 12-digit Aadhaar numbers or biometrics (strict UIDAI compliance).
- **NFR-02**: All private verification documents stored in encrypted private storage accessible only via short-lived signed URLs.
- **NFR-03**: All payment callbacks validated using HMAC-SHA256 signatures with secret rotation capability.

### 4.2 Performance & Responsiveness
- **NFR-04**: Frontend page load under 1.5 seconds on 4G mobile connections.
- **NFR-05**: Mobile-responsive UI optimized for standard Android smartphones commonly used by local shopkeepers.

### 4.3 Data Integrity & Availability
- **NFR-06**: ACID transactional guarantees on all booking and reservation state changes.
- **NFR-07**: Daily automated database backups with point-in-time recovery capabilities.

---

## 5. Related Links
- Role and permissions matrix: [[User-Roles-and-Permissions]]
- MVP scope boundaries: [[MVP-Scope]]
- Open business decisions: [[Open-Questions]]
- Database schema: [[Database-Schema]]
