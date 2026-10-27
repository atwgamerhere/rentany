# Jabalpur Rent (rentany.in) 📱
> Hyperlocal mobile-phone rental marketplace connecting verified local mobile shops in Jabalpur, Madhya Pradesh with trusted customers.

---

## 🧭 About Jabalpur Rent

**Jabalpur Rent** enables Jabalpur residents, students, travelers, and content creators to rent premium smartphones (iPhone, Samsung Galaxy, OnePlus, Google Pixel) from verified local retail shops for short-term and medium-term durations (1 to 30 days) with secure digital KYC verification, transparent security deposits, and digital escrow payments.

---

## 🧠 Project Architecture & The Obsidian "Second Brain"

This repository couples application source code with a comprehensive technical documentation vault maintained directly in Obsidian:

- **Documentation Vault**: [`rentany-vault/`](./rentany-vault/Home.md) (also accessible via `knowledge-vault/`)
  - Central index: [`Home.md`](./rentany-vault/Home.md)
  - Live status: [`PROJECT-STATUS.md`](./rentany-vault/PROJECT-STATUS.md)
  - Master roadmap: [`MASTER-PLAN.md`](./rentany-vault/MASTER-PLAN.md)
  - Architecture decisions: [`01-Architecture/Architecture-Decisions.md`](./rentany-vault/01-Architecture/Architecture-Decisions.md)
- **Frontend**: [`frontend/`](./frontend/) — Clean, responsive Vanilla HTML5/CSS3/JavaScript modules.
- **Backend API**: [`backend/`](./backend/) — Modular TypeScript service for payment verification, KYC webhooks, and reservation concurrency guards.
- **Database**: [`database/`](./database/) — PostgreSQL migrations, schemas, and Supabase Row-Level Security (RLS) policies.
- **Tests**: [`tests/`](./tests/) — Unit, integration, and security verification suites.

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js (v20+ LTS recommended, current runtime: v24+)
- npm (v10+)
- Obsidian (recommended for navigating `rentany-vault/`)
- A free Supabase account for PostgreSQL & Auth

### Setup Steps
1. **Clone & Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your sandbox credentials
   ```

2. **Open the Obsidian Vault**
   - Launch Obsidian -> "Open folder as vault" -> select the `rentany-vault` directory.
   - Start by reading `Home.md` and `PROJECT-STATUS.md`.

3. **Current Status**
   - **Current Phase**: **PHASE 1 (Architecture, Database Design & Threat Modeling)**
   - All code implementation begins after Phase 1 approval.

---

## 🔒 Security Principles
- **Defense in Depth**: Zero trust in frontend assertions. RLS enforced on database tables and private document storage buckets.
- **Data Privacy**: No raw 12-digit Aadhaar storage (strictly masked UIDAI compliance).
- **Payment Integrity**: Server-side cryptographic signature validation and idempotent webhook consumption.
- **Concurrency Safety**: Database-level reservation locking to prevent double bookings on real hardware.

---

## 📜 License & Ownership
Proprietary project developed for Jabalpur, Madhya Pradesh, India.
