-- ==============================================================================
-- RENTANY MIGRATION 001: EXTENSIONS AND CUSTOM ENUMS
-- Phase 3: Database Migrations, Auth, RLS & Storage
-- ==============================================================================

-- 1. PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- Required for GiST exclusion constraints on UUID + Range

-- 2. Custom Enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('CUSTOMER', 'SHOP_OWNER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE kyc_status AS ENUM ('PENDING', 'VERIFIED_RESIDENT', 'VERIFIED_OUTSTATION', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE shop_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE condition_grade AS ENUM ('GRADE_A', 'GRADE_B', 'GRADE_C');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE device_status AS ENUM ('AVAILABLE', 'RESERVED', 'RENTED', 'MAINTENANCE', 'RETIRED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'PENDING_KYC',
    'RESERVED',
    'PICKED_UP',
    'RETURN_INSPECTED',
    'COMPLETED',
    'CANCELLED',
    'DISPUTED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'CAPTURED',
    'ESCROW_HELD',
    'DEPOSIT_REFUNDED',
    'DEPOSIT_DEDUCTED',
    'FAILED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE dispute_status AS ENUM (
    'OPEN',
    'RESOLVED_SETTLED',
    'ESCALATED_POLICE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
