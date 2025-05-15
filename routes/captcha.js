const express = require('express');
const axios = require('axios');
const router = express.Router();
const envConfig = require('../config/envconfig');

// Verify Google reCAPTCHA v2 token
router.post('/verify-captcha', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Captcha token missing' });
  }
  try {
    const secretKey = envConfig.captchaSecretKey;
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      { params: { secret: secretKey, response: token } }
    );
    const { success } = response.data;
    if (success) {
      return res.json({ success: true });
    }
    return res.status(400).json({ success: false, message: 'Captcha verification failed' });
  } catch (error) {
    console.error('Captcha verification error:', error);
    return res.status(500).json({ success: false, message: 'Error verifying captcha' });
  }
});

module.exports = router;