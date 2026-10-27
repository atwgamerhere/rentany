# 🗄️ Jabalpur Rent — Database Schema (PostgreSQL DDL)

> **Database Engine**: PostgreSQL 15+ (Supabase)  
> **Status**: Planned (Phase 1 Blueprint, deployed in Phase 3)

---

## 1. Extensions & Custom Types

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- Required for range exclusion constraint

-- Custom ENUM Types
CREATE TYPE user_role AS ENUM (
    'CUSTOMER',
    'SHOP_OWNER',
    'ADMIN'
);

CREATE TYPE kyc_status AS ENUM (
    'PENDING',
    'VERIFIED',
    'REJECTED'
);

CREATE TYPE shop_status AS ENUM (
    'PENDING',
    'ACTIVE',
    'SUSPENDED'
);

CREATE TYPE device_condition AS ENUM (
    'GRADE_A', -- Pristine, no scratches
    'GRADE_B', -- Minor cosmetic wear, 100% functional
    'GRADE_C'  -- Noticeable cosmetic blemishes, 100% functional
);

CREATE TYPE device_status AS ENUM (
    'AVAILABLE',
    'RESERVED',
    'RENTED',
    'MAINTENANCE',
    'DECOMMISSIONED'
);

CREATE TYPE booking_status AS ENUM (
    'PENDING_PAYMENT',
    'CONFIRMED',
    'PICKUP_READY',
    'HANDED_OVER',
    'RETURNED',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE payment_gateway AS ENUM (
    'RAZORPAY',
    'CASHFREE'
);

CREATE TYPE payment_status AS ENUM (
    'INITIATED',
    'CAPTURED',
    'FAILED',
    'REFUNDED'
);

CREATE TYPE deposit_status AS ENUM (
    'HELD',
    'REFUNDED_FULL',
    'FORFEITED_PARTIAL',
    'FORFEITED_FULL'
);

CREATE TYPE inspection_type AS ENUM (
    'PICKUP',
    'RETURN'
);

CREATE TYPE dispute_reason AS ENUM (
    'DEVICE_DAMAGED',
    'LATE_RETURN',
    'THEFT_SUSPECTED',
    'OVERCHARGED',
    'INCORRECT_SPEC'
);

CREATE TYPE dispute_status AS ENUM (
    'OPEN',
    'UNDER_REVIEW',
    'RESOLVED',
    'ESCALATED_LEGAL'
);
```

---

## 2. Table Definitions

### 2.1 Profiles Table
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(120),
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_phone ON public.profiles(phone);
CREATE INDEX idx_profiles_role ON public.profiles(role);
```

### 2.2 User Verifications Table (DigiLocker KYC)
```sql
CREATE TABLE public.user_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE RESTRICT,
    kyc_provider VARCHAR(50) NOT NULL DEFAULT 'DIGILOCKER',
    status kyc_status NOT NULL DEFAULT 'PENDING',
    -- Strictly masked Aadhaar in compliance with UIDAI regulations
    masked_aadhaar VARCHAR(14) CHECK (masked_aadhaar ~ '^XXXX-XXXX-[0-9]{4}$'),
    verified_name VARCHAR(120),
    date_of_birth DATE,
    verified_address TEXT,
    city VARCHAR(80),
    state VARCHAR(80) DEFAULT 'Madhya Pradesh',
    pincode VARCHAR(10),
    document_hash VARCHAR(64), -- SHA-256 hash of verification payload
    raw_payload_url TEXT,     -- Private encrypted signed URL (admin only)
    rejection_reason TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verifications_status ON public.user_verifications(status);
```

### 2.3 Shops Table
```sql
CREATE TABLE public.shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    locality VARCHAR(100) NOT NULL, -- e.g. 'Sadar', 'Russell Chowk', 'Gorakhpur'
    address TEXT NOT NULL,
    landmark VARCHAR(150),
    contact_phone VARCHAR(20) NOT NULL,
    gstin VARCHAR(20),
    trade_license_number VARCHAR(50),
    status shop_status NOT NULL DEFAULT 'PENDING',
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 1.00 AND rating <= 5.00),
    total_rentals INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shops_owner ON public.shops(owner_id);
CREATE INDEX idx_shops_locality ON public.shops(locality);
CREATE INDEX idx_shops_status ON public.shops(status);
```

### 2.4 Listings Table (Phone Catalog Templates)
```sql
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand VARCHAR(60) NOT NULL,       -- 'Apple', 'Samsung', 'Google', 'OnePlus'
    model VARCHAR(100) NOT NULL,      -- 'iPhone 15 Pro', 'Galaxy S24 Ultra'
    storage_capacity VARCHAR(20) NOT NULL, -- '128GB', '256GB', '512GB'
    color VARCHAR(40) NOT NULL,
    base_daily_rate NUMERIC(10, 2) NOT NULL CHECK (base_daily_rate > 0),
    standard_deposit NUMERIC(10, 2) NOT NULL CHECK (standard_deposit >= 0),
    description TEXT,
    image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_listings_brand ON public.listings(brand);
CREATE INDEX idx_listings_model ON public.listings(model);
CREATE INDEX idx_listings_active ON public.listings(is_active);
```

### 2.5 Physical Devices Table (Real Hardware Inventory)
```sql
CREATE TABLE public.physical_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE RESTRICT,
    serial_number VARCHAR(80) NOT NULL UNIQUE,
    imei_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hash of physical IMEI
    battery_health INT NOT NULL CHECK (battery_health BETWEEN 50 AND 100),
    condition_grade device_condition NOT NULL DEFAULT 'GRADE_A',
    status device_status NOT NULL DEFAULT 'AVAILABLE',
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_listing ON public.physical_devices(listing_id);
CREATE INDEX idx_devices_shop ON public.physical_devices(shop_id);
CREATE INDEX idx_devices_status ON public.physical_devices(status);
```

### 2.6 Bookings Table (Concurrency-Safe Reservations)
```sql
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    device_id UUID NOT NULL REFERENCES public.physical_devices(id) ON DELETE RESTRICT,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE RESTRICT,
    rental_period TSTZRANGE NOT NULL,
    daily_rate NUMERIC(10, 2) NOT NULL CHECK (daily_rate > 0),
    rental_fee NUMERIC(10, 2) NOT NULL CHECK (rental_fee > 0),
    service_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    deposit_amount NUMERIC(10, 2) NOT NULL CHECK (deposit_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount = (rental_fee + service_fee + deposit_amount)),
    status booking_status NOT NULL DEFAULT 'PENDING_PAYMENT',
    pickup_otp_hash VARCHAR(64),
    return_otp_hash VARCHAR(64),
    handed_over_at TIMESTAMPTZ,
    returned_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EXCLUSION CONSTRAINT: Prevents any physical device from being booked for overlapping time ranges
-- Excludes CANCELLED bookings from the constraint check
ALTER TABLE public.bookings
ADD CONSTRAINT exclude_overlapping_device_bookings
EXCLUDE USING gist (
    device_id WITH =,
    rental_period WITH &&
) WHERE (status NOT IN ('CANCELLED'));

CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_device ON public.bookings(device_id);
CREATE INDEX idx_bookings_shop ON public.bookings(shop_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_period ON public.bookings USING gist (rental_period);
```

### 2.7 Payments Table
```sql
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE RESTRICT,
    gateway payment_gateway NOT NULL DEFAULT 'RAZORPAY',
    gateway_order_id VARCHAR(100) NOT NULL UNIQUE,
    gateway_payment_id VARCHAR(100) UNIQUE,
    amount_paid NUMERIC(10, 2) NOT NULL CHECK (amount_paid > 0),
    deposit_held NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_status payment_status NOT NULL DEFAULT 'INITIATED',
    payment_signature VARCHAR(128),
    deposit_refund_id VARCHAR(100),
    deposit_status deposit_status NOT NULL DEFAULT 'HELD',
    captured_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON public.payments(booking_id);
CREATE INDEX idx_payments_order ON public.payments(gateway_order_id);
```

### 2.8 Handover Inspections Table
```sql
CREATE TABLE public.handover_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    inspection_type inspection_type NOT NULL,
    inspected_by UUID NOT NULL REFERENCES public.profiles(id),
    condition_photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    battery_health INT CHECK (battery_health BETWEEN 50 AND 100),
    screen_intact BOOLEAN NOT NULL DEFAULT TRUE,
    account_unlocked BOOLEAN NOT NULL DEFAULT TRUE,
    remarks TEXT,
    inspected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inspections_booking ON public.handover_inspections(booking_id);
```

### 2.9 Disputes Table
```sql
CREATE TABLE public.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE RESTRICT,
    raised_by UUID NOT NULL REFERENCES public.profiles(id),
    reason dispute_reason NOT NULL,
    claim_amount NUMERIC(10, 2) NOT NULL CHECK (claim_amount >= 0),
    description TEXT NOT NULL,
    status dispute_status NOT NULL DEFAULT 'OPEN',
    resolution_notes TEXT,
    resolved_by UUID REFERENCES public.profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_disputes_booking ON public.disputes(booking_id);
CREATE INDEX idx_disputes_status ON public.disputes(status);
```

### 2.10 Audit Logs Table (Immutable Append-Only)
```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(60) NOT NULL,
    resource_id UUID NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_action ON public.audit_logs(action);
CREATE INDEX idx_audit_time ON public.audit_logs(created_at);
```

---

## 3. Related Links
- ER diagram visualization: [[Entity-Relationship-Diagram]]
- Row-Level Security rules: [[Access-Policies]]
- Migrations history: [[Migrations-Log]]
