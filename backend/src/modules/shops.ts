// ==============================================================================
// RENTANY BACKEND: SHOP PARTNER MANAGEMENT (PHASE 4)
// Handles partner registration, Jabalpur trade license vetting, and approval
// ==============================================================================

import { db } from './db.ts';
import type { Shop } from './db.ts';

export interface ShopRegistrationInput {
  ownerId: string;
  name: string;
  addressLine: string;
  locality: 'SADAR' | 'RUSSELL_CHOWK' | 'GORAKHPUR' | 'WRIGHT_TOWN';
  pincode: string;
  phone: string;
  tradeLicenseNumber: string;
}

const VALID_LOCALITIES = ['SADAR', 'RUSSELL_CHOWK', 'GORAKHPUR', 'WRIGHT_TOWN'] as const;
const VALID_JABALPUR_PINCODES = ['482001', '482002', '482003', '482004', '482005', '482007', '482008'];

export function registerShop(input: ShopRegistrationInput): { success: boolean; shop?: Shop; error?: string } {
  // Input validations
  if (!input.name || input.name.trim().length < 3) {
    return { success: false, error: 'Shop name must be at least 3 characters' };
  }

  if (!VALID_LOCALITIES.includes(input.locality)) {
    return { success: false, error: 'Shop must be located in Sadar, Russell Chowk, Gorakhpur, or Wright Town' };
  }

  if (!VALID_JABALPUR_PINCODES.includes(input.pincode)) {
    return { success: false, error: 'Shop must have a valid Jabalpur PIN code (482001-482008)' };
  }

  // JMC Trade License pattern: JMC/TL/YYYY/NNNN
  const tradeLicenseRegex = /^JMC\/TL\/20[1-2][0-9]\/[0-9]{4}$/;
  if (!tradeLicenseRegex.test(input.tradeLicenseNumber)) {
    return { success: false, error: 'Invalid Jabalpur Municipal Corporation (JMC) Trade License format' };
  }

  // Create new shop (starts unverified pending admin vetting)
  const newShop: Shop = {
    id: `20000000-0000-0000-0000-${String(db.shops.size + 1).padStart(12, '0')}`,
    owner_id: input.ownerId,
    name: input.name.trim(),
    address_line: input.addressLine.trim(),
    locality: input.locality,
    pincode: input.pincode,
    phone: input.phone.trim(),
    trade_license_number: input.tradeLicenseNumber,
    is_verified: false,
    commission_percent: 20.0 // Fixed 20% platform commission
  };

  db.shops.set(newShop.id, newShop);
  db.logAudit('shops', 'INSERT', newShop.id);

  return { success: true, shop: newShop };
}

export function approveShop(shopId: string, adminUserId: string): { success: boolean; shop?: Shop; error?: string } {
  const shop = db.shops.get(shopId);
  if (!shop) {
    return { success: false, error: 'Shop not found' };
  }

  shop.is_verified = true;
  db.shops.set(shop.id, shop);
  db.logAudit('shops', 'APPROVE', shop.id);

  return { success: true, shop };
}

export function listShops(filter?: { locality?: string; verifiedOnly?: boolean }): Shop[] {
  let list = Array.from(db.shops.values());
  if (filter?.verifiedOnly) {
    list = list.filter(s => s.is_verified);
  }
  if (filter?.locality) {
    list = list.filter(s => s.locality === filter.locality);
  }
  return list;
}

export function getShopById(shopId: string): Shop | undefined {
  return db.shops.get(shopId);
}
