# ⏩ Jabalpur Rent — Next Steps & Action Queue

> **Protocol**: Follow strict sequential execution. Do not commence Phase 2 implementation until Phase 1 review is completed and approved by the founder.

---

## 1. Immediate Action (Phase 1 Closure)

1. **Founder Review**:
   - Present the complete Phase 1 documentation suite to the founder.
   - Walk through the System Architecture ([[System-Architecture]]), Database Schema ([[Database-Schema]]), User Roles Matrix ([[User-Roles-and-Permissions]]), Threat Model ([[Threat-Model]]), and Open Business Decisions ([[Open-Questions]]).
2. **Founder Decision Sign-Off**:
   - Confirm preferred deposit pricing model and primary payment/KYC gateway direction.
   - Grant explicit approval to begin Phase 2.

---

## 2. Queued Sequence for Phase 2 (Frontend Prototype)

Once approval is received, Phase 2 will execute in this order:

### Step 1: Design System & Shared CSS
- Create `frontend/src/css/variables.css` with:
  - Curated HSL color palette (sleek dark mode base with vibrant emerald/teal accents for trust & escrow).
  - Modern typography system importing Google Fonts (`Outfit` for headings, `Inter` for crisp readability).
  - Elevation tokens, glassmorphism card surfaces, and border-radius scales.
- Create `frontend/src/css/base.css` and `frontend/src/css/components.css` (cards, badges, modals, inputs, hero layouts, buttons).

### Step 2: Customer Discovery & Catalog UI
- Build `frontend/src/customer/index.html` with:
  - Hero section showcasing Jabalpur phone rentals.
  - Quick filter chips for local hubs (*Sadar*, *Russell Chowk*, *Gorakhpur*, *Wright Town*).
  - Featured phone cards with daily rates, deposit badges, and specs.
- Build `frontend/src/customer/catalog.html` with multi-facet filters (Brand, Price, Camera type).
- Build `frontend/src/customer/device.html` with:
  - Multi-angle gallery.
  - Interactive date range selector.
  - Real-time transparent price calculation (Rental Days x Daily Rate + Refundable Deposit).
  - "Book Now" CTA.

### Step 3: Checkout & Customer Dashboard UI
- Build `frontend/src/customer/checkout.html`:
  - Order summary breakdown.
  - Mock DigiLocker KYC authorization trigger button.
  - Simulated payment gateway checkout modal.
- Build `frontend/src/customer/bookings.html`:
  - Active booking cards displaying status timeline and the 6-digit **Pickup OTP** card.

### Step 4: Shop Partner & Admin Portals
- Build `frontend/src/shop/dashboard.html` & `frontend/src/shop/inventory.html` (device condition toggles, stock list).
- Build `frontend/src/shop/handover.html` (Pickup OTP verification form, photo upload simulator, return inspection checklist).
- Build `frontend/src/admin/dashboard.html` (shop approval queue, flagged KYC review).

### Step 5: Verification & Review
- Test responsive layout on mobile viewport (360px), tablet (768px), and desktop (1280px+).
- Validate smooth micro-interactions and zero broken assets.

---

## 🔗 Related Links
- Current phase status: [[Current-Phase]]
- Master roadmap: [[MASTER-PLAN]]
- Project status: [[PROJECT-STATUS]]
