# 🔁 Jabalpur Rent — Pre-Deployment Regression Checklist

> Run this regression checklist whenever modifying database schemas, authentication middleware, or payment/booking engines.

---

## 1. Authentication & Access Control Regression
- [ ] User can sign up / log in with valid mobile OTP.
- [ ] Session token expires as configured; requests with expired tokens return HTTP 401.
- [ ] Authenticated customer attempting to update their own `role` to `ADMIN` is rejected.
- [ ] Shopkeeper authenticated under Shop A cannot query or edit Shop B's devices.
- [ ] Shopkeepers cannot query or view customer KYC records.

---

## 2. Inventory & Concurrency Regression
- [ ] Newly added physical device appears in catalog only if status is `AVAILABLE` and shop is `ACTIVE`.
- [ ] Concurrent booking simulation on identical device rejects overlapping date ranges.
- [ ] Booking a phone temporarily changes device status to `RESERVED`; status reverts to `AVAILABLE` if checkout expires (15 mins).
- [ ] Handing over phone changes device status to `RENTED`.
- [ ] Clean return transitions device status back to `AVAILABLE`.

---

## 3. Financial & Webhook Regression
- [ ] Checkout recalculates rental fee and security deposit authoritatively on server.
- [ ] Webhook callback with forged or missing HMAC signature is rejected with HTTP 401/403.
- [ ] Webhook callback replayed 3 times processes payment exactly once without duplicate credits.
- [ ] Clean return confirmation triggers automated deposit refund API call.
- [ ] Deposit refund cannot be triggered more than once for the same booking.

---

## 4. Hardware Inspection & Physical Handover Regression
- [ ] Shopkeeper cannot confirm handover without entering valid 6-digit Pickup OTP.
- [ ] Handover requires uploading at least 2 inspection photos.
- [ ] Device return requires entering valid 6-digit Return OTP.
- [ ] Device return checklist explicitly requires iCloud/Google FRP logout confirmation.

---

## 🔗 Related Links
- Test strategy: [[Test-Strategy]]
- Release checklist: [[Release-Checklist]]
- Threat model: [[Threat-Model]]
