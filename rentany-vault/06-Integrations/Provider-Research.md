# 🔬 Jabalpur Rent — Third-Party Provider Research & Pricing Analysis

> **Standard**: Current, verifiable pricing as of 2026 for Indian fintech, identity verification, and cloud hosting platforms. No fabricated APIs, prices, or capabilities.

---

## 1. Indian Payment Gateway Comparison

| Feature / Metric | Razorpay | Cashfree Payments | PhonePe Payment Gateway |
| :--- | :--- | :--- | :--- |
| **Standard Transaction Fee** | 2.0% + 18% GST (Domestic Cards, Netbanking) | 1.90% - 2.0% + 18% GST | 0% promotional or 1.99% standard |
| **UPI Payment Fee** | Standard PG rates apply (or customized 0-2% tier) | Standard PG rates apply | Competitive UPI rates |
| **Pre-Authorization (Card Hold)** | Supported via *Authorize & Capture* API. **Strict RBI limitation**: max 5 to 7 days hold before auto-lapse. | Supported via *Cashfree Pre-Auth*. Subject to 5-7 days card validity under RBI rules. | Limited support for pre-auth. |
| **Automated Instant Refunds** | Supported via API. Direct to original payment method. | Supported via Instant Refunds API directly to source / UPI VPA. | Supported via Refund API (takes 2-5 banking days). |
| **Partner Shop Payouts** | *RazorpayX* (Requires current account / enterprise onboarding) | *Cashfree Payouts* (Highly developer friendly; ₹1.50 - ₹3.00 per IMPS/UPI transfer) | *PhonePe Payouts* |
| **Developer Experience** | Industry benchmark documentation, rich JS modal, comprehensive sandbox. | Excellent developer documentation, specialized in escrow & marketplace splits. | Good documentation, mobile-first focus. |
| **Recommendation** | **Primary**: Razorpay for checkout & instant refund sandbox; evaluate Cashfree for shop payouts. |

---

## 2. Indian Identity & KYC Verification Providers

| Provider | Mechanism | Verifiable Cost (INR) | Capabilities & UIDAI Compliance |
| :--- | :--- | :---: | :--- |
| **Setu (Pine Labs)** | Official DigiLocker Gateway | ₹5 to ₹12 per successful verification | Official UIDAI ecosystem partner. Provides government DigiLocker consent UI, extracts verified full name, address, and **masked Aadhaar** (`XXXX-XXXX-1234`). |
| **Cashfree Verification Suite** | Aadhaar OKYC & Offline XML | ₹3 to ₹8 per verification | Provides Aadhaar OTP verification, PAN verification, and Bank Account Penny-Drop (₹1 - ₹2) to verify shopkeeper bank accounts. |
| **HyperVerge** | AI Face Match + Document OCR | ₹15 to ₹25 per check | Enterprise grade; includes facial liveness check. Overkill for MVP; suitable for high-risk rentals Post-MVP. |
| **Recommendation** | **Primary**: Setu DigiLocker API or Cashfree Verification Suite. Both guarantee zero raw Aadhaar liability. |

---

## 3. Database, Backend & Infrastructure Providers

| Service | Provider | Free Tier Capability | Paid Tier Cost |
| :--- | :--- | :--- | :--- |
| **PostgreSQL & Auth** | **Supabase** | $0/mo (500MB DB, 50,000 MAU, 1GB storage, 2GB bandwidth). *Note: Pauses after 7 days inactivity.* | **$25/month** (~₹2,100/mo) for Pro (8GB DB, 100,000 MAU, 100GB storage, daily backups, no pausing, PITR available). |
| **Frontend Hosting** | **Vercel / Cloudflare Pages** | 100% Free (100GB bandwidth, automatic SSL, global CDN edge, custom domain `jabalpurrent.in`). | Not needed for MVP volume. |
| **Backend API Server** | **Render / Railway** | Free tier on Render (sleeps after 15 mins inactivity) — suitable for development. | **$7/month** (~₹590/mo) on Render Starter or **$5/month** (~₹420/mo) on Railway for always-on 24/7 API runtime. |

---

## 4. Notifications & Telephony Providers

| Provider | Route | Verifiable Cost (INR) | Compliance Notes |
| :--- | :--- | :---: | :--- |
| **Fast2SMS** | Transactional SMS | ~₹0.20 - ₹0.28 per SMS | Offers Quick SMS test balance for prototype sandbox; requires DLT registration for production. |
| **Msg91** | Transactional SMS | ~₹0.20 - ₹0.25 per SMS | High deliverability; requires registered DLT entity and template approval. |
| **Meta WhatsApp Cloud API** | WhatsApp Business API | **First 1,000 service conversations/month FREE**; ~₹0.35 - ₹0.40 per utility conversation thereafter. | Perfect for Jabalpur audience where WhatsApp adoption is near 100%. Bypasses upfront telecom DLT friction. |

---

## 5. Related Links
- Cost tracking model: [[Cost-Tracking]]
- Payment architecture: [[Payment-Integration]]
- Identity verification: [[Verification-Provider]]
- Open questions: [[Open-Questions]]
