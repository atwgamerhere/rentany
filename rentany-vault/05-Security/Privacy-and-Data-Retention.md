# 📜 Jabalpur Rent — Privacy & Data Retention Policy

> **Regulatory Framework**: Fully aligned with India's **Digital Personal Data Protection Act, 2023 (DPDP Act 2023)** and **UIDAI Aadhaar Regulations under the Aadhaar Act 2016**.

---

## 1. Regulatory Compliance Framework

### 1.1 UIDAI Aadhaar Regulations Compliance
- **Strict Prohibition on Raw 12-Digit Aadhaar**: Storing, processing, or transmitting raw 12-digit Aadhaar numbers without UIDAI authentication license is a criminal violation under Section 29 of the Aadhaar Act.
- **Masking Mandate**: The application strictly enforces masking: only the last 4 digits are persisted, preceded by eight 'X' characters:
  ```
  XXXX-XXXX-1234
  ```
- **Zero Biometric Data**: Jabalpur Rent never collects, stores, or processes fingerprint, iris, or facial biometric templates.

### 1.2 Digital Personal Data Protection (DPDP) Act 2023 Compliance
- **Purpose Limitation**: Customer data (name, phone number, verified city) is collected solely for the specified purpose of equipment rental fulfillment, theft prevention, and financial settlement.
- **Data Minimization**: We do not collect unnecessary information (such as caste, religion, salary history, or browsing habits).
- **Consent Architecture**: Explicit, revocable digital consent is captured prior to redirecting customers to the DigiLocker verification flow.

---

## 2. Data Classification & Retention Periods

| Data Category | Specific Elements | Retention Period | Post-Retention Action |
| :--- | :--- | :--- | :--- |
| **Authentication & Profile** | Mobile phone, Full Name, Avatar | Duration of active account | Anonymized upon account deletion |
| **KYC Identity Verification** | Masked Aadhaar (`XXXX-XXXX-1234`), verified address, KYC audit hash | 5 years from last completed rental (mandatory financial audit requirement) | Secure cryptographic purge |
| **Physical Condition Photos** | Handover inspection photos taken at shop | 90 days after clean return and deposit release | Automatically purged from storage bucket |
| **Payment & Financial Records** | Gateway order ID, payment ID, amount, refund ID | 7 years (mandated under Indian Income Tax Act & GST laws) | Archived to cold encrypted storage |
| **Audit Logs** | IP address, timestamp, action name, resource ID | 2 years | Rotated and archived |

---

## 3. Right to Erasure & Account Deletion Protocol

1. **Eligibility**: A customer may request account deletion at any time provided they have **no active rentals, pending payments, or open damage disputes**.
2. **Execution**:
   - The customer's profile is anonymized (`full_name` replaced with `DELETED_USER`, phone hash decoupled).
   - Temporary photos and session tokens are deleted immediately.
   - Financial transaction ledgers and masked KYC audit records are retained in compliance with statutory Indian tax requirements.

---

## 4. Related Links
- Threat model: [[Threat-Model]]
- Security checklist: [[Security-Checklist]]
- Database schema: [[Database-Schema]]
