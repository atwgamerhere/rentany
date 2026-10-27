// ==============================================================================
// RENTANY BACKEND: PUBLIC CATALOG & LISTINGS (PHASE 4)
// Provides searchable smartphone listings with locality and brand filtering
// ==============================================================================

import { db } from './db.ts';
import type { PhysicalDevice, Shop } from './db.ts';

export interface CatalogItem {
  id: string;
  brand: string;
  model: string;
  category: 'FLAGSHIP' | 'PRO_CAMERA' | 'COMPACT' | 'TRAVEL';
  dailyRate: number;
  availableUnits: number;
  shopName: string;
  shopLocality: string;
  shopId: string;
  specs: {
    camera: string;
    chipset: string;
    screen: string;
    battery: string;
  };
}

// Canonical curated models available across Jabalpur partner shops
const CANONICAL_CATALOG: Array<Omit<CatalogItem, 'availableUnits' | 'shopName' | 'shopLocality' | 'shopId'>> = [
  {
    id: 'listing-iphone-15-pro-max',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    category: 'FLAGSHIP',
    dailyRate: 1499,
    specs: {
      camera: '48MP Main + 5x Telephoto',
      chipset: 'A17 Pro (3nm)',
      screen: '6.7" Super Retina XDR 120Hz',
      battery: '4422 mAh (All-Day ProRes)'
    }
  },
  {
    id: 'listing-samsung-s24-ultra',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    category: 'FLAGSHIP',
    dailyRate: 1399,
    specs: {
      camera: '200MP Quad Tele + 100x Space Zoom',
      chipset: 'Snapdragon 8 Gen 3',
      screen: '6.8" Dynamic AMOLED 2X',
      battery: '5000 mAh + S-Pen'
    }
  },
  {
    id: 'listing-pixel-8-pro',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    category: 'PRO_CAMERA',
    dailyRate: 1199,
    specs: {
      camera: '50MP + Best Take + Magic Audio',
      chipset: 'Google Tensor G3',
      screen: '6.7" Super Actua Display',
      battery: '5050 mAh'
    }
  },
  {
    id: 'listing-oneplus-12',
    brand: 'OnePlus',
    model: 'OnePlus 12',
    category: 'FLAGSHIP',
    dailyRate: 999,
    specs: {
      camera: 'Hasselblad 4th Gen Camera System',
      chipset: 'Snapdragon 8 Gen 3',
      screen: '6.82" 2K ProXDR 120Hz',
      battery: '5400 mAh + 100W SUPERVOOC'
    }
  }
];

export interface CatalogFilter {
  brand?: string;
  locality?: string;
  maxDailyRate?: number;
  availableOnly?: boolean;
}

export function getPublicCatalog(filter?: CatalogFilter): CatalogItem[] {
  const result: CatalogItem[] = [];

  for (const template of CANONICAL_CATALOG) {
    // Find active physical devices matching this brand and model
    const matchingDevices = Array.from(db.devices.values()).filter(
      d => d.brand.toLowerCase() === template.brand.toLowerCase() &&
           d.model.toLowerCase() === template.model.toLowerCase() &&
           d.is_active
    );

    if (matchingDevices.length === 0) continue;

    const sampleDevice = matchingDevices[0];
    const shop = db.shops.get(sampleDevice.shop_id);
    if (!shop || !shop.is_verified) continue;

    // Apply brand filter
    if (filter?.brand && filter.brand.toLowerCase() !== 'all' &&
        template.brand.toLowerCase() !== filter.brand.toLowerCase()) {
      continue;
    }

    // Apply locality filter
    if (filter?.locality && filter.locality.toUpperCase() !== 'ALL' &&
        shop.locality !== filter.locality.toUpperCase()) {
      continue;
    }

    // Apply max daily rate filter
    if (filter?.maxDailyRate && template.dailyRate > filter.maxDailyRate) {
      continue;
    }

    result.push({
      ...template,
      availableUnits: matchingDevices.length,
      shopName: shop.name,
      shopLocality: shop.locality,
      shopId: shop.id
    });
  }

  return result;
}

export function getListingDetails(listingId: string): CatalogItem | undefined {
  const catalog = getPublicCatalog();
  return catalog.find(item => item.id === listingId);
}
