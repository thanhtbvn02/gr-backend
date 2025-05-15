const express = require('express');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { URLSearchParams } = require('url');
const envConfig = require('../config/envconfig');
const userService = require('../services/userService');

const router = express.Router();

const getGoogleConfig = () => {
  const SERVER_HOST = envConfig.serverHost;
  const client_id = envConfig.googleClientId;
  const client_secret = envConfig.googleClientSecret;
  const redirect_uri = `${SERVER_HOST}/api/auth/google/callback`;
  return { client_id, client_secret, redirect_uri };
};
// console.log(getGoogleConfig());

const getGoogleAuthUrl = () => {
  const { client_id, redirect_uri } = getGoogleConfig();
  const options = {
    redirect_uri,
    client_id,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };
  const qs = new URLSearchParams(options);
  return `https://accounts.google.com/o/oauth2/v2/auth?${qs.toString()}`;
};
// console.log(getGoogleAuthUrl());

const getGoogleToken = async (code) => {
  const { client_id, client_secret, redirect_uri } = getGoogleConfig();
  const body = new URLSearchParams({
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: 'authorization_code',
  }).toString();
  // console.log(body);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return res.json();
};

const getGoogleUser = async (code) => {
  const { id_token, access_token } = await getGoogleToken(code);
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}&alt=json`,
    {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    }
  );
  return res.json();
};

const checkGoogleUser = async (data) => {
  try {
    const user = await userService.findByEmail(data.email);
    
    if (user) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'USER_SECRET_KEY', { expiresIn: '1d' });
      return { token, isNew: false };
    } else {
      const newUser = await userService.create({
        username: data.email.split('@')[0], // Tạo username từ email
        email: data.email,
        password: null, // Người dùng Google không cần password
        full_name: data.name,
        birth_date: null,
        phone: null,
        address: null,
        role: 'user'
      });
      
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'USER_SECRET_KEY', { expiresIn: '1d' });
      return { token, isNew: true };
    }
  } catch (error) {
    throw error;
  }
};


// Route mở popup Google
router.get('/google', (req, res) => {
  const url = getGoogleAuthUrl();
  res.redirect(url);
});

// Callback từ Google
router.get('/google/callback', async (req, res) => {
  try {
    const { code, error, error_description } = req.query;
    
    if (error) {
      console.error('Google returned error:', error, error_description);
      return res.redirect(`${process.env.FRONTEND_URL}/login-failed?message=${encodeURIComponent(error_description || 'Google từ chối xác thực')}`);
    }
    
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/login-failed?message=Mã code không tồn tại từ Google`);
    }
    
    const userData = await getGoogleUser(code);
    
    if (!userData || !userData.email) {
      console.error('Không lấy được dữ liệu người dùng từ Google:', userData);
      return res.redirect(`${process.env.FRONTEND_URL}/login-failed?message=Không lấy được thông tin người dùng`);
    }
    
    const { token, isNew } = await checkGoogleUser(userData);
    
    return res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}&isNew=${isNew}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/login-failed?message=${encodeURIComponent(error.message || 'Xác thực thất bại')}`);
  }
});



module.exports = router;
