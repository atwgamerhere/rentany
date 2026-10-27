# ✅ Jabalpur Rent — Prioritized Security Checklist

> **Mandate**: Every security gate must be systematically audited and verified before launching the Jabalpur merchant pilot.

---

## 1. Authentication & Identity Gates

| Gate ID | Security Control | Verification Method | Status | Target Phase |
| :--- | :--- | :--- | :---: | :---: |
| **SEC-AUTH-01** | **Phone OTP Rate Limiting**: Max 3 OTP requests per phone per 10 minutes | Automated integration test with burst requests | ⚪ Planned | Phase 3 |
| **SEC-AUTH-02** | **Role Escalation Defense**: Non-admin users cannot alter their own `role` | SQL injection / direct `UPDATE profiles` test | ⚪ Planned | Phase 3 |
| **SEC-AUTH-03** | **JWT Signature Verification**: Server validates token expiration and issuer on all protected routes | Replay expired / forged JWT token | ⚪ Planned | Phase 3 |
| **SEC-AUTH-04** | **OTP Expiration & Invalidation**: Pickup and Return OTPs expire after 15 minutes and invalidate upon single use | Handover integration test | ⚪ Planned | Phase 5 |
| **SEC-AUTH-05** | **DigiLocker KYC Integrity**: Server rejects altered or unverified KYC payloads | Mock altered DigiLocker webhook payload | ⚪ Planned | Phase 6 |

---

## 2. Database & Row-Level Security (RLS) Gates

| Gate ID | Security Control | Verification Method | Status | Target Phase |
| :--- | :--- | :--- | :---: | :---: |
| **SEC-DB-01** | **RLS Active on All Tables**: Zero tables accessible without an explicit policy | Run Supabase security linter (`supabase inspect db`) | ⚪ Planned | Phase 3 |
| **SEC-DB-02** | **KYC Document Isolation**: Shopkeepers have zero query access to customer KYC records | Test SQL query under authenticated shopkeeper role | ⚪ Planned | Phase 3 |
| **SEC-DB-03** | **Shop Inventory Isolation**: Shop A cannot view, update, or delete Shop B's physical devices | Automated multi-tenant isolation test | ⚪ Planned | Phase 4 |
| **SEC-DB-04** | **Concurrency Exclusion**: Database-level block against overlapping bookings for the same phone | Simulated concurrent SQL transaction test | ⚪ Planned | Phase 5 |
| **SEC-DB-05** | **Aadhaar Masking Enforcement**: Database constraint rejects any unmasked 12-digit Aadhaar | Insert test row with 12-digit numeric Aadhaar | ⚪ Planned | Phase 3 |

---

## 3. Payment & Financial Gates

| Gate ID | Security Control | Verification Method | Status | Target Phase |
| :--- | :--- | :--- | :---: | :---: |
| **SEC-PAY-01** | **HMAC-SHA256 Webhook Verification**: Constant-time signature comparison using secret key | Send webhook with forged signature | ⚪ Planned | Phase 6 |
| **SEC-PAY-02** | **Idempotent Webhook Processing**: Duplicate webhook events do not duplicate credits or state changes | Send identical webhook payload 3 times consecutively | ⚪ Planned | Phase 6 |
| **SEC-PAY-03** | **Server-Calculated Pricing**: Total payable amounts calculated strictly by backend from database rates | Tamper with price payload in frontend checkout request | ⚪ Planned | Phase 5 |
| **SEC-PAY-04** | **Automated Refund Guard**: Security deposit refunds triggered only after shop return confirmation | Verify refund API fails if booking status is not `RETURNED` | ⚪ Planned | Phase 6 |

---

## 4. Storage & Asset Protection Gates

| Gate ID | Security Control | Verification Method | Status | Target Phase |
| :--- | :--- | :--- | :---: | :---: |
| **SEC-STR-01** | **Private KYC Bucket**: KYC documents inaccessible via direct public HTTP URLs | Attempt direct GET request to storage asset URL | ⚪ Planned | Phase 3 |
| **SEC-STR-02** | **Short-Lived Signed URLs**: Verification documents accessed only via temporary signed URLs (max 15 mins) | Verify expired signed URL returns 403 Forbidden | ⚪ Planned | Phase 3 |
| **SEC-STR-03** | **Upload MIME & Size Limits**: Image uploads restricted to JPEG/PNG/WebP and under 5MB | Attempt uploading executable `.php` or 20MB file | ⚪ Planned | Phase 3 |

---

## 5. Network, API & Header Security Gates

| Gate ID | Security Control | Verification Method | Status | Target Phase |
| :--- | :--- | :--- | :---: | :---: |
| **SEC-NET-01** | **Strict Security Headers**: HSTS, CSP, X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`) | SecurityHeaders.com / curl header audit | ⚪ Planned | Phase 7 |
| **SEC-NET-02** | **CORS Restrictions**: API accepts requests only from trusted frontend origin | Cross-origin request simulation | ⚪ Planned | Phase 7 |
| **SEC-NET-03** | **Secrets Cleanliness**: Zero credentials, service role keys, or webhook secrets in Git history | Git commit history scan via `trufflehog` / `git-secrets` | 🟢 Verified | Phase 1 |

---

## 🔗 Related Links
- STRIDE threat model: [[Threat-Model]]
- Security findings: [[Security-Findings]]
- Secrets management: [[Secrets-and-Configuration]]
