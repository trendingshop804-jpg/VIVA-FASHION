import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Cashfree Server API Proxy plugin to execute server-to-server requests without browser CORS
function cashfreeApiPlugin(): Plugin {
  const APP_ID = import.meta.env.VITE_CASHFREE_APP_ID || '';
  const SECRET_KEY = import.meta.env.VITE_CASHFREE_SECRET_KEY || '';
  const API_VERSION = '2023-08-01';

  return {
    name: 'cashfree-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/create-cashfree-order' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const orderData = JSON.parse(body);

              // Cashfree Production API enforces HTTPS return_url and valid payment_methods keywords
              if (orderData.order_meta) {
                if (orderData.order_meta.return_url) {
                  if (orderData.order_meta.return_url.startsWith('http://')) {
                    orderData.order_meta.return_url = orderData.order_meta.return_url.replace('http://', 'https://');
                  }
                  // Remove deprecated order_token parameter
                  orderData.order_meta.return_url = orderData.order_meta.return_url
                    .replace('&order_token={order_token}', '')
                    .replace('?order_token={order_token}&', '?')
                    .replace('?order_token={order_token}', '')
                    .replace('{order_token}', '');
                }
                if (orderData.order_meta.notify_url && orderData.order_meta.notify_url.startsWith('http://')) {
                  orderData.order_meta.notify_url = orderData.order_meta.notify_url.replace('http://', 'https://');
                }
                if (orderData.order_meta.payment_methods && typeof orderData.order_meta.payment_methods === 'string') {
                  orderData.order_meta.payment_methods = orderData.order_meta.payment_methods.replace('wallet', 'app');
                }
              }

              // Target URL depending on environment or secret key
              const isProd = SECRET_KEY.startsWith('cfsk_ma_prod_');
              const cfBaseUrl = isProd
                ? 'https://api.cashfree.com/pg/orders'
                : 'https://sandbox.cashfree.com/pg/orders';

              const cfResponse = await fetch(cfBaseUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-client-id': APP_ID,
                  'x-client-secret': SECRET_KEY,
                  'x-api-version': API_VERSION,
                },
                body: JSON.stringify(orderData),
              });

              const data = await cfResponse.json();
              res.writeHead(cfResponse.status, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err?.message || 'Failed to create Cashfree order on server' }));
            }
          });
          return;
        }

        if (req.url?.startsWith('/api/cashfree-order-status/') && req.method === 'GET') {
          const orderId = req.url.replace('/api/cashfree-order-status/', '');
          try {
            const isProd = SECRET_KEY.startsWith('cfsk_ma_prod_');
            const cfBaseUrl = isProd
              ? `https://api.cashfree.com/pg/orders/${orderId}`
              : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

            const cfResponse = await fetch(cfBaseUrl, {
              method: 'GET',
              headers: {
                'x-client-id': APP_ID,
                'x-client-secret': SECRET_KEY,
                'x-api-version': API_VERSION,
              },
            });

            const data = await cfResponse.json();
            res.writeHead(cfResponse.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err?.message || 'Failed to fetch Cashfree order status' }));
          }
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cashfreeApiPlugin(),
  ],
})
