// ==============================================================================
// RENTANY TEST SUITE: HARDWARE CONCURRENCY & RANGE LOCKS (INTEGRATION)
// Validates double-booking exclusion behavior
// ==============================================================================

import assert from 'node:assert/strict';
import { db } from '../../backend/src/modules/db.ts';
import { createBooking, doDatesOverlap } from '../../backend/src/modules/bookings.ts';

export async function runConcurrencyTests(): Promise<void> {
  console.log('▶ Running Hardware Concurrency & Double-Booking Tests...');

  // Test 1: Range overlap utility logic
  {
    assert.equal(doDatesOverlap('2026-11-01', '2026-11-05', '2026-11-03', '2026-11-07'), true, 'Overlapping dates must return true');
    assert.equal(doDatesOverlap('2026-11-01', '2026-11-05', '2026-11-06', '2026-11-10'), false, 'Non-overlapping dates must return false');
    assert.equal(doDatesOverlap('2026-11-05', '2026-11-05', '2026-11-05', '2026-11-05'), true, 'Same day must return true');
    console.log('  ✔ Date range overlap predicate verified');
  }

  // Test 2: Double-booking collision rejection on physical unit
  {
    const deviceId = '30000000-0000-0000-0000-000000000002'; // Samsung S24 Ultra

    // Booking 1: Customer A reserves Nov 10 to Nov 15
    const bookingA = createBooking({
      customerId: 'customer-arjun-01',
      deviceId,
      startDate: '2026-11-10',
      endDate: '2026-11-15',
      isJabalpurResident: true
    });
    assert.equal(bookingA.success, true, 'First reservation must succeed');
    assert.ok(bookingA.booking?.id, 'Booking A must have valid ID');

    // Booking 2: Customer B attempts to reserve Nov 12 to Nov 18 on SAME unit
    const bookingB = createBooking({
      customerId: 'customer-rohit-02',
      deviceId,
      startDate: '2026-11-12',
      endDate: '2026-11-18',
      isJabalpurResident: false
    });
    assert.equal(bookingB.success, false, 'Simultaneous conflicting reservation must be blocked');
    assert.match(bookingB.error || '', /Hardware conflict/, 'Error must specifically cite hardware conflict');
    console.log('  ✔ Overlapping reservation blocked by hardware exclusion');

    // Booking 3: Customer C reserves Nov 20 to Nov 25 (non-overlapping) on SAME unit
    const bookingC = createBooking({
      customerId: 'customer-priya-03',
      deviceId,
      startDate: '2026-11-20',
      endDate: '2026-11-25',
      isJabalpurResident: true
    });
    assert.equal(bookingC.success, true, 'Subsequent non-overlapping reservation must succeed');
    console.log('  ✔ Non-overlapping reservation on same hardware unit succeeded');
  }
}
