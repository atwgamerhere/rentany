// ==============================================================================
// RENTANY BACKEND: PRICING & ESCROW ENGINE (PHASE 5)
// Deterministic pricing calculations, duration discount tiers, and fee splits
// ==============================================================================

export interface PricingBreakdown {
  dailyRate: number;
  rentalDays: number;
  discountPercentage: number;
  subtotal: number;
  discountAmount: number;
  netRentalAmount: number;
  securityDeposit: number;
  platformFee: number; // 20% platform take-rate
  shopPayout: number;  // 80% partner shop share
  totalPayableUpfront: number;
}

export const PRICING_CONSTANTS = {
  PLATFORM_COMMISSION_PERCENT: 20.0,
  SHOP_PAYOUT_PERCENT: 80.0,
  RESIDENT_SECURITY_DEPOSIT: 3000,
  OUTSTATION_SECURITY_DEPOSIT: 8000,
  TIER_DISCOUNT_3_DAYS: 10, // 10% off for 3-6 days
  TIER_DISCOUNT_7_DAYS: 20  // 20% off for 7+ days
};

export function calculatePricing(
  dailyRate: number,
  rentalDays: number,
  isJabalpurResident: boolean = true
): PricingBreakdown {
  if (dailyRate <= 0) {
    throw new Error('Daily rate must be greater than zero');
  }
  if (rentalDays <= 0 || !Number.isInteger(rentalDays)) {
    throw new Error('Rental duration must be at least 1 full day');
  }

  // Calculate duration discount tier
  let discountPercentage = 0;
  if (rentalDays >= 7) {
    discountPercentage = PRICING_CONSTANTS.TIER_DISCOUNT_7_DAYS;
  } else if (rentalDays >= 3) {
    discountPercentage = PRICING_CONSTANTS.TIER_DISCOUNT_3_DAYS;
  }

  const subtotal = dailyRate * rentalDays;
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const netRentalAmount = subtotal - discountAmount;

  // Exact 20% platform fee, 80% merchant payout
  const platformFee = Math.round((netRentalAmount * PRICING_CONSTANTS.PLATFORM_COMMISSION_PERCENT) / 100);
  const shopPayout = netRentalAmount - platformFee;

  // Refundable security deposit
  const securityDeposit = isJabalpurResident
    ? PRICING_CONSTANTS.RESIDENT_SECURITY_DEPOSIT
    : PRICING_CONSTANTS.OUTSTATION_SECURITY_DEPOSIT;

  const totalPayableUpfront = netRentalAmount + securityDeposit;

  return {
    dailyRate,
    rentalDays,
    discountPercentage,
    subtotal,
    discountAmount,
    netRentalAmount,
    securityDeposit,
    platformFee,
    shopPayout,
    totalPayableUpfront
  };
}
