# 📖 Jabalpur Rent — Domain & Technical Glossary

> Quick reference for all technical, regulatory, and Indian fintech terminology used throughout the Jabalpur Rent project.

---

## 1. Domain & Hardware Terminology

- **IMEI (International Mobile Equipment Identity)**: A unique 15-digit number identifying a physical cellular device. Dialing `*#06#` on any phone displays its IMEI. In Jabalpur Rent, the SHA-256 hash of the IMEI is recorded to track hardware and prevent fraud.
- **CEIR (Central Equipment Identity Register)**: Government of India portal operated by the Department of Telecommunications (DoT) to block stolen mobile phones across all Indian telecom operators.
- **FRP (Factory Reset Protection) / iCloud Activation Lock**: Security features built into Android (Google FRP) and iOS (iCloud Activation Lock) that prevent device usage after a factory reset unless the original owner's account credentials are entered.
- **Battery Health Percentage**: iOS metric indicating maximum capacity relative to when the battery was new. In Jabalpur Rent, this is audited at pickup and return.

---

## 2. Indian Fintech & Identity Terminology

- **DigiLocker**: Government of India platform under the Digital India initiative allowing citizens to access authentic digital documents (Aadhaar, Driving License, Marks sheets) issued by government agencies.
- **Aadhaar OKYC (Offline KYC)**: UIDAI-approved digital identity verification method where the user authorizes sharing an encrypted XML file containing verified name, address, DOB, and masked Aadhaar.
- **Masked Aadhaar**: An Aadhaar document where the first 8 digits are masked (`XXXX-XXXX-1234`), legally authorized for commercial private entities under the Aadhaar Act 2016.
- **DPDP Act 2023**: Digital Personal Data Protection Act, 2023. India's comprehensive data privacy law governing consent, purpose limitation, and data erasure.
- **TRAI DLT (Distributed Ledger Technology)**: Mandatory portal mandated by TRAI where Indian businesses must register entities, sender IDs, and message templates before sending commercial SMS.
- **UPI (Unified Payments Interface)**: Instant real-time payment system developed by NPCI, powering Google Pay, PhonePe, and Paytm.

---

## 3. Database & Architecture Terminology

- **RLS (Row-Level Security)**: PostgreSQL engine feature that restricts which rows in a table can be returned or modified based on the identity and role of the executing user.
- **`tstzrange`**: PostgreSQL native timestamp with time zone range data type, used to model booking start and end times.
- **`btree_gist`**: PostgreSQL extension that allows indexing standard B-tree scalar types alongside GiST range types, enabling exclusion constraints to prevent overlapping reservations.
- **Idempotency**: An API property where repeating the exact same request multiple times produces the identical outcome as making the request once (essential for payment webhooks).
- **STRIDE**: Microsoft security threat modeling methodology: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.

---

## 🔗 Related Links
- External documentation links: [[External-References]]
- Project overview: [[PROJECT-OVERVIEW]]
