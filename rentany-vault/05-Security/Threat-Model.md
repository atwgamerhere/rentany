# 🛡️ Jabalpur Rent — STRIDE Threat Model

> **Framework**: Microsoft STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) tailored specifically for high-value physical electronics rental marketplaces in India.

---

## 1. Asset Inventory & High-Value Targets

1. **Physical Hardware Assets**: Flagship smartphones (retail value ₹60,000 - ₹1,60,000 each) located in partner shops.
2. **Customer Identity Data**: Government identity records (Aadhaar, address, phone numbers).
3. **Financial Escrow Funds**: Customer security deposits (₹3,000 - ₹10,000 per booking) held in escrow.
4. **Privileged Access**: Administrative control over shop payouts and KYC approval.

---

## 2. Comprehensive STRIDE Threat Matrix

| Threat Category | Specific Threat Scenario | Risk Level | Platform Countermeasure |
| :--- | :--- | :---: | :--- |
| **Spoofing Identity** | Attacker uses a fake name or stolen phone number to register and rent an iPhone. | **Critical** | Mandatory DigiLocker OKYC requiring Aadhaar OTP authentication directly on government portal. Verification extracts legal name and matches registered mobile. |
| **Spoofing Identity** | Malicious actor sends fake payment webhook to `/api/payments/webhook` claiming a booking was paid. | **Critical** | The backend computes HMAC-SHA256 of the raw webhook body using the secret key (`RAZORPAY_WEBHOOK_SECRET`) and compares it with the `x-razorpay-signature` header in constant-time. Rejects unverified calls. |
| **Tampering with Data** | Attacker modifies the client HTTP request to change `daily_rate` from ₹1,200 to ₹10. | **High** | The server calculates all totals independently by fetching `base_daily_rate` directly from the database table. Client-submitted prices are discarded. |
| **Tampering with Data** | Customer swaps the phone's internal parts or returns a cheap Chinese dummy clone phone. | **High** | During in-person return, the shopkeeper dials `*#06#` on the physical phone and confirms the on-screen IMEI matches the stored `imei_hash` and checks battery health and screen serial diagnostics. |
| **Repudiation** | Customer claims they never received the phone and demands a full refund. | **High** | Two-Factor Handover: Handover requires the customer to share a secret 6-digit Pickup OTP that only exists in their authenticated dashboard/SMS. Shopkeeper records 4 timestamped photos of the customer with the device. |
| **Repudiation** | Shopkeeper claims the customer never returned the phone. | **High** | The customer initiates return by generating a secret Return OTP in their app. Handing over this OTP to the shopkeeper transitions the database state to `RETURNED` and triggers an automated SMS receipt. |
| **Information Disclosure** | Shopkeeper or attacker accesses private customer Aadhaar card copies or verification documents. | **Critical** | Strict database RLS prevents shopkeepers from viewing `user_verifications` rows. Documents reside in a private Supabase bucket accessible only via short-lived signed URLs generated for admins. |
| **Information Disclosure** | Storing unmasked 12-digit Aadhaar violates UIDAI law and leaks customer national ID. | **Critical** | Zero storage of 12-digit Aadhaar. The server regex-validates and stores only masked Aadhaar (`XXXX-XXXX-1234`). |
| **Denial of Service** | Attacker initiates 50 checkout sessions simultaneously to lock all iPhones in Jabalpur without paying. | **Medium** | Temporary booking holds expire strictly after 15 minutes if payment is not confirmed. Rate-limiting enforced on `/api/bookings/initiate` (max 3 pending holds per user). |
| **Denial of Service** | SMS OTP bombing attack on `/auth/send-otp` exhausting SMS balance. | **Medium** | Strict IP and phone-number rate limiting (max 3 OTP requests per phone per 10 minutes, with exponential backoff). |
| **Elevation of Privilege** | Authenticated customer sends `PUT /api/profile` with `role: "ADMIN"` to gain control center access. | **Critical** | Database RLS policy forbids updates to the `role` column by non-admin users. Server JWT token guards reject client-supplied role claims. Initial admin is provisioned exclusively via backend database seed. |
| **Elevation of Privilege** | Shopkeeper of Shop A attempts to view or delete devices belonging to Shop B. | **High** | Database RLS enforces `shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())` on all inventory queries. |

---

## 3. High-Risk Physical Threat Scenarios & Protocols

### Scenario A: Absconding / Theft of Device
- **Threat**: Customer rents an iPhone 15 Pro, pays ₹1,200 rent + ₹5,000 deposit, and flees Jabalpur or turns off the phone.
- **Protocol**:
  1. **T+12 Hours**: Automated automated WhatsApp/SMS warning and late fee deduction notice.
  2. **T+24 Hours**: Platform support attempts contact with customer and verified emergency contact.
  3. **T+48 Hours**: If uncontactable, platform transitions booking to `ESCALATED_LEGAL`.
  4. Platform generates **Police Investigation Dossier**: Verified DigiLocker legal name, permanent Aadhaar address, registered mobile, physical IMEI, and signed pickup photo agreement.
  5. Shop and platform submit theft FIR with Jabalpur Police Cyber Cell and initiate IMEI blacklist request on the national CEIR portal (blocking the device from connecting to any Indian telecom network: Jio, Airtel, Vi, BSNL).

### Scenario B: iCloud / Google FRP Account Locking
- **Threat**: Customer signs into their personal Apple ID / iCloud account with "Find My" enabled and returns the phone without logging out. The shop cannot wipe or re-rent the phone.
- **Protocol**:
  - The return verification protocol in the shopkeeper portal **strictly forbids** entering the Return OTP until the shopkeeper physically verifies the device is on the "Hello / Setup" screen or iCloud is signed out.

---

## 4. Related Links
- Security checklist: [[Security-Checklist]]
- Data privacy & Aadhaar masking: [[Privacy-and-Data-Retention]]
- Secrets & key management: [[Secrets-and-Configuration]]
- Access policies: [[Access-Policies]]
