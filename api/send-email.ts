import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { fullName, email, registrationType, passOrTier, referenceId, organization, phone, passId, tier, delegateName, token, honeypot } = req.body || {};

    // Honeypot check
    if (honeypot) {
      return res.status(200).json({ success: true });
    }

    const targetEmail = email || req.body.delegateEmail;
    const targetName = fullName || delegateName;

    if (!targetName || typeof targetName !== 'string' || !targetEmail || typeof targetEmail !== 'string') {
      return res.status(400).json({ error: 'Missing required fields: fullName/delegateName and email' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    const cleanName = escapeHtml(targetName.trim().substring(0, 200));
    const cleanEmail = targetEmail.trim().toLowerCase().substring(0, 200);

    const apiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'BMIC 2026 Secretariat <info@bmic.co.bw>';

    if (!apiKey) {
      console.warn('RESEND_API_KEY environment variable is not configured.');
      return res.status(200).json({ success: true, warning: 'Email simulated (RESEND_API_KEY not set)' });
    }

    const resend = new Resend(apiKey);

    let subject = '';
    let textContent = '';
    let htmlContent = '';

    if (passId) {
      const cleanPassId = escapeHtml(passId.trim());
      const cleanTier = escapeHtml((tier || passOrTier || 'General Pass').trim());
      const cleanOrg = escapeHtml((req.body.organizationName || '').trim());
      const passImageBase64 = req.body.passImageBase64 || '';

      subject = `BMIC 2026 Official Congress Pass – ${cleanPassId}`;

      textContent = `
Official Congress Pass - BMIC 2026
------------------------------------------------
Dear ${cleanName},

Your official pass for the Botswana Mobile Innovation Congress (BMIC 2026) has been issued.

Pass ID: ${cleanPassId}
Tier: ${cleanTier}
Delegate: ${cleanName} ${cleanOrg ? `(${cleanOrg})` : ''}
Venue: Royal Aria Conference Centre, Plenary Hall
Date: 30 October 2026

Your official digital pass image is attached to this email and displayed below. Please present this pass at the registration desk upon arrival.

Contact: info@bmic.co.bw | Botswana Mobile Innovation Congress 2026
      `.trim();

      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>BMIC 2026 Official Congress Pass</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050B14; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="650" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A1128; border: 1px solid #1F2D52; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
          <!-- Header Banner -->
          <tr>
            <td align="center" style="padding: 28px 24px 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <span style="font-size: 11px; font-weight: bold; color: #ffffff; letter-spacing: 2px; display: block; margin-bottom: 4px;">BOTSWANA MOBILE &amp; INTERNET CONGRESS</span>
              <span style="font-size: 13px; font-weight: bold; color: #6AA5EE; letter-spacing: 1px; display: block;">BMIC 2026 OFFICIAL PASS</span>
            </td>
          </tr>
          <!-- Greeting -->
          <tr>
            <td style="padding: 24px 32px 16px 32px;">
              <p style="margin: 0 0 12px 0; font-size: 15px; color: #E2E8F0;">
                Dear <strong style="color: #ffffff;">${cleanName}</strong>,
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #9AA6C4;">
                Your official congress pass has been generated. You can view your pass below or use the attached image file when checking in at the Royal Aria Conference Centre.
              </p>
            </td>
          </tr>
          <!-- Actual Pass Image Display -->
          <tr>
            <td align="center" style="padding: 16px 32px 28px 32px;">
              ${
                passImageBase64
                  ? `<img src="${passImageBase64}" alt="BMIC 2026 Official Pass" width="586" style="display: block; width: 100%; max-width: 586px; height: auto; border-radius: 12px; border: 1px solid #2F4275; box-shadow: 0 8px 24px rgba(0,0,0,0.5);" />`
                  : `<div style="padding: 40px; background-color: #0E1C38; border-radius: 12px; color: #6AA5EE; font-family: monospace;">Pass ID: ${cleanPassId} (${cleanTier})</div>`
              }
            </td>
          </tr>
          <!-- Details & Instructions -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0E1C38; border: 1px solid rgba(47, 109, 181, 0.3); border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="font-size: 13px; color: #B8C2D6; line-height: 1.6;">
                    <strong style="color: #ffffff; display: block; margin-bottom: 6px;">Important Information:</strong>
                    &bull; <strong>Date:</strong> 30 October 2026<br>
                    &bull; <strong>Venue:</strong> Royal Aria Conference Centre, Plenary Hall<br>
                    &bull; <strong>Pass ID:</strong> <span style="font-family: monospace; color: #6AA5EE;">${cleanPassId}</span><br>
                    &bull; Present the QR code on your pass at the registration kiosk upon arrival.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #070D18; padding: 20px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #8A99AD;">
              <p style="margin: 0 0 4px 0;">Botswana Mobile Innovation Congress 2026 &middot; Gaborone, Botswana</p>
              <p style="margin: 0;">Support: <a href="mailto:info@bmic.co.bw" style="color: #6AA5EE; text-decoration: none;">info@bmic.co.bw</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim();
    } else {
      const passType = escapeHtml((registrationType || passOrTier || 'General Delegate Pass').trim().substring(0, 150));
      const refId = escapeHtml((referenceId || 'BMIC-2026-REF').trim().substring(0, 100));
      subject = `BMIC 2026 Registration Received – Ref ${refId}`;


    const textContent = `
Reservation Received - BMIC 2026
------------------------------------------------
Dear ${fullName},

Thank you for registering for the Botswana Mobile Innovation Congress (BMIC 2026).
Your reservation for "${passType}" has been successfully logged with the Secretariat.

Organization: ${organization || 'N/A'}
Phone: ${phone || 'N/A'}

Payment Methods:
- E-Wallet/Pay2Cell: +26771843386
- Orange Money: +26772846420
- Mascom MyZaka: +26771843386

Contact: info@bmic.co.bw | Botswana Mobile Innovation Congress 2026
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>BMIC 2026 Reservation Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050B14; padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A1428; border: 1px solid rgba(47, 109, 181, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #070D18; padding: 32px 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: -0.5px;">Botswana Mobile Innovation Congress</h1>
              <p style="margin: 0; font-size: 11px; font-family: monospace; color: #6AA5EE; text-transform: uppercase; letter-spacing: 1px;">BMIC 2026 Official Confirmation</p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: bold; color: #ffffff;">Reservation Received</h2>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #B8C2D6;">
                Dear <strong style="color: #ffffff;">${cleanName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #B8C2D6;">
                Thank you for your registration. Your booking for <strong style="color: #6AA5EE;">${passType}</strong> has been successfully logged with the Secretariat.
              </p>

              <!-- Payment Methods -->
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">Payment Methods</h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0E1C38; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px; font-size: 13px; color: #B8C2D6; line-height: 1.8;">
                    <strong>E-Wallet/Pay2Cell:</strong> +26771843386<br>
                    <strong>Orange Money:</strong> +26772846420<br>
                    <strong>Mascom MyZaka:</strong> +26771843386
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #070D18; padding: 24px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #8A99AD;">
              <p style="margin: 0 0 6px 0;">Botswana Mobile Innovation Congress 2026</p>
              <p style="margin: 0;">For inquiries contact: <a href="mailto:info@bmic.co.bw" style="color: #6AA5EE; text-decoration: none;">info@bmic.co.bw</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
    }

    const attachments: any[] = [];
    if (passId && req.body.passImageBase64) {
      const base64Data = req.body.passImageBase64.replace(/^data:image\/png;base64,/, '');
      attachments.push({
        filename: `BMIC-2026-Pass-${passId.trim()}.png`,
        content: Buffer.from(base64Data, 'base64'),
      });
    }

    const emailPayload: any = {
      from: emailFrom,
      to: [cleanEmail],
      subject,
      html: htmlContent,
      text: textContent,
    };

    if (attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    const result = await resend.emails.send(emailPayload);

    return res.status(200).json({ success: true, id: result.data?.id });
  } catch (error: any) {
    console.error('Serverless email error:', error);
    return res.status(500).json({ error: 'Failed to send confirmation email' });
  }
}
