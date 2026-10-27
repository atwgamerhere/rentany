# 🚨 Jabalpur Rent — Monitoring, Alerting & Incident Response

> **Goal**: Rapid incident detection and remediation to prevent customer frustration and protect partner shop assets.

---

## 1. System Health & Observability Architecture

```
[ Frontend & Mobile Web ]
            │
            ▼
[ Backend /api/health ] ◄── Polled every 60s by Uptime Monitor (BetterStack / UptimeKuma)
            │
            ├── Supabase DB Connection Check
            ├── Storage Bucket Availability Check
            └── Gateway Status Check
```

### Free-Tier Observability Stack
- **Uptime Monitoring**: Better Stack or UptimeRobot (Free tier: 50 monitors checked every 3-5 mins).
- **Error Tracking**: Sentry (Free tier: 5,000 error events/month) captures uncaught client and server exceptions.
- **Log Aggregation**: Render/Railway structured stdout logs retained for 7 days.

---

## 2. Incident Severity Classification & SLAs

| Severity | Definition | Example Scenario | Response SLA | Target Resolution |
| :---: | :--- | :--- | :---: | :---: |
| **P1 — Critical** | Complete service outage or financial threat | Payment gateway failing; all bookings blocked; database inaccessible; active theft reported. | **Immediate (< 15 mins)** | < 2 hours |
| **P2 — Major** | Degraded functionality impacting multiple users | DigiLocker KYC provider API down; SMS OTP delivery delayed; specific shop unable to process handovers. | **< 1 hour** | < 6 hours |
| **P3 — Minor** | Non-critical bugs with operational workarounds | Cosmetic formatting defect on catalog page; filter dropdown glitch on older mobile browser. | **< 24 hours** | Next sprint |

---

## 3. Incident Response Escalation Protocol

1. **Detection**: Automated alert received via email/WhatsApp or reported by shop partner in Sadar/Russell Chowk.
2. **Containment**: If financial or data leak risk is detected, temporarily disable the affected route or place the platform in Maintenance Mode.
3. **Investigation**: Inspect server logs and Supabase query metrics.
4. **Fix & Verify**: Deploy patch or failover to sandbox/mock gateway.
5. **Post-Mortem**: Document root cause, impact duration, and preventive measure in [[09-Session-Logs/README|Session Logs]].

---

## 🔗 Related Links
- Backup & recovery: [[Backup-and-Recovery]]
- Deployment guide: [[Deployment-Guide]]
- Cost tracking: [[Cost-Tracking]]
