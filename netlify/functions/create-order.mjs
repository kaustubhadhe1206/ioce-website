import { getRazorpayConfig } from './_lib/config.mjs';
import { jsonResponse, methodNotAllowed } from './_lib/response.mjs';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return methodNotAllowed();

  const { configured, keyId, keySecret, amountInPaise } = getRazorpayConfig();
  if (!configured) {
    return jsonResponse(200, {
      configured: false,
      message: 'Online payment is not yet enabled. Our team will contact you directly to arrange payment.',
    });
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `ioce_${Date.now()}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return jsonResponse(502, { configured: true, error: 'razorpay_order_failed', detail });
    }

    const order = await res.json();
    return jsonResponse(200, {
      configured: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    return jsonResponse(500, { configured: true, error: err.message });
  }
};
