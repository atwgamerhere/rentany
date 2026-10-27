// ==============================================================================
// RENTANY BACKEND: ENVIRONMENT CONFIGURATION
// Validates runtime environment parameters for Supabase and Payment Gateway
// ==============================================================================

import * as fs from 'fs';
import * as path from 'path';

// Native .env file loader for Node without external dependencies
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }
} catch {
  // Silent fallback to system process.env
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  platformCommissionPercent: number;
}

export function loadConfig(): AppConfig {
  const config: AppConfig = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    supabaseUrl: process.env.SUPABASE_URL || 'https://jabalpurrent.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'mock-anon-key-jabalpur',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key',
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_jabalpur',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key',
    platformCommissionPercent: 20.0, // Strict 20% platform commission
  };

  return config;
}

export const config = loadConfig();
