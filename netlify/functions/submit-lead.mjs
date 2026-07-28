import { jsonResponse, methodNotAllowed } from './_lib/response.mjs';
import { sendConfirmationEmail, sendWhatsappConfirmation, saveLeadToSheet } from './_lib/notify.mjs';

/**
 * Fallback path used when Razorpay isn't configured yet: captures the
 * lead and fires the same confirmation channels, without payment.
 */
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return methodNotAllowed();

  const { lead } = JSON.parse(event.body || '{}');
  const paymentInfo = { status: 'reserved_pending_payment_setup' };

  const [emailResult, whatsappResult, sheetsResult] = await Promise.all([
    sendConfirmationEmail(lead).catch((err) => ({ sent: false, reason: err.message })),
    sendWhatsappConfirmation(lead).catch((err) => ({ sent: false, reason: err.message })),
    saveLeadToSheet(lead, paymentInfo).catch((err) => ({ sent: false, reason: err.message })),
  ]);

  return jsonResponse(200, {
    saved: true,
    notifications: { email: emailResult, whatsapp: whatsappResult, crm: sheetsResult },
  });
};
