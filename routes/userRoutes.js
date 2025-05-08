const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// const { z } = require('zod');
// const validate = require('../middlewares/validate');

// const noSpaces = /^\S+$/;

// validate.commom.ts
// const passwordSchema = z.string({
//     required_error: 'Mật khẩu là bắt buộc',
//     invalid_type_error: 'Mật khẩu phải là chuỗi'
//   }).min(8, 'Mật khẩu tối thiểu 8 ký tự'),
// const registerSchema = z.object({
//     username: z.string({
//       required_error: 'Username là bắt buộc',
//       invalid_type_error: 'Username phải là chuỗi'
//     }).min(1, 'Username không được để trống')
//     .regex(noSpaces, 'Username không được có khoảng trắng'),
    
//     password: z.string({
//       required_error: 'Mật khẩu là bắt buộc',
//       invalid_type_error: 'Mật khẩu phải là chuỗi'
//     }).min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  
//   });

// POST /api/users/register
router.post('/register', userController.register);

// POST /api/users/login
router.post('/login', userController.login);

router.post('/logout', userController.logout)

router.get('/:id', userController.getById)

router.put('/:id', userController.updateById)

router.put('/:id/change-password', userController.changePassword)

router.post('/forgot-password', userController.forgotPassword)

router.post('/reset-password', userController.resetPassword)

module.exports = router;
