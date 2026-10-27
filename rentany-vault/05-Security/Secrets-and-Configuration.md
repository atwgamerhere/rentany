# 🔑 Jabalpur Rent — Secrets & Configuration Management

> **Ironclad Rule**: Privileged keys (`SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`) must **never** appear in client-side code, public bundles, GitHub repositories, or Obsidian documentation notes.

---

## 1. Secrets Classification Matrix

| Key / Variable Name | Confidentiality Level | Allowed Locations | Purpose |
| :--- | :---: | :--- | :--- |
| `SUPABASE_URL` | Public | Browser Client, Backend, `.env` | Supabase endpoint URL |
| `SUPABASE_ANON_KEY` | Public / Client-Safe | Browser Client, Backend, `.env` | Accesses Supabase via active RLS policies |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔒 **Privileged Secret** | **Backend Server Only** (Never Browser!) | Bypasses RLS for system admin tasks (e.g. webhook processing) |
| `DATABASE_URL` | 🔒 **Privileged Secret** | Backend Server, Migration CLI | Direct PostgreSQL connection string |
| `RAZORPAY_KEY_ID` | Public / Client-Safe | Browser Client, Backend | Initiates Razorpay checkout UI |
| `RAZORPAY_KEY_SECRET` | 🔒 **Privileged Secret** | **Backend Server Only** | Calls Razorpay capture and refund APIs |
| `RAZORPAY_WEBHOOK_SECRET` | 🔒 **Privileged Secret** | **Backend Server Only** | Verifies HMAC-SHA256 signatures on callbacks |
| `KYC_API_KEY` / `SECRET` | 🔒 **Privileged Secret** | **Backend Server Only** | Interacts with Setu/Cashfree DigiLocker APIs |
| `INTERNAL_TOKEN_SECRET` | 🔒 **Privileged Secret** | **Backend Server Only** | Signs internal session tokens and CSRF guards |

---

## 2. Secrets Management & Git Hygiene

1. **Strict `.gitignore` Enforcement**:
   - The `.gitignore` file explicitly excludes `.env`, `.env.*.local`, and any file matching `*.env`.
2. **Template Only in Version Control**:
   - Only `.env.example` is committed to Git, containing strictly documented dummy placeholders (e.g., `rzp_test_YourTestKeyIdHere`).
3. **Environment Injection**:
   - In production (e.g., Vercel / Render / Supabase), secrets are injected directly via encrypted platform environment variables, never written to disk.

---

## 3. Secret Leakage Emergency Response Protocol

If a privileged credential is accidentally committed to Git or exposed:
1. **Immediate Revocation**: Revoke the compromised key immediately in the respective dashboard (Supabase, Razorpay, Setu).
2. **Re-issuance**: Generate a new secret key pair and update production environment variables.
3. **Git History Scrub**: Use `git filter-repo` or BFG Repo-Cleaner to permanently purge the commit from git history.
4. **Security Audit**: Query audit logs to determine if unauthorized calls occurred during the window of exposure.

---

## 4. Related Links
- Environment template: [`.env.example`](file:///d:/RENTANY/.env.example)
- Threat model: [[Threat-Model]]
- Security checklist: [[Security-Checklist]]
