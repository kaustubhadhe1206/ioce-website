/**
 * Every integration reads its own env vars and reports whether it's
 * configured, rather than throwing — so one missing credential never
 * breaks the whole booking flow. Fill these in Netlify's
 * Site settings -> Environment variables when ready.
 */

export function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  // Consultation fee in the smallest currency unit (paise). ₹99 default — update to the real fee.
  const amountInPaise = Number(process.env.CONSULTATION_FEE_PAISE || 9900);
  return { configured: Boolean(keyId && keySecret), keyId, keySecret, amountInPaise };
}

export function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONFIRMATION_FROM_EMAIL || 'no-reply@ioce.example.com';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  return { configured: Boolean(apiKey), apiKey, fromEmail, adminEmail };
}

export function getWhatsappConfig() {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  return { configured: Boolean(token && phoneNumberId), token, phoneNumberId };
}

export function getSheetsConfig() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  return {
    configured: Boolean(clientEmail && privateKey && sheetId),
    clientEmail,
    // Netlify env vars store literal "\n" for newlines — restore real line breaks.
    privateKey: privateKey ? privateKey.replace(/\\n/g, '\n') : undefined,
    sheetId,
  };
}
