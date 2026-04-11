const twilio = require('twilio');

let smsClient;

function isPhoneOtpConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
  );
}

function getSmsClient() {
  if (!isPhoneOtpConfigured()) {
    throw new Error(
      'Phone OTP is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in backend/.env'
    );
  }

  if (smsClient) {
    return smsClient;
  }

  smsClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return smsClient;
}

async function sendPhoneVerificationOtp({ toPhone, otp }) {
  const client = getSmsClient();

  await client.messages.create({
    body: `Your RASU verification code is ${otp}. It expires in 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${toPhone}`,
  });
}

module.exports = {
  isPhoneOtpConfigured,
  sendPhoneVerificationOtp,
};