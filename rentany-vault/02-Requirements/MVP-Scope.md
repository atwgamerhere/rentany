# 🎯 Jabalpur Rent — MVP Scope & Boundary Definition

> **Purpose**: Establish unambiguous boundaries between what is mandatory for the Initial Minimum Viable Product (Phases 1-7) versus what is deferred to Post-MVP phases to prevent feature creep.

---

## 1. MVP Scope (Phases 1 through 7)

The MVP is engineered to prove market viability, operational safety, and unit economics with real local shops in Jabalpur, MP.

### Included in MVP
1. **Target Hardware**:
   - High-demand premium smartphones only:
     - **Apple iPhone**: iPhone 13, 14, 15, 15 Pro, 16 Pro.
     - **Samsung Galaxy**: S23 Ultra, S24 Ultra, Z Fold / Flip.
     - **Google Pixel**: Pixel 7 Pro, Pixel 8 Pro.
     - **OnePlus**: OnePlus 11, 12.
2. **Geographic Coverage**:
   - Jabalpur City municipal limits: *Russell Chowk, Ganjipura, Sadar Bazar, Gorakhpur, Wright Town, Napier Town, Adhartal, Vijay Nagar, Cantt*.
3. **Fulfillment Model**:
   - **In-Store Pickup & Return Only**. The customer must physically visit the verified partner shop to inspect the phone, provide the Pickup OTP, and hand over the phone upon return. This is a critical security countermeasure preventing theft and transit disputes.
4. **Customer Onboarding & Identity**:
   - Mobile Phone SMS OTP login.
   - Digital KYC via DigiLocker / Aadhaar OKYC API (extracting verified name, address, and masked Aadhaar).
5. **Inventory Tracking**:
   - Multi-tenant shop inventory tracking individual physical units (`physical_devices`) by IMEI hash, cosmetic condition grade (A/B/C), and battery health.
6. **Booking & Concurrency**:
   - Date range reservation engine preventing overlapping reservations for the same physical IMEI.
   - 15-minute temporary reservation hold during checkout.
7. **Financials & Escrow**:
   - Online checkout for [Rental Fee] + [Platform Service Fee] + [Refundable Security Deposit].
   - Payment processing via Indian payment gateway (Razorpay / Cashfree sandbox in Phase 6).
   - Automated instant deposit refund upon clean return confirmation.
8. **Shopkeeper Portal**:
   - Inventory addition, status toggle (Available / Maintenance / Rented), Pickup OTP verification, condition photo upload, and Return OTP processing.
9. **Admin Dashboard**:
   - Shop partner application review and approval.
   - Flagged KYC inspection.
   - Dispute and deposit forfeiture arbitration.
   - Financial ledger and audit logs.

---

## 2. Strictly Out of Scope for MVP (Post-MVP Roadmap)

| Deferred Feature | Reason for Deferral | Target Phase |
| :--- | :--- | :--- |
| **Doorstep Delivery & Pickup by Bike Courier** | High risk of device theft during transit, courier manipulation, and difficulty verifying cosmetic condition at customer doorstep. In-store pickup ensures face-to-face accountability. | Phase 8+ (Post-Pilot) |
| **P2P Phone Rentals (Individual to Individual)** | Massive asset theft and fraud risk. Local retail mobile shops have physical premises, business licenses (Gumasta/GST), and commercial reputation. | Not Planned (B2B2C Only) |
| **Non-Phone Electronics (Laptops, Drones, DSLRs)** | Mobile phones have standardized diagnostic tools, IMEI blacklisting, and high demand in Jabalpur. Expanding to other categories complicates condition grading. | Phase 9 |
| **Native iOS & Android Mobile Apps** | App Store / Play Store publishing delays, 15-30% in-app purchase policy complications, and update overhead. Responsive Web PWA delivers 100% functionality with zero install friction. | Phase 10 |
| **Automated Dynamic Surge Pricing** | Unnecessary complexity for the initial 2-5 pilot shops. Fixed, transparent daily rates build trust with early Jabalpur customers. | Phase 8+ |
| **Credit Score / CIBIL Underwriting** | Expensive integration (~₹50-100 per pull) and excludes students and informal earners. DigiLocker verified address + refundable deposit provides sufficient risk mitigation. | Post-MVP |

---

## 3. Related Links
- Business requirements: [[Business-Requirements]]
- Master roadmap: [[MASTER-PLAN]]
- Open founder questions: [[Open-Questions]]
