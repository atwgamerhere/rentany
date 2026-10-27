# 📜 Jabalpur Rent — Database Migrations Log

> **Migration Philosophy**: Every migration must be incremental, idempotent where possible, tested in staging before production, and accompanied by a verified rollback script.

---

## 1. Migration Ledger

| Version | Migration File Name | Description | Status | Applied Date |
| :--- | :--- | :--- | :---: | :---: |
| `001` | `20261027000001_extensions_and_enums.sql` | Enable `uuid-ossp`, `btree_gist`, create ENUM types | ⚪ Planned (Phase 3) | - |
| `002` | `20261027000002_core_tables_and_constraints.sql` | Create 10 core tables with foreign keys and check constraints | ⚪ Planned (Phase 3) | - |
| `003` | `20261027000003_exclusion_constraints_and_indexes.sql` | Add `tstzrange` exclusion constraint on bookings and performance indexes | ⚪ Planned (Phase 3) | - |
| `004` | `20261027000004_row_level_security_policies.sql` | Enable RLS on all tables and attach role policies | ⚪ Planned (Phase 3) | - |
| `005` | `20261027000005_storage_buckets_and_rules.sql` | Create public and private Supabase storage buckets with access rules | ⚪ Planned (Phase 3) | - |
| `006` | `20261027000006_audit_triggers.sql` | Create `updated_at` auto-update triggers and audit log hooks | ⚪ Planned (Phase 3) | - |
| `007` | `20261027000007_seed_initial_admin_and_jabalpur_shops.sql` | Seed bootstrap admin profile and 3 test shops in Sadar, Gorakhpur, Russell Chowk | ⚪ Planned (Phase 3) | - |

---

## 2. Migration Execution Guidelines

### Development & Sandbox Workflow
1. Write migration in `database/migrations/YYYYMMDDHHMMSS_name.sql`.
2. Apply locally using Supabase CLI:
   ```bash
   npx supabase db push
   ```
3. Verify table schema and constraints using automated test runner.
4. Record execution timestamp and checksum in this log.

### Rollback Strategy
Every forward migration file must have a paired down-migration or clear teardown sequence documented in the file comments. Never execute destructive `DROP TABLE ... CASCADE` on production without a validated offline database snapshot.

---

## 3. Related Links
- Schema definition: [[Database-Schema]]
- RLS policies: [[Access-Policies]]
- Backup and recovery: [[Backup-and-Recovery]]
