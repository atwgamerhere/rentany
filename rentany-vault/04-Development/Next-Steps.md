# ⏩ Jabalpur Rent — Next Steps & Action Queue

> **Protocol**: Follow strict sequential execution. Do not commence Phase 2 implementation until Phase 1 review is completed and approved by the founder.

---

## 1. Immediate Action (Phase 2 Review)

1. **Founder Review of Phase 2 Prototype**:
   - Preview all 3 interactive portals running live on `http://localhost:5510/index.html`:
     - **Customer Portal**: [`index.html`](http://localhost:5510/index.html) & [`catalog.html`](http://localhost:5510/src/customer/catalog.html) & [`device.html`](http://localhost:5510/src/customer/device.html) & [`checkout.html`](http://localhost:5510/src/customer/checkout.html) & [`bookings.html`](http://localhost:5510/src/customer/bookings.html)
     - **Shop Partner Portal**: [`dashboard.html`](http://localhost:5510/src/shop/dashboard.html) & [`inventory.html`](http://localhost:5510/src/shop/inventory.html) & [`handover.html`](http://localhost:5510/src/shop/handover.html)
     - **Admin Control Center**: [`dashboard.html`](http://localhost:5510/src/admin/dashboard.html)
2. **Founder Sign-off**: Confirm design aesthetics, usability, and dynamic pricing calculations.

---

## 2. Queued Sequence for Phase 3 (Database, Auth, RLS & Storage)

Upon receiving founder approval for Phase 2, Phase 3 will implement:

1. **SQL Migrations**: Write sequential, reversible SQL files in `database/migrations/`:
   - `001_extensions_and_enums.sql`
   - `002_core_tables_and_constraints.sql`
   - `003_exclusion_constraints_and_indexes.sql`
   - `004_row_level_security_policies.sql`
   - `005_storage_buckets_and_rules.sql`
   - `006_audit_triggers.sql`
   - `007_seed_initial_admin_and_jabalpur_shops.sql`
2. **Supabase Auth Integration**: Set up phone OTP verification hooks and JWT session guards.
3. **Automated Security Verification**: Write automated scripts in `tests/security/` testing RLS boundaries (verifying that non-admin users cannot alter roles and shopkeepers cannot query customer KYC).

---

## 🔗 Related Links
- Current phase status: [[Current-Phase]]
- Master roadmap: [[MASTER-PLAN]]
- Project status: [[PROJECT-STATUS]]
