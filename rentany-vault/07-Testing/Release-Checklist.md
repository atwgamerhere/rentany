# 🚀 Jabalpur Rent — Production Release Gate Checklist

> **Mandatory**: Every item on this checklist must be checked and signed off before deploying to production or onboarding real Jabalpur shops.

---

## 1. Code & Repository Hygiene
- [ ] Working tree clean, zero uncommitted or untracked changes in Git.
- [ ] Git commit history audited: zero real secrets, passwords, or production API keys committed (`git log -p`).
- [ ] `.env.example` is fully synchronized with required environment variables.
- [ ] All automated unit, integration, and security tests pass with 0 failures.

---

## 2. Infrastructure & Database Deployment
- [ ] Production PostgreSQL schema deployed on Supabase via migrations in `database/migrations/`.
- [ ] Row-Level Security (RLS) enabled on all 10 tables.
- [ ] `tstzrange` exclusion constraint verified active on `bookings` table.
- [ ] Storage buckets created: `listing-images` (public) and `verification-documents-private` (private).
- [ ] Automated daily backup schedule verified active in Supabase dashboard.

---

## 3. Integrations & Third-Party Gates
- [ ] Payment gateway transitioned from Sandbox to Production with live API keys in encrypted environment variables.
- [ ] Live webhook endpoint configured in Razorpay/Cashfree dashboard with secret HMAC key.
- [ ] DigiLocker / KYC provider API account verified and live credentials configured.
- [ ] WhatsApp Business Cloud API or transactional SMS templates approved.

---

## 4. Jabalpur Field Operations Readiness
- [ ] Pilot partner shops (Sadar & Russell Chowk) onboarded, verified, and active.
- [ ] Shopkeepers trained on entering Pickup OTP, uploading 4 condition photos, and verifying iCloud logout on return.
- [ ] Physical store display standee / QR code tested with customer smartphones.
- [ ] Emergency escalation contact established for dispute arbitration.

---

## 🔗 Related Links
- Regression checklist: [[Regression-Checklist]]
- Deployment guide: [[Deployment-Guide]]
- Backup and recovery: [[Backup-and-Recovery]]
