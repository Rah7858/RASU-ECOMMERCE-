const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in backend/.env');
  }

  if (
    SMTP_USER === 'your_email@gmail.com' ||
    SMTP_PASS === 'your_gmail_app_password' ||
    SMTP_USER.includes('your_email@')
  ) {
    throw new Error('SMTP is still using placeholder values. Set a real Gmail address and Gmail App Password in backend/.env');
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
}

async function sendVerificationEmail({ to, name, otp }) {
  const mailer = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await mailer.sendMail({
    from,
    to,
    subject: 'RASU email verification code',
    text: `Hi ${name}, your RASU verification code is ${otp}. This code expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111;">
        <h2 style="margin-bottom:12px;">Verify your RASU account</h2>
        <p style="margin-bottom:16px;">Hi ${name}, use the verification code below to complete your signup.</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:16px 20px;background:#f5f5f5;border-radius:12px;display:inline-block;">
          ${otp}
        </div>
        <p style="margin-top:16px;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail({ to, name, otp }) {
  const mailer = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await mailer.sendMail({
    from,
    to,
    subject: 'Reset your RASU password',
    text: `Hi ${name}, your RASU password reset code is ${otp}. It expires in 15 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111;">
        <h2 style="margin-bottom:12px;">Reset your RASU password</h2>
        <p style="margin-bottom:16px;">Hi ${name}, use the code below to set a new password.</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:16px 20px;background:#f5f5f5;border-radius:12px;display:inline-block;">
          ${otp}
        </div>
        <p style="margin-top:16px;">This code expires in 15 minutes. If you did not request this, ignore the email.</p>
      </div>
    `,
  });
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};