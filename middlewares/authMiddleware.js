const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) return res.status(401).json({ error: "Không có token xác thực" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "USER_SECRET_KEY",
    (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ error: "Token không hợp lệ hoặc đã hết hạn" });

      req.user = decoded; 
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
        next();
      }
    );
  } else {
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
