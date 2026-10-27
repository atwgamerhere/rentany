# ⚠️ Jabalpur Rent — Known Issues, Technical Debt & Operational Risks

> **Philosophy**: Acknowledge bugs, limitations, and operational risks transparently. Never hide known defects in documentation.

---

## 1. Active Technical Limitations & Watchlist

| ID | Category | Description | Severity | Mitigation / Resolution Strategy |
| :--- | :--- | :--- | :---: | :--- |
| **KI-01** | Payment / RBI | **Card Pre-Auth Expiration**: RBI mandates that credit card pre-authorization holds lapse after 5 to 7 days if not captured. | Medium | Addressed in [[Architecture-Decisions#ADR-007]]: Charge Rental Fee + Security Deposit upfront via UPI/Netbanking; trigger automated instant refund via gateway API on return. |
| **KI-02** | Telephony / Regulatory | **TRAI DLT SMS Lead Time**: In India, transactional SMS requires business DLT registration on Jio/Airtel telecom portals, which takes 7-14 days and requires a registered entity. | Low | Use sandbox mock SMS for Phase 1-6 development. For live pilot, use WhatsApp Cloud API authentication messages or complete Udyam DLT registration. |
| **KI-03** | Operations / Asset Risk | **Phone Non-Return / Flee Risk**: A malicious customer might attempt to abscond with a ₹70,000 phone despite paying a ₹5,000 deposit. | High | Addressed via mandatory DigiLocker OKYC (verifying government registered home address), mandatory in-person shop pickup, signed rental agreement with digital fingerprint, and CEIR (Central Equipment Identity Register) IMEI blocking protocol. |
| **KI-04** | Hardware / Accounts | **iCloud / Google FRP Lock upon Return**: Customer might return a device locked to their personal Apple ID / Google Account, bricking the phone for future rentals. | Medium | Shop handover checklist strictly requires customer to perform device logout and reset in front of the shopkeeper prior to return OTP confirmation. |
| **KI-05** | Network / Connectivity | **Shop Offline Connectivity**: Local shop in Ganjipura or Russell Chowk might experience temporary broadband/mobile data outage during customer handover. | Low | System designed with lightweight, mobile-friendly PWA architecture capable of caching active booking references offline and syncing upon reconnection. |

---

## 2. Technical Debt Ledger
- Currently **zero technical debt** as Phase 1 has maintained strict planning boundaries without rushed or fragile code.

---

## 3. Related Links
- Project status: [[PROJECT-STATUS]]
- Threat model: [[Threat-Model]]
- Open questions: [[Open-Questions]]
