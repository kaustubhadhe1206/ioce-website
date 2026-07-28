import crypto from 'node:crypto';
import { getEmailConfig, getWhatsappConfig, getSheetsConfig } from './config.mjs';

export async function sendConfirmationEmail(lead) {
  const { configured, apiKey, fromEmail } = getEmailConfig();
  if (!configured) return { sent: false, reason: 'not_configured' };

  const html = `
    <div style="font-family: Arial, sans-serif; background:#0F172A; color:#ffffff; padding:32px;">
      <h1 style="color:#C9A227; font-size:22px;">Welcome To Your Transformation Journey</h1>
      <p>Dear ${lead.fullName},</p>
      <p>Thank you for placing your trust in IOCE. Your consultation has been successfully reserved.</p>
      <h3 style="color:#C9A227;">Consultation Summary</h3>
      <ul>
        <li>Mode: ${lead.consultationMode}</li>
        <li>City: ${lead.city}</li>
        <li>Focus area: ${lead.helpWith}</li>
      </ul>
      <p>Every consultation is personally conducted by Grand Master Prashant. Your information remains completely confidential. Our team will contact you shortly to confirm your scheduling.</p>
      <p style="margin-top:24px; color:#8792a6; font-size:12px;">Institute Of Consciousness Engineering — An Initiative of ChemBridge Global</p>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: lead.email,
      subject: 'Welcome To Your Transformation Journey — IOCE',
      html,
    }),
  });

  return { sent: res.ok, reason: res.ok ? undefined : `email_provider_error_${res.status}` };
}

export async function sendWhatsappConfirmation(lead) {
  const { configured, token, phoneNumberId } = getWhatsappConfig();
  if (!configured) return { sent: false, reason: 'not_configured' };

  const message =
    `Namaste.\n\nThank you for choosing IOCE.\n\nYour consultation has been successfully confirmed.\n\n` +
    `Our team will contact you shortly to schedule your preferred consultation.\n\nWarm Regards\nInstitute Of Consciousness Engineering\nAn Initiative of ChemBridge Global`;

  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: lead.mobile,
      type: 'text',
      text: { body: message },
    }),
  });

  return { sent: res.ok, reason: res.ok ? undefined : `whatsapp_provider_error_${res.status}` };
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

export async function saveLeadToSheet(lead, paymentInfo) {
  const { configured, clientEmail, privateKey, sheetId } = getSheetsConfig();
  if (!configured) return { sent: false, reason: 'not_configured' };

  try {
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    const row = [
      new Date().toISOString(),
      lead.fullName,
      lead.mobile,
      lead.email,
      lead.city,
      lead.country || '',
      lead.consultationMode,
      lead.helpWith,
      paymentInfo?.razorpayPaymentId || 'pending',
      paymentInfo?.status || 'lead_captured',
    ];

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [row] }),
      }
    );

    return { sent: res.ok, reason: res.ok ? undefined : `sheets_api_error_${res.status}` };
  } catch (err) {
    return { sent: false, reason: err.message };
  }
}
