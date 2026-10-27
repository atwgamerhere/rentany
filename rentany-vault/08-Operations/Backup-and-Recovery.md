# 💾 Jabalpur Rent — Backup & Disaster Recovery Playbook

> **Target Metrics**:  
> - **RPO (Recovery Point Objective)**: Max 24 hours on daily backups (< 5 minutes with Supabase PITR).  
> - **RTO (Recovery Time Objective)**: Full database restoration completed under 45 minutes.

---

## 1. Backup Architecture & Cadence

```
+-------------------------------------------------------+
|            SUPABASE POSTGRESQL (MUMBAI)               |
+-------------------------------------------------------+
         │                                      │
         │ (Automated Daily Snapshot)           │ (Scheduled Weekly Logical Dump)
         ▼                                      ▼
+-------------------------+            +-------------------------+
| Supabase Cloud Backup   |            | Encrypted Offline Dump  |
| 7-Day Retention (Pro)   |            | S3 / Cold Storage (Founder)
+-------------------------+            +-------------------------+
```

1. **Supabase Managed Backups**:
   - Supabase Pro tier executes automated daily database snapshots retained for 7 days.
   - Point-in-Time Recovery (PITR) enables restoring to any specific second within the last 7 days.
2. **Weekly Cold Storage Logical Dump**:
   - Automated script runs `pg_dump` to create a standalone encrypted SQL file:
     ```bash
     pg_dump -h db.your-ref.supabase.co -U postgres -d postgres -F c -b -v -f backup_$(date +%Y%m%d).dump
     ```

---

## 2. Disaster Recovery Playbook (Step-by-Step)

If database corruption or accidental truncation occurs:

### Step 1: Immediate Triage & Incident Declaration
- Put frontend into maintenance mode (redirect to static maintenance page).
- Halt backend API to prevent new incoming writes.

### Step 2: Database Restoration
1. Open Supabase Dashboard -> **Project Settings** -> **Database** -> **Backups**.
2. Select the most recent clean snapshot timestamp prior to the incident.
3. Click **Restore**. Supabase provisions a restored clone or rewinds in place.

### Step 3: Consistency & Financial Reconciliation
- Run verification query comparing `bookings` and `payments` to identify transactions that occurred between the snapshot and downtime:
  ```sql
  SELECT * FROM public.payments WHERE created_at > '2026-10-27 12:00:00+00';
  ```
- Cross-reference with payment gateway dashboard (Razorpay/Cashfree transaction ledger) to confirm no customer payments are dropped.

### Step 4: Resume Production
- Re-enable backend API and lift maintenance mode.
- Verify customer and shopkeeper dashboards.

---

## 🔗 Related Links
- Deployment guide: [[Deployment-Guide]]
- Monitoring and incidents: [[Monitoring-and-Incidents]]
- Database schema: [[Database-Schema]]
