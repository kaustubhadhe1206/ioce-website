import { jsonResponse, methodNotAllowed } from './_lib/response.mjs';
import { createLeadRow } from './_lib/sheetsClient.mjs';

/**
 * Fires the moment a visitor clicks "Continue" on the consultation form —
 * before scheduling or payment happen — so the sheet captures every
 * funnel entry, not just completed bookings. Returns the leadId + row
 * number so later steps can target this exact row with updateLeadRow().
 */
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return methodNotAllowed();

  const { lead } = JSON.parse(event.body || '{}');
  const result = await createLeadRow(lead).catch((err) => ({ sent: false, reason: err.message }));

  return jsonResponse(200, { crm: result });
};
