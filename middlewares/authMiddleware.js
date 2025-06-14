const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: "Không có token xác thực" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "USER_SECRET_KEY",
    (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ error: "Token không hợp lệ hoặc đã hết hạn" });

      req.user = decoded; // Gắn thông tin user vào req
      next();
    }
  );
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "USER_SECRET_KEY",
      (err, decoded) => {
        if (!err) {
          req.user = decoded;
        }
        // Call next() after verification attempt, regardless of outcome for optional auth
        next();
      }
    );
  } else {
    // No token, proceed to next middleware/handler
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
