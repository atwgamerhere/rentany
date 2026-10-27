// ==============================================================================
// RENTANY BACKEND: PHYSICAL INVENTORY MANAGEMENT (PHASE 4)
// Manages real hardware units, SHA-256 IMEI hashing, and health validation
// ==============================================================================

import * as crypto from 'crypto';
import { db } from './db.ts';
import type { PhysicalDevice } from './db.ts';
import { getShopById } from './shops.ts';

export interface DeviceRegistrationInput {
  shopId: string;
  brand: string;
  model: string;
  rawImei: string;
  serialNumber: string;
  batteryHealth: number;
  conditionGrade: 'MINT' | 'EXCELLENT' | 'GOOD';
}

/**
 * Computes cryptographically irreversible SHA-256 hash of device IMEI.
 * Plaintext IMEI is discarded immediately from memory (Anti-tamper & privacy).
 */
export function hashImei(rawImei: string): string {
  const cleanImei = rawImei.replace(/[^0-9]/g, '');
  if (cleanImei.length !== 15) {
    throw new Error('IMEI must be exactly 15 numeric digits');
  }
  return crypto.createHash('sha256').update(cleanImei).digest('hex');
}

export function registerDevice(input: DeviceRegistrationInput): { success: boolean; device?: PhysicalDevice; error?: string } {
  // Verify shop exists and is verified
  const shop = getShopById(input.shopId);
  if (!shop) {
    return { success: false, error: 'Shop does not exist' };
  }
  if (!shop.is_verified) {
    return { success: false, error: 'Shop must be verified by admin before listing physical devices' };
  }

  // Battery health constraint
  if (input.batteryHealth < 80 || input.batteryHealth > 100) {
    return { success: false, error: 'Battery health must be between 80% and 100% for rental eligibility' };
  }

  // Hash IMEI
  let imeiHash: string;
  try {
    imeiHash = hashImei(input.rawImei);
  } catch (err: any) {
    return { success: false, error: err.message };
  }

  // Check for duplicate IMEI hash across platform
  for (const existing of db.devices.values()) {
    if (existing.imei_hash === imeiHash) {
      return { success: false, error: 'This physical device IMEI is already registered on RENTANY' };
    }
  }

  const device: PhysicalDevice = {
    id: `30000000-0000-0000-0000-${String(db.devices.size + 1).padStart(12, '0')}`,
    shop_id: input.shopId,
    brand: input.brand.trim(),
    model: input.model.trim(),
    imei_hash: imeiHash,
    serial_number: input.serialNumber.trim(),
    battery_health: input.batteryHealth,
    conditionGrade: input.conditionGrade,
    is_active: true
  } as any;

  db.devices.set(device.id, device);
  db.logAudit('physical_devices', 'INSERT', device.id);

  return { success: true, device };
}

export function getDevicesByShop(shopId: string): PhysicalDevice[] {
  return Array.from(db.devices.values()).filter(d => d.shop_id === shopId);
}

export function getDeviceById(deviceId: string): PhysicalDevice | undefined {
  return db.devices.get(deviceId);
}

export function updateDeviceStatus(deviceId: string, isActive: boolean): boolean {
  const device = db.devices.get(deviceId);
  if (!device) return false;
  device.is_active = isActive;
  db.devices.set(deviceId, device);
  db.logAudit('physical_devices', isActive ? 'ACTIVATE' : 'DEACTIVATE', deviceId);
  return true;
}
