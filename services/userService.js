const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const userService = {
  create: async (userData) => {
    try {
      return await User.create(userData);
    } catch (error) {
      console.error("Sequelize validation error:", error);
      throw error;
    }
  },

  findAll: async () => {
    return await User.findAll({
      attributes: { exclude: ["password", "reset_code", "reset_expires"] },
    });
  },

  findByName: async (full_name) => {
    return await User.findOne({ where: { full_name } });
  },

  findByEmail: async (email) => {
    return await User.findOne({ where: { email } });
  },

  findById: async (id) => {
    return await User.findByPk(id, {
      attributes: { exclude: ["password", "reset_code", "reset_expires"] },
    });
  },

  updateUserInfo: async (id, data) => {
    return await User.update(data, {
      where: { id },
      returning: true,
    });
  },

  updatePassword: async (id, newPassword) => {
    return await User.update({ password: newPassword }, { where: { id } });
  },

  setResetCode: async (id, code, expires) => {
    return await User.update(
      { reset_code: code, reset_expires: expires },
      { where: { id } }
    );
  },

  findUserByResetCode: async (code) => {
    return await User.findOne({
      where: {
        reset_code: code,
        reset_expires: { [Op.gt]: new Date() },
      },
    });
  },

  clearResetCode: async (id) => {
    return await User.update(
      { reset_code: null, reset_expires: null },
      { where: { id } }
    );
  },

  countAll: async () => {
    return await User.count();
  },

  countByRole: async (role) => {
    return await User.count({ where: { role } });
  },

  deleteById: async (id) => {
    return await User.destroy({ where: { id } });
  },
};

module.exports = userService;
