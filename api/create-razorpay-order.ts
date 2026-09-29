import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({ error: 'Razorpay credentials not configured' });
    }

    const { amount, receipt, notes } = req.body || {};

    if (!amount || !receipt) {
      return res.status(400).json({ error: 'amount and receipt are required' });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt,
        notes,
      }),
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || 'Failed to create Razorpay order'
    });
  }
}
