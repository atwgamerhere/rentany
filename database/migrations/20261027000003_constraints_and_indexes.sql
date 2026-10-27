-- ==============================================================================
-- RENTANY MIGRATION 003: CONSTRAINTS & HIGH-THROUGHPUT INDEXES
-- Phase 3: Database Migrations, Auth, RLS & Storage
-- ==============================================================================

-- 1. Hardware Concurrency Exclusion Constraint (Prevents Double Booking)
-- Blocks any two overlapping rental periods on the exact same physical device
DO $$ BEGIN
  ALTER TABLE bookings ADD CONSTRAINT exclude_overlapping_device_bookings
  EXCLUDE USING gist (
    device_id WITH =,
    rental_period WITH &&
  ) WHERE (status NOT IN ('CANCELLED'));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Indexes for Bookings & Hardware Lookups
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_shop ON bookings (shop_id);
CREATE INDEX IF NOT EXISTS idx_bookings_device ON bookings (device_id);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings (booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_period ON bookings USING gist (rental_period);

-- 3. Indexes for Physical Devices & Catalog Listings
CREATE INDEX IF NOT EXISTS idx_devices_shop ON physical_devices (shop_id);
CREATE INDEX IF NOT EXISTS idx_devices_listing ON physical_devices (listing_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON physical_devices (status);
CREATE INDEX IF NOT EXISTS idx_listings_brand ON listings (brand);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings (is_active);

-- 4. Indexes for Shops & Locality Searches
CREATE INDEX IF NOT EXISTS idx_shops_locality ON shops (locality);
CREATE INDEX IF NOT EXISTS idx_shops_status ON shops (status);
CREATE INDEX IF NOT EXISTS idx_shops_owner ON shops (owner_id);

-- 5. Indexes for Payments, Disputes & Audit Trail
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments (booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_order ON payments (gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_booking ON disputes (booking_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes (status);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs (entity_table, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at DESC);
