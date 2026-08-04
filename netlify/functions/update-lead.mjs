import { jsonResponse, methodNotAllowed } from './_lib/response.mjs';
import { updateLeadRow } from './_lib/sheetsClient.mjs';

/**
 * Targeted partial update for an existing lead row — used when Calendly
 * confirms a scheduled slot, and by verify-payment/submit-lead once
 * payment completes or is skipped. Never touches columns not present
 * in `updates`.
 */
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return methodNotAllowed();

  const { leadId, rowNumber, updates } = JSON.parse(event.body || '{}');
  const result = await updateLeadRow({ leadId, rowNumber, updates }).catch((err) => ({
    sent: false,
    reason: err.message,
  }));

  return jsonResponse(200, { crm: result });
};
