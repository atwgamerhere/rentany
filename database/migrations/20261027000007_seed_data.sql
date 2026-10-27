-- ==============================================================================
-- RENTANY MIGRATION 007: BOOTSTRAP SEED DATA
-- Phase 3: Database Migrations, Auth, RLS & Storage
-- ==============================================================================

-- 1. Admin Profile
INSERT INTO profiles (id, phone, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '+919999900001', 'Platform Administrator', 'ADMIN')
ON CONFLICT (phone) DO NOTHING;

-- 2. Partner Shopkeepers Profiles
INSERT INTO profiles (id, phone, full_name, role)
VALUES 
  ('10000000-0000-0000-0000-000000000001', '+919425188410', 'Rajesh Sahu', 'SHOP_OWNER'),
  ('10000000-0000-0000-0000-000000000002', '+919826377120', 'Amitabh Jain', 'SHOP_OWNER'),
  ('10000000-0000-0000-0000-000000000003', '+919301244320', 'Sunil Vishwakarma', 'SHOP_OWNER'),
  ('10000000-0000-0000-0000-000000000004', '+919755411290', 'Pooja Verma', 'SHOP_OWNER')
ON CONFLICT (phone) DO NOTHING;

-- 3. Verified Jabalpur Partner Shops
INSERT INTO shops (id, owner_id, name, locality, address, phone, status, commission_percentage)
VALUES 
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Apex Mobile Gallery', 'Sadar Bazar', '42, Residency Road, Sadar Bazar, Jabalpur, MP 482001', '+919425188410', 'ACTIVE', 20.00),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'City Cellular Point', 'Russell Chowk', '18, Electronic Market, Russell Chowk, Jabalpur, MP 482002', '+919826377120', 'ACTIVE', 20.00),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Smart World Electronics', 'Gorakhpur', '105, Main Market, Gorakhpur, Jabalpur, MP 482001', '+919301244320', 'ACTIVE', 20.00),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Mahakoshal Tech Hub', 'Wright Town', '6, Civic Centre Road, Wright Town, Jabalpur, MP 482002', '+919755411290', 'ACTIVE', 20.00)
ON CONFLICT (id) DO NOTHING;

-- 4. Flagship Listings
INSERT INTO listings (id, brand, model, storage, base_daily_rate, deposit_resident, deposit_tourist, camera_highlight, is_active)
VALUES 
  ('30000000-0000-0000-0000-000000000001', 'Apple', 'iPhone 15 Pro Max', '256GB', 1400.00, 3000.00, 8000.00, '48MP ProRAW + 5x Optical Telephoto (Ideal for Bhedaghat 4K)', TRUE),
  ('30000000-0000-0000-0000-000000000002', 'Samsung', 'Galaxy S24 Ultra', '256GB', 1350.00, 3000.00, 8000.00, '200MP Main + 100x Space Zoom (Best for Kanha Safari Wildlife)', TRUE),
  ('30000000-0000-0000-0000-000000000003', 'Apple', 'iPhone 15', '128GB', 999.00, 3000.00, 8000.00, '48MP Dual Camera with 2x Telephoto + Cinematic 4K', TRUE),
  ('30000000-0000-0000-0000-000000000004', 'Google', 'Pixel 8 Pro', '128GB', 899.00, 3000.00, 8000.00, 'Google Pro Controls + Best Take & Audio Magic Eraser', TRUE),
  ('30000000-0000-0000-0000-000000000005', 'OnePlus', 'OnePlus 12', '256GB', 799.00, 3000.00, 8000.00, '4th Gen Hasselblad Camera System with 3x Periscope Zoom', TRUE),
  ('30000000-0000-0000-0000-000000000006', 'Apple', 'iPhone 14 Pro', '128GB', 1100.00, 3000.00, 8000.00, '48MP Pro Quad Camera with Action Mode stabilization', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. Physical Device Units (Tracked by SHA-256 IMEI Hash)
INSERT INTO physical_devices (id, listing_id, shop_id, color, serial_number, imei_hash, battery_health, condition_grade, status)
VALUES 
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Natural Titanium', 'F2LX9984Q6', 'a4f89d31e9c90b6a718290cc112480bdf483921048bcae918231908234891024', 98, 'GRADE_A', 'AVAILABLE'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 'Titanium Gray', 'R5CWA09923K', 'c8e19277bf2a9010481902834bca8210948bcaef182903482109348920148201', 99, 'GRADE_A', 'AVAILABLE'),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Pacific Blue', 'G3KJ8821N4', 'b109dc89104fa289481902830491820394810293481029384019283401928340', 100, 'GRADE_A', 'AVAILABLE'),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', 'Bay Blue', '389PK0012A', 'f719001bca9082de481092830491820394810293481029384019283401928340', 97, 'GRADE_A', 'AVAILABLE'),
  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', 'Silky Black', 'OP1298412K', 'd398ca7710bc8921481092830491820394810293481029384019283401928340', 100, 'GRADE_A', 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;
