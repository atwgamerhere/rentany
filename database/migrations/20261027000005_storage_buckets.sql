-- ==============================================================================
-- RENTANY MIGRATION 005: STORAGE BUCKETS & ACCESS POLICIES
-- Phase 3: Database Migrations, Auth, RLS & Storage
-- ==============================================================================

-- 1. Create Storage Buckets (Supabase Storage Schema)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('listing-images', 'listing-images', TRUE),
  ('verification-documents-private', 'verification-documents-private', FALSE),
  ('inspection-photos', 'inspection-photos', FALSE)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 2. Public Access for Listing Images
CREATE POLICY "Public Read Listing Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "Admin Upload Listing Images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'listing-images' AND is_admin());

-- 3. Private Access for KYC Verification Documents (No public access; signed URLs only)
CREATE POLICY "Owner Access Own KYC Docs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'verification-documents-private' 
    AND (auth.uid()::text = (storage.foldername(name))[1] OR is_admin())
  );

CREATE POLICY "Owner Upload Own KYC Docs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'verification-documents-private' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Handover Inspection Photos Access
CREATE POLICY "Inspection Photos Access" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'inspection-photos' 
    AND (
      is_admin() OR
      EXISTS (
        SELECT 1 FROM bookings b 
        WHERE b.id::text = (storage.foldername(name))[1]
          AND (b.customer_id = auth.uid() OR owns_shop(b.shop_id))
      )
    )
  );

CREATE POLICY "Shopkeeper Upload Inspection Photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'inspection-photos' 
    AND (
      is_admin() OR
      EXISTS (
        SELECT 1 FROM bookings b 
        WHERE b.id::text = (storage.foldername(name))[1]
          AND owns_shop(b.shop_id)
      )
    )
  );
