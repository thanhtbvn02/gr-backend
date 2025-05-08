const express = require('express');
const svgCaptcha = require('svg-captcha');

const router = express.Router();

router.get('/', (req, res) => {
  const captcha = svgCaptcha.create({
    noise: 3,
    color: true,
    background: '#ccdefc'
  });
  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
});

router.post('/verify-captcha', (req, res) => {
  const userCaptcha = req.body.captcha;
  const sessionCaptcha = req.session.captcha;

  if (!userCaptcha || !sessionCaptcha) {
    return res.status(400).json({ success: false, message: 'Captcha missing' });
  }

  if (userCaptcha.toLowerCase() === sessionCaptcha.toLowerCase()) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});


module.exports = router;
