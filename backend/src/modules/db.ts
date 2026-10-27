// ==============================================================================
// RENTANY BACKEND: DATABASE ACCESS LAYER
// Lightweight client supporting Supabase Postgres and in-memory mock store
// ==============================================================================

import { config } from '../config/env';

export interface Profile {
  id: string;
  phone: string;
  full_name: string;
  role: 'CUSTOMER' | 'SHOP_OWNER' | 'ADMIN';
  created_at: string;
}

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  address_line: string;
  locality: 'SADAR' | 'RUSSELL_CHOWK' | 'GORAKHPUR' | 'WRIGHT_TOWN';
  pincode: string;
  phone: string;
  trade_license_number: string;
  is_verified: boolean;
  commission_percent: number;
}

export interface PhysicalDevice {
  id: string;
  shop_id: string;
  brand: string;
  model: string;
  imei_hash: string;
  serial_number: string;
  battery_health: number;
  condition_grade: 'MINT' | 'EXCELLENT' | 'GOOD';
  is_active: boolean;
}

export interface Booking {
  id: string;
  booking_reference: string;
  customer_id: string;
  device_id: string;
  shop_id: string;
  start_date: string;
  end_date: string;
  rental_days: number;
  daily_rate: number;
  subtotal: number;
  discount_amount: number;
  net_rental_amount: number;
  security_deposit: number;
  platform_fee: number;
  shop_payout: number;
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'RETURNED' | 'COMPLETED' | 'CANCELLED';
  pickup_otp: string;
  otp_expires_at: string;
  created_at: string;
}

export interface Inspection {
  id: string;
  booking_id: string;
  inspector_id: string;
  inspection_type: 'HANDOVER' | 'RETURN';
  physical_condition_notes: string;
  screen_condition: 'MINT' | 'SCRATCHED' | 'CRACKED';
  battery_level: number;
  accessories_included: string[];
  deposit_refund_amount?: number;
  created_at: string;
}

// In-Memory Database store populated from Phase 3 migration seeds
class MemoryStore {
  profiles: Map<string, Profile> = new Map();
  shops: Map<string, Shop> = new Map();
  devices: Map<string, PhysicalDevice> = new Map();
  bookings: Map<string, Booking> = new Map();
  inspections: Map<string, Inspection> = new Map();
  auditLogs: Array<{ id: string; table: string; action: string; recordId: string; timestamp: string }> = [];

  constructor() {
    this.seed();
  }

  seed() {
    // Admin profile
    this.profiles.set('00000000-0000-0000-0000-000000000001', {
      id: '00000000-0000-0000-0000-000000000001',
      phone: '+919999900001',
      full_name: 'Abdul Tarique Warsi (SuperAdmin)',
      role: 'ADMIN',
      created_at: new Date().toISOString()
    });

    // Jabalpur Shops
    const shopsData: Shop[] = [
      {
        id: '20000000-0000-0000-0000-000000000001',
        owner_id: '10000000-0000-0000-0000-000000000001',
        name: 'Mahakoshal Mobile Hub',
        address_line: 'Shop 12, Main Cantt Market, Sadar',
        locality: 'SADAR',
        pincode: '482001',
        phone: '+919425188410',
        trade_license_number: 'JMC/TL/2024/0912',
        is_verified: true,
        commission_percent: 20.0
      },
      {
        id: '20000000-0000-0000-0000-000000000002',
        owner_id: '10000000-0000-0000-0000-000000000002',
        name: 'Narmada Gadget Point',
        address_line: 'Clock Tower Square, Russell Chowk',
        locality: 'RUSSELL_CHOWK',
        pincode: '482002',
        phone: '+919826133221',
        trade_license_number: 'JMC/TL/2023/1104',
        is_verified: true,
        commission_percent: 20.0
      },
      {
        id: '20000000-0000-0000-0000-000000000003',
        owner_id: '10000000-0000-0000-0000-000000000003',
        name: 'Sanskriti Cellular Gallery',
        address_line: 'Gorakhpur Main Road near Gurandi',
        locality: 'GORAKHPUR',
        pincode: '482001',
        phone: '+919755512398',
        trade_license_number: 'JMC/TL/2024/0442',
        is_verified: true,
        commission_percent: 20.0
      },
      {
        id: '20000000-0000-0000-0000-000000000004',
        owner_id: '10000000-0000-0000-0000-000000000004',
        name: 'Marble City Electronics',
        address_line: 'Golbazar Commercial Complex, Wright Town',
        locality: 'WRIGHT_TOWN',
        pincode: '482002',
        phone: '+919300088712',
        trade_license_number: 'JMC/TL/2022/8821',
        is_verified: true,
        commission_percent: 20.0
      }
    ];

    for (const shop of shopsData) {
      this.shops.set(shop.id, shop);
    }

    // Physical Devices with SHA-256 IMEI hashes (never raw)
    const devicesData: PhysicalDevice[] = [
      {
        id: '30000000-0000-0000-0000-000000000001',
        shop_id: '20000000-0000-0000-0000-000000000001',
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        imei_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        serial_number: 'FK2W3L89N7',
        battery_health: 98,
        condition_grade: 'MINT',
        is_active: true
      },
      {
        id: '30000000-0000-0000-0000-000000000002',
        shop_id: '20000000-0000-0000-0000-000000000002',
        brand: 'Samsung',
        model: 'Galaxy S24 Ultra',
        imei_hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        serial_number: 'RF8N10A2B3C',
        battery_health: 100,
        condition_grade: 'MINT',
        is_active: true
      },
      {
        id: '30000000-0000-0000-0000-000000000003',
        shop_id: '20000000-0000-0000-0000-000000000003',
        brand: 'Google',
        model: 'Pixel 8 Pro',
        imei_hash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
        serial_number: '38191FDH3001',
        battery_health: 96,
        condition_grade: 'EXCELLENT',
        is_active: true
      },
      {
        id: '30000000-0000-0000-0000-000000000004',
        shop_id: '20000000-0000-0000-0000-000000000004',
        brand: 'OnePlus',
        model: 'OnePlus 12',
        imei_hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        serial_number: 'OP1298418A',
        battery_health: 99,
        condition_grade: 'MINT',
        is_active: true
      }
    ];

    for (const d of devicesData) {
      this.devices.set(d.id, d);
    }
  }

  logAudit(table: string, action: string, recordId: string) {
    this.auditLogs.push({
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      table,
      action,
      recordId,
      timestamp: new Date().toISOString()
    });
  }
}

export const db = new MemoryStore();
