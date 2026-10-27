-- ==============================================================================
-- RENTANY MIGRATION 002: CORE TABLES SCHEMA
-- Phase 3: Database Migrations, Auth, RLS & Storage
-- ==============================================================================

-- 1. Profiles Table (Extends auth.users in Supabase or local auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  full_name VARCHAR(120),
  role user_role DEFAULT 'CUSTOMER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Verifications Table (Strict UIDAI Compliance: No raw 12-digit Aadhaar)
CREATE TABLE IF NOT EXISTS user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kyc_status kyc_status DEFAULT 'PENDING',
  provider VARCHAR(30) DEFAULT 'SETU_DIGILOCKER',
  masked_aadhaar VARCHAR(14) CHECK (masked_aadhaar ~ '^XXXX-XXXX-[0-9]{4}$'),
  is_jabalpur_resident BOOLEAN DEFAULT FALSE,
  verified_pincode VARCHAR(6),
  verified_at TIMESTAMPTZ,
  id_document_url TEXT, -- Private bucket signed URL path
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_verification UNIQUE (user_id)
);

-- 3. Shops Table (Verified Physical Jabalpur Retailers)
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  name VARCHAR(150) NOT NULL,
  locality VARCHAR(80) NOT NULL, -- Sadar, Russell Chowk, Gorakhpur, Wright Town
  address TEXT NOT NULL,
  pincode VARCHAR(6) DEFAULT '482001',
  gstin VARCHAR(15),
  trade_license_number VARCHAR(50),
  phone VARCHAR(15) NOT NULL,
  status shop_status DEFAULT 'PENDING',
  commission_percentage NUMERIC(5,2) DEFAULT 20.00, -- 20% platform commission
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Listings Table (Catalog Smartphone Models)
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  storage VARCHAR(20) NOT NULL,
  base_daily_rate NUMERIC(10,2) NOT NULL CHECK (base_daily_rate > 0),
  deposit_resident NUMERIC(10,2) DEFAULT 3000.00,
  deposit_tourist NUMERIC(10,2) DEFAULT 8000.00,
  description TEXT,
  camera_highlight VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Physical Devices Table (Real Hardware Units tracked by IMEI)
CREATE TABLE IF NOT EXISTS physical_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE RESTRICT,
  color VARCHAR(50) NOT NULL,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  imei_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 hash of IMEI
  battery_health SMALLINT CHECK (battery_health BETWEEN 50 AND 100),
  condition_grade condition_grade DEFAULT 'GRADE_A',
  status device_status DEFAULT 'AVAILABLE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bookings Table (Hardware Concurrency with Range Locks)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. JR-2026-8921
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE RESTRICT,
  device_id UUID NOT NULL REFERENCES physical_devices(id) ON DELETE RESTRICT,
  rental_period TSTZRANGE NOT NULL,
  rental_days INT NOT NULL CHECK (rental_days BETWEEN 1 AND 30),
  daily_rate NUMERIC(10,2) NOT NULL,
  raw_rental_fee NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) DEFAULT 0.00,
  net_rental_fee NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL, -- 20%
  shop_payout NUMERIC(10,2) NOT NULL,   -- 80%
  security_deposit NUMERIC(10,2) NOT NULL,
  total_paid NUMERIC(10,2) NOT NULL,
  pickup_otp VARCHAR(6) NOT NULL, -- 6-digit confidential OTP
  status booking_status DEFAULT 'PENDING_KYC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Payments Table (Escrow and Refunds)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  gateway VARCHAR(30) DEFAULT 'RAZORPAY',
  gateway_order_id VARCHAR(100) NOT NULL,
  gateway_payment_id VARCHAR(100),
  amount_paid NUMERIC(10,2) NOT NULL,
  security_deposit_held NUMERIC(10,2) NOT NULL,
  deposit_refund_amount NUMERIC(10,2) DEFAULT 0.00,
  deposit_deduction_amount NUMERIC(10,2) DEFAULT 0.00,
  refund_rrn VARCHAR(100),
  status payment_status DEFAULT 'CAPTURED',
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Handover Inspections Table (Pickup & Return Condition Audits)
CREATE TABLE IF NOT EXISTS handover_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  inspection_type VARCHAR(20) NOT NULL CHECK (inspection_type IN ('PICKUP', 'RETURN')),
  verified_by_shopkeeper_id UUID NOT NULL REFERENCES profiles(id),
  battery_health_verified SMALLINT,
  screen_condition VARCHAR(100) DEFAULT 'CLEAN_NO_SCRATCHES',
  body_condition VARCHAR(100) DEFAULT 'CLEAN_NO_DENTS',
  icloud_google_signed_out BOOLEAN DEFAULT TRUE,
  photos_url_array TEXT[],
  inspection_notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Disputes Table (Damage Claim Settlement)
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  claim_amount NUMERIC(10,2) NOT NULL,
  authorized_repair_estimate_url TEXT,
  resolution_notes TEXT,
  final_deduction_amount NUMERIC(10,2) DEFAULT 0.00,
  status dispute_status DEFAULT 'OPEN',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Audit Logs Table (Tamper-Proof Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action VARCHAR(100) NOT NULL,
  entity_table VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
