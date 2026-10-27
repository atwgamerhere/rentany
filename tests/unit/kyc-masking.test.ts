// ==============================================================================
// RENTANY TEST SUITE: UIDAI AADHAAR MASKING & PRIVACY (UNIT)
// Enforces Section 29 of Aadhaar Act 2016
// ==============================================================================

import assert from 'node:assert/strict';
import { maskAadhaar, verifyCustomerKyc } from '../../backend/src/modules/kyc.ts';

export async function runKycMaskingTests(): Promise<void> {
  console.log('▶ Running UIDAI Aadhaar Masking & KYC Privacy Tests...');

  // Test 1: Raw 12-digit masking
  {
    const masked = maskAadhaar('987654321098');
    assert.equal(masked, 'XXXX-XXXX-1098', 'Raw 12-digit Aadhaar must be masked to XXXX-XXXX-1098');
    assert.match(masked, /^XXXX-XXXX-[0-9]{4}$/, 'Must match official UIDAI mask pattern');
    console.log('  ✔ Raw 12-digit Aadhaar properly masked');
  }

  // Test 2: Pre-masked Aadhaar string
  {
    const masked = maskAadhaar('XXXX-XXXX-4567');
    assert.equal(masked, 'XXXX-XXXX-4567', 'Valid pre-masked format should pass through');
    console.log('  ✔ Valid pre-masked Aadhaar preserved');
  }

  // Test 3: Formatting with spaces or hyphens
  {
    const masked = maskAadhaar('9876 5432 1098');
    assert.equal(masked, 'XXXX-XXXX-1098', 'Spaces should be stripped prior to masking');
    console.log('  ✔ Spaced raw input correctly cleaned');
  }

  // Test 4: Invalid lengths rejected
  {
    assert.throws(() => maskAadhaar('12345'), /Invalid Aadhaar format/, 'Short input must throw error');
    assert.throws(() => maskAadhaar('123456789012345'), /Invalid Aadhaar format/, '15-digit input must throw error');
    assert.throws(() => maskAadhaar('ABCD-EFGH-IJKL'), /Invalid Aadhaar format/, 'Alphabetic input must throw error');
    console.log('  ✔ Malformed inputs strictly rejected');
  }

  // Test 5: Jabalpur resident verification via PIN code
  {
    const resident = verifyCustomerKyc({
      userId: '00000000-0000-0000-0000-000000000001',
      fullName: 'Abdul Tarique Warsi',
      rawAadhaarNumber: '111122223333',
      pincode: '482001',
      city: 'Jabalpur',
      state: 'Madhya Pradesh'
    });
    assert.equal(resident.isJabalpurResident, true, 'PIN 482001 must qualify as Jabalpur Resident');

    const tourist = verifyCustomerKyc({
      userId: '00000000-0000-0000-0000-000000000001',
      fullName: 'Rahul Sharma',
      rawAadhaarNumber: '444455556666',
      pincode: '110001',
      city: 'New Delhi',
      state: 'Delhi'
    });
    assert.equal(tourist.isJabalpurResident, false, 'Delhi PIN 110001 must classify as Tourist/Outstation');
    console.log('  ✔ Jabalpur resident vs Outstation classification verified');
  }
}
