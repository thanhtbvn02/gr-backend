const express = require("express");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { URLSearchParams } = require("url");
const envConfig = require("../config/envconfig");
const userService = require("../services/userService");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

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
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
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
    grant_type: "authorization_code",
  }).toString();
  // console.log(body);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
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
    let user = await userService.findByEmail(data.email);
    let username,
      passwordPlain,
      hashed,
      sendCredentials = false;

    // Nếu user chưa có, tạo mới
    if (!user) {
      username = data.email.split("@")[0];
      passwordPlain = crypto.randomBytes(5).toString("hex");
      hashed = await bcrypt.hash(passwordPlain, 10);

      user = await userService.create({
        username,
        email: data.email,
        password: hashed,
        full_name: data.name,
        birth_date: null,
        phone: null,
        address: null,
        role: "user",
      });

      sendCredentials = true;
    } else {
      // Nếu user đã có nhưng thiếu username hoặc password
      let updateData = {};
      if (!user.username) {
        updateData.username = data.email.split("@")[0];
        username = updateData.username;
        sendCredentials = true;
      } else {
        username = user.username;
      }
      if (!user.password) {
        passwordPlain = crypto.randomBytes(5).toString("hex");
        updateData.password = await bcrypt.hash(passwordPlain, 10);
        sendCredentials = true;
      }
      if (Object.keys(updateData).length) {
        await userService.updateUserInfo(user.id, updateData);
      }
    }

    // Gửi email nếu vừa tạo user hoặc vừa sinh username/password
    if (sendCredentials) {
      let html = `<p>Tài khoản của bạn đã được tạo/thêm thông tin thành công.</p>
      <p><b>Username:</b> ${username}</p>
      <p><b>Password:</b> ${
        passwordPlain ||
        "[đã có sẵn, vui lòng dùng Google đăng nhập hoặc đặt lại nếu quên]"
      }</p>
      <p>Hãy đăng nhập và đổi lại mật khẩu nếu muốn!</p>
      `;
      await sendMail({
        to: data.email,
        subject: "Thông tin tài khoản Shop",
        html,
      });
    }

    // Lấy lại user để đảm bảo có đủ info
    const userAfter = await userService.findByEmail(data.email);

    const token = jwt.sign(
      { userId: userAfter.id, role: userAfter.role },
      process.env.JWT_SECRET || "USER_SECRET_KEY",
      { expiresIn: "1d" }
    );
    return { token, isNew: !user };
  } catch (error) {
    throw error;
  }
};

router.get("/google", (req, res) => {
  const url = getGoogleAuthUrl();
  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  try {
    const { code, error, error_description } = req.query;

    if (error) {
      console.error("Google returned error:", error, error_description);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login-failed?message=${encodeURIComponent(
          error_description || "Google từ chối xác thực"
        )}`
      );
    }

    if (!code) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login-failed?message=Mã code không tồn tại từ Google`
      );
    }

    const userData = await getGoogleUser(code);

    if (!userData || !userData.email) {
      console.error("Không lấy được dữ liệu người dùng từ Google:", userData);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login-failed?message=Không lấy được thông tin người dùng`
      );
    }

    const { token, isNew } = await checkGoogleUser(userData);

    return res.redirect(
      `${process.env.FRONTEND_URL}/login-success?token=${token}&isNew=${isNew}`
    );
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/login-failed?message=${encodeURIComponent(
        error.message || "Xác thực thất bại"
      )}`
    );
  }
});

module.exports = router;
