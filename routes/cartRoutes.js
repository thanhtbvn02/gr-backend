const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.optionalAuth, cartController.getById);
router.post("/", authMiddleware.authenticateToken, cartController.create);
router.put("/:id", authMiddleware.authenticateToken, cartController.update);
router.delete("/:id", authMiddleware.authenticateToken, cartController.delete);

module.exports = router;
