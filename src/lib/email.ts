import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailParams): Promise<{ success: boolean; info?: any; error?: any }> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"The Student Spot" <no-reply@thestudentspot.com>`;

  // Fallback to console logs if environment variables are not set
  if (!host || !user || !pass) {
    console.log(`
======================================================
[MOCK EMAIL GATEWAY - MOCK SMTP FALLBACK]
To: ${to}
Subject: ${subject}
Body:
${text}
======================================================
    `);
    return { success: true, info: 'Mock email printed to console.' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    });

    console.log(`[EMAIL DISPATCH] Real email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, info };
  } catch (error: any) {
    console.error('[EMAIL ERROR] Failed to send real SMTP email:', error);
    return { success: false, error: error.message };
  }
}
