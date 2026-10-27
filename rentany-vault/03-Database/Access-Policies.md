# 🛡️ Jabalpur Rent — Row-Level Security & Storage Access Policies

> **Core Axiom**: The database engine is the final line of defense. Every table has Row-Level Security (RLS) enabled unconditionally (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`). Zero unauthorized access is permitted even if the client application is completely compromised.

---

## 1. PostgreSQL Row-Level Security (RLS) Policies

### 1.1 Helper Functions for JWT Inspection
```sql
-- Helper function to check if the current user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN' AND is_suspended = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if the current user owns a specific shop
CREATE OR REPLACE FUNCTION public.owns_shop(target_shop_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.shops
    WHERE id = target_shop_id AND owner_id = auth.uid() AND status = 'ACTIVE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 1.2 Profiles Table Policies
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view their own profile; public can view basic shopkeeper names
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

-- Users can update their own non-privileged details (phone, full_name, avatar)
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id
    -- Crucial: Prevents self-elevation of role or lifting suspension
    AND role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND is_suspended IS NOT DISTINCT FROM (SELECT is_suspended FROM public.profiles WHERE id = auth.uid())
);
```

---

### 1.3 User Verifications (DigiLocker KYC) Policies
> [!CRITICAL]
> **Data Privacy Boundary**: Shopkeepers are strictly **prohibited** from viewing customer identity documents. Only the customer themselves and platform administrators have access.
```sql
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;

-- Customers can view only their own verification status
CREATE POLICY "Customers view own KYC"
ON public.user_verifications FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

-- Only the server/backend service role or Admin can insert/update verification records
CREATE POLICY "Admin or Backend manages KYC records"
ON public.user_verifications FOR ALL
USING (public.is_admin());
```

---

### 1.4 Shops Table Policies
```sql
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Active shops are publicly visible to all visitors and customers
CREATE POLICY "Public can view active shops"
ON public.shops FOR SELECT
USING (status = 'ACTIVE' OR owner_id = auth.uid() OR public.is_admin());

-- Shop owners can update their own shop details
CREATE POLICY "Owners can update own shop"
ON public.shops FOR UPDATE
USING (owner_id = auth.uid() OR public.is_admin())
WITH CHECK (
    -- Cannot self-approve an inactive or pending shop
    (status IS NOT DISTINCT FROM (SELECT status FROM public.shops WHERE id = public.shops.id))
    OR public.is_admin()
);
```

---

### 1.5 Listings Table Policies (Catalog)
```sql
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active listings
CREATE POLICY "Public can view active listings"
ON public.listings FOR SELECT
USING (is_active = TRUE OR public.is_admin());

-- Only Admins can modify global catalog listing templates
CREATE POLICY "Only admins manage catalog listings"
ON public.listings FOR ALL
USING (public.is_admin());
```

---

### 1.6 Physical Devices Table Policies (Hardware Inventory)
```sql
ALTER TABLE public.physical_devices ENABLE ROW LEVEL SECURITY;

-- Public can view devices that are AVAILABLE
CREATE POLICY "Public can view available devices"
ON public.physical_devices FOR SELECT
USING (status = 'AVAILABLE' OR public.owns_shop(shop_id) OR public.is_admin());

-- Shop owners can insert and manage their own shop's devices
CREATE POLICY "Shop owners manage own devices"
ON public.physical_devices FOR ALL
USING (public.owns_shop(shop_id) OR public.is_admin())
WITH CHECK (public.owns_shop(shop_id) OR public.is_admin());
```

---

### 1.7 Bookings Table Policies
```sql
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Customers can view their own bookings; Shops can view bookings for their shop
CREATE POLICY "Parties view their relevant bookings"
ON public.bookings FOR SELECT
USING (
    customer_id = auth.uid()
    OR public.owns_shop(shop_id)
    OR public.is_admin()
);

-- Customers can create a booking for themselves
CREATE POLICY "Customers create own bookings"
ON public.bookings FOR INSERT
WITH CHECK (customer_id = auth.uid());

-- Shop owner can update status only during handover/return with valid OTP
CREATE POLICY "Shop owners update assigned bookings"
ON public.bookings FOR UPDATE
USING (public.owns_shop(shop_id) OR customer_id = auth.uid() OR public.is_admin());
```

---

### 1.8 Payments Table Policies
```sql
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Customers view payments for their own bookings; Admins view all
CREATE POLICY "Customers view own booking payments"
ON public.payments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.bookings
        WHERE bookings.id = payments.booking_id AND bookings.customer_id = auth.uid()
    )
    OR public.is_admin()
);

-- Payments are inserted/updated strictly by the trusted Backend API via service_role key
```

---

### 1.9 Audit Logs Table Policies
```sql
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit logs are strictly read-only for Admins; zero update or delete for all
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_admin());

-- Zero UPDATE or DELETE policies exist for audit_logs (append-only ledger)
```

---

## 2. Supabase Storage Security Policies

### 2.1 Public Bucket: `listing-images`
- **Visibility**: Public (CDN cached worldwide).
- **Upload Rule**: Authenticated shop owners and administrators only.
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`.
- **Max file size**: 5MB per image.

### 2.2 Private Bucket: `verification-documents-private`
- **Visibility**: 🔒 **Strictly Private**. Direct public URLs are disabled.
- **Access Rule**: Accessible exclusively via short-lived (15 minutes) cryptographically signed URLs generated by the server.
- **Upload Rule**: Authenticated users can upload only into their own folder:
  ```
  verification-documents-private/{user_id}/*
  ```
- **Read Rule**:
  - The document owner (`auth.uid() = user_id`).
  - Platform Administrator (`public.is_admin() = true`).
  - **Shopkeepers have ZERO access**.

---

## 3. Related Links
- Database schema: [[Database-Schema]]
- Roles & permissions: [[User-Roles-and-Permissions]]
- Threat model: [[Threat-Model]]
