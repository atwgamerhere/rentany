# 👥 Jabalpur Rent — User Roles & Permission Matrix

> **Core Rule**: Permissions are enforced authoritatively at the database layer (PostgreSQL RLS) and backend API layer, **never** solely trusted to client-side UI toggles.

---

## 1. System Roles Definition

| Role Identifier | Description | Assignment Mechanism |
| :--- | :--- | :--- |
| `ANONYMOUS` | Public unauthenticated visitor | Default unauthenticated state |
| `CUSTOMER_UNVERIFIED` | Registered customer who has verified phone OTP but not completed KYC | Default upon initial phone auth signup |
| `CUSTOMER_VERIFIED` | Registered customer with approved DigiLocker KYC | Automated transition upon Setu/DigiLocker webhook verification or manual admin approval |
| `SHOP_PENDING` | Local shopkeeper who registered shop details; pending document review | Assigned upon completing shop registration |
| `SHOP_ACTIVE` | Approved local shopkeeper authorized to list devices and process rentals | Assigned exclusively by Platform Administrator after document review |
| `SHOP_SUSPENDED` | Shop partner suspended due to dispute, policy violation, or fraud | Assigned by Platform Administrator |
| `ADMIN` | Marketplace owner / operator with global operational privileges | Assigned strictly via direct database migration / seed with secret bootstrap key. Cannot be self-assigned. |

---

## 2. Granular Permissions Matrix

| Resource / Action | Anonymous | Customer (Unverified) | Customer (Verified) | Shop (Pending) | Shop (Active) | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Browse Public Listings** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Calculate Price / Quote** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Initiate KYC Verification** | ❌ | ✅ | ✅ (Re-verify) | ❌ | ❌ | ✅ (Inspect) |
| **Initiate Phone Booking** | ❌ | ❌ (Blocked) | ✅ | ❌ | ❌ | ✅ (Test) |
| **Pay Rental Fee & Deposit** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **View Own Bookings** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ (All) |
| **View Other Customer Bookings**| ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **View Own KYC Documents** | ❌ | ✅ (Signed URL)| ✅ (Signed URL)| ❌ | ❌ | ✅ (Audited) |
| **View Other Customer KYC** | ❌ | ❌ | ❌ | ❌ | ❌ (Strictly Blocked)| ✅ (Audited) |
| **Register New Shop** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Edit Own Shop Profile** | ❌ | ❌ | ❌ | ✅ (Limited) | ✅ | ✅ |
| **Add / Edit Own Devices** | ❌ | ❌ | ❌ | ❌ (Draft only)| ✅ | ✅ |
| **Edit Other Shop Devices** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Validate Pickup OTP (Handover)**| ❌ | ❌ | ❌ | ❌ | ✅ (Own Shop Only) | ✅ |
| **Validate Return OTP (Return)** | ❌ | ❌ | ❌ | ❌ | ✅ (Own Shop Only) | ✅ |
| **Flag Return Damage / Dispute**| ❌ | ❌ | ❌ | ❌ | ✅ (Own Shop Only) | ✅ |
| **Trigger Deposit Refund** | ❌ | ❌ | ❌ | ❌ | ❌ (Automated via API)| ✅ (Manual Override)|
| **Approve / Reject Shops** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Access Immutable Audit Logs** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Privilege Escalation Prevention Architecture

### Prevention of Self-Elevation to Admin
1. **Database Role Column Protection**: The `users.role` column cannot be updated by normal authenticated users. In PostgreSQL RLS:
   ```sql
   -- Users can update their own phone or name, but NOT their role
   CREATE POLICY "Users cannot change their own role"
   ON public.profiles
   FOR UPDATE
   USING (auth.uid() = id)
   WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid()));
   ```
2. **Server-Side Role Guard**: Backend routes check claims from the decrypted JWT issued by Supabase Auth, validating against the database row before allowing privileged actions.
3. **No Admin Registration Route in Public API**: There is zero public endpoint such as `/api/auth/register-admin`. The initial admin account is created via secure backend database seed.

### Shop Boundary Isolation (Multi-Tenant Safety)
- A shopkeeper authenticated as Shop A (`shop_id = 'A'`) cannot query, modify, or inspect devices, active bookings, or customer details belonging to Shop B (`shop_id = 'B'`).
- Enforced directly by PostgreSQL RLS:
  ```sql
  CREATE POLICY "Shop owners can only view and update their own inventory"
  ON public.physical_devices
  FOR ALL
  USING (
    shop_id IN (
      SELECT id FROM public.shops WHERE owner_id = auth.uid() AND status = 'ACTIVE'
    )
  );
  ```

---

## 4. Related Links
- Business requirements: [[Business-Requirements]]
- Database access policies: [[Access-Policies]]
- Threat model & privilege escalation attacks: [[Threat-Model]]
- Database schema: [[Database-Schema]]
