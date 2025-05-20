const express = require("express");
const router = express.Router();
const vnpayController = require("../controllers/vnpayController");

router.post("/create_payment_url", vnpayController.createPayment);
router.get("/vnpay_return", vnpayController.vnpayReturn);
router.get("/vnpay_ipn", vnpayController.vnpayIpn);

module.exports = router;
