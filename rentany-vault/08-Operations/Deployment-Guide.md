# 🚢 Jabalpur Rent — Production Deployment Guide

> **Target Architecture**: Lightweight, high-availability, low-maintenance deployment designed for maximum speed on mobile 4G in Central India.

---

## 1. Hosting Topology & Geographic Regions

```
[ User in Jabalpur (Airtel / Jio 4G) ]
               │
               ▼
   [ Cloudflare Global Edge CDN / WAF ]
         │                        │
         ▼                        ▼
[ Frontend Web App ]     [ Backend API Server ]
 (Vercel / Cloudflare)     (Render / Railway)
  Edge CDN Worldwide         Node.js Runtime
                                  │
                                  ▼
                     [ Supabase PostgreSQL & Storage ]
                      Region: AWS ap-south-1 (Mumbai)
                      Lowest latency to Jabalpur (~25ms)
```

---

## 2. Component-by-Component Deployment

### 2.1 Managed Database & Auth (Supabase)
1. **Region Selection**: Always select **AWS ap-south-1 (Mumbai, India)** for the lowest latency (~20-30ms) to Jabalpur.
2. **Apply Migrations**:
   ```bash
   npx supabase link --project-ref your-project-id
   npx supabase db push
   ```
3. **Configure Storage Buckets**:
   - `listing-images`: Set to **Public**.
   - `verification-documents-private`: Set to **Private**.
4. **Configure Phone Auth**:
   - Enable Phone Provider in Supabase Auth settings.

### 2.2 Backend Application (Render / Railway)
1. Connect GitHub repository to Render or Railway.
2. Configure Build & Start Commands:
   - Build: `cd backend && npm install && npm run build`
   - Start: `cd backend && npm start`
3. Inject Environment Variables from `.env.example`:
   - `NODE_ENV=production`
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
   - `INTERNAL_TOKEN_SECRET`
4. Configure Health Check Endpoint: `/api/health`.

### 2.3 Frontend Web Portals (Vercel / Cloudflare Pages)
1. Deploy `frontend/` directory directly to Vercel or Cloudflare Pages.
2. Zero build step required (pure semantic HTML, CSS, and Vanilla JS modules).
3. Configure Custom Domain:
   - Point DNS `A` / `CNAME` records to Cloudflare / Vercel edge for `jabalpurrent.in` or `rentany.in`.
   - Enable automatic SSL/TLS (Full/Strict).

---

## 3. Post-Deployment Smoke Test
1. Visit production URL on mobile device.
2. Verify SSL certificate is valid and security headers are present.
3. Verify public listing catalog loads from Supabase database.
4. Verify `/api/health` returns `{"status": "ok"}`.

---

## 🔗 Related Links
- Cost tracking: [[Cost-Tracking]]
- Backup and recovery: [[Backup-and-Recovery]]
- Release checklist: [[Release-Checklist]]
