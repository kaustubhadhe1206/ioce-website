import crypto from 'node:crypto';
import { getSheetsConfig } from './config.mjs';

const SHEET_TAB = 'Sheet1';

// Fixed column layout — keep this in sync with the sheet's header row.
const COLUMNS = {
  leadId: 'A',
  submittedAt: 'B',
  fullName: 'C',
  mobile: 'D',
  email: 'E',
  city: 'F',
  country: 'G',
  consultationMode: 'H',
  helpWith: 'I',
  meetingScheduled: 'J',
  calendlyLink: 'K',
  paymentStatus: 'L',
  razorpayPaymentId: 'M',
};

// Millisecond timestamp + a short random suffix: sortable/readable like a
// plain timestamp, but collision-proof if two people submit in the same ms.
export function generateLeadId() {
  return `${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
}

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

async function getGoogleAccessToken(clientEmail, privateKey) {
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const claims = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${claims}`;
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(privateKey, 'base64url');
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) throw new Error(`google_token_error_${res.status}`);
  const data = await res.json();
  return data.access_token;
}

/**
 * Inserts a new row the moment a visitor submits the consultation form —
 * before scheduling or payment happen — so drop-offs are still visible in
 * the sheet, not just completed bookings. Meeting/payment columns start
 * blank/pending and get filled in by updateLeadRow() as they progress.
 */
export async function createLeadRow(lead) {
  const { configured, clientEmail, privateKey, sheetId } = getSheetsConfig();
  if (!configured) return { sent: false, reason: 'not_configured' };

  try {
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    const leadId = generateLeadId();
    const row = [
      leadId,
      new Date().toISOString(),
      lead.fullName,
      lead.mobile,
      lead.email,
      lead.city,
      lead.country || '',
      lead.consultationMode,
      lead.helpWith,
      'No',
      '',
      'pending',
      '',
    ];

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_TAB}!A1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [row] }),
      }
    );

    if (!res.ok) return { sent: false, reason: `sheets_api_error_${res.status}` };

    const data = await res.json();
    // updatedRange looks like "Sheet1!A7:M7" — pull the row number out of it
    // so later updates can target this row directly without a fresh search.
    const match = /![A-Z]+(\d+):/.exec(data.updates?.updatedRange || '');
    const rowNumber = match ? Number(match[1]) : null;

    return { sent: true, leadId, rowNumber };
  } catch (err) {
    return { sent: false, reason: err.message };
  }
}

/**
 * Re-locates a lead's row by its ID if the given rowNumber doesn't hold
 * it any more (e.g. someone manually inserted/deleted a row in the sheet)
 * — a lightweight primary-key lookup instead of trusting the row number.
 */
async function resolveRowNumber({ accessToken, sheetId, leadId, rowNumber }) {
  if (rowNumber) {
    const cellRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_TAB}!${COLUMNS.leadId}${rowNumber}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (cellRes.ok) {
      const cellData = await cellRes.json();
      if (cellData.values?.[0]?.[0] === leadId) return rowNumber;
    }
  }

  const colRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_TAB}!${COLUMNS.leadId}:${COLUMNS.leadId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!colRes.ok) return null;
  const colData = await colRes.json();
  const rows = colData.values || [];
  const foundIndex = rows.findIndex((r) => r[0] === leadId);
  return foundIndex === -1 ? null : foundIndex + 1; // Sheets rows are 1-indexed
}

/**
 * Updates only the given fields on an existing lead's row (e.g. scheduling
 * confirmation, payment status) without touching the rest of the row.
 * `updates` keys must match the COLUMNS map above.
 */
export async function updateLeadRow({ leadId, rowNumber, updates }) {
  const { configured, clientEmail, privateKey, sheetId } = getSheetsConfig();
  if (!configured) return { sent: false, reason: 'not_configured' };
  if (!leadId || !updates || !Object.keys(updates).length) {
    return { sent: false, reason: 'nothing_to_update' };
  }

  try {
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    const resolvedRow = await resolveRowNumber({ accessToken, sheetId, leadId, rowNumber });
    if (!resolvedRow) return { sent: false, reason: 'lead_id_not_found' };

    const data = Object.entries(updates)
      .filter(([field]) => COLUMNS[field])
      .map(([field, value]) => ({
        range: `${SHEET_TAB}!${COLUMNS[field]}${resolvedRow}`,
        values: [[value]],
      }));

    if (!data.length) return { sent: false, reason: 'no_recognised_fields' };

    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ valueInputOption: 'RAW', data }),
    });

    return { sent: res.ok, reason: res.ok ? undefined : `sheets_api_error_${res.status}` };
  } catch (err) {
    return { sent: false, reason: err.message };
  }
}
