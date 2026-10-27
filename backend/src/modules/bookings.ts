// ==============================================================================
// RENTANY BACKEND: CONCURRENCY-SAFE BOOKING ENGINE (PHASE 5)
// Prevents hardware double-bookings and generates cryptographic 6-digit OTPs
// ==============================================================================

import * as crypto from 'crypto';
import { db } from './db.ts';
import type { Booking } from './db.ts';
import { calculatePricing } from './pricing.ts';

export interface CreateBookingInput {
  customerId: string;
  deviceId: string;
  startDate: string; // ISO format: YYYY-MM-DD
  endDate: string;   // ISO format: YYYY-MM-DD
  isJabalpurResident?: boolean;
}

/**
 * Checks if two date ranges overlap.
 * Mirrors PostgreSQL range overlap operator: [A_start, A_end] && [B_start, B_end]
 */
export function doDatesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const tStartA = new Date(startA).getTime();
  const tEndA = new Date(endA).getTime();
  const tStartB = new Date(startB).getTime();
  const tEndB = new Date(endB).getTime();

  return tStartA <= tEndB && tStartB <= tEndA;
}

/**
 * Generates cryptographically secure 6-digit OTP.
 */
export function generatePickupOtp(): string {
  return String(crypto.randomInt(100000, 999999));
}

export function createBooking(input: CreateBookingInput): { success: boolean; booking?: Booking; error?: string } {
  // Verify device exists and is active
  const device = db.devices.get(input.deviceId);
  if (!device || !device.is_active) {
    return { success: false, error: 'Physical device is not available for rental' };
  }

  // Verify dates
  const tStart = new Date(input.startDate).getTime();
  const tEnd = new Date(input.endDate).getTime();

  if (isNaN(tStart) || isNaN(tEnd)) {
    return { success: false, error: 'Invalid start or end date format' };
  }
  if (tStart > tEnd) {
    return { success: false, error: 'Start date cannot be after end date' };
  }

  // Calculate rental duration in days (inclusive)
  const msPerDay = 1000 * 60 * 60 * 24;
  const rentalDays = Math.max(1, Math.round((tEnd - tStart) / msPerDay) + 1);

  // CONCURRENCY CHECK: Verify no existing active booking overlaps this physical unit
  for (const existing of db.bookings.values()) {
    if (existing.device_id === input.deviceId &&
        existing.status !== 'CANCELLED' &&
        existing.status !== 'COMPLETED') {
      if (doDatesOverlap(input.startDate, input.endDate, existing.start_date, existing.end_date)) {
        return {
          success: false,
          error: `Hardware conflict: Physical unit ${device.model} (${device.serial_number}) is already reserved for these dates`
        };
      }
    }
  }

  // Daily rate lookup (Flagship standard)
  const dailyRate = device.brand === 'Apple' ? 1499 : 1399;
  const pricing = calculatePricing(dailyRate, rentalDays, input.isJabalpurResident ?? true);

  // Generate reference and 6-digit OTP
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const refSuffix = String(db.bookings.size + 1).padStart(4, '0');
  const bookingReference = `RENT-JBP-${todayStr}-${refSuffix}`;
  const pickupOtp = generatePickupOtp();

  // OTP expires at 23:59:59 on pickup day
  const otpExpiry = new Date(input.startDate);
  otpExpiry.setHours(23, 59, 59, 999);

  const booking: Booking = {
    id: `booking-${Date.now()}-${refSuffix}`,
    booking_reference: bookingReference,
    customer_id: input.customerId,
    device_id: input.deviceId,
    shop_id: device.shop_id,
    start_date: input.startDate,
    end_date: input.endDate,
    rental_days: rentalDays,
    daily_rate: pricing.dailyRate,
    subtotal: pricing.subtotal,
    discount_amount: pricing.discountAmount,
    net_rental_amount: pricing.netRentalAmount,
    security_deposit: pricing.securityDeposit,
    platform_fee: pricing.platformFee,
    shop_payout: pricing.shopPayout,
    status: 'CONFIRMED',
    pickup_otp: pickupOtp,
    otp_expires_at: otpExpiry.toISOString(),
    created_at: new Date().toISOString()
  };

  db.bookings.set(booking.id, booking);
  db.logAudit('bookings', 'INSERT', booking.id);

  return { success: true, booking };
}

export function getBookingById(bookingId: string): Booking | undefined {
  return db.bookings.get(bookingId);
}

export function getBookingsByCustomer(customerId: string): Booking[] {
  return Array.from(db.bookings.values()).filter(b => b.customer_id === customerId);
}

export function getBookingsByShop(shopId: string): Booking[] {
  return Array.from(db.bookings.values()).filter(b => b.shop_id === shopId);
}
