// ==============================================================================
// RENTANY BACKEND: COUNTER HANDOVER & RETURN INSPECTION (PHASE 5)
// In-person OTP verification, physical inspection checklist, and instant refund calculation
// ==============================================================================

import { db } from './db.ts';
import type { Booking, Inspection } from './db.ts';

export interface HandoverVerificationInput {
  bookingId: string;
  shopId: string;
  enteredOtp: string;
  screenCondition: 'MINT' | 'SCRATCHED' | 'CRACKED';
  batteryLevel: number;
  accessoriesIncluded: string[];
  notes?: string;
}

export interface ReturnInspectionInput {
  bookingId: string;
  shopId: string;
  screenCondition: 'MINT' | 'SCRATCHED' | 'CRACKED';
  batteryLevel: number;
  accessoriesReturned: string[];
  damageDeductionNotes?: string;
}

export interface ReturnResult {
  success: boolean;
  booking?: Booking;
  inspection?: Inspection;
  depositRefundAmount?: number;
  damageDeductions?: number;
  error?: string;
}

/**
 * Validates store-counter handover with customer's 6-digit OTP.
 */
export function verifyHandoverPickup(input: HandoverVerificationInput): { success: boolean; booking?: Booking; error?: string } {
  const booking = db.bookings.get(input.bookingId);
  if (!booking) {
    return { success: false, error: 'Booking not found' };
  }

  if (booking.shop_id !== input.shopId) {
    return { success: false, error: 'Unauthorized: Booking belongs to a different shop location' };
  }

  if (booking.status !== 'CONFIRMED') {
    return { success: false, error: `Cannot perform handover: Booking is in ${booking.status} status` };
  }

  // Verify OTP
  if (booking.pickup_otp !== input.enteredOtp.trim()) {
    return { success: false, error: 'Invalid Pickup OTP. Please check customer Digital Pass.' };
  }

  // Create handover inspection record
  const inspection: Inspection = {
    id: `insp-handover-${Date.now()}`,
    booking_id: booking.id,
    inspector_id: input.shopId,
    inspection_type: 'HANDOVER',
    physical_condition_notes: input.notes || 'Counter pickup verified. Device in verified condition.',
    screen_condition: input.screenCondition,
    battery_level: input.batteryLevel,
    accessories_included: input.accessoriesIncluded,
    created_at: new Date().toISOString()
  };

  db.inspections.set(inspection.id, inspection);

  // Transition booking to ACTIVE
  booking.status = 'ACTIVE';
  db.bookings.set(booking.id, booking);
  db.logAudit('bookings', 'HANDOVER_COMPLETE', booking.id);

  return { success: true, booking };
}

/**
 * Handles device return, assesses physical condition, and computes net deposit refund.
 */
export function processDeviceReturn(input: ReturnInspectionInput): ReturnResult {
  const booking = db.bookings.get(input.bookingId);
  if (!booking) {
    return { success: false, error: 'Booking not found' };
  }

  if (booking.status !== 'ACTIVE') {
    return { success: false, error: `Cannot process return: Booking status is ${booking.status}` };
  }

  // Damage deduction schedule
  let damageDeductions = 0;
  if (input.screenCondition === 'SCRATCHED') {
    damageDeductions += 500; // Minor cosmetic scratch fee
  } else if (input.screenCondition === 'CRACKED') {
    damageDeductions += 2500; // Screen repair contribution
  }

  // Check missing accessories (e.g. charging cable)
  if (!input.accessoriesReturned.includes('Original Cable')) {
    damageDeductions += 500;
  }

  // Deductions cannot exceed original security deposit
  damageDeductions = Math.min(damageDeductions, booking.security_deposit);
  const depositRefundAmount = booking.security_deposit - damageDeductions;

  // Record return inspection
  const inspection: Inspection = {
    id: `insp-return-${Date.now()}`,
    booking_id: booking.id,
    inspector_id: input.shopId,
    inspection_type: 'RETURN',
    physical_condition_notes: input.damageDeductionNotes || (damageDeductions > 0 ? `Damage assessed: -₹${damageDeductions}` : 'Device returned in mint condition.'),
    screen_condition: input.screenCondition,
    battery_level: input.batteryLevel,
    accessories_included: input.accessoriesReturned,
    deposit_refund_amount: depositRefundAmount,
    created_at: new Date().toISOString()
  };

  db.inspections.set(inspection.id, inspection);

  // Transition booking to COMPLETED
  booking.status = 'COMPLETED';
  db.bookings.set(booking.id, booking);
  db.logAudit('bookings', 'RETURN_COMPLETE', booking.id);

  return {
    success: true,
    booking,
    inspection,
    depositRefundAmount,
    damageDeductions
  };
}
