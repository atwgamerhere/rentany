// ==============================================================================
// RENTANY TEST SUITE: OTP GENERATION & VERIFICATION (UNIT)
// ==============================================================================

import assert from 'node:assert/strict';
import { generatePickupOtp } from '../../backend/src/modules/bookings.ts';

export async function runOtpTests(): Promise<void> {
  console.log('▶ Running OTP Cryptographic Unit Tests...');

  // Test 1: Length and Numeric Format
  {
    for (let i = 0; i < 50; i++) {
      const otp = generatePickupOtp();
      assert.equal(otp.length, 6, 'OTP must be exactly 6 characters long');
      assert.match(otp, /^[1-9][0-9]{5}$/, 'OTP must be a 6-digit numeric string starting from 100000');
      const num = parseInt(otp, 10);
      assert.ok(num >= 100000 && num <= 999999, 'OTP must fall in range [100000, 999999]');
    }
    console.log('  ✔ 50 consecutive OTP entropy runs passed [100000, 999999]');
  }

  // Test 2: Uniqueness distribution
  {
    const set = new Set<string>();
    for (let i = 0; i < 100; i++) {
      set.add(generatePickupOtp());
    }
    assert.ok(set.size > 95, 'High entropy: At least 95 unique OTPs generated in 100 iterations');
    console.log('  ✔ High entropy distribution verified');
  }
}
