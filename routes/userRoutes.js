const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

router.get("/", userController.getAll);

router.get("/find-by-name-or-email", userController.findByNameOrEmail);

router.get("/count", userController.countAll);

router.get("/count/:role", userController.countByRole);

router.get("/:id", userController.getById);

router.put("/:id", userController.updateById);

router.put("/:id/change-password", userController.changePassword);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password", userController.resetPassword);

router.post("/:id/avatar", upload.single("image"), userController.uploadAvatar);

router.delete("/:id", userController.deleteById);

router.post("/delete-multiple", userController.deleteMultiple);

module.exports = router;
