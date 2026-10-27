# 💰 Jabalpur Rent — Verifiable Infrastructure & Operating Cost Model

> **Standard**: Based on verifiable 2026 pricing for India. Zero fabricated numbers or hidden vendor costs.

---

## 1. Development & Prototyping Phase Costs (Phases 1 through 6)

During all prototyping, development, and sandbox integration phases, **operating infrastructure cost is ₹0 (Zero INR)** by leveraging production-grade free developer tiers:

| Component | Provider | Tier / Configuration | Monthly Cost (INR) |
| :--- | :--- | :--- | :---: |
| **Database & Auth** | Supabase | Free Tier (500MB DB, 50k MAU, 1GB Storage) | **₹0** |
| **Frontend Web Hosting** | Vercel / Cloudflare Pages | Free Tier (100GB bandwidth, SSL, Global CDN) | **₹0** |
| **Backend API Server** | Render / Railway | Free / Hobby Tier (suitable for dev testing) | **₹0** |
| **Payment Gateway Sandbox** | Razorpay / Cashfree | Developer Sandbox Mode (Test credentials) | **₹0** |
| **KYC Sandbox** | Setu / Cashfree | Developer Mock / Sandbox Environment | **₹0** |
| **Total Prototyping Monthly Cost** | | | **₹0 / month** |

---

## 2. Production Pilot Phase Costs (Phase 7 — 2-3 Jabalpur Partner Shops)

When launching the live merchant pilot in Jabalpur (processing real money and real customers):

| Expense Item | Provider | Billing Frequency | Estimated Cost (INR) | Mandatory? |
| :--- | :--- | :--- | :---: | :---: |
| **Custom Domain** | Cloudflare / Namecheap (`jabalpurrent.in`) | Annual (~₹800/yr) | ~₹67 / month | Yes |
| **Managed Database** | Supabase Pro Plan (No auto-pause, daily backups, 8GB DB) | Monthly ($25/mo) | ~₹2,100 / month | Recommended (or ₹0 on Free Tier if pinged) |
| **Always-On Backend API** | Render Starter ($7/mo) or Railway ($5/mo) | Monthly | ~₹420 - ₹590 / month | Yes |
| **Transactional SMS / WhatsApp** | WhatsApp Cloud API + Fast2SMS | Per message (First 1,000 WA msgs free) | ~₹150 / month (for 50 rentals) | Yes |
| **DigiLocker KYC Checks** | Setu / Cashfree Verification | Variable (~₹8 per verified check) | ~₹400 / month (for 50 customers) | Yes |
| **Payment Gateway Fee** | Razorpay / Cashfree | 2% + 18% GST (deducted per transaction) | Variable (absorbed into platform take-rate) | Yes |
| **Total Estimated Operating Cost (Pilot)** | | | **~₹3,150 - ₹3,300 / month** |

---

## 3. Unit Economics & Break-Even Simulation (Jabalpur Market)

### Assumptions
- **Average Rental Duration**: 3 days
- **Average Daily Rate**: ₹1,200/day
- **Gross Rental Value**: ₹3,600 per booking
- **Platform Take-Rate (15%)**: **₹540 gross margin per rental**

### Volume Scenarios

```
+-------------------------------------------------------------------+
| 10 Rentals/Month (Early Pilot):                                   |
|   Platform Revenue: 10 x ₹540 = ₹5,400                           |
|   Fixed Infrastructure Cost: ~₹3,200                              |
|   Net Platform Profit: +₹2,200 / month (Profitable from Day 1)    |
+-------------------------------------------------------------------+
| 50 Rentals/Month (Established Jabalpur Pilot):                    |
|   Platform Revenue: 50 x ₹540 = ₹27,000                          |
|   Infrastructure & KYC Cost: ~₹3,500                              |
|   Net Platform Profit: +₹23,500 / month                           |
+-------------------------------------------------------------------+
| 200 Rentals/Month (City-Wide Mahakoshal Scale):                   |
|   Platform Revenue: 200 x ₹540 = ₹1,08,000                       |
|   Infrastructure & KYC Cost: ~₹5,800                              |
|   Net Platform Profit: +₹1,02,200 / month                         |
+-------------------------------------------------------------------+
```

---

## 4. Related Links
- Provider research: [[Provider-Research]]
- Master roadmap: [[MASTER-PLAN]]
- Deployment guide: [[Deployment-Guide]]
