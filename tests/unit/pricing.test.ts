// ==============================================================================
// RENTANY TEST SUITE: PRICING & ESCROW ENGINE (UNIT)
// ==============================================================================

import assert from 'node:assert/strict';
import { calculatePricing, PRICING_CONSTANTS } from '../../backend/src/modules/pricing.ts';

export async function runPricingTests(): Promise<void> {
  console.log('▶ Running Pricing Engine Unit Tests...');

  // Test 1: 1-Day Rental (0% duration discount)
  {
    const res = calculatePricing(1499, 1, true);
    assert.equal(res.subtotal, 1499, '1-day subtotal should equal daily rate');
    assert.equal(res.discountPercentage, 0, '1-day rental should receive 0% discount');
    assert.equal(res.discountAmount, 0, 'Discount amount should be 0');
    assert.equal(res.netRentalAmount, 1499, 'Net rental amount should equal subtotal');
    assert.equal(res.platformFee, 300, 'Platform fee should be 20% of net (300)');
    assert.equal(res.shopPayout, 1199, 'Shop payout should be 80% of net (1199)');
    assert.equal(res.securityDeposit, 3000, 'Resident security deposit should be ₹3,000');
    assert.equal(res.totalPayableUpfront, 4499, 'Total payable should be net + deposit (4499)');
    console.log('  ✔ 1-day rental baseline verified');
  }

  // Test 2: 3-Day Rental (10% duration discount)
  {
    const res = calculatePricing(1499, 3, true);
    assert.equal(res.subtotal, 4497, '3-day subtotal should be 1499 * 3 = 4497');
    assert.equal(res.discountPercentage, 10, '3-day rental should receive 10% discount');
    assert.equal(res.discountAmount, 450, '10% discount rounded should be 450');
    assert.equal(res.netRentalAmount, 4047, 'Net rental should be 4497 - 450 = 4047');
    assert.equal(res.platformFee, 809, 'Platform fee should be 20% of 4047 = 809');
    assert.equal(res.shopPayout, 3238, 'Shop payout should be 80% = 3238');
    assert.equal(res.securityDeposit, 3000, 'Resident deposit should be 3000');
    assert.equal(res.totalPayableUpfront, 7047, 'Total upfront should be 4047 + 3000 = 7047');
    console.log('  ✔ 3-day 10% duration discount tier verified');
  }

  // Test 3: 7-Day Rental (20% duration discount)
  {
    const res = calculatePricing(1499, 7, true);
    assert.equal(res.subtotal, 10493, '7-day subtotal should be 1499 * 7 = 10493');
    assert.equal(res.discountPercentage, 20, '7-day rental should receive 20% discount');
    assert.equal(res.discountAmount, 2099, '20% discount should be 2099');
    assert.equal(res.netRentalAmount, 8394, 'Net rental should be 8394');
    assert.equal(res.platformFee, 1679, 'Platform fee should be 20% of 8394 = 1679');
    assert.equal(res.shopPayout, 6715, 'Shop payout should be 8394 - 1679 = 6715');
    assert.equal(res.totalPayableUpfront, 11394, 'Total upfront should be 8394 + 3000 = 11394');
    console.log('  ✔ 7-day 20% duration discount tier verified');
  }

  // Test 4: Outstation / Tourist Security Deposit (₹8,000)
  {
    const res = calculatePricing(1499, 2, false);
    assert.equal(res.securityDeposit, 8000, 'Outstation deposit should be ₹8,000');
    assert.equal(res.totalPayableUpfront, 2998 + 8000, 'Total should reflect ₹8,000 deposit');
    console.log('  ✔ Outstation tourist deposit tier (₹8,000) verified');
  }

  // Test 5: Invalid Boundary Handling
  {
    assert.throws(() => calculatePricing(0, 3, true), /greater than zero/, 'Should reject 0 daily rate');
    assert.throws(() => calculatePricing(1499, 0, true), /at least 1 full day/, 'Should reject 0 rental days');
    assert.throws(() => calculatePricing(1499, -2, true), /at least 1 full day/, 'Should reject negative days');
    console.log('  ✔ Error boundary checks verified');
  }
}
