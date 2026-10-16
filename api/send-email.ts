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
      const cleanBookingRef = escapeHtml((req.body.bookingId || '').replace('reg_', '').toUpperCase());
      const isMagentaTier = cleanTier.toLowerCase().includes('corporate delegate') || cleanTier.toLowerCase().includes('corp');
      const pillBg = isMagentaTier ? '#E0245E' : '#2F6FBA';
      const accentColor = isMagentaTier ? '#FF6B9A' : '#6AA5EE';
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(cleanPassId)}`;

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

Please present this Pass ID or QR code at the registration desk upon arrival.

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
        <!-- Main Ticket Card Table -->
        <table width="640" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A1128; border: 1px solid #1F2D52; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
          <tr>
            <!-- Left Ticket Body -->
            <td style="padding: 32px; vertical-align: top;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: bold; color: #ffffff; letter-spacing: 1px; display: block;">BOTSWANA MOBILE &amp; INTERNET</span>
                    <span style="font-size: 11px; font-weight: bold; color: #6AA5EE; letter-spacing: 1px; display: block;">CONGRESS</span>
                  </td>
                  <td align="right">
                    <span style="background-color: ${pillBg}; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                      ${cleanTier}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Date & Location -->
              <div style="font-size: 10px; font-family: monospace; color: #8A97B8; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 18px; margin-bottom: 24px;">
                30 OCTOBER 2026 &middot; GABORONE, BOTSWANA
              </div>

              <!-- Delegate Info -->
              <div style="margin-bottom: 24px;">
                <span style="font-size: 9px; font-family: monospace; color: #8A97B8; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 4px;">DELEGATE</span>
                <h2 style="margin: 0; font-size: 24px; font-weight: 500; color: #ffffff; letter-spacing: -0.5px;">${cleanName}</h2>
                ${cleanOrg ? `<div style="font-size: 13px; color: #9AA6C4; margin-top: 2px;">${cleanOrg}</div>` : ''}
              </div>

              <!-- Divider -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="border-top: 1px solid #24366A; font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>

              <!-- Info Grid -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-bottom: 16px; padding-right: 12px;">
                    <span style="font-size: 9px; font-family: monospace; color: #8A97B8; text-transform: uppercase; display: block; margin-bottom: 2px;">VENUE</span>
                    <span style="font-size: 12px; color: #ffffff; font-weight: 500; line-height: 1.4; display: block;">Royal Aria Conference Centre, Plenary Hall</span>
                  </td>
                  <td width="50%" style="vertical-align: top; padding-bottom: 16px; padding-left: 12px;">
                    <span style="font-size: 9px; font-family: monospace; color: #8A97B8; text-transform: uppercase; display: block; margin-bottom: 2px;">PASS ID</span>
                    <span style="font-size: 12px; font-family: monospace; color: ${accentColor}; font-weight: bold; display: block;">${cleanPassId}</span>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 12px;">
                    <span style="font-size: 9px; font-family: monospace; color: #8A97B8; text-transform: uppercase; display: block; margin-bottom: 2px;">ACCESS</span>
                    <span style="font-size: 11px; color: #ffffff; line-height: 1.4; display: block;">Full congress and exhibition access</span>
                  </td>
                  <td width="50%" style="vertical-align: top; padding-left: 12px;">
                    <span style="font-size: 9px; font-family: monospace; color: #8A97B8; text-transform: uppercase; display: block; margin-bottom: 2px;">BOOKING REF</span>
                    <span style="font-size: 11px; font-family: monospace; color: #ffffff; display: block;">#${cleanBookingRef || 'BMIC2026'}</span>
                  </td>
                </tr>
              </table>
            </td>

            <!-- Right Ticket Stub -->
            <td width="190" style="background-color: #0D1736; border-left: 1px dashed #3B4A78; padding: 28px 20px; vertical-align: middle; text-align: center;">
              <span style="font-size: 10px; font-family: monospace; font-weight: bold; color: #FF6B9A; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 16px;">ADMIT ONE</span>
              
              <!-- QR Code Box -->
              <table align="center" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; padding: 8px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                <tr>
                  <td align="center">
                    <img src="${qrUrl}" alt="Pass QR Code" width="115" height="115" style="display: block; border-radius: 6px;" />
                  </td>
                </tr>
              </table>

              <span style="font-size: 10px; color: #ffffff; display: block; margin-bottom: 2px;">Scan at registration</span>
              <span style="font-size: 9px; font-family: monospace; color: #8A97B8; display: block; margin-bottom: 12px; word-break: break-all;">${cleanPassId}</span>

              <!-- Status Pill -->
              <table align="center" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(47, 109, 181, 0.2); border: 1px solid rgba(47, 109, 181, 0.4); border-radius: 6px;">
                <tr>
                  <td style="padding: 4px 12px; font-size: 9px; font-family: monospace; font-weight: bold; color: #6AA5EE; text-transform: uppercase; letter-spacing: 1px;">
                    VALID PASS
                  </td>
                </tr>
              </table>
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
