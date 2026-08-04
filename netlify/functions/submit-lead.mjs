import { jsonResponse, methodNotAllowed } from './_lib/response.mjs';
import { sendConfirmationEmail, sendAdminNotification, sendWhatsappConfirmation } from './_lib/notify.mjs';
import { updateLeadRow } from './_lib/sheetsClient.mjs';

/**
 * Fallback path used when Razorpay isn't configured yet: fires the same
 * confirmation channels without payment, and marks the existing lead row
 * (created back when the form was submitted) as reserved-without-payment
 * rather than inserting a duplicate row.
 */
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return methodNotAllowed();

  const { lead, leadId, rowNumber } = JSON.parse(event.body || '{}');
  const paymentInfo = { status: 'reserved_pending_payment_setup' };

  const [emailResult, adminResult, whatsappResult, sheetsResult] = await Promise.all([
    sendConfirmationEmail(lead).catch((err) => ({ sent: false, reason: err.message })),
    sendAdminNotification(lead, paymentInfo).catch((err) => ({ sent: false, reason: err.message })),
    sendWhatsappConfirmation(lead).catch((err) => ({ sent: false, reason: err.message })),
    updateLeadRow({
      leadId,
      rowNumber,
      updates: { paymentStatus: paymentInfo.status },
    }).catch((err) => ({ sent: false, reason: err.message })),
  ]);

  return jsonResponse(200, {
    saved: true,
    notifications: { email: emailResult, admin: adminResult, whatsapp: whatsappResult, crm: sheetsResult },
  });
};
