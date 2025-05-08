const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendMail = require('../utils/sendMail');
const crypto = require('crypto');


const userController = {
  register: (req, res) => {
    const { username, email, password, full_name, birth_date, phone, address } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Thiếu thông tin đăng ký' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Lỗi mã hóa mật khẩu' });
      User.create(username,
        email || null,
        hashedPassword,
        full_name || null,
        birth_date || null,
        phone || null,
        address || null, (err2, result) => {
        if (err2) {
          if (err2.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
          }
          return res.status(500).json({ message: 'Lỗi khi tạo người dùng', error: err2 });
        }
        return res.status(201).json({ message: 'Đăng ký thành công' });
      });
    });
  },

  login: (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Thiếu tên đăng nhập hoặc mật khẩu' });
    }

    User.findByUsername(username, (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi server' });
      if (!results || results.length === 0) {
        return res.status(400).json({ message: 'Không tìm thấy người dùng' });
      }

      const userData = results[0];

      bcrypt.compare(password, userData.password, (err2, isMatch) => {
        if (err2) return res.status(500).json({ message: 'Lỗi kiểm tra mật khẩu' });
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        const token = jwt.sign({ userId: userData.id }, 'USER_SECRET_KEY', { expiresIn: '1d' });

        return res.status(200).json({
          message: 'Đăng nhập thành công',
          token,
          user: {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            full_name: userData.full_name,
            role: userData.role
          }
        });
      });
    });
  },

  logout: (req, res) => {
    return res.status(200).json({ message: 'Đăng xuất thành công' });
  },

  getById: (req, res) => {
    const { id } = req.params;

    User.findById(id, (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi server', error: err });
      if (!results.length) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      return res.json(results[0]);
    });
  },

  updateById: (req, res) => {
    const { id } = req.params;
    const { username, email, full_name, phone, address, birth_date } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username là bắt buộc' });
    }

    User.updateUserInfor(id, { username, email, full_name, phone, address, birth_date }, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        return res.status(500).json({ message: 'Lỗi server khi cập nhật', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      return res.json({ message: 'Cập nhật thành công' });
    });
  },

  changePassword: (req, res) => {
    const { id } = req.params; 
    const { oldPassword, newPassword } = req.body;
  
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Thiếu mật khẩu cũ hoặc mật khẩu mới' });
    }
  
    User.findById(id, (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi server', error: err });
      if (!results.length) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
  
      const userData = results[0];
  
      bcrypt.compare(oldPassword, userData.password, (err2, isMatch) => {
        if (err2) return res.status(500).json({ message: 'Lỗi kiểm tra mật khẩu' });
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
  
        bcrypt.hash(newPassword, 10, (err3, hashedNewPassword) => {
          if (err3) return res.status(500).json({ message: 'Lỗi mã hóa mật khẩu mới' });
  
          User.updatePassword(id, hashedNewPassword, (err4, result) => {
            if (err4) return res.status(500).json({ message: 'Lỗi cập nhật mật khẩu', error: err4 });
  
            return res.json({ message: 'Đổi mật khẩu thành công' });
          });
        });
      });
    });
  },
  
  // Client sends email
  // Server check if email exists and valid then sends reset password link to email (token change password)
  // Client check mail and click on the link
  // Client sends api include token, new password
  // Server check token valid and not expired
  // Server update new password

  forgotPassword: (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Thiếu email' });
    }
    console.log(email);

    User.findByEmail(email, (err, users) => {
      if (err)    return res.status(500).json({ message: 'Lỗi server', error: err });
      if (!users.length) return res.status(404).json({ success: false, message: 'Email không tồn tại' });
  
      const user = users[0];
  
      // 3. Sinh OTP 6 chữ số & đặt expires sau 1h
      const code    = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 60*60*1000);
  
      // 4. Lưu code vào DB
      User.setResetCode(user.id, code, expires, (err2) => {
        if (err2) return res.status(500).json({ message: 'Lỗi lưu reset code', error: err2 });
  
        // 5. Gửi email OTP
        const html = `
          <p>Mã xác thực đặt lại mật khẩu của bạn là:</p>
          <h2>${code}</h2>
          <p>Hết hạn trong 1 giờ.</p>
        `;
        sendMail({ to: user.email, subject: 'OTP đặt lại mật khẩu', html })
          .then(() => res.json({ success: true, message: 'OTP đã được gửi vào email của bạn.' }))
          .catch(mailErr => {
            console.error('💥 sendMail error:', mailErr);
            res.status(500).json({ message: 'Lỗi gửi email OTP', error: mailErr });
          });
      });
    });
  },

  resetPassword: (req, res) => {
    const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Thiếu mã xác thực' });
  }

    User.findUserByResetCode(code, async (err, users) => {
      if (err) return res.status(500).json({ message: 'Lỗi server', error: err });
      if (!users.length) return res.status(400).json({ message: 'Mã không hợp lệ hoặc đã hết hạn' });
  
      const user = users[0];
      // Sinh mật khẩu mới ngẫu nhiên
      const newPassPlain = crypto.randomBytes(5).toString('hex');
      try {
        const hashed = await bcrypt.hash(newPassPlain, 10);
        // Cập nhật mật khẩu
        User.updatePassword(user.id, hashed, (err2) => {
          if (err2) return res.status(500).json({ message: 'Lỗi cập nhật mật khẩu', error: err2 });
  
          // Xóa code khỏi DB
          User.clearResetCode(user.id, () => {
            // Gửi email mật khẩu mới
            const htmlNew = `<p>Mật khẩu mới của bạn là:</p>
                             <h2>${newPassPlain}</h2>
                             <p>Vui lòng đăng nhập và đổi lại mật khẩu sau khi đăng nhập thành công.</p>`;
            sendMail({ to: user.email, subject: 'Mật khẩu mới của bạn', html: htmlNew })
              .then(() => res.json({ message: 'Đặt lại mật khẩu thành công. Vui lòng kiểm tra email.' }))
              .catch(mailErr => res.status(500).json({ message: 'Lỗi gửi email mật khẩu mới', error: mailErr }));
          });
        });
      } catch (hashErr) {
        return res.status(500).json({ message: 'Lỗi mã hóa mật khẩu mới', error: hashErr });
      }
    });
  },

}

module.exports = userController;
