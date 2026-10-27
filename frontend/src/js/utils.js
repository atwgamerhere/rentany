// ==============================================================================
// JABALPUR RENT — UTILITY & PRICING HELPER FUNCTIONS
// ==============================================================================

/**
 * Format number as Indian Rupees (INR)
 * Example: 7200 -> "₹7,200"
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Dynamic Quote Calculator (incorporating founder decisions)
 * - Duration discount: 3+ days = 10% off; 7+ days = 20% off
 * - Platform Take-Rate: 20%
 * - Security Deposit: ₹3,000 for Jabalpur residents; ₹8,000 for outstation/tourists
 */
export function calculateQuote(baseDailyRate, days, isResident = true) {
  const safeDays = Math.max(1, parseInt(days, 10) || 1);
  const rawRentalFee = baseDailyRate * safeDays;

  // Duration Discount
  let discountPercent = 0;
  if (safeDays >= 7) {
    discountPercent = 0.20; // 20% discount for week+
  } else if (safeDays >= 3) {
    discountPercent = 0.10; // 10% discount for 3+ days
  }

  const discountAmount = Math.round(rawRentalFee * discountPercent);
  const netRentalFee = rawRentalFee - discountAmount;

  // 20% Platform Commission Split
  const platformFee = Math.round(netRentalFee * 0.20);
  const shopShare = netRentalFee - platformFee;

  // Tiered Security Deposit (Founder Decision 1B)
  const depositAmount = isResident ? 3000 : 8000;

  // Total customer payment at checkout
  const totalPayable = netRentalFee + depositAmount;

  return {
    days: safeDays,
    rawRentalFee,
    discountPercent: discountPercent * 100,
    discountAmount,
    netRentalFee,
    platformFee, // 20%
    shopShare,   // 80%
    depositAmount,
    isResident,
    totalPayable
  };
}

/**
 * Display non-intrusive floating toast notifications
 */
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠' : 'ℹ';
  toast.innerHTML = `<span style="font-weight: 800; color: var(--brand-primary);">${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Modal helpers
 */
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}
