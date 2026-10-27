# 🧪 Jabalpur Rent — Quality Assurance & Test Strategy

> **Core Rule**: Never record a test as passed if it was not executed. Clearly distinguish planned test suites from verified test runs.

---

## 1. Test Pyramid & Methodology

```
           / \
          /   \     E2E / Physical Acceptance Tests (Handover & Return UAT)
         /-----\
        /       \   Integration & Security Tests (Concurrency, Webhooks, RLS)
       /---------\
      /           \ Unit Tests (Pricing, Date Ranges, OTP Crypto, Aadhaar Masking)
     /-------------\
```

---

## 2. Test Suites Overview

### 2.1 Unit Tests (`tests/unit/`)
- **Pricing Engine**:
  - Test calculation of base rate x rental days.
  - Test duration discounts (3+ days: 10% discount; 7+ days: 20% discount).
  - Test edge cases (same-day booking, leap years, DST transitions).
- **Security & Masking Utilities**:
  - Verify Aadhaar masking utility properly masks `1234 5678 9012` to `XXXX-XXXX-9012`.
  - Verify rejection of malformed or unmasked Aadhaar strings.
- **OTP Generation & Verification**:
  - Test cryptographic entropy of 6-digit OTP generation.
  - Test time-based expiration (15 minutes validity).
  - Test single-use invalidation.

### 2.2 Integration Tests (`tests/integration/`)
- **Concurrency & Exclusion Constraints**:
  - Spawn 10 concurrent asynchronous booking requests targeting the exact same `physical_devices.id` across overlapping `tstzrange` intervals.
  - Verify that exactly 1 booking succeeds and 9 bookings are rejected by PostgreSQL's `exclude_overlapping_device_bookings` constraint with zero deadlocks.
- **Payment Webhook & Idempotency**:
  - Simulate gateway webhook payload with valid HMAC-SHA256 signature -> verify HTTP 200 and booking status transitions to `CONFIRMED`.
  - Simulate identical webhook payload re-delivered 3 times -> verify HTTP 200 returned, zero duplicate payments logged, zero duplicate OTP notifications.
  - Simulate webhook payload with forged signature -> verify immediate HTTP 401/403 rejection.

### 2.3 Security Tests (`tests/security/`)
- **Row-Level Security (RLS) Penetration**:
  - Authenticate as Customer A -> attempt to query `user_verifications` for Customer B -> verify 0 rows returned.
  - Authenticate as Shopkeeper A -> attempt to query `physical_devices` of Shop B -> verify 0 rows returned.
  - Authenticate as Customer -> attempt `UPDATE profiles SET role = 'ADMIN'` -> verify operation rejected by database policy.
- **Private Storage Boundaries**:
  - Attempt direct unauthenticated HTTP `GET` to KYC document URL -> verify HTTP 403 Forbidden.
  - Generate signed URL with 5-second expiration -> verify access succeeds at 2 seconds and fails at 6 seconds.

---

## 3. Related Links
- Verified test results: [[Test-Results]]
- Regression checklist: [[Regression-Checklist]]
- Release checklist: [[Release-Checklist]]
