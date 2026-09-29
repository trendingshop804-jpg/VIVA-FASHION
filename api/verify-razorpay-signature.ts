import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return res.status(500).json({ error: 'Razorpay secret not configured' });
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body || {};

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: 'Missing payment parameters' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return res.status(200).json({
      verified: generatedSignature === razorpaySignature
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || 'Signature verification failed'
    });
  }
}
