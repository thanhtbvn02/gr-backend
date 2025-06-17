const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const envConfig = require("../config/envconfig");

const sortObject = (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[encodeURIComponent(key)] = encodeURIComponent(obj[key]).replace(
        /%20/g,
        "+"
      );
      return acc;
    }, {});

const vnpayController = {
  createPayment: async (req, res) => {
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const tmnCode = envConfig.vnpayTmnCode;
    const hashSecret = envConfig.vnpayHashSecret;
    const vnpayUrl = envConfig.vnpayUrl;
    const returnUrl = envConfig.vnpayReturnUrl;

    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const orderId = moment(date).format("HHmmss");

    const { amount, bankCode, orderDescription, orderType, language } =
      req.body;
    const locale = language || "vn";

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params.vnp_BankCode = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", hashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params.vnp_SecureHash = signed;
    const paymentUrl =
      vnpayUrl + "?" + qs.stringify(vnp_Params, { encode: false });

    res.json({
      url: paymentUrl,
    });
  },

  vnpayIpn: async (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const signed = crypto
      .createHmac("sha512", envConfig.vnpayHashSecret)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    if (secureHash === signed && vnp_Params.vnp_ResponseCode === "00") {
      const orderId = vnp_Params.vnp_TxnRef;
      const transactionId = vnp_Params.vnp_TransactionNo;
      console.log(
        `Payment successful for order: ${orderId}, transaction: ${transactionId}`
      );

      return res.status(200).json({ RspCode: "00", Message: "Success" });
    }
    return res.status(200).json({ RspCode: "97", Message: "Invalid Checksum" });
  },

  vnpayReturn: async (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const signed = crypto
      .createHmac("sha512", envConfig.vnpayHashSecret)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    if (secureHash === signed) {
      if (vnp_Params.vnp_ResponseCode === "00") {
        const vnpData = qs.stringify(vnp_Params);
        return res.redirect(
          `${envConfig.frontendUrl}/vnpay-return?status=success&${vnpData}`
        );
      } else {
        const vnpData = qs.stringify(vnp_Params);
        return res.redirect(
          `${envConfig.frontendUrl}/vnpay-return?status=failed&${vnpData}`
        );
      }
    } else {
      return res.redirect(
        `${envConfig.frontendUrl}/vnpay-return?status=failed&message=invalid_signature`
      );
    }
  },
};

module.exports = vnpayController;
// http://localhost:5000/api/payment/vnpay_return?
// vnp_Amount=11300000&
// vnp_BankCode=NCB&
// vnp_BankTranNo=VNP14965884&
// vnp_CardType=ATM&
// vnp_OrderInfo=Thanh+to%C3%A1n+%C4%91%C6%A1n+h%C3%A0ng+-+2025-05-19T09%3A25%3A18.068Z&
// vnp_PayDate=20250519162752&
// vnp_ResponseCode=00&
// vnp_TmnCode=0IT6BDO8
// &vnp_TransactionNo=14965884&
// vnp_TransactionStatus=00&
// vnp_TxnRef=162518&
// vnp_SecureHash=5fe821e88ad9cf699a61d4da8acc81d34ebd8a6f14dea96cd535c04c59de95aed74f3665bfbe4694ceddfcd2e006a346a13c7c8a832d224958c66184b2d452c8

// https://sandbox.vnpayment.vn/tryitnow/Home/VnPayReturn?
// vnp_Amount=1000000&
// vnp_BankCode=NCB&
// vnp_BankTranNo=VNP14965919&
// vnp_CardType=ATM&
// vnp_OrderInfo=Thanh+toan+don+hang+thoi+gian%3A+2025-05-19+16%3A37%3A22&
// vnp_PayDate=20250519163818&
// vnp_ResponseCode=00&
// vnp_TmnCode=CTTVNP01&
// vnp_TransactionNo=14965919&
// vnp_TransactionStatus=00&
// vnp_TxnRef=250675&
// vnp_SecureHash=542b94ac1e614e811e2c1892ee2468ac1ed07d761f6a9a47090ee0462f8ba248ad7080c7a611006d9ae7603c8e5ed7d6137a42c0334f57915bb675b2819d7367122914b3651cef9ae3bcaaba2502477e5652b08648e3dc689355a45227771c9efc1ce451a8f829050c197bfbb659ebcd722296c248d746048f357e3fb4d0c6d85484307e61144b601ed01f3bc12dfb6ba26196702e35a2c5e8acacfb257377adfbf879e91fe2d43c6bf6ddc14e9f7e9144e1f2d1dbb0e8118fca5117a56bb143414feb5a8a62f6e1d80ca749be41128590e7869eb2d19d9a599ee812104bf290d38e0f3af94f8b697b8bafeda42f662c354c19dec8df1fdbdbcce0d92d2cf256
