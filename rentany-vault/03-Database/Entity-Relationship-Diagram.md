# 🗄️ Jabalpur Rent — Entity Relationship Diagram (ERD)

> **Database Engine**: PostgreSQL 15+ (Hosted on Supabase)  
> **Topology**: Strict third-normal form (3NF) relational model with foreign key constraints, check constraints, and immutable audit logs.

---

## 1. Complete Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    PROFILES ||--o| USER_VERIFICATIONS : "has one"
    PROFILES ||--o{ SHOPS : "owns"
    PROFILES ||--o{ BOOKINGS : "places as customer"
    PROFILES ||--o{ AUDIT_LOGS : "performs"

    SHOPS ||--o{ PHYSICAL_DEVICES : "owns inventory"
    LISTINGS ||--o{ PHYSICAL_DEVICES : "categorizes"
    
    PHYSICAL_DEVICES ||--o{ BOOKINGS : "is reserved in"
    
    BOOKINGS ||--o| PAYMENTS : "has financial record"
    BOOKINGS ||--o{ HANDOVER_INSPECTIONS : "has condition audits"
    BOOKINGS ||--o| DISPUTES : "may have"

    PROFILES {
        uuid id PK "Matches auth.users.id"
        varchar phone UK "Unique mobile number"
        varchar full_name "Legal full name"
        enum role "CUSTOMER, SHOP_OWNER, ADMIN"
        timestamp created_at
        timestamp updated_at
    }

    USER_VERIFICATIONS {
        uuid id PK
        uuid user_id FK, UK "References profiles.id"
        enum kyc_provider "DIGILOCKER, CASHFREE, MANUAL"
        enum status "PENDING, VERIFIED, REJECTED"
        varchar masked_aadhaar "XXXX-XXXX-1234 strictly masked"
        text verified_address "Full address from DigiLocker"
        varchar city "Jabalpur or other"
        varchar state "Madhya Pradesh"
        varchar pincode "482001 - 482005"
        timestamp verified_at
        uuid verified_by FK "Admin if manual"
    }

    SHOPS {
        uuid id PK
        uuid owner_id FK "References profiles.id"
        varchar name "Shop commercial name"
        varchar locality "Sadar, Russell Chowk, Gorakhpur, etc."
        text address "Physical street address"
        varchar landmark "Near Gol Bazar, etc."
        varchar gstin "Optional GSTIN / Trade License"
        enum status "PENDING, ACTIVE, SUSPENDED"
        varchar contact_phone "Public shop contact"
        timestamp created_at
    }

    LISTINGS {
        uuid id PK
        varchar brand "Apple, Samsung, Google, OnePlus"
        varchar model "iPhone 15 Pro, S24 Ultra, etc."
        varchar storage_capacity "128GB, 256GB, 512GB"
        varchar color "Natural Titanium, Phantom Black, etc."
        decimal base_daily_rate "Per day rental fee in INR"
        decimal standard_deposit "Standard security deposit in INR"
        text description "Catalog specifications"
        jsonb image_urls "Array of public CDN image URLs"
        boolean is_active "Catalog visibility toggle"
    }

    PHYSICAL_DEVICES {
        uuid id PK
        uuid listing_id FK "References listings.id"
        uuid shop_id FK "References shops.id"
        varchar serial_number UK "Device hardware serial number"
        varchar imei_hash UK "Cryptographic SHA256 of physical IMEI"
        int battery_health "Battery health percentage (e.g. 96%)"
        enum condition_grade "GRADE_A, GRADE_B, GRADE_C"
        enum status "AVAILABLE, RESERVED, RENTED, MAINTENANCE, DECOMMISSIONED"
        text internal_notes "Private shop notes"
        timestamp created_at
    }

    BOOKINGS {
        uuid id PK
        uuid customer_id FK "References profiles.id"
        uuid device_id FK "References physical_devices.id"
        uuid shop_id FK "References shops.id"
        tstzrange rental_period "Start to End timestamp range"
        decimal daily_rate "Locked daily rate at booking"
        decimal rental_fee "Total rental fee before deposit"
        decimal service_fee "Platform fee"
        decimal deposit_amount "Held security deposit"
        decimal total_amount "Total paid by customer"
        enum status "PENDING_PAYMENT, CONFIRMED, PICKUP_READY, HANDED_OVER, RETURNED, COMPLETED, CANCELLED"
        varchar pickup_otp_hash "Hashed 6-digit pickup OTP"
        varchar return_otp_hash "Hashed 6-digit return OTP"
        timestamp handed_over_at
        timestamp returned_at
        timestamp created_at
    }

    PAYMENTS {
        uuid id PK
        uuid booking_id FK, UK "References bookings.id"
        enum gateway "RAZORPAY, CASHFREE"
        varchar gateway_order_id UK "Order ID from gateway"
        varchar gateway_payment_id UK "Payment ID from gateway"
        decimal amount_paid "Total amount captured in INR"
        decimal deposit_held "Deposit portion held in escrow"
        enum payment_status "INITIATED, CAPTURED, FAILED, REFUNDED"
        varchar deposit_refund_id "Gateway refund reference ID"
        enum deposit_status "HELD, REFUNDED_FULL, FORFEITED_PARTIAL, FORFEITED_FULL"
        timestamp captured_at
        timestamp refunded_at
    }

    HANDOVER_INSPECTIONS {
        uuid id PK
        uuid booking_id FK "References bookings.id"
        enum inspection_type "PICKUP, RETURN"
        uuid inspected_by FK "References profiles.id (Shopkeeper)"
        jsonb condition_photos "Array of private URLs taken at shop"
        int battery_health "Recorded battery health at handover"
        boolean screen_intact "Screen free of cracks"
        boolean account_unlocked "iCloud / Google FRP removed"
        text remarks "Written notes on scratches or dents"
        timestamp inspected_at
    }

    DISPUTES {
        uuid id PK
        uuid booking_id FK, UK "References bookings.id"
        uuid raised_by FK "References profiles.id"
        enum reason "DEVICE_DAMAGED, LATE_RETURN, THEFT_SUSPECTED, OVERCHARGED"
        decimal claim_amount "Amount claimed from deposit"
        enum status "OPEN, UNDER_REVIEW, RESOLVED, ESCALATED_LEGAL"
        text resolution_notes "Arbitration explanation"
        uuid resolved_by FK "Admin profile"
        timestamp resolved_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid actor_id FK "User who initiated action"
        varchar action "e.g. BOOKING_CONFIRMED, KYC_VIEWED, REFUND_TRIGGERED"
        varchar resource_type "e.g. bookings, user_verifications"
        uuid resource_id "ID of affected entity"
        jsonb metadata "Old and new values, IP address, user agent"
        timestamp created_at
    }
```

---

## 2. Key Architectural Guarantees of this Topology

1. **Decoupling of Catalog from Physical Units**:
   - `LISTINGS` stores generic smartphone specs (e.g., iPhone 15 Pro 128GB).
   - `PHYSICAL_DEVICES` stores exact physical hardware assets located in a specific Jabalpur shop with `imei_hash` and `battery_health`.
2. **Concurrency Safety with Exclusion Constraints**:
   - `BOOKINGS` uses PostgreSQL's native `tstzrange` column type (`rental_period`).
   - Using PostgreSQL `btree_gist` extension, we enforce that no two non-cancelled bookings can have overlapping `rental_period` for the same `device_id`.
3. **Strict Compliance & Redaction**:
   - `USER_VERIFICATIONS` stores `masked_aadhaar` (`XXXX-XXXX-1234`), entirely eliminating the liability of handling raw Aadhaar numbers.
4. **Financial Idempotency**:
   - `PAYMENTS` enforces unique constraints on `gateway_order_id` and `gateway_payment_id`, mathematically preventing duplicate webhook credits.

---

## 3. Related Links
- Detailed SQL DDL schema: [[Database-Schema]]
- Row-Level Security policies: [[Access-Policies]]
- Migrations history: [[Migrations-Log]]
