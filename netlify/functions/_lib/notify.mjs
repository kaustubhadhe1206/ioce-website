import { getEmailConfig, getWhatsappConfig } from './config.mjs';

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

export async function sendAdminNotification(lead, paymentInfo) {
  const { configured, apiKey, fromEmail, adminEmail } = getEmailConfig();
  if (!configured || !adminEmail) return { sent: false, reason: 'not_configured' };

  const html = `
    <div style="font-family: Arial, sans-serif; padding:24px; color:#111;">
      <h2 style="color:#0F172A;">New Consultation Booking</h2>
      <ul style="line-height:1.8;">
        <li><strong>Name:</strong> ${lead.fullName}</li>
        <li><strong>Mobile:</strong> ${lead.mobile}</li>
        <li><strong>Email:</strong> ${lead.email}</li>
        <li><strong>City:</strong> ${lead.city}</li>
        <li><strong>Country:</strong> ${lead.country || '—'}</li>
        <li><strong>Mode:</strong> ${lead.consultationMode}</li>
        <li><strong>Preferred time:</strong> ${lead.preferredTime || '—'}</li>
        <li><strong>What they need help with:</strong> ${lead.helpWith}</li>
        <li><strong>Payment status:</strong> ${paymentInfo?.status || 'unknown'}</li>
        <li><strong>Razorpay payment ID:</strong> ${paymentInfo?.razorpayPaymentId || 'n/a'}</li>
      </ul>
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
      to: adminEmail,
      subject: `New IOCE Booking — ${lead.fullName}`,
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
