import crypto from 'node:crypto';
import { getRazorpayConfig } from './_lib/config.mjs';
import { jsonResponse, methodNotAllowed } from './_lib/response.mjs';
import { sendConfirmationEmail, sendAdminNotification, sendWhatsappConfirmation } from './_lib/notify.mjs';
import { updateLeadRow } from './_lib/sheetsClient.mjs';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return methodNotAllowed();

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, lead, leadId, rowNumber } = JSON.parse(
    event.body || '{}'
  );
  const { configured, keySecret } = getRazorpayConfig();

  if (!configured) {
    return jsonResponse(200, { configured: false, verified: false, message: 'Payments are not yet enabled.' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return jsonResponse(400, { configured: true, verified: false, error: 'signature_mismatch' });
  }

  const paymentInfo = { razorpayPaymentId: razorpay_payment_id, status: 'paid' };

  const [emailResult, adminResult, whatsappResult, sheetsResult] = await Promise.all([
    sendConfirmationEmail(lead).catch((err) => ({ sent: false, reason: err.message })),
    sendAdminNotification(lead, paymentInfo).catch((err) => ({ sent: false, reason: err.message })),
    sendWhatsappConfirmation(lead).catch((err) => ({ sent: false, reason: err.message })),
    updateLeadRow({
      leadId,
      rowNumber,
      updates: { paymentStatus: 'paid', razorpayPaymentId: razorpay_payment_id },
    }).catch((err) => ({ sent: false, reason: err.message })),
  ]);

  return jsonResponse(200, {
    configured: true,
    verified: true,
    notifications: { email: emailResult, admin: adminResult, whatsapp: whatsappResult, crm: sheetsResult },
  });
};
