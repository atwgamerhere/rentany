// ==============================================================================
// RENTANY BACKEND: APPLICATION SERVER ENTRYPOINT
// Lightweight HTTP server using standard Node.js APIs (zero framework bloat)
// ==============================================================================

import * as http from 'node:http';
import { config } from './config/env.ts';
import { getPublicCatalog } from './modules/catalog.ts';
import { listShops } from './modules/shops.ts';

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  // Route: Health check
  if (url.pathname === '/health' || url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'rentany-backend', region: 'ap-south-1', timestamp: new Date().toISOString() }));
    return;
  }

  // Route: Public Catalog
  if (url.pathname === '/api/catalog') {
    const brand = url.searchParams.get('brand') || undefined;
    const locality = url.searchParams.get('locality') || undefined;
    const catalog = getPublicCatalog({ brand, locality });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ count: catalog.length, catalog }));
    return;
  }

  // Route: Shops
  if (url.pathname === '/api/shops') {
    const locality = url.searchParams.get('locality') || undefined;
    const shops = listShops({ locality, verifiedOnly: true });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ count: shops.length, shops }));
    return;
  }

  // Default 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(config.port, () => {
    console.log(`🏛️ RENTANY API Server running on port ${config.port} (${config.nodeEnv})`);
  });
}

export { server };
