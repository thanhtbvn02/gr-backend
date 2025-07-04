const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const { Op } = require("sequelize");
const userService = require("../services/userService");

const { uploadImage, deleteImage } = require("../utils/cloudinary");
const bufferToDataURI = (file) => {
  const base64 = file.buffer.toString("base64");
  return `data:${file.mimetype};base64,${base64}`;
};

const userController = {
  register: async (req, res) => {
    const { username, email, password, full_name, birth_date, phone } =
      req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        full_name,
        birth_date,
        phone,
      });
      return res.status(201).json({ message: "Đăng ký thành công" });
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ message: "Tên đăng nhập hoặc email đã tồn tại" });
      }
      return res
        .status(500)
        .json({ message: "Lỗi khi tạo người dùng", error: err });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Thiếu tên đăng nhập hoặc mật khẩu" });
    }

    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(400).json({ message: "Không tìm thấy người dùng" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Sai mật khẩu" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "USER_SECRET_KEY",
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          status: user.status,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  logout: (req, res) => {
    return res.status(200).json({ message: "Đăng xuất thành công" });
  },

  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  findByNameOrEmail: async (req, res) => {
    const { keyword } = req.query;
    try {
      let user = null;
      if (keyword) {
        user = await userService.findByName(keyword);
        if (!user) user = await userService.findByEmail(keyword);
      }
      return res.json(user ? [user] : []);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message });
    }
  },

  updateById: async (req, res) => {
    const { id } = req.params;
    const { username, email, full_name, phone, birth_date, role, status } =
      req.body;

    if (!username) {
      return res.status(400).json({ message: "Username là bắt buộc" });
    }

    try {
      const [updated] = await User.update(
        { username, email, full_name, phone, birth_date, role, status },
        { where: { id } }
      );

      if (!updated) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      return res.json({ message: "Cập nhật thành công" });
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
      return res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật", error: err });
    }
  },

  changePassword: async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Thiếu mật khẩu cũ hoặc mật khẩu mới" });
    }

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await User.update({ password: hashedNewPassword }, { where: { id } });

      return res.json({ message: "Đổi mật khẩu thành công" });
    } catch (err) {
      return res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Thiếu email" });
    }

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Email không tồn tại" });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await User.update(
        { reset_code: code, reset_expires: expires },
        { where: { id: user.id } }
      );

      const html = `
        <p>Mã xác thực đặt lại mật khẩu của bạn là:</p>
        <h2>${code}</h2>
        <p>Hết hạn trong 1 giờ.</p>
      `;

      await sendMail({ to: user.email, subject: "OTP đặt lại mật khẩu", html });
      return res.json({
        success: true,
        message: "OTP đã được gửi vào email của bạn.",
      });
    } catch (err) {
      console.error("💥 Error:", err);
      return res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  resetPassword: async (req, res) => {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Thiếu mã xác thực" });
    }

    try {
      const user = await User.findOne({
        where: {
          reset_code: code,
          reset_expires: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Mã không hợp lệ hoặc đã hết hạn" });
      }

      const newPassPlain = crypto.randomBytes(5).toString("hex");
      const hashed = await bcrypt.hash(newPassPlain, 10);

      await User.update(
        {
          password: hashed,
          reset_code: null,
          reset_expires: null,
        },
        { where: { id: user.id } }
      );

      const html = `
        <p>Mật khẩu mới của bạn là:</p>
        <h2>${newPassPlain}</h2>
        <p>Vui lòng đăng nhập và đổi mật khẩu mới.</p>
      `;

      await sendMail({ to: user.email, subject: "Mật khẩu mới", html });
      return res.json({
        message: "Mật khẩu mới đã được gửi vào email của bạn",
      });
    } catch (err) {
      return res.status(500).json({ message: "Lỗi server", error: err });
    }
  },

  countAll: async (req, res) => {
    try {
      const count = await User.count();
      return res.json({ count });
    } catch (error) {
      console.error("Error counting all users:", error);
      return res
        .status(500)
        .json({ message: "Lỗi đếm tất cả người dùng", error: error.message });
    }
  },

  countByRole: async (req, res) => {
    try {
      const { role } = req.params;
      const count = await User.count({
        where: { role },
      });
      return res.json({ count });
    } catch (error) {
      console.error("Error counting users by role:", error);
      return res.status(500).json({
        message: "Lỗi đếm người dùng theo vai trò",
        error: error.message,
      });
    }
  },
  uploadAvatar: async (req, res) => {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng gửi file ảnh!" });
    }

    try {
      const fileDataURI = bufferToDataURI(req.file);

      const { public_id, url } = await uploadImage(fileDataURI);
      await User.update({ image: url }, { where: { id } });
      return res.status(200).json({
        message: "Upload ảnh thành công",
        data: { public_id, url },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Lỗi khi upload ảnh", error: err.message });
    }
  },
  deleteById: async (req, res) => {
    const { id } = req.params;
    try {
      await User.destroy({ where: { id } });
      return res.status(200).json({ message: "Xóa tài khoản thành công" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi khi xóa tài khoản", error: err.message });
    }
  },
  deleteMultiple: async (req, res) => {
    const { ids } = req.body; // [1,2,3,...]
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Thiếu danh sách id" });
    }
    try {
      const deleted = await User.destroy({ where: { id: ids } });
      return res.status(200).json({ message: `Đã xóa ${deleted} tài khoản.` });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi khi xóa nhiều tài khoản", error: err.message });
    }
  },
};

module.exports = userController;
