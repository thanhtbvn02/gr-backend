// utils/sendMail.js
require('dotenv').config();
const envConfig = require('../config/envconfig');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,           
  auth: {
    user: envConfig.email,           
    pass: envConfig.emailPassword
  },
  debug: true,   
  tls: {
    rejectUnauthorized: false   
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error('❌ SMTP connection error:', err);
  } else {
    console.log('✅ SMTP ready to send messages');
  }
});
async function sendMail({ to, subject, html, text }) {
  const mailOptions = {
    from: `"Shop drug" <no-reply@shopdrug.com}>`,
    to,
    subject,
    html,
    ...(text && { text }),
  };
  return transporter.sendMail(mailOptions);
}

module.exports = sendMail;