// // const express = require('express');
// // const router = express.Router();
// // const userController = require('../controllers/userController');

// // // const { z } = require('zod');
// // // const validate = require('../middlewares/validate');

// // // const noSpaces = /^\S+$/;

// // // validate.commom.ts
// // // const passwordSchema = z.string({
// // //     required_error: 'Mật khẩu là bắt buộc',
// // //     invalid_type_error: 'Mật khẩu phải là chuỗi'
// // //   }).min(8, 'Mật khẩu tối thiểu 8 ký tự'),
// // // const registerSchema = z.object({
// // //     username: z.string({
// // //       required_error: 'Username là bắt buộc',
// // //       invalid_type_error: 'Username phải là chuỗi'
// // //     }).min(1, 'Username không được để trống')
// // //     .regex(noSpaces, 'Username không được có khoảng trắng'),

// // //     password: z.string({
// // //       required_error: 'Mật khẩu là bắt buộc',
// // //       invalid_type_error: 'Mật khẩu phải là chuỗi'
// // //     }).min(8, 'Mật khẩu tối thiểu 8 ký tự'),

// // //   });

// // // POST /api/users/register
// // router.post('/register', userController.register);

// // // POST /api/users/login
// // router.post('/login', userController.login);

// // router.post('/logout', userController.logout)

// // router.get('/', userController.getAll)

// // router.get('/:id', userController.getById)

// // router.put('/:id', userController.updateById)

// // router.put('/:id/change-password', userController.changePassword)

// // router.post('/forgot-password', userController.forgotPassword)

// // router.post('/reset-password', userController.resetPassword)

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // POST /api/users/register
// router.post('/register', userController.register);

// // POST /api/users/login
// router.post('/login', userController.login);

// // POST /api/users/logout
// router.post('/logout', userController.logout);

// // GET /api/users/
// router.get('/', userController.getAll);

// // GET /api/users/:id
// router.get('/:id', userController.getById);

// // PUT /api/users/:id
// router.put('/:id', userController.updateById);

// // PUT /api/users/:id/change-password
// router.put('/:id/change-password', userController.changePassword);

// // POST /api/users/forgot-password
// router.post('/forgot-password', userController.forgotPassword);

// // POST /api/users/reset-password
// router.post('/reset-password', userController.resetPassword);

// module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");

// POST /api/users/register
router.post("/register", userController.register);

// POST /api/users/login
router.post("/login", userController.login);

// POST /api/users/logout
router.post("/logout", userController.logout);

// GET /api/users/
router.get("/", userController.getAll);

router.get("/find-by-name-or-email", userController.findByNameOrEmail);

router.get("/count", userController.countAll);

router.get("/count/:role", userController.countByRole);

// GET /api/users/:id
router.get("/:id", userController.getById);

// PUT /api/users/:id
router.put("/:id", userController.updateById);

// PUT /api/users/:id/change-password
router.put("/:id/change-password", userController.changePassword);

// POST /api/users/forgot-password
router.post("/forgot-password", userController.forgotPassword);

// POST /api/users/reset-password
router.post("/reset-password", userController.resetPassword);

router.post("/:id/avatar", upload.single("image"), userController.uploadAvatar);

router.delete("/:id", userController.deleteById);

router.post("/delete-multiple", userController.deleteMultiple);

module.exports = router;
