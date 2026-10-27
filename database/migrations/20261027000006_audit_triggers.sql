-- ==============================================================================
-- RENTANY MIGRATION 006: AUDIT TRIGGERS & TIMESTAMP AUTOMATION
-- Phase 3: Database Migrations, Auth, RLS & Storage
-- ==============================================================================

-- 1. Generic set_updated_at function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach to all mutable tables
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_user_verifications_updated_at
  BEFORE UPDATE ON user_verifications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_physical_devices_updated_at
  BEFORE UPDATE ON physical_devices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_disputes_updated_at
  BEFORE UPDATE ON disputes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 2. Audit Trail Trigger for State Changes on Bookings & Payments
CREATE OR REPLACE FUNCTION log_booking_audit()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND (OLD.status IS DISTINCT FROM NEW.status)) THEN
    INSERT INTO audit_logs (
      action,
      entity_table,
      entity_id,
      old_data,
      new_data
    ) VALUES (
      'BOOKING_STATUS_CHANGE',
      'bookings',
      NEW.id,
      jsonb_build_object('status', OLD.status, 'otp', OLD.pickup_otp),
      jsonb_build_object('status', NEW.status, 'otp', NEW.pickup_otp)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_bookings_audit
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION log_booking_audit();
