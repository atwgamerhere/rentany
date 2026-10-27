-- ==============================================================================
-- RENTANY MIGRATION 004: ROW LEVEL SECURITY (RLS) POLICIES
-- Phase 3: Database Migrations, Auth, RLS & Storage
-- ==============================================================================

-- 1. Enable RLS on all 10 core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE physical_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE handover_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an Admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current authenticated user owns a given shop
CREATE OR REPLACE FUNCTION owns_shop(target_shop_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM shops 
    WHERE id = target_shop_id AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profiles Policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid() OR is_admin());

-- 3. User Verifications Policies (Shopkeepers CANNOT view customer KYC docs)
CREATE POLICY "Users read own verification" ON user_verifications
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admin manages verifications" ON user_verifications
  FOR ALL USING (is_admin());

-- 4. Shops Policies
CREATE POLICY "Public can view active shops" ON shops
  FOR SELECT USING (status = 'ACTIVE' OR owner_id = auth.uid() OR is_admin());

CREATE POLICY "Shop owners can update own shop" ON shops
  FOR UPDATE USING (owner_id = auth.uid() OR is_admin());

-- 5. Listings Policies
CREATE POLICY "Public can view active listings" ON listings
  FOR SELECT USING (is_active = TRUE OR is_admin());

CREATE POLICY "Admin can manage listings" ON listings
  FOR ALL USING (is_admin());

-- 6. Physical Devices Policies (Shop Isolation: Shop A cannot view/edit Shop B)
CREATE POLICY "Public can view available devices" ON physical_devices
  FOR SELECT USING (status = 'AVAILABLE' OR owns_shop(shop_id) OR is_admin());

CREATE POLICY "Shop owners manage own devices" ON physical_devices
  FOR ALL USING (owns_shop(shop_id) OR is_admin());

-- 7. Bookings Policies
CREATE POLICY "Customers view own bookings" ON bookings
  FOR SELECT USING (customer_id = auth.uid() OR owns_shop(shop_id) OR is_admin());

CREATE POLICY "Customers create own bookings" ON bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Shop owners and admin update bookings" ON bookings
  FOR UPDATE USING (owns_shop(shop_id) OR is_admin());

-- 8. Payments Policies
CREATE POLICY "Customers view own payments" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings b WHERE b.id = payments.booking_id AND b.customer_id = auth.uid())
    OR is_admin()
  );

-- 9. Handover Inspections Policies
CREATE POLICY "Participants view inspections" ON handover_inspections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.id = handover_inspections.booking_id 
        AND (b.customer_id = auth.uid() OR owns_shop(b.shop_id) OR is_admin())
    )
  );

CREATE POLICY "Shop owners record inspections" ON handover_inspections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.id = handover_inspections.booking_id 
        AND owns_shop(b.shop_id)
    ) OR is_admin()
  );

-- 10. Disputes Policies
CREATE POLICY "Participants view disputes" ON disputes
  FOR SELECT USING (customer_id = auth.uid() OR owns_shop(shop_id) OR is_admin());

CREATE POLICY "Admin resolves disputes" ON disputes
  FOR UPDATE USING (is_admin());

-- 11. Audit Logs Policies (Append-only via service role/triggers; read-only for admin)
CREATE POLICY "Admin can view audit logs" ON audit_logs
  FOR SELECT USING (is_admin());
