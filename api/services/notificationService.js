const sendSMS = async (to, body) => {
  console.log(`[SMS SEND] To: ${to} | Message: ${body}`);
  return true;
};

const sendEmail = async (to, subject, html) => {
  console.log(`[EMAIL SEND] To: ${to} | Subject: ${subject}`);
  return true;
};

const sendWhatsApp = async (to, body) => {
  console.log(`[WHATSAPP SEND] To: ${to} | Message: ${body}`);
  return true;
};

module.exports = { sendSMS, sendEmail, sendWhatsApp };
