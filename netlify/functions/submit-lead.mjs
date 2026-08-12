import { jsonResponse, methodNotAllowed } from './_lib/response.mjs';
import { sendConfirmationEmail, sendAdminNotification, sendWhatsappConfirmation } from './_lib/notify.mjs';
import { updateLeadRow } from './_lib/sheetsClient.mjs';

/**
 * Confirms a lead without going through Razorpay. Two distinct callers
 * land here: the free 15-minute plan, which is intentionally never
 * supposed to see a payment step, and the fallback used when Razorpay
 * isn't configured yet at all. Both fire the same confirmation channels
 * and update the existing lead row (created back when the form was
 * submitted) rather than inserting a duplicate — `reason` just picks the
 * accurate status text for the sheet.
 */
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return methodNotAllowed();

  const { lead, leadId, rowNumber, reason } = JSON.parse(event.body || '{}');
  const paymentInfo = {
    status: reason === 'free_plan' ? 'not_required (15-min free plan)' : 'reserved_pending_payment_setup',
  };

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
