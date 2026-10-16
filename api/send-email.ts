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
    const { fullName, email, registrationType, passOrTier, referenceId, organization, phone, notes, honeypot } = req.body || {};

    // Honeypot check
    if (honeypot) {
      return res.status(200).json({ success: true });
    }

    if (!fullName || typeof fullName !== 'string' || !email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Missing required fields: fullName and email' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    const cleanName = escapeHtml(fullName.trim().substring(0, 200));
    const cleanEmail = email.trim().toLowerCase().substring(0, 200);
    const passType = escapeHtml((registrationType || passOrTier || 'General Delegate Pass').trim().substring(0, 150));
    const refId = escapeHtml((referenceId || 'BMIC-2026-REF').trim().substring(0, 100));

    const apiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'BMIC 2026 Secretariat <info@bmic.co.bw>';

    if (!apiKey) {
      console.warn('RESEND_API_KEY environment variable is not configured.');
      return res.status(200).json({ success: true, warning: 'Email simulated (RESEND_API_KEY not set)' });
    }

    const resend = new Resend(apiKey);
    const subject = `BMIC 2026 Registration Received – Ref ${refId}`;

    const textContent = `
Reservation Received - BMIC 2026
------------------------------------------------
Dear ${fullName},

Thank you for registering for the Botswana Mobile Innovation Congress (BMIC 2026).
Your reservation for "${passType}" has been successfully logged with the Secretariat.

Reference ID: ${refId}
Reference Number: ${req.body.referenceNumber || 'N/A'}
Organization: ${organization || 'N/A'}
Phone: ${phone || 'N/A'}

Payment Methods:
- E-Wallet/Pay2Cell: +26771843386
- Orange Money: +26772846420
- Mascom MyZaka: +26771843386

An official VAT invoice and proforma will be sent to your email address, and scannable congress pass credentials will be issued once payment is confirmed or the purchase order is verified.

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

              <!-- Reference Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0E1C38; border: 1px solid rgba(47,109,181,0.4); border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <span style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #6AA5EE; display: block; margin-bottom: 4px;">Secretariat Reference ID</span>
                    <span style="font-size: 18px; font-family: monospace; font-weight: bold; color: #ffffff; letter-spacing: 1px;">${refId}</span>
                  </td>
                </tr>
              </table>

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


              <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #B8C2D6;">
                An official VAT invoice and proforma will be sent to your email address, and scannable congress pass credentials will be issued once payment is confirmed or the purchase order is verified.
              </p>
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

    const result = await resend.emails.send({
      from: emailFrom,
      to: [cleanEmail],
      subject,
      html: htmlContent,
      text: textContent,
    });

    return res.status(200).json({ success: true, id: result.data?.id });
  } catch (error: any) {
    console.error('Serverless email error:', error);
    return res.status(500).json({ error: 'Failed to send confirmation email' });
  }
}
