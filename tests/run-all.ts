// ==============================================================================
// RENTANY TEST RUNNER: MASTER VERIFICATION SUITE
// Runs all unit, integration, and security test suites with zero external test bloat
// ==============================================================================

import { runPricingTests } from './unit/pricing.test.ts';
import { runOtpTests } from './unit/otp.test.ts';
import { runKycMaskingTests } from './unit/kyc-masking.test.ts';
import { runConcurrencyTests } from './integration/concurrency.test.ts';

async function runMasterSuite(): Promise<void> {
  const startTime = Date.now();
  console.log('================================================================');
  console.log('🏛️  RENTANY — Master Test & Quality Verification Suite');
  console.log('================================================================\n');

  try {
    await runPricingTests();
    console.log('');
    await runOtpTests();
    console.log('');
    await runKycMaskingTests();
    console.log('');
    await runConcurrencyTests();
    console.log('');

    const elapsed = Date.now() - startTime;
    console.log('================================================================');
    console.log(`🎉 ALL TEST SUITES PASSED (0 failures, completed in ${elapsed}ms)`);
    console.log('================================================================');
  } catch (err: any) {
    console.error('\n❌ TEST SUITE FAILED:');
    console.error(err);
    process.exit(1);
  }
}

runMasterSuite();
